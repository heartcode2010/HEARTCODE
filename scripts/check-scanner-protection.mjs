import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const base = process.env.BASE_SHA;
const head = process.env.HEAD_SHA || 'HEAD';
if (!base) {
  console.error('BASE_SHA is required; refusing to run scanner protection check without a comparison range.');
  process.exit(2);
}
const protectedPaths = readFileSync('docs/SCANNER-PROTECTED-PATHS.md', 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.startsWith('- '))
  .map((line) => line.slice(2));
const changed = execFileSync('git', ['diff', '--name-only', base, head], { encoding: 'utf8' })
  .split('\n').map((line) => line.trim()).filter(Boolean);
const blocked = changed.filter((file) => protectedPaths.some((entry) =>
  entry.endsWith('/') ? file.startsWith(entry) : file === entry
));
if (blocked.length) {
  console.error('Scanner-protected files changed. This OS workstream must not modify the scanner:');
  for (const file of blocked) console.error(`  - ${file}`);
  console.error('Obtain explicit owner approval and handle scanner changes in a separate task.');
  process.exit(1);
}
console.log(`Scanner protection check passed: ${changed.length} changed file(s), no protected scanner paths touched.`);
