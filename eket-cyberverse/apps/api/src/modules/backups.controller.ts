import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import db from '../database/store';

export const getBackups = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const backups = db.getBackups(orgId);
  return res.json({ success: true, count: backups.length, data: backups });
};

export const logRestoreDrill = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const { id } = req.params;
  const { result, drillNotes } = req.body;

  const backup = db.backups.find((b) => b.id === id && b.organizationId === orgId);
  if (!backup) {
    return res.status(404).json({ success: false, message: 'Backup record not found' });
  }

  backup.restoreDrillResult = result === 'PASS' ? 'PASS' : 'FAIL';
  backup.lastRestoreDrillAt = new Date().toISOString();

  db.appendAudit({
    organizationId: orgId,
    actor: req.user!.email,
    action: 'BACKUP_RESTORE_DRILL_EXECUTED',
    resourceType: 'BackupRecord',
    resourceId: backup.id,
    details: `Restore drill result: ${backup.restoreDrillResult}. Notes: ${drillNotes || 'None'}`,
    evidenceHash: 'drill-evidence-verified',
  });

  return res.json({ success: true, message: 'Restore drill logged successfully', data: backup });
};
