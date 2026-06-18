import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class BehavioralScanner implements ScannerModule {
  moduleName = 'BehavioralScanner';
  category = 'BEHAVIORAL & TELEMETRY ANALYSIS';

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
        technicalExplanation: 'The application contains code patterns that capture device identifiers, monitor detailed user behavior, track visits across sites, or perform client-side device/canvas fingerprinting.',
        businessImpact: 'Intense telemetry and tracking scripts can impact performance and privacy compliance (GDPR/CCPA). Behavioral tracking without opt-in consent poses regulatory risks.',
        remediation: 'Audit all third-party tracking scripts. If canvas or audio fingerprinting is used, verify it is necessary and document it in the privacy policy.',
        evidence,
      });
    };

    // 1. Canvas fingerprinting checks
    if (html.includes('getImageData') && html.includes('toDataURL') && (html.includes('canvas') || html.includes('getContext'))) {
      addFinding('BEH-001', 'Potential Canvas Fingerprinting Code', 'Identified script patterns that read raw canvas image data, commonly used to compile unique browser/device fingerprint hashes.', 'getContext("2d") + toDataURL() / getImageData()');
    }

    // 2. Audio fingerprinting checks
    if (html.includes('AudioContext') && (html.includes('createOscillator') || html.includes('createAnalyser'))) {
      addFinding('BEH-002', 'Potential Audio Fingerprinting Code', 'Found references to AudioContext oscillator and analysis functions, which can be utilized to fingerprint the device audio card.', 'AudioContext + createOscillator()');
    }

    // 3. User Agent harvesting / Platform tracking
    if (html.includes('navigator.userAgent') && (html.includes('platform') || html.includes('devicePixelRatio') || html.includes('plugins'))) {
      addFinding('BEH-003', 'Detailed Device Info Harvesting', 'Detected code that queries browser plugins, device pixel ratio, and detailed platform variables, which are signals for device fingerprinting.', 'navigator.userAgent + navigator.plugins');
    }

    // 4. Tracking Pixels / Analytics (HubSpot, Mixpanel, etc.)
    const analyticsPatterns = [
      { name: 'HubSpot', regex: /js\.hs-scripts\.com|js\.hsadspixel\.net/i },
      { name: 'Mixpanel', regex: /cdn\.mxpnl\.com|mixpanel\.init/i },
      { name: 'Intercom', regex: /widget\.intercom\.io|intercomSettings/i },
      { name: 'Amplitude', regex: /amplitude\.com|amplitude\.run/i },
      { name: 'Sentry Telemetry', regex: /sentry\.io|sentry-cdn/i },
    ];

    analyticsPatterns.forEach((p, idx) => {
      const match = html.match(p.regex);
      if (match) {
        addFinding(`BEH-004-${idx}`, `Advanced Telemetry Service: ${p.name}`, `Identified client-side behavioral logging integrations with ${p.name}.`, match[0]);
      }
    });

    // 5. Hidden redirect mechanisms
    if (html.includes('http-equiv="refresh"') || /window\.location\.(replace|href)\s*=/i.test(html)) {
      const match = html.match(/http-equiv="refresh"/i) || html.match(/window\.location\.(replace|href)/i);
      addFinding('BEH-005', 'Client-Side Redirection/Navigation Trigger', 'Discovered meta-refresh or explicit JavaScript location reassignment instructions.', match ? match[0] : 'window.location.replace');
    }

    return findings;
  }
}
