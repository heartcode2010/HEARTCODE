import { execFileSync } from 'node:child_process';

const base = process.env.BASE_SHA;
const head = process.env.HEAD_SHA || 'HEAD';
if (!base) {
  console.error('BASE_SHA is required for the scanner protection check.');
  process.exit(2);
}

const protectedPaths = [
  'frontend/src/pages/Dashboard.tsx',
  'frontend/src/index.css',
  'frontend/src/services/api.ts',
  'frontend/src/store/scanStore.ts',
  'backend/src/routes/scan.routes.ts',
  'backend/src/controllers/scan.controller.ts',
  'backend/src/controllers/vulnerability.controller.ts',
  'backend/src/routes/vulnerability.routes.ts',
  'backend/src/controllers/report.controller.ts',
  'backend/src/routes/report.routes.ts',
  'backend/src/models/Scan.ts',
  'backend/src/models/Vulnerability.ts',
  'backend/src/config/db.ts',
  'backend/src/middleware/auth.middleware.ts',
  'backend/src/services/ScanService.ts',
  'backend/src/services/scanner/',
];

const changed = execFileSync('git', ['diff', '--name-only', base, head], { encoding: 'utf8' })
  .split('\n').map(path => path.trim()).filter(Boolean);
const violations = changed.filter(path => protectedPaths.some(guard => guard.endsWith('/') ? path.startsWith(guard) : path === guard));

if (violations.length) {
  console.error('Scanner-protected files were changed. Do not merge this change without explicit scanner-owner approval:');
  violations.forEach(path => console.error(' - ' + path));
  process.exit(1);
}
console.log('Scanner protection passed. No protected scanner paths changed.');
