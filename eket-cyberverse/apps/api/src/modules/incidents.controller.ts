import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import db from '../database/store';
import { Incident } from '../types';

export const getIncidents = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const incidents = db.getIncidents(orgId);
  return res.json({ success: true, count: incidents.length, data: incidents });
};

export const createIncident = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const { title, severity, affectedAssetIds, initialEvent } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Incident title is required' });
  }

  const newIncident: Incident = {
    id: `inc-${Date.now()}`,
    organizationId: orgId,
    title,
    severity: severity || 'HIGH',
    status: 'suspected',
    affectedAssetIds: Array.isArray(affectedAssetIds) ? affectedAssetIds : [],
    leadResponder: req.user!.email,
    timeline: [
      {
        timestamp: new Date().toISOString(),
        event: initialEvent || 'Incident reported to Security Operations',
        recordedBy: req.user!.email,
      },
    ],
    containmentActions: ['Isolate suspect traffic', 'Capture forensic memory snapshot'],
    createdAt: new Date().toISOString(),
  };

  db.incidents.push(newIncident);

  db.appendAudit({
    organizationId: orgId,
    actor: req.user!.email,
    action: 'INCIDENT_DECLARED',
    resourceType: 'Incident',
    resourceId: newIncident.id,
    details: `Declared ${newIncident.severity} incident '${newIncident.title}'`,
    evidenceHash: 'incident-creation',
  });

  return res.status(201).json({ success: true, data: newIncident });
};
