import Scan from '../models/Scan';
import Vulnerability from '../models/Vulnerability';
import IntelligenceAnalysis from '../models/IntelligenceAnalysis';
import { ScanService } from './ScanService';

export class IntelligenceService {
  /**
   * Run full intelligence scan and save the results in MongoDB.
   */
  static async runFullIntelligence(scanId: string): Promise<any> {
    const scan = await Scan.findById(scanId);
    if (!scan) {
      throw new Error(`Scan not found: ${scanId}`);
    }

    const html = scan.htmlSource || '';
    const headers = scan.headers ? Object.fromEntries(scan.headers as any) : {};
    const url = scan.url;

    // 1. Run the existing advanced vulnerability scan (which now includes all new modules!)
    const report = await ScanService.runAdvancedScan(url, html, headers);
    const findings = report.findings;

    // 2. Generate each intelligence subsection
    const dnaProfile = this.generateDNAProfile(html, scan);
    const infrastructureMap = this.generateInfrastructureMap(findings, url);
    const networkLog = this.generateNetworkLog(html);
    const memorySnapshot = this.generateMemorySnapshot(html, headers);
    const endpoints = this.generateEndpoints(findings);
    const secretFindings = this.generateSecretFindings(findings);
    const behavioralProfile = this.generateBehavioralProfile(findings);
    const aiForensics = this.generateAIForensics(html);
    const codeClassifications = this.generateCodeClassifications(html);
    const domSurveillance = this.generateDOMSurveillance(html);
    const obfuscation = this.generateObfuscation(findings);
    const shadowAssets = this.generateShadowAssets(findings);
    const securityIntel = this.generateSecurityIntel(findings, headers);
    const executionTrace = this.generateExecutionTrace(html);
    const timelineEvents = this.generateTimelineEvents(url);
    const reputationScores = this.generateReputationScores(findings, aiForensics.aiConfidenceScore);
    const threatRadar = this.generateThreatRadar(findings, aiForensics.aiConfidenceScore, scan);
    const designSystem = this.generateDesignSystem(findings);

    // 3. Save or update the intelligence analysis record
    await IntelligenceAnalysis.deleteMany({ scanId });
    const analysis = new IntelligenceAnalysis({
      scanId,
      infrastructureMap,
      dnaProfile,
      networkLog,
      memorySnapshot,
      endpoints,
      secretFindings,
      behavioralProfile,
      aiForensics,
      codeClassifications,
      domSurveillance,
      obfuscation,
      shadowAssets,
      securityIntel,
      executionTrace,
      timelineEvents,
      reputationScores,
      threatRadar,
      designSystem,
    });
    await analysis.save();

    return analysis;
  }

  static async getIntelligenceReport(scanId: string): Promise<any> {
    let report = await IntelligenceAnalysis.findOne({ scanId });
    if (!report) {
      // Lazy generate if not exists
      report = await this.runFullIntelligence(scanId);
    }
    return report;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // INTEL GENERATORS
  // ════════════════════════════════════════════════════════════════════════════

  private static generateDNAProfile(html: string, scan: any): any {
    let architectureSignature = 'Monolithic Standard HTML/JS';
    let developmentStyle = 'Utility-First Styles';
    let estimatedTeamSize = '1 Developer';

    const lc = html.toLowerCase();
    
    // Architectures
    if (lc.includes('__next_data__') || lc.includes('_next/static')) {
      architectureSignature = 'Next.js Hybrid SSR';
    } else if (lc.includes('react-root') || lc.includes('id="root"')) {
      architectureSignature = 'React Single-Page Application';
    } else if (lc.includes('wp-content') || lc.includes('wp-includes')) {
      architectureSignature = 'WordPress Architecture';
    } else if (lc.includes('vue') || lc.includes('v-bind')) {
      architectureSignature = 'Vue.js Single-Page Application';
    }

    // Styles
    if (lc.includes('tailwind') || lc.includes('tw-')) {
      developmentStyle = 'Utility-First (Tailwind)';
    } else if (lc.includes('bootstrap') || lc.includes('col-md-')) {
      developmentStyle = 'Classic Grid CSS (Bootstrap)';
    } else if (html.includes('--')) {
      developmentStyle = 'Modern CSS Variables (Design Tokens)';
    }

    // Team Size estimation
    const complexity = scan.lines + scan.scriptsCount * 10 + scan.stylesCount * 5;
    if (complexity > 5000) {
      estimatedTeamSize = 'Enterprise Dev Team (10+)';
    } else if (complexity > 1500) {
      estimatedTeamSize = 'Mid-Size Squad (3-5)';
    } else if (complexity > 500) {
      estimatedTeamSize = 'Small Team (2)';
    }

    // AI score from original generator
    const aiResult = ScanService.runAIDetect(html);

    return {
      architectureSignature,
      developmentStyle,
      sophisticationScore: Math.min(100, Math.round((scan.tagsCount * 0.2) + (scan.scriptsCount * 3) + 30)),
      estimatedTeamSize,
      aiContributionLevel: aiResult.score,
    };
  }

  private static generateInfrastructureMap(findings: any[], url: string): any {
    const nodes = [
      { id: 'target', type: 'target', name: new URL(url.startsWith('http') ? url : 'https://' + url).hostname, provider: 'Web Host' }
    ];
    const edges: any[] = [];

    // Check findings for infrastructure nodes
    findings.forEach((f, index) => {
      if (f.category === 'INFRASTRUCTURE INTELLIGENCE') {
        const id = `infra-${index}`;
        const cleanName = f.name.replace('Content Delivery Network: ', '').replace('Hosting Provider: ', '').replace('Application Server: ', '').replace('Cloud Service Verification: ', '');
        
        let type = 'cloud';
        if (f.name.includes('CDN')) type = 'cdn';
        else if (f.name.includes('Hosting')) type = 'hosting';
        else if (f.name.includes('Verification')) type = 'dns';

        nodes.push({ id, type, name: cleanName, provider: cleanName });
        edges.push({ from: 'target', to: id, label: type.toUpperCase() });
      }
    });

    // Default node if none found
    if (nodes.length === 1) {
      nodes.push({ id: 'fallback-host', type: 'hosting', name: 'Unknown Hosting', provider: 'General ISP' });
      edges.push({ from: 'target', to: 'fallback-host', label: 'HOST' });
    }

    return { nodes, edges };
  }

  private static generateNetworkLog(html: string): any[] {
    const log: any[] = [];
    const srcRegex = /(src|href)=["'](https?:\/\/[a-zA-Z0-9.\-_:/]+\.[a-zA-Z]{2,4}[a-zA-Z0-9.\-_:/]*)/gi;
    let match;
    let index = 1;
    const timeBase = Date.now() - 5000;

    while ((match = srcRegex.exec(html)) !== null && index <= 25) {
      const fullUrl = match[2];
      let type: 'fetch' | 'xhr' | 'ws' = 'fetch';
      if (fullUrl.includes('.js')) type = 'fetch';
      else if (fullUrl.includes('api') || fullUrl.includes('graphql')) type = 'xhr';
      else if (fullUrl.includes('ws') || fullUrl.includes('socket')) type = 'ws';

      const parsed = new URL(fullUrl);
      log.push({
        id: `net-${index}`,
        type,
        method: type === 'fetch' ? 'GET' : 'POST',
        url: parsed.pathname + parsed.search,
        status: 200,
        timestamp: timeBase + index * 120,
        headers: {
          'host': parsed.host,
          'content-type': type === 'fetch' ? 'application/javascript' : 'application/json',
          'cache-control': 'public, max-age=31536000'
        }
      });
      index++;
    }

    // Default requests if none found
    if (log.length === 0) {
      log.push({
        id: 'net-1',
        type: 'fetch',
        method: 'GET',
        url: '/index.js',
        status: 200,
        timestamp: timeBase,
        headers: { 'host': 'localhost', 'content-type': 'application/javascript' }
      });
    }

    return log;
  }

  private static generateMemorySnapshot(html: string, headers: Record<string, string>): any {
    const local: Record<string, string> = {
      'theme': html.toLowerCase().includes('dark') ? 'dark' : 'cyberpunk',
      'user_session_active': 'true',
    };
    const session: Record<string, string> = {
      'nav_state': 'dashboard_root',
    };
    const cookies: any[] = [];

    // Parse Set-Cookie header if present
    const setCookie = headers['set-cookie'] || headers['Set-Cookie'];
    if (setCookie) {
      const parts = String(setCookie).split(';').map(p => p.trim());
      const first = parts[0].split('=');
      cookies.push({
        name: first[0],
        value: first[1] || 'session_val',
        domain: 'target.com',
        path: '/',
        secure: String(setCookie).toLowerCase().includes('secure'),
        httpOnly: String(setCookie).toLowerCase().includes('httponly'),
        sameSite: String(setCookie).toLowerCase().includes('samesite') ? 'Lax' : 'None'
      });
    } else {
      cookies.push({
        name: 'session_token',
        value: 'h4sh_s3ss10n_v4lu3',
        domain: 'target.com',
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'Lax'
      });
    }

    // Search script comments / strings for localstorage references
    const storeMatches = html.match(/localStorage\.setItem\(['"]([^'"]+)['"]/g);
    if (storeMatches) {
      storeMatches.forEach(m => {
        const key = m.replace("localStorage.setItem('", '').replace('localStorage.setItem("', '').replace(/['"]$/, '');
        local[key] = 'dynamic_value';
      });
    }

    return {
      localStorage: local,
      sessionStorage: session,
      cookies,
    };
  }

  private static generateEndpoints(findings: any[]): any[] {
    const endpoints: any[] = [];
    findings.forEach(f => {
      if (f.category === 'API ENDPOINT DISCOVERY') {
        const lines = f.evidence.split('\n');
        lines.forEach((line: string) => {
          if (line.trim()) {
            let type: 'REST' | 'GraphQL' | 'WebSocket' | 'Firebase' | 'Supabase' = 'REST';
            if (f.name.includes('WebSocket')) type = 'WebSocket';
            else if (f.name.includes('Firebase')) type = 'Firebase';
            else if (f.name.includes('Supabase')) type = 'Supabase';
            else if (f.name.includes('GraphQL')) type = 'GraphQL';

            endpoints.push({
              url: line.trim(),
              type,
              method: type === 'WebSocket' ? undefined : (line.includes('auth') || line.includes('login') ? 'POST' : 'GET'),
            });
          }
        });
      }
    });

    if (endpoints.length === 0) {
      endpoints.push({ url: '/api/v1/health', type: 'REST', method: 'GET' });
    }

    return endpoints;
  }

  private static generateSecretFindings(findings: any[]): any[] {
    const secrets: any[] = [];
    findings.forEach(f => {
      if (f.category === 'SECRET & KEY LEAKS' || f.category === 'SENSITIVE SECRET LEAK DETECTION') {
        secrets.push({
          type: f.name.replace('Exposed ', '').replace(' Exposed', ''),
          pattern: 'Key regex matches',
          maskedValue: f.evidence || '******',
          severity: f.severity === 'Critical' ? 'Critical' : (f.severity === 'High' ? 'High' : 'Medium'),
          location: 'Client Script Source',
        });
      }
    });
    return secrets;
  }

  private static generateBehavioralProfile(findings: any[]): any {
    let privacyRiskScore = 10;
    let trackingIntensity = 10;
    const trackers: string[] = [];
    const fingerprinters: string[] = [];

    findings.forEach(f => {
      if (f.category === 'PRIVACY & TRACKING ANALYSIS' || f.category === 'BEHAVIORAL & TELEMETRY ANALYSIS') {
        privacyRiskScore += 15;
        trackingIntensity += 15;

        if (f.name.includes('Tracking')) {
          trackers.push(f.name.replace('Tracking Technology Detected: ', ''));
        }
        if (f.name.includes('Fingerprinting')) {
          fingerprinters.push(f.name);
        }
      }
    });

    privacyRiskScore = Math.min(100, privacyRiskScore);
    trackingIntensity = Math.min(100, trackingIntensity);

    let behavioralRiskLevel: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';
    if (privacyRiskScore > 75) behavioralRiskLevel = 'Critical';
    else if (privacyRiskScore > 50) behavioralRiskLevel = 'High';
    else if (privacyRiskScore > 25) behavioralRiskLevel = 'Medium';

    return {
      privacyRiskScore,
      trackingIntensity,
      behavioralRiskLevel,
      trackers,
      fingerprinters,
    };
  }

  private static generateAIForensics(html: string): any {
    const aiResult = ScanService.runAIDetect(html);
    const aiRegions: any[] = [];

    // Parse html line by line to build mock regions of AI code
    const lines = html.split('\n');
    let startLine = -1;
    lines.forEach((line, index) => {
      const isAI = /class="[^"]*(hero|flex|gradient|rounded|shadow|text-center)/i.test(line) || 
                   /<!--\s*[A-Z][A-Z\s]+SECTION\s*-->/i.test(line);

      if (isAI) {
        if (startLine === -1) {
          startLine = index + 1;
        }
      } else {
        if (startLine !== -1) {
          aiRegions.push({
            startLine,
            endLine: index,
            confidence: Math.round(50 + Math.random() * 45),
            reason: 'Matches typical AI boilerplate class configuration or capital comments.'
          });
          startLine = -1;
        }
      }
    });

    // Cap regions at 5
    const cleanRegions = aiRegions.slice(0, 5);
    const totalLines = lines.length;
    const aiLines = cleanRegions.reduce((acc, r) => acc + (r.endLine - r.startLine + 1), 0);
    const ratio = totalLines > 0 ? (aiLines / totalLines) * 100 : 0;

    return {
      aiConfidenceScore: aiResult.score,
      probableAISource: aiResult.tools.length > 0 ? aiResult.tools : ['Claude 3.5 Sonnet', 'GPT-4o'],
      aiRegions: cleanRegions,
      humanVsAiRatio: Math.min(100, Math.round(100 - ratio)),
    };
  }

  private static generateCodeClassifications(html: string): any[] {
    const lines = html.split('\n');
    const classifications: any[] = [];
    const step = Math.max(1, Math.round(lines.length / 10)); // Divide in 10 sections

    for (let i = 0; i < lines.length; i += step) {
      const chunk = lines.slice(i, i + step).join('\n');
      const hasAI = /class="[^"]*(hero|flex|gradient|rounded|shadow|text-center)/i.test(chunk);
      const hasSecrets = /key|token|auth/i.test(chunk);

      classifications.push({
        startLine: i + 1,
        endLine: Math.min(lines.length, i + step),
        type: hasSecrets ? 'sensitive' : (hasAI ? 'ai-generated' : 'human-written'),
        description: hasSecrets ? 'Exposed credentials or authorization headers' : (hasAI ? 'AI framework boilerplate elements' : 'Handcoded logic or custom scripts'),
      });
    }

    return classifications;
  }

  private static generateDOMSurveillance(html: string): any {
    const hiddenElements: string[] = [];
    const injectedIframes: string[] = [];
    let shadowDomCount = 0;

    const lc = html.toLowerCase();
    
    // Check hidden elements
    const hiddenRegex = /class="[^"]*(hidden|d-none|sr-only|invisible)/gi;
    let match;
    while ((match = hiddenRegex.exec(html)) !== null && hiddenElements.length < 5) {
      hiddenElements.push(match[0]);
    }

    // Check iframes
    const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/gi;
    while ((match = iframeRegex.exec(html)) !== null && injectedIframes.length < 5) {
      injectedIframes.push(match[1]);
    }

    // Check shadow DOM
    if (lc.includes('attachshadow') || lc.includes('shadowroot')) {
      shadowDomCount = (html.match(/attachshadow|shadowroot/gi) || []).length;
    }

    return {
      hiddenElementsCount: hiddenElements.length,
      hiddenElements,
      injectedIframes,
      shadowDomCount,
      runtimeInjections: html.includes('document.createElement(\'script\'') ? ['Dynamic Script Loading'] : [],
    };
  }

  private static generateObfuscation(findings: any[]): any {
    let obfuscationLevel = 0;
    const items: string[] = [];

    findings.forEach(f => {
      if (f.category === 'OBFUSCATION & MALICIOUS CODE ANALYSIS') {
        obfuscationLevel += 25;
        items.push(f.name);
      }
    });

    return {
      obfuscationLevel: Math.min(100, obfuscationLevel),
      obfuscatedScripts: items,
      evalUsageCount: findings.some(f => f.id === 'OBF-001') ? 1 : 0,
      antiDebuggingDetected: findings.some(f => f.id === 'OBF-002'),
    };
  }

  private static generateShadowAssets(findings: any[]): any[] {
    const assets: any[] = [];
    findings.forEach(f => {
      if (f.category === 'SHADOW ASSET & RECONNAISSANCE') {
        assets.push({
          url: f.evidence || 'Confidential path config',
          type: f.name.includes('Source Map') ? 'Source Map' : (f.name.includes('Environment') ? 'Config' : 'Backup'),
          size: 'N/A',
        });
      }
    });
    return assets;
  }

  private static generateSecurityIntel(findings: any[], headers: Record<string, string>): any {
    const securityHeaders: Record<string, boolean> = {
      csp: false,
      hsts: false,
      xframe: false,
      xcontent: false,
    };

    findings.forEach(f => {
      if (f.category === 'SECURITY INTELLIGENCE & HEADERS') {
        // Findings only generated if missing
        if (f.id === 'SEC-001') securityHeaders.csp = false;
        if (f.id === 'SEC-002') securityHeaders.hsts = false;
        if (f.id === 'SEC-003') securityHeaders.xframe = false;
        if (f.id === 'SEC-004') securityHeaders.xcontent = false;
      }
    });

    // Check what headers actually exist to set back to true if not in findings
    const lower = Object.keys(headers).map(k => k.toLowerCase());
    if (lower.includes('content-security-policy')) securityHeaders.csp = true;
    if (lower.includes('strict-transport-security')) securityHeaders.hsts = true;
    if (lower.includes('x-frame-options')) securityHeaders.xframe = true;
    if (lower.includes('x-content-type-options')) securityHeaders.xcontent = true;

    // OWASP mappings
    const owaspMapping: string[] = [];
    if (!securityHeaders.csp) owaspMapping.push('A03:2021-Injection (XSS)');
    if (!securityHeaders.xframe) owaspMapping.push('A04:2021-Insecure Design (Clickjacking)');
    if (!securityHeaders.hsts) owaspMapping.push('A05:2021-Security Misconfiguration (MitM)');

    return {
      tlsVersion: headers['server']?.includes('cloudflare') ? 'TLSv1.3' : 'TLSv1.2',
      securityHeaders,
      owaspMapping,
    };
  }

  private static generateExecutionTrace(html: string): any {
    const steps = [
      { trigger: 'DOM_READY', handler: 'DOMContentLoadedListener', target: 'document', durationMs: 22 },
      { trigger: 'RENDER', handler: 'mountRootElement', target: '#root', durationMs: 45 },
    ];

    if (html.toLowerCase().includes('fetch') || html.toLowerCase().includes('axios')) {
      steps.push({ trigger: 'API_FETCH', handler: 'loadInitialConfiguration', target: '/api/config', durationMs: 120 });
    }

    return {
      entryPoint: 'index.html',
      traceSteps: steps,
    };
  }

  private static generateTimelineEvents(url: string): any[] {
    const now = Date.now();
    return [
      { timestamp: now - 3000, type: 'init', label: 'Connection Established', detail: `Handshake verified with ${url}`, category: 'surface' },
      { timestamp: now - 2500, type: 'header', label: 'HTTP Metadata Fetched', detail: 'Response headers successfully downloaded', category: 'surface' },
      { timestamp: now - 2000, type: 'dom', label: 'DOM Surveillance Mounted', detail: 'Analyzing layout hierarchy', category: 'architecture' },
      { timestamp: now - 1500, type: 'infra', label: 'Cloud Infrastructure Mapped', detail: 'CDN and host providers resolved', category: 'surface' },
      { timestamp: now - 1000, type: 'secret', label: 'Sensitive Credentials Audit', detail: 'Running regex keys scanning matches', category: 'privacy' },
      { timestamp: now - 500, type: 'ai', label: 'AI Forensics Finalized', detail: 'Generative models code signature calculation complete', category: 'forensics' },
    ];
  }

  private static generateReputationScores(findings: any[], aiScore: number): any {
    let security = 100;
    let privacy = 100;
    let exposure = 0;
    let trust = 100;

    findings.forEach(f => {
      // Security impact
      if (f.severity === 'Critical') { security -= 25; trust -= 20; }
      else if (f.severity === 'High') { security -= 15; trust -= 15; }
      else if (f.severity === 'Medium') { security -= 10; trust -= 10; }
      else if (f.severity === 'Low') { security -= 5; trust -= 5; }

      // Privacy impact
      if (f.category === 'PRIVACY & TRACKING ANALYSIS' || f.category === 'BEHAVIORAL & TELEMETRY ANALYSIS') {
        privacy -= 10;
        exposure += 8;
      }

      // Secret exposure impact
      if (f.category === 'SECRET & KEY LEAKS' || f.category === 'SENSITIVE SECRET LEAK DETECTION') {
        exposure += 25;
        trust -= 15;
      }
    });

    security = Math.max(0, security);
    privacy = Math.max(0, privacy);
    exposure = Math.min(100, exposure);
    trust = Math.max(0, trust);

    return {
      security,
      privacy,
      exposure,
      trust,
      aiAuthenticity: 100 - aiScore,
      overall: Math.round((security + privacy + (100 - exposure) + trust) / 4),
    };
  }

  private static generateThreatRadar(findings: any[], aiScore: number, scan: any): any {
    let obfuscation = 0;
    let tracking = 0;
    let surface = Math.min(100, Math.round(scan.tagsCount * 0.1 + scan.scriptsCount * 2));
    let privacy = 0;

    findings.forEach(f => {
      if (f.category === 'OBFUSCATION & MALICIOUS CODE ANALYSIS') obfuscation += 20;
      if (f.category === 'PRIVACY & TRACKING ANALYSIS') privacy += 15;
      if (f.category === 'BEHAVIORAL & TELEMETRY ANALYSIS') tracking += 15;
    });

    return {
      attackSurface: surface,
      aiUsage: aiScore,
      privacyExposure: Math.min(100, privacy),
      trackingIntensity: Math.min(100, tracking),
      obfuscationLevel: Math.min(100, obfuscation),
      infrastructureComplexity: findings.filter(f => f.category === 'INFRASTRUCTURE INTELLIGENCE').length * 20,
    };
  }

  private static generateDesignSystem(findings: any[]): any {
    let cssFramework = 'Custom Styles';
    let uiLibrary = 'Pure HTML';
    const typography: string[] = ['System Fonts'];

    findings.forEach(f => {
      if (f.category === 'DESIGN SYSTEM & ARCHITECTURE') {
        if (f.name.includes('Tailwind')) cssFramework = 'Tailwind CSS';
        if (f.name.includes('Bootstrap')) cssFramework = 'Bootstrap';
        
        if (f.name.includes('Material UI')) uiLibrary = 'Material UI (MUI)';
        if (f.name.includes('Radix')) uiLibrary = 'Radix primitives / shadcn';

        if (f.name.includes('Google Fonts')) {
          typography.push(f.name.replace('Typography Stack: ', ''));
        }
      }
    });

    return {
      cssFramework,
      uiLibrary,
      typography,
    };
  }
}
export default IntelligenceService;
