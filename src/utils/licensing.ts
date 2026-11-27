import type { BillOrder } from '../types/pos';
import type { StorageLike } from './storage';

/**
 * Hardened offline-first trial & device-bound licensing for Esai Cakes POS (UBSC Software).
 *
 * Security model:
 * - Only the ECDSA P-256 PUBLIC KEY ships in this bundle; signing private key never leaves the PC.
 * - On Android, Device Code is derived from Settings.Secure.ANDROID_ID (survives Clear Data & reinstall).
 * - Build timestamp (__APP_BUILD_TIME__) + monotonic lastSeenAt + latest bill timestamp prevent clock rollback.
 * - Stored state is integrity-sealed; expired timed keys are blacklisted and cannot be replayed.
 */
export const TRIAL_DAYS = 7;
export const TRIAL_HARD_END_ISO: string | null = '2026-12-31T23:59:59+05:30';

export const LICENSE_STORAGE_KEY = 'esai_cakes_pos_license_v1';
const STATE_INTEGRITY_PEPPER = 'UBSC-STATE-SEAL-v2-2026';
const CLOCK_DRIFT_TOLERANCE_MS = 5 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/** Public-only ECDSA P-256 JWK (cannot forge/sign keys). */
const PUBLIC_SIGNING_JWK: JsonWebKey = {
  kty: 'EC',
  crv: 'P-256',
  x: '2Z1iW0DA8PLpv2pFdGDmcvathWS93csKzLefIxkwH_M',
  y: 'sNjojcmsb_GjHmaqk9rHAUA2zk4Cw_RYH6uRjHNlzSc',
};

declare const __APP_BUILD_TIME__: number | undefined;

export function getAppBuildTimeMs(): number {
  try {
    if (typeof __APP_BUILD_TIME__ === 'number' && Number.isFinite(__APP_BUILD_TIME__)) {
      return __APP_BUILD_TIME__;
    }
  } catch {
    // Undefined in direct tsx/node test runs.
  }
  return 0;
}

export type LicensePlan = '30D' | '1Y' | 'LT';

export interface StoredLicenseState {
  deviceId: string;
  firstSeenAt: string;
  lastSeenAt: string;
  licenseKey: string | null;
  activatedAt: string | null;
  expiredKeys: string[];
  seal: string;
  tampered?: boolean;
}

export type LicenseStatusKind = 'licensed' | 'trial' | 'expired' | 'clock_tampered' | 'tampered';

export interface VerifiedKeyPayload {
  valid: boolean;
  plan?: LicensePlan;
  expiryCode?: string;
  expiresAt?: Date | null;
  error?: string;
}

export interface LicenseEvaluation {
  status: LicenseStatusKind;
  deviceId: string;
  plan: LicensePlan | null;
  expiresAt: string | null;
  daysLeft: number;
  reason?: string;
}

function hashToCode(input: string, length: number): string {
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

export function deriveDeviceIdFromSeed(seed: string): string {
  const code = hashToCode(`UBSC-DEV:${seed.trim()}`, 8);
  return `EC-${code.slice(0, 4)}-${code.slice(4, 8)}`;
}

export function generateDeviceId(): string {
  let raw = '';
  for (let i = 0; i < 8; i += 1) {
    raw += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `EC-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

export function computeStateSeal(state: Omit<StoredLicenseState, 'seal' | 'tampered'>): string {
  const payload = [
    state.deviceId,
    state.firstSeenAt,
    state.lastSeenAt,
    state.licenseKey ?? '',
    state.activatedAt ?? '',
    state.expiredKeys.join(','),
    STATE_INTEGRITY_PEPPER,
  ].join('|');
  return hashToCode(payload, 12);
}

function sealState(state: Omit<StoredLicenseState, 'seal' | 'tampered'>): StoredLicenseState {
  return {
    ...state,
    seal: computeStateSeal(state),
  };
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

function base64UrlToBytes(b64u: string): Uint8Array | null {
  try {
    const b64 = b64u.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
    const binary = atob(b64 + pad);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

let cachedPublicKey: Promise<CryptoKey> | null = null;

function getPublicVerifyKey(): Promise<CryptoKey> {
  if (!cachedPublicKey) {
    cachedPublicKey = globalThis.crypto.subtle.importKey(
      'jwk',
      PUBLIC_SIGNING_JWK,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify'],
    );
  }
  return cachedPublicKey;
}

export async function verifyLicenseKey(
  rawKey: string,
  deviceId: string,
): Promise<VerifiedKeyPayload> {
  const cleanKey = rawKey.trim();
  const cleanId = deviceId.trim().toUpperCase();
  const match = /^ESAI-(30D|1Y|LT)-(LIFE|\d{6})-([A-Za-z0-9_-]{80,96})$/.exec(cleanKey);
  if (!match) {
    return {
      valid: false,
      error: 'Invalid activation key format. Paste the full ESAI-... key.',
    };
  }

  const plan = match[1] as LicensePlan;
  const expiryCode = match[2];
  const sigB64u = match[3];

  if (plan === 'LT' && expiryCode !== 'LIFE') {
    return { valid: false, error: 'Invalid lifetime license key.' };
  }
  if (plan !== 'LT' && expiryCode === 'LIFE') {
    return { valid: false, error: 'Invalid timed license key.' };
  }

  let expiresAt: Date | null = null;
  if (expiryCode !== 'LIFE') {
    expiresAt = parseYyMmDdEndOfDay(expiryCode);
    if (!expiresAt) {
      return { valid: false, error: 'License key has an invalid expiry date.' };
    }
  }

  const sigBytes = base64UrlToBytes(sigB64u);
  if (!sigBytes) {
    return { valid: false, error: 'Corrupted license key signature.' };
  }

  try {
    const pubKey = await getPublicVerifyKey();
    const messageBytes = new TextEncoder().encode(`${cleanId}:${plan}:${expiryCode}`);
    const sigCopy = new Uint8Array(sigBytes).buffer;
    const msgCopy = new Uint8Array(messageBytes).buffer;
    const verified = await globalThis.crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      pubKey,
      sigCopy,
      msgCopy,
    );
    if (!verified) {
      return {
        valid: false,
        error: 'This key does not match your Device Code or signature is invalid.',
      };
    }
    return { valid: true, plan, expiryCode, expiresAt };
  } catch {
    return { valid: false, error: 'Unable to verify license key on this device.' };
  }
}

export function loadOrInitLicenseState(
  storage: StorageLike,
  now = new Date(),
  nativeInfo?: { androidId?: string; firstInstallTime?: number },
  buildTimeMs = getAppBuildTimeMs(),
): StoredLicenseState {
  const nowMs = now.getTime();
  const effectiveNowIso = new Date(Math.max(nowMs, buildTimeMs)).toISOString();
  const nativeDeviceId = nativeInfo?.androidId
    ? deriveDeviceIdFromSeed(nativeInfo.androidId)
    : null;
  const installIso =
    nativeInfo?.firstInstallTime && Number.isFinite(nativeInfo.firstInstallTime)
      ? new Date(nativeInfo.firstInstallTime).toISOString()
      : null;

  try {
    const raw = storage.getItem(LICENSE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredLicenseState>;
      if (parsed && typeof parsed.deviceId === 'string' && parsed.deviceId.startsWith('EC-')) {
        const expiredKeys = Array.isArray(parsed.expiredKeys)
          ? parsed.expiredKeys.filter((k): k is string => typeof k === 'string')
          : [];
        const base = {
          deviceId: parsed.deviceId,
          firstSeenAt: typeof parsed.firstSeenAt === 'string' ? parsed.firstSeenAt : effectiveNowIso,
          lastSeenAt: typeof parsed.lastSeenAt === 'string' ? parsed.lastSeenAt : effectiveNowIso,
          licenseKey: typeof parsed.licenseKey === 'string' ? parsed.licenseKey : null,
          activatedAt: typeof parsed.activatedAt === 'string' ? parsed.activatedAt : null,
          expiredKeys,
        };
        const expectedSeal = computeStateSeal(base);
        const sealOk = parsed.seal === expectedSeal;
        // If native ANDROID_ID exists and stored deviceId mismatches, treat as tampered/copied storage.
        const idMatchesNative = !nativeDeviceId || base.deviceId === nativeDeviceId;
        if (!sealOk || !idMatchesNative) {
          return {
            ...base,
            deviceId: nativeDeviceId ?? base.deviceId,
            seal: parsed.seal ?? '',
            tampered: true,
          };
        }

        // Advance lastSeenAt strictly monotonically forward (never backwards)
        const prevLastMs = Date.parse(base.lastSeenAt);
        const nextLastMs = Math.max(
          Number.isFinite(prevLastMs) ? prevLastMs : 0,
          nowMs,
          buildTimeMs,
        );
        // Never let firstSeenAt be pushed into the future past native install time
        const prevFirstMs = Date.parse(base.firstSeenAt);
        const nativeInstallMs = installIso ? Date.parse(installIso) : Infinity;
        const nextFirstMs = Math.min(
          Number.isFinite(prevFirstMs) ? prevFirstMs : nowMs,
          nativeInstallMs,
        );

        const next = sealState({
          ...base,
          firstSeenAt: new Date(nextFirstMs).toISOString(),
          lastSeenAt: new Date(nextLastMs).toISOString(),
        });
        storage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(next));
        return next;
      }
    }
  } catch {
    // If existing storage was corrupted JSON, fall through cleanly or mark fresh.
  }

  const fresh = sealState({
    deviceId: nativeDeviceId ?? generateDeviceId(),
    firstSeenAt: installIso ?? effectiveNowIso,
    lastSeenAt: effectiveNowIso,
    licenseKey: null,
    activatedAt: null,
    expiredKeys: [],
  });
  try {
    storage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    // Ignore
  }
  return fresh;
}

export function saveLicenseState(
  storage: StorageLike,
  state: Omit<StoredLicenseState, 'seal' | 'tampered'>,
): StoredLicenseState {
  const sealed = sealState(state);
  try {
    storage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(sealed));
  } catch {
    // Ignore
  }
  return sealed;
}

export function getHighWatermarkMs(
  state: StoredLicenseState,
  orders: BillOrder[],
  buildTimeMs = getAppBuildTimeMs(),
): number {
  const lastSeenMs = Date.parse(state.lastSeenAt);
  let latestOrderMs = 0;
  for (const order of orders) {
    if (order.isDemo) continue;
    const t = Date.parse(order.createdAt);
    if (Number.isFinite(t) && t > latestOrderMs) {
      latestOrderMs = t;
    }
  }
  return Math.max(
    Number.isFinite(lastSeenMs) ? lastSeenMs : 0,
    latestOrderMs,
    buildTimeMs,
  );
}

export function evaluateLicense(
  state: StoredLicenseState,
  orders: BillOrder[],
  verifiedActiveKey: VerifiedKeyPayload | null,
  now = new Date(),
  hardEndIso: string | null = TRIAL_HARD_END_ISO,
  buildTimeMs = getAppBuildTimeMs(),
): { evaluation: LicenseEvaluation; newlyExpiredKey?: string } {
  if (state.tampered) {
    return {
      evaluation: {
        status: 'tampered',
        deviceId: state.deviceId,
        plan: null,
        expiresAt: null,
        daysLeft: 0,
        reason: 'License storage was modified externally. Enter a valid activation key to continue.',
      },
    };
  }

  const nowMs = now.getTime();
  const highWatermarkMs = getHighWatermarkMs(state, orders, buildTimeMs);
  if (highWatermarkMs > 0 && nowMs < highWatermarkMs - CLOCK_DRIFT_TOLERANCE_MS) {
    return {
      evaluation: {
        status: 'clock_tampered',
        deviceId: state.deviceId,
        plan: null,
        expiresAt: null,
        daysLeft: 0,
        reason:
          'Device date/time appears to have been set backwards. Restore automatic date & time to continue.',
      },
    };
  }

  const effectiveNowMs = Math.max(nowMs, highWatermarkMs);

  // Check active license key (and blacklist if expired or never valid)
  if (state.licenseKey && verifiedActiveKey?.valid) {
    if (state.expiredKeys.includes(state.licenseKey)) {
      return {
        evaluation: {
          status: 'expired',
          deviceId: state.deviceId,
          plan: verifiedActiveKey.plan ?? null,
          expiresAt: verifiedActiveKey.expiresAt?.toISOString() ?? null,
          daysLeft: 0,
          reason: 'This license key has already expired and cannot be reused.',
        },
      };
    }

    if (!verifiedActiveKey.expiresAt) {
      return {
        evaluation: {
          status: 'licensed',
          deviceId: state.deviceId,
          plan: verifiedActiveKey.plan ?? 'LT',
          expiresAt: null,
          daysLeft: Infinity,
        },
      };
    }

    const expMs = verifiedActiveKey.expiresAt.getTime();
    if (effectiveNowMs <= expMs) {
      const daysLeft = Math.max(1, Math.ceil((expMs - effectiveNowMs) / DAY_MS));
      return {
        evaluation: {
          status: 'licensed',
          deviceId: state.deviceId,
          plan: verifiedActiveKey.plan ?? '30D',
          expiresAt: verifiedActiveKey.expiresAt.toISOString(),
          daysLeft,
        },
      };
    }

    // Key has expired! Record it so it can never be replayed.
    return {
      newlyExpiredKey: state.licenseKey,
      evaluation: {
        status: 'expired',
        deviceId: state.deviceId,
        plan: verifiedActiveKey.plan ?? null,
        expiresAt: verifiedActiveKey.expiresAt.toISOString(),
        daysLeft: 0,
        reason: 'Your license key has expired. Enter a new activation key to continue billing.',
      },
    };
  }

  // Evaluate trial window (capped by both install+TRIAL_DAYS and TRIAL_HARD_END_ISO)
  const firstSeenMs = Date.parse(state.firstSeenAt);
  const installEndMs =
    (Number.isFinite(firstSeenMs) ? firstSeenMs : effectiveNowMs) + TRIAL_DAYS * DAY_MS;
  const hardEndMs = hardEndIso ? Date.parse(hardEndIso) : NaN;
  const trialEndMs = Number.isFinite(hardEndMs)
    ? Math.min(installEndMs, hardEndMs)
    : installEndMs;

  if (effectiveNowMs <= trialEndMs) {
    const daysLeft = Math.max(1, Math.ceil((trialEndMs - effectiveNowMs) / DAY_MS));
    return {
      evaluation: {
        status: 'trial',
        deviceId: state.deviceId,
        plan: null,
        expiresAt: new Date(trialEndMs).toISOString(),
        daysLeft,
      },
    };
  }

  return {
    evaluation: {
      status: 'expired',
      deviceId: state.deviceId,
      plan: null,
      expiresAt: new Date(trialEndMs).toISOString(),
      daysLeft: 0,
      reason: 'Your free trial has ended. Enter a new activation key to unlock Esai Cakes POS.',
    },
  };
}
