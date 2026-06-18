import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class ShadowAssetScanner implements ScannerModule {
  moduleName = 'ShadowAssetScanner';
  category = 'SHADOW ASSET & RECONNAISSANCE';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const html = target.html || '';

    const addFinding = (id: string, name: string, description: string, evidence: string, severity: 'High' | 'Medium' | 'Low' | 'Informational' = 'Informational') => {
      findings.push({
        id,
        category: this.category,
        severity,
        confidence: 'Firm',
        name,
        description,
        technicalExplanation: 'The application reference lists config files, sourcemaps, development logs, or backup directories in its client-accessible HTML layout.',
        businessImpact: 'Exposing source maps or configuration documents enables reverse-engineers to retrieve the original, uncompiled backend/frontend source code, increasing the risk of target analysis.',
        remediation: 'Ensure source maps are disabled or blocked in the production deployment pipeline. Remove references to dev files or internal environments.',
        evidence,
      });
    };

    // 1. Source map references
    const mapMatches = html.match(/(sourceMappingURL=[a-zA-Z0-9.\-_:/]+\.map)/gi) || html.match(/\/\/#\s*sourceMappingURL/i);
    if (mapMatches) {
      addFinding('SHA-001', 'Source Map Reference Exposed', 'Discovered inline sourceMappingURL pointers indicating production source-mapping is enabled.', mapMatches[0], 'Low');
    }

    // 2. Git directory references / leaks
    if (html.includes('.git/') || html.includes('.gitignore') || html.includes('.git/config')) {
      addFinding('SHA-002', 'Git Repository Leak Reference', 'Found references to .git metadata directories or repository config maps.', '.git reference', 'High');
    }

    // 3. Environment files references / leaks
    const envMatches = html.match(/\.env\b/i) || html.match(/\.env\.local\b/i) || html.match(/\bconfig\.env\b/i);
    if (envMatches) {
      addFinding('SHA-003', 'Environment Config File Exposed', 'Discovered references mentioning .env configuration files in source scripts.', envMatches[0], 'Medium');
    }

    // 4. Exposed package/manifest details
    if (html.includes('package.json') || html.includes('composer.json') || html.includes('package-lock.json')) {
      const match = html.match(/package\.json|composer\.json|package-lock\.json/i);
      addFinding('SHA-004', 'Dependency Configuration Exposed', 'Detected direct naming of package metadata configs in the page client scripts.', match ? match[0] : 'package.json', 'Low');
    }

    // 5. Development or internal server path mappings
    const devServerMatches = html.match(/(localhost:[0-9]+|127\.0\.0\.1:[0-9]+|dev-server[a-zA-Z0-9.\-_]*)/gi);
    if (devServerMatches) {
      const unique = Array.from(new Set(devServerMatches)).slice(0, 3);
      addFinding('SHA-005', 'Internal / Development Server Path Link', 'Found paths referencing local/dev hosts or environments in script assets.', unique.join(', '), 'Low');
    }

    return findings;
  }
}
