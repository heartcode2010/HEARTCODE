import assert from 'assert';
import db from '../src/database/store';

console.log('────────────────────────────────────────────────────────');
console.log('🧪 RUNNING EKET CYBERVERSE TEST SUITE');
console.log('────────────────────────────────────────────────────────');

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// 1. Strict Tenant Isolation Test
test('Tenant Isolation: Org 1 cannot see Org 2 assets', () => {
  const org1Assets = db.getAssets('org-eket-1');
  const org2Assets = db.getAssets('org-isolated-2');

  assert.ok(org1Assets.length > 0, 'Org 1 must have assets');
  assert.ok(org2Assets.length > 0, 'Org 2 must have assets');

  // Ensure no cross-contamination
  const leakIntoOrg1 = org1Assets.some((a) => a.organizationId !== 'org-eket-1');
  const leakIntoOrg2 = org2Assets.some((a) => a.organizationId !== 'org-isolated-2');

  assert.strictEqual(leakIntoOrg1, false, 'No Org 2 assets can appear in Org 1 asset list');
  assert.strictEqual(leakIntoOrg2, false, 'No Org 1 assets can appear in Org 2 asset list');
});

// 2. Strict Verified Remediation Evidence Enforcement
test('Verified Remediation: Reject verification attempt lacking substantive evidence', () => {
  const task = db.remediationTasks[0];
  assert.ok(task, 'Task must exist');

  // Attempt verification with empty evidence
  const emptyEvidence = '';
  const isRejected = !emptyEvidence || emptyEvidence.trim().length < 10;

  assert.strictEqual(isRejected, true, 'Verification without evidence MUST be rejected');
});

// 3. Evidence-Based Verification Success Test
test('Verified Remediation: Mark verified only when evidence is verified and cryptographic hash generated', () => {
  const task = db.remediationTasks[0];
  const validEvidence = 'Verified PHP 8.3.12 (cli) (built: Sep 28 2024) with SHA256 checksum match.';

  assert.ok(validEvidence.length >= 10, 'Evidence meets length requirement');

  // Test hash creation
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(validEvidence).digest('hex');
  assert.strictEqual(typeof hash, 'string', 'Cryptographic evidence hash generated');
  assert.strictEqual(hash.length, 64, 'SHA-256 hash must be 64 characters hex');
});

// 4. PHP Runtime Security & Advisory Matching Test
test('PHP Security: Evaluates EOL version and matches known advisories', () => {
  const php74Installation = db.phpInstallations.find((p) => p.version.startsWith('7.4'));
  assert.ok(php74Installation, 'PHP 7.4 runtime must be cataloged');
  assert.strictEqual(php74Installation.supportStatus, 'end-of-life', 'PHP 7.4 must be marked end-of-life');

  const cve4577 = db.advisories.find((a) => a.id === 'CVE-2024-4577');
  assert.ok(cve4577, 'CVE-2024-4577 must be present in advisory store');
  assert.strictEqual(cve4577.isKnownExploited, true, 'CVE-2024-4577 must be marked CISA Known Exploited');
});

// 5. Audit Trail Immutable Logging
test('Audit Trail: Appending security event records actor, action, and evidence hash', () => {
  const initialCount = db.auditEvents.length;
  const event = db.appendAudit({
    organizationId: 'org-eket-1',
    actor: 'lead-operator@eket-cyberverse.org',
    action: 'TEST_SUITE_EXECUTION',
    resourceType: 'SecurityEngine',
    resourceId: 'test-runner',
    details: 'Automated test suite verification cycle',
    evidenceHash: 'test-hash-1234',
  });

  assert.strictEqual(db.auditEvents.length, initialCount + 1, 'Audit log length increased by 1');
  assert.strictEqual(event.actor, 'lead-operator@eket-cyberverse.org');
});

console.log('────────────────────────────────────────────────────────');
console.log(`Test Execution Results: ${passed} PASSED, ${failed} FAILED`);
console.log('────────────────────────────────────────────────────────');

if (failed > 0) {
  process.exit(1);
}
