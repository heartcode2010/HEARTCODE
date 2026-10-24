import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import db from '../database/store';
import { Asset } from '../types';

export const getAssets = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const assets = db.getAssets(orgId);
  return res.json({ success: true, count: assets.length, data: assets });
};

export const createAsset = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const { name, assetType, target, environment, criticality, owner, tags, evidenceSource } = req.body;

  if (!name || !assetType || !target) {
    return res.status(400).json({ success: false, message: 'Name, assetType, and target are required' });
  }

  const newAsset: Asset = {
    id: `ast-${Date.now()}`,
    organizationId: orgId,
    name,
    assetType,
    target,
    environment: environment || 'production',
    criticality: criticality || 'medium',
    owner: owner || req.user!.email,
    tags: Array.isArray(tags) ? tags : [],
    lastObservedAt: new Date().toISOString(),
    evidenceSource: evidenceSource || 'Manual Registration Console',
    metadata: {},
    createdAt: new Date().toISOString(),
  };

  db.assets.push(newAsset);

  db.appendAudit({
    organizationId: orgId,
    actor: req.user!.email,
    action: 'ASSET_REGISTERED',
    resourceType: 'Asset',
    resourceId: newAsset.id,
    details: `Registered ${newAsset.assetType} '${newAsset.name}' (${newAsset.target})`,
    evidenceHash: 'manual-input-verified',
  });

  return res.status(201).json({ success: true, data: newAsset });
};

export const deleteAsset = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const { id } = req.params;

  const index = db.assets.findIndex((a) => a.id === id && a.organizationId === orgId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Asset not found or belongs to another organization' });
  }

  const deleted = db.assets.splice(index, 1)[0];

  db.appendAudit({
    organizationId: orgId,
    actor: req.user!.email,
    action: 'ASSET_DECOMMISSIONED',
    resourceType: 'Asset',
    resourceId: id,
    details: `Decommissioned asset ${deleted.name}`,
    evidenceHash: 'administrative-action',
  });

  return res.json({ success: true, message: 'Asset decommissioned', data: deleted });
};
