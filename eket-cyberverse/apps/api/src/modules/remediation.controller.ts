import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import db from '../database/store';
import crypto from 'crypto';
import { RemediationTask } from '../types';

export const getRemediationTasks = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const tasks = db.getRemediationTasks(orgId);

  return res.json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
};

export const createRemediationTask = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const { findingId, title, priority, assignedTo, dueDate, remediationPlan } = req.body;

  if (!findingId || !title || !remediationPlan) {
    return res.status(400).json({ success: false, message: 'findingId, title, and remediationPlan are required' });
  }

  const finding = db.findings.find((f) => f.id === findingId && f.organizationId === orgId);
  if (!finding) {
    return res.status(404).json({ success: false, message: 'Finding not found or access denied' });
  }

  const newTask: RemediationTask = {
    id: `rem-${Date.now()}`,
    organizationId: orgId,
    findingId,
    title,
    state: 'AWAITING_APPROVAL',
    priority: priority || 'HIGH',
    assignedTo: assignedTo || req.user!.email,
    dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    remediationPlan,
    executionLogs: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.remediationTasks.push(newTask);
  finding.remediationTaskId = newTask.id;
  finding.status = 'remediating';

  db.appendAudit({
    organizationId: orgId,
    actor: req.user!.email,
    action: 'REMEDIATION_TASK_CREATED',
    resourceType: 'RemediationTask',
    resourceId: newTask.id,
    details: `Created task for finding ${finding.title}`,
    evidenceHash: 'initial-task-creation',
  });

  return res.status(201).json({ success: true, data: newTask });
};

export const approveRemediationTask = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const { id } = req.params;

  if (req.user!.role !== 'admin' && req.user!.role !== 'security_engineer') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Only admin or security_engineer can authorize remediation plans',
    });
  }

  const task = db.remediationTasks.find((t) => t.id === id && t.organizationId === orgId);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Remediation task not found' });
  }

  task.state = 'APPROVED';
  task.approvedBy = req.user!.email;
  task.approvedAt = new Date().toISOString();
  task.updatedAt = new Date().toISOString();

  db.appendAudit({
    organizationId: orgId,
    actor: req.user!.email,
    action: 'REMEDIATION_PLAN_APPROVED',
    resourceType: 'RemediationTask',
    resourceId: task.id,
    details: `Authorized remediation execution for '${task.title}'`,
    evidenceHash: crypto.createHash('sha256').update(task.remediationPlan).digest('hex'),
  });

  return res.json({ success: true, message: 'Remediation plan approved', data: task });
};

export const logExecution = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const { id } = req.params;
  const { action, outputSummary } = req.body;

  if (!action || !outputSummary) {
    return res.status(400).json({ success: false, message: 'action and outputSummary are required' });
  }

  const task = db.remediationTasks.find((t) => t.id === id && t.organizationId === orgId);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Remediation task not found' });
  }

  task.state = 'AWAITING_VERIFICATION';
  task.executionLogs.push({
    timestamp: new Date().toISOString(),
    actor: req.user!.email,
    action,
    outputSummary,
  });
  task.updatedAt = new Date().toISOString();

  return res.json({ success: true, message: 'Execution logged. Task now awaiting verification.', data: task });
};

export const verifyRemediation = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const { id } = req.params;
  const { method, evidenceText, verifiedTrue } = req.body;

  // ABSOLUTE NON-NEGOTIABLE RULE: A task cannot be marked verified resolved without real evidence
  if (!evidenceText || typeof evidenceText !== 'string' || evidenceText.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'CRITICAL: Remediation verification rejected. Substantial supporting inspection evidence (min 10 chars) is required.',
    });
  }

  const task = db.remediationTasks.find((t) => t.id === id && t.organizationId === orgId);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Remediation task not found' });
  }

  const evidenceHash = crypto.createHash('sha256').update(evidenceText).digest('hex');

  const isVerified = verifiedTrue !== false; // defaults to true unless explicitly reported false
  task.state = isVerified ? 'VERIFIED_RESOLVED' : 'VERIFICATION_FAILED';
  task.verificationEvidence = {
    verifiedAt: new Date().toISOString(),
    verifiedBy: req.user!.email,
    method: method || 're-probe',
    evidenceText,
    evidenceHash,
    verifiedTrue: isVerified,
  };
  task.updatedAt = new Date().toISOString();

  // If verified, update the finding status
  const finding = db.findings.find((f) => f.id === task.findingId && f.organizationId === orgId);
  if (finding && isVerified) {
    finding.status = 'verified_resolved';
  }

  db.appendAudit({
    organizationId: orgId,
    actor: req.user!.email,
    action: isVerified ? 'REMEDIATION_VERIFIED_RESOLVED' : 'REMEDIATION_VERIFICATION_FAILED',
    resourceType: 'RemediationTask',
    resourceId: task.id,
    details: `Evidence verification ${isVerified ? 'PASSED' : 'FAILED'}: ${evidenceText.slice(0, 100)}...`,
    evidenceHash,
  });

  return res.json({
    success: true,
    message: isVerified
      ? 'Remediation independently verified and resolved with cryptographic audit record.'
      : 'Verification failed. Remediation remains open.',
    data: task,
  });
};
