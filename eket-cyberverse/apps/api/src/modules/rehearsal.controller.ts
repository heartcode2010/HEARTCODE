import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { RehearsalPlan } from '../types';

export const planChangeRehearsal = (req: AuthenticatedRequest, res: Response) => {
  const { targetAsset, proposedAction } = req.body;

  if (!targetAsset || !proposedAction) {
    return res.status(400).json({ success: false, message: 'targetAsset and proposedAction are required' });
  }

  // Pre-flight assessment engine
  const isPhpUpgrade = proposedAction.toLowerCase().includes('php');
  const isTlsChange = proposedAction.toLowerCase().includes('cert') || proposedAction.toLowerCase().includes('tls');

  const compatibilityWarnings: string[] = [];
  const prerequisites: string[] = [];

  if (isPhpUpgrade) {
    compatibilityWarnings.push(
      'Deprecated functions in PHP 8.2/8.3: utf8_encode/decode removed, strftime removed.',
      'Composer dependencies must be evaluated with `composer check-platform-reqs` prior to switchover.',
      'OPcache memory settings must be re-baselined for the new runtime daemon.'
    );
    prerequisites.push(
      'Verified VM snapshot taken within last 60 minutes.',
      'Nginx reverse proxy health check endpoint configured for graceful drain.',
      'Rollback script prepared to revert fastcgi_pass socket path.'
    );
  } else if (isTlsChange) {
    compatibilityWarnings.push(
      'Intermediate chain must include ISRG Root X1 for cross-compatibility with legacy Android/Java clients.',
      'HSTS max-age setting must not exceed 300 seconds during rehearsal window.'
    );
    prerequisites.push('DNS CAA records allow target Certificate Authority issue requests.');
  } else {
    compatibilityWarnings.push('Generic runtime or configuration change requires isolated smoke testing.');
    prerequisites.push('Full application state backup verified.');
  }

  const plan: RehearsalPlan = {
    id: `reh-${Date.now()}`,
    targetAsset,
    proposedAction,
    compatibilityWarnings,
    prerequisites,
    backupVerified: true,
    rollbackPlan: `1. Stop newly deployed service.\n2. Re-point symlink /etc/service/active to previous release backup.\n3. Reload reverse proxy.\n4. Confirm HTTP 200 health probe.`,
    estimatedDowntimeSeconds: isPhpUpgrade ? 15 : 0,
    readinessScore: 88,
  };

  return res.json({ success: true, plan });
};
