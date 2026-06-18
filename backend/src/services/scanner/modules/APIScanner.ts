import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class APIScanner implements ScannerModule {
  moduleName = 'APIScanner';
  category = 'API SECURITY DISCOVERY';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const html = target.html;

    const add = (severity: any, name: string, desc: string, tech: string, imp: string, rem: string, ev: string = '') => {
      findings.push({
        id: `API-${findings.length + 1}`,
        category: this.category,
        severity,
        confidence: 'Tentative',
        name,
        description: desc,
        technicalExplanation: tech,
        businessImpact: imp,
        remediation: rem,
        evidence: ev,
      });
    };

    // Open fetch / SSRF checks
    if (/fetch\s*\(\s*(location\.|window\.location|params\.|query\.|url\b)/i.test(html)) {
      const m = html.match(/.{0,20}fetch\s*\([^)]{0,80}/);
      add('High', 'Unvalidated URL passed to fetch()',
        'A fetch call uses a URL derived from user input or location params.',
        'If an attacker can control the URL passed to fetch(), they can force the user\'s browser to make requests to arbitrary domains (Client-Side SSRF) or perform open redirects.',
        'Can be used to bypass firewalls, access internal network services, or steal credentials.',
        'Validate and strictly whitelist all URLs before passing them to fetch or XMLHttpRequest. Never use raw query parameters as fetch targets.',
        m ? m[0].trim() : ''
      );
    }

    // GraphQL Detection
    if (/graphql|query\s*\{|mutation\s*\{/i.test(html) && /fetch\s*\(/i.test(html)) {
      const m = html.match(/.{0,20}(graphql|query\s*\{).{0,60}/i);
      add('Informational', 'GraphQL Endpoint Indicated',
        'Signatures suggest the application communicates with a GraphQL API.',
        'GraphQL APIs often have a larger attack surface due to introspection, deeply nested queries (DoS), and complex authorization logic.',
        'Provides reconnaissance data to attackers. If introspection is enabled, attackers can map the entire database schema.',
        'Ensure GraphQL introspection is disabled in production. Implement query depth and complexity limiting.',
        m ? m[0].trim() : ''
      );
    }

    // REST API Endpoint Exposure
    const apiPaths = html.match(/(["'])((\/api\/|\/v1\/|\/v2\/)[a-zA-Z0-9_/-]+)\1/g);
    if (apiPaths && apiPaths.length > 0) {
      const uniquePaths = Array.from(new Set(apiPaths.map(p => p.replace(/["']/g, ''))));
      add('Informational', 'API Endpoints Discovered',
        `Found ${uniquePaths.length} REST-style API endpoints in the client source.`,
        'Client-side applications inherently expose the API routes they consume. However, discovering these routes is the first step in API security testing (checking for BOLA/IDOR, broken authentication, etc.).',
        'Aids attackers in mapping the API attack surface.',
        'Ensure all exposed endpoints implement strict authorization checks. Do not rely on obscurity.',
        uniquePaths.slice(0, 5).join('\n')
      );
    }

    return findings;
  }
}
