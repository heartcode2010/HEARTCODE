import { Router } from 'express';
import authenticate, { requireRole } from '../middleware/auth';

import { getAssets, createAsset, deleteAsset } from '../modules/assets.controller';
import { getAdvisories, syncAdvisories } from '../modules/advisories.controller';
import { getPhpInventory, evaluatePhpRuntime } from '../modules/php.controller';
import { getCertificates, inspectCertificate } from '../modules/tls.controller';
import { getFindings, getFindingById } from '../modules/findings.controller';
import {
  getRemediationTasks,
  createRemediationTask,
  approveRemediationTask,
  logExecution,
  verifyRemediation,
} from '../modules/remediation.controller';
import { planChangeRehearsal } from '../modules/rehearsal.controller';
import { getIncidents, createIncident } from '../modules/incidents.controller';
import { getBackups, logRestoreDrill } from '../modules/backups.controller';
import { getPolicies, getAuditEvents } from '../modules/policies.controller';
import { queryCopilot } from '../modules/copilot.controller';
import { getPostureReport } from '../modules/reports.controller';

const router = Router();

// ── Health & Diagnostics ──
router.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Eket Cyberverse API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// All operational routes require tenant authentication
router.use(authenticate);

// ── Asset Inventory ──
router.get('/assets', getAssets);
router.post('/assets', createAsset);
router.delete('/assets/:id', deleteAsset);

// ── Global Vulnerability Intelligence ──
router.get('/advisories', getAdvisories);
router.post('/advisories/sync', syncAdvisories);

// ── PHP Runtime Security ──
router.get('/php-security/inventory', getPhpInventory);
router.post('/php-security/evaluate', evaluatePhpRuntime);

// ── TLS Trust Guardian ──
router.get('/tls/certificates', getCertificates);
router.post('/tls/inspect', inspectCertificate);

// ── Findings & Explainable Risk ──
router.get('/findings', getFindings);
router.get('/findings/:id', getFindingById);

// ── Verified Remediation Engine ──
router.get('/remediation/tasks', getRemediationTasks);
router.post('/remediation/tasks', createRemediationTask);
router.post('/remediation/tasks/:id/approve', requireRole(['admin', 'security_engineer']), approveRemediationTask);
router.post('/remediation/tasks/:id/execute', logExecution);
router.post('/remediation/tasks/:id/verify', verifyRemediation);

// ── Security Change Rehearsal ──
router.post('/rehearsal/plan', planChangeRehearsal);

// ── Incidents ──
router.get('/incidents', getIncidents);
router.post('/incidents', createIncident);

// ── Backup Assurance ──
router.get('/backups', getBackups);
router.post('/backups/:id/restore-drill', logRestoreDrill);

// ── Policies & Audit ──
router.get('/policies', getPolicies);
router.get('/audit/events', getAuditEvents);

// ── AI Security Copilot ──
router.post('/copilot/query', queryCopilot);

// ── Security Reporting ──
router.get('/reports/posture', getPostureReport);

export default router;
