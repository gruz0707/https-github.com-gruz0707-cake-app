import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createPrivateKey, sign } from 'node:crypto';
import {
  deriveDeviceIdFromSeed,
  evaluateLicense,
  LICENSE_STORAGE_KEY,
  loadOrInitLicenseState,
  saveLicenseState,
  verifyLicenseKey,
} from './licensing';
import { createMemoryStorage } from './storage';
import type { BillOrder } from '../types/pos';

function signTestKey(deviceId: string, plan: '30D' | '1Y' | 'LT', expiryCode: string): string {
  const keyPath = path.resolve(import.meta.dirname, '../../scripts/ubsc-private-key.json');
  const privJwk = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const privateKey = createPrivateKey({ key: privJwk, format: 'jwk' });
  const payload = `${deviceId.toUpperCase()}:${plan}:${expiryCode}`;
  const sig = sign('sha256', Buffer.from(payload, 'utf8'), {
    key: privateKey,
    dsaEncoding: 'ieee-p1363',
  }).toString('base64url');
  return `ESAI-${plan}-${expiryCode}-${sig}`;
}

function makeOrder(createdAt: string): BillOrder {
  return {
    id: 'o1',
    billNumber: 'EC-261127-001',
    createdAt,
    items: [],
    subtotal: 500,
    discountAmount: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 500,
    paymentMethod: 'Cash',
  };
}

test('trial starts with 7 days left and expires past trial end', () => {
  const storage = createMemoryStorage();
  const day0 = new Date('2026-11-27T10:00:00+05:30');
  const state = loadOrInitLicenseState(storage, day0, undefined, 0);
  assert.ok(state.deviceId.startsWith('EC-'));

  const evalDay0 = evaluateLicense(state, [], null, day0, null, 0).evaluation;
  assert.equal(evalDay0.status, 'trial');
  assert.equal(evalDay0.daysLeft, 7);

  const day8 = new Date('2026-12-05T10:00:00+05:30');
  const evalDay8 = evaluateLicense(state, [], null, day8, null, 0).evaluation;
  assert.equal(evalDay8.status, 'expired');
  assert.equal(evalDay8.daysLeft, 0);
});

test('hard end date locks trial even on a fresh install past cutoff', () => {
  const storage = createMemoryStorage();
  const hardEnd = '2026-11-30T23:59:59+05:30';
  const freshInstall = new Date('2026-12-02T09:00:00+05:30');
  const state = loadOrInitLicenseState(storage, freshInstall, undefined, 0);

  const res = evaluateLicense(state, [], null, freshInstall, hardEnd, 0).evaluation;
  assert.equal(res.status, 'expired');
});

test('clock rollback is caught via lastSeenAt, bill timestamps, and APK build time', () => {
  const storage = createMemoryStorage();
  const day0 = new Date('2026-11-27T10:00:00.000Z');
  const state = loadOrInitLicenseState(storage, day0, undefined, 0);

  // Backdated clock relative to lastSeenAt
  const rolledBack = new Date('2026-11-25T10:00:00.000Z');
  assert.equal(
    evaluateLicense(state, [], null, rolledBack, null, 0).evaluation.status,
    'clock_tampered',
  );

  // Backdated clock relative to a saved bill
  assert.equal(
    evaluateLicense(
      state,
      [makeOrder('2026-12-02T12:00:00.000Z')],
      null,
      new Date('2026-11-29T12:00:00.000Z'),
      null,
      0,
    ).evaluation.status,
    'clock_tampered',
  );

  // Backdated clock relative to compiled APK build time even after fresh storage
  const buildMs = Date.parse('2026-11-27T12:00:00.000Z');
  assert.equal(
    evaluateLicense(state, [], null, new Date('2026-11-20T00:00:00.000Z'), null, buildMs)
      .evaluation.status,
    'clock_tampered',
  );
});

test('ECDSA key verification binds to device, enforces expiry, and blacklists expired keys', async () => {
  const deviceA = deriveDeviceIdFromSeed('android-id-shop-a');
  const deviceB = deriveDeviceIdFromSeed('android-id-shop-b');
  const key30 = signTestKey(deviceA, '30D', '261227');

  assert.equal((await verifyLicenseKey(key30, deviceA)).valid, true);
  assert.equal((await verifyLicenseKey(key30, deviceB)).valid, false);
  // Tampering one character in the expiry date invalidates the ECDSA signature
  const forged = key30.replace('-261227-', '-291227-');
  assert.equal((await verifyLicenseKey(forged, deviceA)).valid, false);

  const storage = createMemoryStorage();
  const state = saveLicenseState(storage, {
    deviceId: deviceA,
    firstSeenAt: '2026-11-27T00:00:00.000Z',
    lastSeenAt: '2026-11-27T00:00:00.000Z',
    licenseKey: key30,
    activatedAt: '2026-11-27T00:00:00.000Z',
    expiredKeys: [],
  });
  const parsed = await verifyLicenseKey(key30, deviceA);

  // Valid before Dec 27 2026
  const active = evaluateLicense(state, [], parsed, new Date('2026-12-10T00:00:00.000Z'), null, 0);
  assert.equal(active.evaluation.status, 'licensed');

  // Expired on Dec 28 2026 -> flags newlyExpiredKey for permanent blacklist
  const expired = evaluateLicense(state, [], parsed, new Date('2026-12-28T10:00:00.000Z'), null, 0);
  assert.equal(expired.evaluation.status, 'expired');
  assert.equal(expired.newlyExpiredKey, key30);

  // Even if blacklisted key is somehow present, it stays rejected
  const replayed = evaluateLicense(
    { ...state, expiredKeys: [key30] },
    [],
    parsed,
    new Date('2026-12-10T00:00:00.000Z'),
    null,
    0,
  );
  assert.equal(replayed.evaluation.status, 'expired');
});

test('localStorage tampering breaks integrity seal and locks app', () => {
  const storage = createMemoryStorage();
  const day0 = new Date('2026-11-27T10:00:00.000Z');
  const state = loadOrInitLicenseState(storage, day0, undefined, 0);

  // Attacker manually edits firstSeenAt in localStorage to 2099
  const tampered = { ...state, firstSeenAt: '2099-01-01T00:00:00.000Z' };
  storage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(tampered));

  const reloaded = loadOrInitLicenseState(storage, day0, undefined, 0);
  assert.equal(reloaded.tampered, true);
  assert.equal(evaluateLicense(reloaded, [], null, day0, null, 0).evaluation.status, 'tampered');
});
