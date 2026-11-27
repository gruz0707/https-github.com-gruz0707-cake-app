import fs from 'node:fs';
import path from 'node:path';
import { createPrivateKey, sign } from 'node:crypto';

const DAY_MS = 24 * 60 * 60 * 1000;
const [, , rawDeviceId, rawPlan = 'LT'] = process.argv;

if (!rawDeviceId || !/^EC-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(rawDeviceId.trim())) {
  console.log('Usage: npm run keygen -- <DEVICE_CODE> [30D|1Y|LT]');
  console.log('Example: npm run keygen -- EC-7F3A-91C2 LT');
  process.exit(1);
}

const plan = rawPlan.toUpperCase();
if (plan !== '30D' && plan !== '1Y' && plan !== 'LT') {
  console.error('Plan must be 30D, 1Y, or LT');
  process.exit(1);
}

const keyPath = path.resolve(import.meta.dirname, 'ubsc-private-key.json');
if (!fs.existsSync(keyPath)) {
  console.error(`Private signing key not found at ${keyPath}`);
  process.exit(1);
}

const privJwk = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
const privateKey = createPrivateKey({ key: privJwk, format: 'jwk' });

const cleanId = rawDeviceId.trim().toUpperCase();
const now = new Date();
let expiryCode = 'LIFE';
if (plan === '30D') {
  const exp = new Date(now.getTime() + 30 * DAY_MS);
  expiryCode = `${String(exp.getFullYear()).slice(-2)}${String(exp.getMonth() + 1).padStart(2, '0')}${String(exp.getDate()).padStart(2, '0')}`;
} else if (plan === '1Y') {
  const exp = new Date(now.getTime() + 365 * DAY_MS);
  expiryCode = `${String(exp.getFullYear()).slice(-2)}${String(exp.getMonth() + 1).padStart(2, '0')}${String(exp.getDate()).padStart(2, '0')}`;
}

const payload = `${cleanId}:${plan}:${expiryCode}`;
// IEEE P1363 format matches WebCrypto subtle.verify('ECDSA', ...)
const sig = sign('sha256', Buffer.from(payload, 'utf8'), {
  key: privateKey,
  dsaEncoding: 'ieee-p1363',
}).toString('base64url');

const licenseKey = `ESAI-${plan}-${expiryCode}-${sig}`;
console.log(`\nDevice Code : ${cleanId}`);
console.log(`Plan        : ${plan}${expiryCode === 'LIFE' ? ' (Lifetime)' : ` (expires ${expiryCode})`}`);
console.log(`License Key : ${licenseKey}\n`);
