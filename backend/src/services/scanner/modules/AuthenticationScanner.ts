import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class AuthenticationScanner implements ScannerModule {
  moduleName = 'AuthenticationScanner';
  category = 'AUTHENTICATION SECURITY REVIEW';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const html = target.html;

    const add = (severity: any, name: string, desc: string, tech: string, imp: string, rem: string, ev: string = '') => {
      findings.push({
        id: `AUTH-${findings.length + 1}`,
        category: this.category,
        severity,
        confidence: 'Firm',
        name,
        description: desc,
        technicalExplanation: tech,
        businessImpact: imp,
        remediation: rem,
        evidence: ev,
      });
    };

    // Client-side password hashing check
    if (/function\s+hashStr|Math\.imul.*charCodeAt|\.charCodeAt\(.*hash/i.test(html)) {
      const m = html.match(/.{0,20}hashStr.{0,60}/);
      add('Critical', 'Weak Client-Side Password Hashing',
        'Custom hash function used for authentication client-side.',
        'Hashing passwords on the client is fundamentally insecure. An attacker can intercept the hash and perform a Pass-the-Hash attack, or simply modify the client-side JavaScript to bypass the authentication check entirely.',
        'Complete bypass of authentication controls.',
        'Move authentication to the server. Send passwords over TLS and hash them server-side using strong algorithms like bcrypt or Argon2.',
        m ? m[0].trim() : ''
      );
    }

    // Hardcoded credentials check
    if (/hashStr\s*\(\s*['"][^'"]{3,}['"]\s*\)/.test(html) || /===\s*['"][^'"]{6,}['"].*password|password.*===\s*['"][^'"]{6,}['"]/i.test(html)) {
      add('Critical', 'Hardcoded Authentication Bypass',
        'Password or its hash is hardcoded in client-side JavaScript.',
        'The application performs authentication by comparing user input against a hardcoded string in the source code. Anyone who views the source can extract the password or bypass the check.',
        'Trivial unauthorized access for any user.',
        'Implement server-side authentication backed by a database.',
        '(password hidden for safety)'
      );
    }

    // Form Autocomplete
    if (/<form/i.test(html) && !/<form[^>]+autocomplete\s*=\s*["']off["']/i.test(html)) {
      const m = html.match(/<form[^>]*>/i);
      add('Low', 'Form Autocomplete Not Disabled',
        'A form was found without autocomplete disabled.',
        'Browsers may cache sensitive form values (like TOTP codes, credit cards, or security answers) if autocomplete is not explicitly disabled.',
        'On shared devices, subsequent users might extract sensitive data from the browser cache.',
        'Set `autocomplete="off"` on sensitive forms and inputs.',
        m ? m[0] : ''
      );
    }

    // Password Fields missing autocomplete directives
    const pwdFields = html.match(/<input[^>]+type\s*=\s*["']password["'][^>]*>/gi);
    if (pwdFields) {
      const unprotected = pwdFields.filter(f => !/autocomplete\s*=\s*["'](off|new-password|current-password)/i.test(f));
      if (unprotected.length > 0) {
        add('Low', 'Password Field Missing Explicit Autocomplete',
          `Found ${unprotected.length} password inputs lacking explicit autocomplete directives.`,
          'Password managers rely on standard autocomplete attributes to function securely. Missing attributes can lead to incorrect autofill or caching by the browser.',
          'Reduced security usability and potential caching issues.',
          'Add `autocomplete="current-password"` for login forms or `autocomplete="new-password"` for registration/reset forms.',
          unprotected[0].substring(0, 150)
        );
      }
    }

    return findings;
  }
}
