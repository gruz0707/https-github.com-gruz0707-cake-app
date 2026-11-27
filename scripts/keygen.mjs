import { generateLicenseKey } from '../src/utils/licensing';

const [, , rawDeviceId, rawPlan = 'LT'] = process.argv;

if (!rawDeviceId || !rawDeviceId.toUpperCase().startsWith('EC-')) {
  console.log('Usage: npm run keygen -- <DEVICE_CODE> [30D|1Y|LT]');
  console.log('Example: npm run keygen -- EC-7F3A-91C2 LT');
  process.exit(1);
}

const plan = rawPlan.toUpperCase();
if (plan !== '30D' && plan !== '1Y' && plan !== 'LT') {
  console.error('Plan must be 30D, 1Y, or LT');
  process.exit(1);
}

const key = generateLicenseKey(rawDeviceId, plan);
console.log(`\nDevice Code : ${rawDeviceId.toUpperCase()}`);
console.log(`Plan        : ${plan}`);
console.log(`License Key : ${key}\n`);
