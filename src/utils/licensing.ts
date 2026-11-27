import type { BillOrder } from '../types/pos';
import type { StorageLike } from './storage';

/**
 * Offline-first trial & device-bound licensing for Esai Cakes POS (UBSC Software).
 *
 * Adjust these two constants before building a distribution APK:
 * - TRIAL_DAYS: number of days from first launch.
 * - TRIAL_HARD_END_ISO: optional absolute cutoff date (e.g. '2026-12-31T23:59:59+05:30')
 *   past which an unactivated APK will lock regardless of install date.
 */
export const TRIAL_DAYS = 7;
export const TRIAL_HARD_END_ISO: string | null = '2026-12-31T23:59:59+05:30';

export const LICENSE_STORAGE_KEY = 'esai_cakes_pos_license_v1';
const KEY_SALT = 'UBSC-ESAI-CAKES-2026-OFFLINE-KEY';
const CLOCK_DRIFT_TOLERANCE_MS = 5 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export type LicensePlan = '30D' | '1Y' | 'LT';

export interface StoredLicenseState {
  deviceId: string;
  firstSeenAt: string;
  lastSeenAt: string;
  licenseKey: string | null;
  activatedAt: string | null;
}

export type LicenseStatusKind = 'licensed' | 'trial' | 'expired' | 'clock_tampered';

export interface LicenseEvaluation {
  status: LicenseStatusKind;
  deviceId: string;
  plan: LicensePlan | null;
  expiresAt: string | null;
  daysLeft: number;
  reason?: string;
}

function hashToCode(input: string, length: number): string {
  // Dual-lane 32-bit FNV-1a mixing -> unambiguous Crockford-style alphabet
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= ch + i * 31;
    h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
  }
  let state = (BigInt(h1) << 32n) | BigInt(h2);
  let out = '';
  const base = BigInt(ALPHABET.length);
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[Number(state % base)];
    state = (state / base) ^ BigInt((i + 1) * 0x45d9f3b);
    if (state < 0n) state = -state;
  }
  return out;
}

export function generateDeviceId(): string {
  let raw = '';
  for (let i = 0; i < 8; i += 1) {
    raw += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `EC-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

function formatYyMmDd(date: Date): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

function parseYyMmDdEndOfDay(code: string): Date | null {
  if (!/^\d{6}$/.test(code)) return null;
  const yy = Number.parseInt(code.slice(0, 2), 10);
  const mm = Number.parseInt(code.slice(2, 4), 10);
  const dd = Number.parseInt(code.slice(4, 6), 10);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  const dt = new Date(2000 + yy, mm - 1, dd, 23, 59, 59, 999);
  if (dt.getFullYear() !== 2000 + yy || dt.getMonth() !== mm - 1 || dt.getDate() !== dd) {
    return null;
  }
  return dt;
}

/**
 * Generates a signed offline license key bound to a specific Device ID.
 */
export function generateLicenseKey(
  deviceId: string,
  plan: LicensePlan,
  now = new Date(),
): string {
  const cleanId = deviceId.trim().toUpperCase();
  let expiryCode = 'LIFE';
  if (plan === '30D') {
    expiryCode = formatYyMmDd(new Date(now.getTime() + 30 * DAY_MS));
  } else if (plan === '1Y') {
    expiryCode = formatYyMmDd(new Date(now.getTime() + 365 * DAY_MS));
  }
  const sig = hashToCode(`${cleanId}:${plan}:${expiryCode}:${KEY_SALT}`, 6);
  return `ESAI-${plan}-${expiryCode}-${sig}`;
}

export interface ParsedLicenseKey {
  valid: boolean;
  plan?: LicensePlan;
  expiresAt?: Date | null;
  error?: string;
}

export function verifyLicenseKey(rawKey: string, deviceId: string): ParsedLicenseKey {
  const cleanKey = rawKey.trim().toUpperCase();
  const cleanId = deviceId.trim().toUpperCase();
  const match = /^ESAI-(30D|1Y|LT)-(LIFE|\d{6})-([A-Z0-9]{6})$/.exec(cleanKey);
  if (!match) {
    return {
      valid: false,
      error: 'Invalid key format. Example: ESAI-30D-261227-XXXXXX',
    };
  }
  const plan = match[1] as LicensePlan;
  const expiryCode = match[2];
  const sig = match[3];

  if (plan === 'LT' && expiryCode !== 'LIFE') {
    return { valid: false, error: 'Invalid lifetime license key.' };
  }
  if (plan !== 'LT' && expiryCode === 'LIFE') {
    return { valid: false, error: 'Invalid timed license key.' };
  }

  const expectedSig = hashToCode(`${cleanId}:${plan}:${expiryCode}:${KEY_SALT}`, 6);
  if (sig !== expectedSig) {
    return {
      valid: false,
      error: 'This key does not match your Device Code.',
    };
  }

  if (expiryCode === 'LIFE') {
    return { valid: true, plan, expiresAt: null };
  }

  const expiresAt = parseYyMmDdEndOfDay(expiryCode);
  if (!expiresAt) {
    return { valid: false, error: 'License key has an invalid expiry date.' };
  }
  return { valid: true, plan, expiresAt };
}

export function loadOrInitLicenseState(
  storage: StorageLike,
  now = new Date(),
): StoredLicenseState {
  const nowIso = now.toISOString();
  try {
    const raw = storage.getItem(LICENSE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredLicenseState>;
      if (parsed && typeof parsed.deviceId === 'string' && parsed.deviceId.startsWith('EC-')) {
        const firstSeenMs = Date.parse(parsed.firstSeenAt ?? '');
        const lastSeenMs = Date.parse(parsed.lastSeenAt ?? '');
        const nowMs = now.getTime();
        const next: StoredLicenseState = {
          deviceId: parsed.deviceId,
          firstSeenAt: Number.isFinite(firstSeenMs) ? parsed.firstSeenAt! : nowIso,
          // Only advance lastSeenAt monotonically forward so clock rollback is caught
          lastSeenAt:
            Number.isFinite(lastSeenMs) && lastSeenMs > nowMs
              ? parsed.lastSeenAt!
              : nowIso,
          licenseKey: typeof parsed.licenseKey === 'string' ? parsed.licenseKey : null,
          activatedAt: typeof parsed.activatedAt === 'string' ? parsed.activatedAt : null,
        };
        storage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(next));
        return next;
      }
    }
  } catch {
    // Fall through to fresh state
  }

  const fresh: StoredLicenseState = {
    deviceId: generateDeviceId(),
    firstSeenAt: nowIso,
    lastSeenAt: nowIso,
    licenseKey: null,
    activatedAt: null,
  };
  try {
    storage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    // Ignore storage quota errors
  }
  return fresh;
}

export function saveLicenseState(storage: StorageLike, state: StoredLicenseState): void {
  try {
    storage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore
  }
}

export function evaluateLicense(
  state: StoredLicenseState,
  orders: BillOrder[],
  now = new Date(),
  hardEndIso: string | null = TRIAL_HARD_END_ISO,
): LicenseEvaluation {
  const nowMs = now.getTime();
  const lastSeenMs = Date.parse(state.lastSeenAt);

  // 1. Check monotonic lastSeenAt & latest real bill timestamp for clock rollback
  let latestOrderMs = 0;
  for (const order of orders) {
    if (order.isDemo) continue;
    const t = Date.parse(order.createdAt);
    if (Number.isFinite(t) && t > latestOrderMs) {
      latestOrderMs = t;
    }
  }

  const highWatermarkMs = Math.max(
    Number.isFinite(lastSeenMs) ? lastSeenMs : 0,
    latestOrderMs,
  );
  if (highWatermarkMs > 0 && nowMs < highWatermarkMs - CLOCK_DRIFT_TOLERANCE_MS) {
    return {
      status: 'clock_tampered',
      deviceId: state.deviceId,
      plan: null,
      expiresAt: null,
      daysLeft: 0,
      reason: 'Device date/time appears to have been set backwards. Restore automatic date & time or activate a license key.',
    };
  }

  // 2. Check activated license key
  if (state.licenseKey) {
    const parsed = verifyLicenseKey(state.licenseKey, state.deviceId);
    if (parsed.valid) {
      if (!parsed.expiresAt) {
        return {
          status: 'licensed',
          deviceId: state.deviceId,
          plan: parsed.plan ?? 'LT',
          expiresAt: null,
          daysLeft: Infinity,
        };
      }
      if (nowMs <= parsed.expiresAt.getTime()) {
        const daysLeft = Math.max(1, Math.ceil((parsed.expiresAt.getTime() - nowMs) / DAY_MS));
        return {
          status: 'licensed',
          deviceId: state.deviceId,
          plan: parsed.plan ?? '30D',
          expiresAt: parsed.expiresAt.toISOString(),
          daysLeft,
        };
      }
      return {
        status: 'expired',
        deviceId: state.deviceId,
        plan: parsed.plan ?? null,
        expiresAt: parsed.expiresAt.toISOString(),
        daysLeft: 0,
        reason: 'Your license key has expired. Enter a new key to continue billing.',
      };
    }
  }

  // 3. Evaluate trial window (min of firstSeen + TRIAL_DAYS and TRIAL_HARD_END_ISO)
  const firstSeenMs = Date.parse(state.firstSeenAt);
  const installEndMs = (Number.isFinite(firstSeenMs) ? firstSeenMs : nowMs) + TRIAL_DAYS * DAY_MS;
  const hardEndMs = hardEndIso ? Date.parse(hardEndIso) : NaN;
  const trialEndMs =
    Number.isFinite(hardEndMs) ? Math.min(installEndMs, hardEndMs) : installEndMs;

  if (nowMs <= trialEndMs) {
    const daysLeft = Math.max(1, Math.ceil((trialEndMs - nowMs) / DAY_MS));
    return {
      status: 'trial',
      deviceId: state.deviceId,
      plan: null,
      expiresAt: new Date(trialEndMs).toISOString(),
      daysLeft,
    };
  }

  return {
    status: 'expired',
    deviceId: state.deviceId,
    plan: null,
    expiresAt: new Date(trialEndMs).toISOString(),
    daysLeft: 0,
    reason: 'Your free trial has ended. Enter an activation key to unlock Esai Cakes POS.',
  };
}
