import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class EndpointDiscoveryScanner implements ScannerModule {
  moduleName = 'EndpointDiscoveryScanner';
  category = 'API ENDPOINT DISCOVERY';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const html = target.html || '';

    const addFinding = (id: string, name: string, description: string, evidence: string, severity: 'Low' | 'Informational' = 'Informational') => {
      findings.push({
        id,
        category: this.category,
        severity,
        confidence: 'Firm',
        name,
        description,
        technicalExplanation: 'The application contains hardcoded references to backend endpoints, WebSocket connections, or third-party cloud services in its client-side source code.',
        businessImpact: 'Discovered API endpoints and cloud configurations expand the attack surface. Attackers can map out private API routing and test them for vulnerabilities (e.g. BOLA/IDOR).',
        remediation: 'Review the necessity of exposing backend URLs in client bundles. Secure exposed endpoints with robust authentication and access control policies.',
        evidence,
      });
    };

    // 1. WebSocket detection
    const wsMatches = html.match(/(wss?:\/\/[a-zA-Z0-9.\-_:/]+)/gi);
    if (wsMatches) {
      const unique = Array.from(new Set(wsMatches)).slice(0, 5);
      addFinding('EP-001', 'WebSocket Endpoints Discovered', `Found active WebSocket connection URLs in client source code.`, unique.join('\n'));
    }

    // 2. Firebase Database detection
    const fbMatches = html.match(/([a-zA-Z0-9-]+\.firebaseio\.com)/gi);
    if (fbMatches) {
      const unique = Array.from(new Set(fbMatches)).slice(0, 3);
      addFinding('EP-002', 'Firebase Database Instance Found', `Found hardcoded Firebase real-time database URLs.`, unique.join('\n'), 'Low');
    }

    // 3. Supabase instance detection
    const sbMatches = html.match(/([a-zA-Z0-9-]+\.supabase\.co)/gi);
    if (sbMatches) {
      const unique = Array.from(new Set(sbMatches)).slice(0, 3);
      addFinding('EP-003', 'Supabase Cloud Instance Found', `Found hardcoded Supabase DB instances.`, unique.join('\n'), 'Low');
    }

    // 4. GraphQL endpoint detection
    if (html.includes('/graphql') || /query\s*\{\s*[a-zA-Z_]+/i.test(html) || /mutation\s*\{\s*[a-zA-Z_]+/i.test(html)) {
      const match = html.match(/\/graphql/i) || ['GraphQL structure'];
      addFinding('EP-004', 'GraphQL Endpoint Reference Detected', 'Found references indicating the presence of a GraphQL endpoint.', match[0]);
    }

    // 5. REST API URI patterns
    const apiMatches = html.match(/(\/api\/v[0-9]\/[a-zA-Z0-9-_/]+|\/api\/[a-zA-Z0-9-_/]+)/gi);
    if (apiMatches) {
      const unique = Array.from(new Set(apiMatches)).slice(0, 10);
      addFinding('EP-005', 'REST API Routes Discovered', `Found ${apiMatches.length} API route references (e.g. /api/v1/auth).`, unique.join('\n'));
    }

    return findings;
  }
}
