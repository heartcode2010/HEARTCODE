import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class SecretLeakScanner implements ScannerModule {
  moduleName = 'SecretLeakScanner';
  category = 'SECRET LEAK SCANNER';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const html = target.html;

    const add = (name: string, description: string, evidence: string) => {
      findings.push({
        id: `SEC-${findings.length + 1}`,
        category: this.category,
        severity: 'Critical',
        confidence: 'Firm',
        name: name,
        description: description,
        technicalExplanation: 'Sensitive credentials or API keys were found hardcoded directly in the client-side source code. Any user visiting the site can extract these values.',
        businessImpact: 'Severe. Attackers can impersonate the application, access internal databases, incur cloud billing charges, or access user data.',
        remediation: 'Immediately revoke the compromised credential. Move the credential to environment variables on the backend server, and ensure client-side code only communicates with your backend API, not third-party services directly.',
        evidence: evidence,
      });
    };

    const keyPatterns = [
      { re: /api[_-]?key["'\s]*[:=]["'\s]*([a-zA-Z0-9\-_]{20,})/i, label: 'Generic API Key' },
      { re: /secret["'\s]*[:=]["'\s]*([a-zA-Z0-9\-_]{16,})/i, label: 'Generic Secret' },
      { re: /access[_-]?token["'\s]*[:=]["'\s]*([a-zA-Z0-9\-_]{16,})/i, label: 'Access Token' },
      { re: /password["'\s]*[:=]["'\s]*["']([^"']{6,})/i, label: 'Hardcoded Password' },
      { re: /(AIza[0-9A-Za-z\-_]{35})/, label: 'Google API Key' },
      { re: /(gh[pousr]_[A-Za-z0-9_]{36,})/, label: 'GitHub Token' },
      { re: /(AKIA[0-9A-Z]{16})/, label: 'AWS Access Key ID' },
      { re: /sk-[a-zA-Z0-9]{32,}/, label: 'OpenAI/Stripe Secret Key' },
    ];

    keyPatterns.forEach(kp => {
      const m = html.match(kp.re);
      if (m) {
        add(`Exposed Credential: ${kp.label}`, `Hardcoded credential found in source matching pattern for ${kp.label}.`, m[0].substring(0, 80));
      }
    });

    // Firebase Specific
    if (/firebaseConfig\s*=/.test(html) || /initializeApp\s*\(/.test(html)) {
      const m = html.match(/apiKey\s*:\s*["'][^"']{10,}["']/);
      if (m) {
          findings.push({
            id: `SEC-${findings.length + 1}`,
            category: this.category,
            severity: 'High',
            confidence: 'Certain',
            name: 'Firebase Config Exposed',
            description: 'Firebase project credentials are visible in source code.',
            technicalExplanation: 'Firebase client configurations are inherently public. However, if Firebase Security Rules (Firestore, Realtime DB, Storage) are not properly configured to restrict access based on authentication, this constitutes a critical data exposure.',
            businessImpact: 'Attackers could read, write, or delete the entire database if security rules are permissive.',
            remediation: 'Ensure Firestore/Storage security rules strictly enforce authentication and authorization. Consider implementing Firebase App Check.',
            evidence: m[0],
          });
      }
    }

    // JWT Token
    const jwtMatch = html.match(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/);
    if (jwtMatch) {
      add('JWT Token Hardcoded', 'A JSON Web Token is embedded in the source code.', jwtMatch[0].substring(0, 60) + '...');
    }

    // Base64 Encoded Credentials
    const b64Matches = html.match(/["']([A-Za-z0-9+/]{40,}={0,2})["']/g);
    if (b64Matches && b64Matches.length > 0) {
      try {
        const decoded = Buffer.from(b64Matches[0].replace(/["']/g, ''), 'base64').toString('utf8');
        if (/password|secret|key|token|api/i.test(decoded)) {
          add('Base64-Encoded Credential', 'A Base64 string decodes to credential-like keywords.', b64Matches[0].substring(0, 60));
        }
      } catch (e) {
        // Not base64
      }
    }

    return findings;
  }
}
