import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import db from '../database/store';

export const getFindings = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const { severity, category, status } = req.query;

  let findings = db.getFindings(orgId);

  if (severity && typeof severity === 'string') {
    findings = findings.filter((f) => f.severity === severity.toUpperCase());
  }
  if (category && typeof category === 'string') {
    findings = findings.filter((f) => f.category === category);
  }
  if (status && typeof status === 'string') {
    findings = findings.filter((f) => f.status === status);
  }

  return res.json({
    success: true,
    count: findings.length,
    data: findings,
  });
};

export const getFindingById = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const { id } = req.params;

  const finding = db.findings.find((f) => f.id === id && f.organizationId === orgId);

  if (!finding) {
    return res.status(404).json({ success: false, message: 'Finding not found or access denied' });
  }

  return res.json({ success: true, data: finding });
};
