import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import db from '../database/store';

export const getPhpInventory = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const installations = db.getPhpInstallations(orgId);

  return res.json({
    success: true,
    count: installations.length,
    data: installations,
  });
};

export const evaluatePhpRuntime = (req: AuthenticatedRequest, res: Response) => {
  const { version, serverHostname, assetId } = req.body;

  if (!version) {
    return res.status(400).json({ success: false, message: 'PHP version is required (e.g., 8.1.18)' });
  }

  // Version parsing and EOL determination
  const parts = version.split('.').map((p: string) => parseInt(p, 10));
  const major = parts[0];
  const minor = parts[1];
  const patch = parts[2] || 0;

  let supportStatus: 'active' | 'security-only' | 'end-of-life' = 'end-of-life';
  let eolDate = '2022-11-28';
  let recommendedTarget = '8.3.12 (Active Support LTS)';

  if (major === 8 && minor >= 3) {
    supportStatus = 'active';
    eolDate = '2027-12-31';
    recommendedTarget = 'Current Release Up to Date';
  } else if (major === 8 && minor === 2) {
    supportStatus = 'security-only';
    eolDate = '2026-12-31';
    recommendedTarget = '8.3.12 (Recommended Next Branch)';
  } else if (major === 8 && minor === 1) {
    supportStatus = 'end-of-life';
    eolDate = '2025-12-31';
    recommendedTarget = '8.3.12';
  } else {
    supportStatus = 'end-of-life';
    eolDate = '2022-11-28';
    recommendedTarget = '8.3.12';
  }

  // Find relevant CVEs matching this version
  const relevantCVEs = db.advisories.filter((a) => a.product.includes('PHP')).map((a) => a.id);

  return res.json({
    success: true,
    evaluation: {
      inputVersion: version,
      supportStatus,
      eolDate,
      recommendedTarget,
      isVulnerable: supportStatus === 'end-of-life' || relevantCVEs.length > 0,
      matchedAdvisories: relevantCVEs,
      evaluationTimestamp: new Date().toISOString(),
      caveat: 'Heuristic version evaluation based on authoritative PHP.net lifecycle rules. Backport check required for distribution packages.',
    },
  });
};
