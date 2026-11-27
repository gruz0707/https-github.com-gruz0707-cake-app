import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateLicense,
  generateLicenseKey,
  loadOrInitLicenseState,
  verifyLicenseKey,
  type StoredLicenseState,
} from './licensing';
import { createMemoryStorage } from './storage';
import type { BillOrder } from '../types/pos';

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
  const state = loadOrInitLicenseState(storage, day0);
  assert.ok(state.deviceId.startsWith('EC-'));

  const evalDay0 = evaluateLicense(state, [], day0, null);
  assert.equal(evalDay0.status, 'trial');
  assert.equal(evalDay0.daysLeft, 7);

  const day8 = new Date('2026-12-05T10:00:00+05:30');
  const evalDay8 = evaluateLicense(state, [], day8, null);
  assert.equal(evalDay8.status, 'expired');
  assert.equal(evalDay8.daysLeft, 0);
});

test('hard end date locks trial even on a fresh install past cutoff', () => {
  const storage = createMemoryStorage();
  const hardEnd = '2026-11-30T23:59:59+05:30';
  const freshInstall = new Date('2026-12-02T09:00:00+05:30');
  const state = loadOrInitLicenseState(storage, freshInstall);

  const res = evaluateLicense(state, [], freshInstall, hardEnd);
  assert.equal(res.status, 'expired');
});

test('clock rollback is detected via lastSeenAt and bill timestamps', () => {
  const state: StoredLicenseState = {
    deviceId: 'EC-ABCD-1234',
    firstSeenAt: '2026-11-20T10:00:00.000Z',
    lastSeenAt: '2026-11-27T10:00:00.000Z',
    licenseKey: null,
    activatedAt: null,
  };
  const rolledBack = new Date('2026-11-25T10:00:00.000Z');
  const res = evaluateLicense(state, [], rolledBack, null);
  assert.equal(res.status, 'clock_tampered');

  const withNewerOrder = evaluateLicense(
    { ...state, lastSeenAt: '2026-11-25T09:00:00.000Z' },
    [makeOrder('2026-11-27T12:00:00.000Z')],
    new Date('2026-11-26T12:00:00.000Z'),
    null,
  );
  assert.equal(withNewerOrder.status, 'clock_tampered');
});

test('device-bound keys unlock matching device and reject other devices', () => {
  const deviceA = 'EC-7F3A-91C2';
  const deviceB = 'EC-9999-AAAA';
  const now = new Date('2026-11-27T12:00:00+05:30');

  const key30 = generateLicenseKey(deviceA, '30D', now);
  assert.equal(verifyLicenseKey(key30, deviceA).valid, true);
  assert.equal(verifyLicenseKey(key30, deviceB).valid, false);

  const keyLt = generateLicenseKey(deviceA, 'LT', now);
  const state: StoredLicenseState = {
    deviceId: deviceA,
    firstSeenAt: '2026-11-01T00:00:00.000Z',
    lastSeenAt: now.toISOString(),
    licenseKey: keyLt,
    activatedAt: now.toISOString(),
  };
  const evalLt = evaluateLicense(state, [], new Date('2030-01-01T00:00:00Z'), '2026-12-01T00:00:00Z');
  assert.equal(evalLt.status, 'licensed');
  assert.equal(evalLt.plan, 'LT');
});
