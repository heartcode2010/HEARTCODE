import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import db from '../database/store';
import crypto from 'crypto';

export const getCertificates = (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.user!.organizationId;
  const certs = db.getTlsCertificates(orgId);

  return res.json({
    success: true,
    count: certs.length,
    data: certs,
  });
};

export const inspectCertificate = (req: AuthenticatedRequest, res: Response) => {
  const { hostname } = req.body;

  if (!hostname) {
    return res.status(400).json({ success: false, message: 'Hostname is required' });
  }

  // Simulated TLS probe with deterministic cryptographic fingerprint
  const cleanHost = hostname.replace(/^https?:\/\//, '').split('/')[0];
  const now = new Date();
  const validTo = new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000); // 75 days out
  const fingerprint = crypto.createHash('sha256').update(cleanHost + 'tls-cert').digest('hex').toUpperCase().match(/.{2}/g)?.join(':') || 'FA:33...';

  return res.json({
    success: true,
    inspection: {
      hostname: cleanHost,
      subject: `CN=${cleanHost}`,
      issuer: "Let's Encrypt Authority E6 (ISRG Root X1)",
      validFrom: now.toISOString(),
      validTo: validTo.toISOString(),
      daysRemaining: 75,
      isExpired: false,
      chainValid: true,
      hostnameMatches: true,
      keyStrength: 'ECDSA 256-bit (prime256v1)',
      sha256Fingerprint: fingerprint,
      trustStatus: 'trusted',
      ctLogged: true,
      alpn: ['h2', 'http/1.1'],
      probedAt: new Date().toISOString(),
    },
  });
};
