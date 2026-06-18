import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class MisconfigurationScanner implements ScannerModule {
  moduleName = 'MisconfigurationScanner';
  category = 'MISCONFIGURATION DETECTION';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const html = target.html;

    const add = (severity: any, name: string, description: string, technical: string, impact: string, remediation: string, evidence: string = '') => {
      findings.push({
        id: `MISC-${findings.length + 1}`,
        category: this.category,
        severity: severity,
        confidence: 'Certain',
        name: name,
        description: description,
        technicalExplanation: technical,
        businessImpact: impact,
        remediation: remediation,
        evidence: evidence,
      });
    };

    // Inline Event Handlers
    const inlineEvents = html.match(/on(click|mouseover|load|error|submit|focus|blur|change|keyup|keydown|input)="[^"]*"/gi);
    if (inlineEvents && inlineEvents.length > 0) {
      add('Medium', 'Inline Event Handlers', 
        `Found ${inlineEvents.length} inline event handlers.`,
        'Inline event handlers (like onclick) mix logic with markup. They require a Content Security Policy (CSP) that allows \'unsafe-inline\', significantly weakening protection against XSS.',
        'Increases the likelihood of a successful Cross-Site Scripting (XSS) attack.',
        'Move JavaScript logic to external files and attach event listeners using `addEventListener`.',
        inlineEvents.slice(0, 3).join('\n')
      );
    }

    // eval() usage
    if (/\beval\s*\(/.test(html)) {
      const m = html.match(/.{0,40}eval\s*\(.{0,60}/);
      add('High', 'Use of eval() Detected',
        'The eval() function is used in the client-side code.',
        'eval() executes arbitrary strings as JavaScript. If any part of the string passed to eval() can be influenced by user input, it results in a severe XSS vulnerability.',
        'Complete compromise of the client-side session if exploitable.',
        'Remove all uses of eval(). Use JSON.parse() for parsing JSON data, or rewrite logic to avoid dynamic code execution.',
        m ? m[0].trim() : ''
      );
    }

    // innerHTML Assignments
    const ihMatches = html.match(/\.innerHTML\s*=/g);
    if (ihMatches && ihMatches.length > 0) {
      add('Medium', `innerHTML Assignments Detected`,
        `Found ${ihMatches.length} instances of innerHTML assignment.`,
        'Assigning data directly to innerHTML is the most common vector for DOM-based XSS. If the assigned string contains unescaped user input, it will be executed as HTML/JS.',
        'Potential for DOM-based XSS attacks leading to session theft.',
        'Use `textContent` or `innerText` when inserting text. If HTML parsing is required, strictly sanitize the input using a library like DOMPurify first.',
        ihMatches.slice(0, 2).join('  ')
      );
    }

    // CORS Wildcard
    const cors = target.headers ? (target.headers['access-control-allow-origin'] || '') : '';
    if (cors.trim() === '*' || /access-control-allow-origin\s*:\s*\*/i.test(html)) {
      add('Medium', 'CORS Wildcard Detected',
        'Access-Control-Allow-Origin is set to wildcard (*).',
        'A wildcard CORS policy allows any external domain to read responses from this server. While this does not send credentials (cookies), it exposes public data to arbitrary sites.',
        'Data leakage to unauthorized third-party domains.',
        'Specify the exact origins that require access instead of using a wildcard.',
        'Access-Control-Allow-Origin: *'
      );
    }

    // Mixed Content
    if (target.url && target.url.startsWith('https')) {
      const mixed = html.match(/src\s*=\s*["']http:\/\/[^"']+["']/gi);
      if (mixed && mixed.length > 0) {
        add('Medium', 'Mixed Content (HTTP on HTTPS)',
          `Found ${mixed.length} resource(s) loaded over unencrypted HTTP.`,
          'Loading insecure active content (scripts) or passive content (images) on an HTTPS page allows network attackers to intercept and potentially modify the content.',
          'Compromise of page integrity, potentially leading to XSS if the intercepted resource is a script.',
          'Update all resource URLs to use `https://` or protocol-relative URLs (`//`).',
          mixed.slice(0, 3).join('\n')
        );
      }
    }

    // Sensitive Comments
    const sensComments = html.match(/<!--[^>]*(todo|fixme|hack|bug|password|key|secret|token|admin|debug|temp|hardcoded|remove|credentials)[^>]*-->/gi);
    if (sensComments && sensComments.length > 0) {
      add('Low', 'Sensitive HTML Comments',
        `Found ${sensComments.length} comments containing sensitive keywords.`,
        'Developers often leave comments referencing internal architecture, bugs, or temporary credentials. This provides attackers with a roadmap of the application\'s internal workings.',
        'Aids attackers in reconnaissance.',
        'Implement build steps to strip HTML comments before deploying to production.',
        sensComments.slice(0, 2).join('\n').substring(0, 300)
      );
    }

    return findings;
  }
}
