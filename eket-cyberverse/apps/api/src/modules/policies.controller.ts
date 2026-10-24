import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import db from '../database/store';

export const getPolicies = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const policies = db.getPolicies(orgId);
  return res.json({ success: true, count: policies.length, data: policies });
};

export const getAuditEvents = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const events = db.getAuditEvents(orgId);
  return res.json({ success: true, count: events.length, data: events });
};
