import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';
import * as tls from 'tls';
import { URL } from 'url';

export class SSLScanner implements ScannerModule {
  moduleName = 'SSLScanner';
  category = 'SSL/TLS ANALYSIS';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    
    let hostname: string;
    let port: number;
    try {
      const urlObj = new URL(target.url.startsWith('http') ? target.url : `https://${target.url}`);
      hostname = urlObj.hostname;
      port = urlObj.port ? parseInt(urlObj.port) : (urlObj.protocol === 'http:' ? 80 : 443);
    } catch (e) {
      // Invalid URL, skip SSL scan
      return findings;
    }

    if (port !== 443 && !target.url.startsWith('https')) {
       findings.push({
        id: 'SSL-001',
        category: this.category,
        severity: 'High',
        confidence: 'Certain',
        name: 'Insecure Protocol Usage (HTTP)',
        description: 'The target is being accessed over unencrypted HTTP.',
        technicalExplanation: 'HTTP sends data in plaintext over the network. An attacker on the same network path can intercept, read, and modify all traffic between the client and server.',
        businessImpact: 'Complete compromise of user privacy, credentials, and data integrity. Severe compliance violation for almost any regulatory framework.',
        remediation: 'Implement an SSL/TLS certificate and force all traffic over HTTPS using Strict-Transport-Security (HSTS) and server-side redirects.',
        evidence: `URL used HTTP: ${target.url}`,
      });
      return findings; // Can't do TLS checks on plain HTTP
    }

    try {
      const certData = await this.getTlsInfo(hostname, port);
      
      const validTo = new Date(certData.valid_to);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 3600 * 24));

      if (daysUntilExpiry < 0) {
        findings.push({
          id: 'SSL-002',
          category: this.category,
          severity: 'Critical',
          confidence: 'Certain',
          name: 'Expired SSL Certificate',
          description: `The SSL certificate expired ${Math.abs(daysUntilExpiry)} days ago.`,
          technicalExplanation: 'An expired certificate causes browsers to display severe security warnings to users. It indicates a failure in security lifecycle management and means the identity of the server can no longer be guaranteed by the CA.',
          businessImpact: 'Complete loss of user trust, broken integrations with secure APIs, and severe reputation damage as users will be blocked from accessing the site.',
          remediation: 'Immediately renew and install a valid SSL certificate.',
          evidence: `Expired on: ${certData.valid_to}`,
        });
      } else if (daysUntilExpiry < 14) {
        findings.push({
          id: 'SSL-003',
          category: this.category,
          severity: 'Medium',
          confidence: 'Certain',
          name: 'SSL Certificate Expiring Soon',
          description: `The SSL certificate expires in ${daysUntilExpiry} days.`,
          technicalExplanation: 'The certificate is close to expiration. If not renewed in time, the application will become inaccessible or show security errors to users.',
          businessImpact: 'Potential for sudden service disruption and loss of trust if renewal processes fail.',
          remediation: 'Renew the SSL certificate before it expires. Setup automated renewal mechanisms (e.g., certbot/Let\'s Encrypt) to prevent future occurrences.',
          evidence: `Expires on: ${certData.valid_to}`,
        });
      }

      if (certData.tlsVersion === 'TLSv1.0' || certData.tlsVersion === 'TLSv1.1') {
         findings.push({
          id: 'SSL-004',
          category: this.category,
          severity: 'High',
          confidence: 'Certain',
          name: 'Deprecated TLS Version Supported',
          description: `The server negotiated an outdated and insecure TLS protocol version (${certData.tlsVersion}).`,
          technicalExplanation: 'TLS 1.0 and 1.1 suffer from known cryptographic weaknesses (e.g., BEAST, POODLE, CRIME) and are officially deprecated by major browsers and standard bodies.',
          businessImpact: 'Traffic may be vulnerable to decryption attacks. Fails modern compliance standards (PCI-DSS).',
          remediation: 'Disable TLS 1.0 and TLS 1.1 on the server. Enforce TLS 1.2 minimum, ideally TLS 1.3.',
          evidence: `Negotiated protocol: ${certData.tlsVersion}`,
        });
      }

    } catch (err: any) {
      findings.push({
          id: 'SSL-005',
          category: this.category,
          severity: 'High',
          confidence: 'Tentative',
          name: 'SSL Handshake Failure',
          description: 'Failed to negotiate a secure connection to the server.',
          technicalExplanation: `The TLS handshake failed. This could be due to a completely invalid/self-signed certificate, entirely unsupported protocols, or firewall blocks. Error: ${err.message}`,
          businessImpact: 'Users may be unable to securely connect to the application.',
          remediation: 'Verify server SSL configuration, certificate chain validity, and firewall settings.',
          evidence: err.message,
        });
    }

    return findings;
  }

  private getTlsInfo(hostname: string, port: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const socket = tls.connect({
        host: hostname,
        port: port,
        servername: hostname, // For SNI
        rejectUnauthorized: false, // Don't crash on invalid certs, we want to inspect them
      }, () => {
        const cert = socket.getPeerCertificate();
        const protocol = socket.getProtocol();
        socket.destroy();
        
        if (!cert || Object.keys(cert).length === 0) {
            reject(new Error('No certificate provided by server'));
            return;
        }
        
        resolve({
            valid_from: cert.valid_from,
            valid_to: cert.valid_to,
            tlsVersion: protocol,
            issuer: cert.issuer,
            subject: cert.subject
        });
      });

      socket.on('error', (err) => {
        reject(err);
      });
      
      // Prevent hanging
      socket.setTimeout(5000, () => {
          socket.destroy();
          reject(new Error('TLS connection timed out'));
      });
    });
  }
}
