/**
 * clientAnalysisEngine.ts
 * High-performance client-side security, AI generation, and tech stack analysis engine.
 * Directly mirrors the empirical algorithms from HEARTCODE / CODED DOMAIN v10.
 */

export interface Finding {
  risk: 'critical' | 'high' | 'medium' | 'low' | 'info';
  name: string;
  desc: string;
  evidence: string;
  rec: string;
  category?: string;
  severity?: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  description?: string;
  technicalExplanation?: string;
  businessImpact?: string;
  remediation?: string;
  confidence?: string;
}

export interface AISignal {
  fired: boolean;
  weight: number;
  icon: string;
  label: string;
  detail: string;
}

export interface AIAnalysis {
  score: number;
  signals: AISignal[];
  tools: string[];
}

export interface TechStackItem {
  cat: string;
  name: string;
  icon: string;
  evidence: string;
}

export function analyseVulnerabilities(html: string, targetUrl: string): Finding[] {
  const findings: Finding[] = [];

  const add = (
    risk: 'critical' | 'high' | 'medium' | 'low' | 'info',
    name: string,
    desc: string,
    evidence: string,
    rec: string,
    category = 'Web Security'
  ) => {
    const sevMap: Record<string, 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational'> = {
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      info: 'Informational',
    };

    findings.push({
      risk,
      name,
      desc,
      evidence,
      rec,
      category,
      severity: sevMap[risk],
      description: desc,
      technicalExplanation: evidence ? `Identified payload snippet: ${evidence}` : desc,
      businessImpact: risk === 'critical' ? 'High risk of credential theft, data exfiltration, or complete system compromise.' : 'Potential attack surface for malicious injection and privacy leaks.',
      remediation: rec,
      confidence: 'High',
    });
  };

  if (!/<meta[^>]+content-security-policy/i.test(html)) {
    add('high', 'Missing Content Security Policy (CSP)', 'No CSP meta tag found. CSP is a critical defence against XSS and data-injection attacks.', '', 'Add a Content-Security-Policy meta tag or HTTP header. Use a strict policy: default-src \'self\'.', 'Header Security');
  }

  if (!/<meta[^>]+x-frame-options/i.test(html)) {
    add('medium', 'No X-Frame-Options Meta Tag', 'Page may be embeddable in malicious iframes, enabling clickjacking attacks.', '', 'Set X-Frame-Options: DENY or SAMEORIGIN as an HTTP header, or use the frame-ancestors CSP directive.', 'Clickjacking');
  }

  const inlineEvents = html.match(/on(click|mouseover|load|error|submit|focus|blur|change|keyup|keydown|input)="[^"]*"/gi);
  if (inlineEvents && inlineEvents.length > 0) {
    add('medium', `Inline Event Handlers (${inlineEvents.length})`, 'Inline event handlers expand XSS attack surface and prevent strict CSP enforcement.', inlineEvents.slice(0, 3).join('\n'), 'Move handlers to external JS using addEventListener(). This allows CSP without unsafe-inline.', 'Code Quality');
  }

  if (/\beval\s*\(/.test(html)) {
    const m = html.match(/.{0,40}eval\s*\(.{0,60}/);
    add('high', 'Use of eval() Execution Sink', 'eval() executes arbitrary strings at runtime — severe risk if any input is user-controlled.', m ? m[0].trim() : '', 'Remove eval(). Use JSON.parse() for data. Refactor dynamic execution with safer alternatives.', 'Code Injection');
  }

  if (/document\.write\s*\(/.test(html)) {
    const m = html.match(/.{0,30}document\.write\s*\(.{0,60}/);
    add('medium', 'document.write() Usage', 'DOM-based XSS vector if argument includes URL-derived or user-controlled data.', m ? m[0].trim() : '', 'Replace with createElement() or textContent.', 'DOM XSS');
  }

  const ihMatches = html.match(/\.innerHTML\s*=/g);
  if (ihMatches && ihMatches.length > 0) {
    add('medium', `innerHTML Dynamic Assignments (${ihMatches.length})`, 'If assigned value contains unsanitised input, classic DOM XSS vector.', ihMatches.slice(0, 2).join('  '), 'Use textContent for text. Sanitise with DOMPurify before using innerHTML.', 'DOM XSS');
  }

  const keyPatterns = [
    { re: /api[_-]?key["'\s]*[:=]["'\s]*([a-zA-Z0-9\-_]{20,})/i, label: 'API Key' },
    { re: /secret["'\s]*[:=]["'\s]*([a-zA-Z0-9\-_]{16,})/i, label: 'Secret Token' },
    { re: /access[_-]?token["'\s]*[:=]["'\s]*([a-zA-Z0-9\-_]{16,})/i, label: 'Access Token' },
    { re: /password["'\s]*[:=]["'\s]*["']([^"']{6,})/i, label: 'Hardcoded Password' },
    { re: /(AIza[0-9A-Za-z\-_]{35})/, label: 'Google API Key' },
    { re: /(gh[pousr]_[A-Za-z0-9_]{36,})/, label: 'GitHub Token' },
    { re: /(AKIA[0-9A-Z]{16})/, label: 'AWS Access Key ID' },
    { re: /sk-[a-zA-Z0-9]{32,}/, label: 'OpenAI/Stripe Secret Key' },
  ];

  keyPatterns.forEach((kp) => {
    const m = html.match(kp.re);
    if (m) {
      add('critical', `Exposed Secret Token — ${kp.label}`, 'Hardcoded credential found in client-side source — readable by anyone auditing the source code.', m[0].substring(0, 80), 'Remove immediately. Rotate the credential. Move authentication to server-side environment variables.', 'Credentials');
    }
  });

  const jwtMatch = html.match(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/);
  if (jwtMatch) {
    add('critical', 'JWT Token Hardcoded in Source', 'A JSON Web Token is embedded in the source code — this token may grant unauthorised API access.', jwtMatch[0].substring(0, 60) + '…', 'Revoke this token immediately. Never embed tokens in client-side code.', 'Authentication');
  }

  if (targetUrl && (targetUrl.startsWith('https') || targetUrl.includes('https'))) {
    const mixed = html.match(/src\s*=\s*["']http:\/\/[^"']+["']/gi);
    if (mixed && mixed.length > 0) {
      add('medium', `Mixed Content (${mixed.length} resource${mixed.length > 1 ? 's' : ''})`, 'HTTP resources on HTTPS page can be blocked or intercepted.', mixed.slice(0, 2).join('\n'), 'Update all resource URLs to use HTTPS.', 'Transport Security');
    }
  }

  const emails = html.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g);
  if (emails && emails.length > 0) {
    const unique = Array.from(new Set(emails)).slice(0, 5);
    add('low', `Exposed Email Addresses (${emails.length})`, 'Emails harvested for spam, phishing, or targeted social engineering.', unique.join(', '), 'Use server-side contact forms or obfuscate addresses to deter automated scrapers.', 'Information Disclosure');
  }

  const sensComments = html.match(/<!--[^>]*(todo|fixme|hack|bug|password|key|secret|token|admin|debug|temp|hardcoded|remove|credentials)[^>]*-->/gi);
  if (sensComments && sensComments.length > 0) {
    add('medium', `Sensitive HTML Comments (${sensComments.length})`, 'Comments with sensitive keywords reveal implementation details to potential attackers.', sensComments.slice(0, 2).join('\n').substring(0, 300), 'Remove all developer comments from production code builds.', 'Information Disclosure');
  }

  const extScripts = html.match(/<script[^>]+src\s*=\s*["'][^"']+["'][^>]*>/gi);
  if (extScripts) {
    const noSri = extScripts.filter((s) => !/integrity\s*=/i.test(s) && /https?:\/\//i.test(s));
    if (noSri.length > 0) {
      add('medium', `External Scripts Without SRI (${noSri.length})`, 'If the CDN is compromised, malicious code can be injected undetected.', noSri.slice(0, 2).join('\n').substring(0, 300), 'Add integrity="sha384-..." and crossorigin="anonymous" to external script tags.', 'Supply Chain');
    }
  }

  const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  findings.sort((a, b) => order[a.risk] - order[b.risk]);
  return findings;
}

export function detectAIGeneration(html: string): AIAnalysis {
  const signals: AISignal[] = [];
  let totalScore = 0;
  const toolHints: string[] = [];
  const lc = html.toLowerCase();

  const check = (fired: boolean, weight: number, icon: string, label: string, detail: string, tool?: string) => {
    signals.push({ fired, weight, icon, label, detail });
    if (fired) {
      totalScore += weight;
      if (tool) toolHints.push(tool);
    }
  };

  const genMeta = html.match(/<meta[^>]+name\s*=\s*["']generator["'][^>]*content\s*=\s*["']([^"']+)["']/i);
  if (genMeta) {
    check(true, 30, '🏷️', `Generator Meta Tag: ${genMeta[1].substring(0, 40)}`, 'Site openly declares its build tool.', genMeta[1].split(' ')[0]);
  }

  check(/framerusercontent\.com|data-framer-/i.test(html), 38, '🖼️', 'Framer Fingerprint', 'Framer CDN/class/data-attr signatures.', 'Framer');
  check(/wix-static\.net|parastorage\.com|static\.wixstatic/i.test(html), 38, '🌐', 'Wix Platform CDN', 'Wix-specific CDN domains in asset URLs.', 'Wix');
  check(/assets\.website-files\.com|data-wf-page|data-wf-site/i.test(html), 38, '🔷', 'Webflow Platform', 'Webflow CDN/data attributes detected.', 'Webflow');
  check(/squarespace\.com|sqspcdn\.com/i.test(html), 35, '◼️', 'Squarespace Platform', 'Squarespace CDN or structural attrs.', 'Squarespace');
  check(/cdn\.builder\.io|builder\.io\/api/i.test(html), 40, '🤖', 'Builder.io AI Visual Editor', 'Builder.io is AI-generated by definition.', 'Builder.io');
  check(/lovable\.app|lovable\.dev|gpt-engineer/i.test(html), 42, '❤️', 'Lovable / GPT-Engineer', 'Lovable.app/GPT-Engineer signatures found.', 'Lovable');
  check(/bolt\.new|stackblitz\.io.*bolt|bolt-ai/i.test(html), 40, '⚡', 'Bolt.new (StackBlitz AI)', 'Bolt.new AI builder signatures.', 'Bolt.new');
  check(/v0\.dev|vercel\.com\/v0|generated by v0/i.test(html), 40, '▲', 'Vercel v0 AI Generator', 'v0.dev by Vercel signatures detected.', 'v0.dev');
  check(/cursor\.sh|cursor-ai|made with cursor/i.test(html), 35, '💻', 'Cursor AI Editor', 'Cursor AI signatures found.', 'Cursor');
  check(/copilot-generated|github\.com\/features\/copilot/i.test(html), 32, '🐱', 'GitHub Copilot Attribution', 'Copilot attribution in source.', 'GitHub Copilot');

  const hasLargeStyle = /<style[\s\S]{600,}<\/style>/i.test(html);
  const hasLargeScript = /<script[\s\S]{600,}<\/script>/i.test(html);
  const noExtCSS = (html.match(/<link[^>]+stylesheet/gi) || []).length === 0;
  check(hasLargeStyle && hasLargeScript && noExtCSS, 25, '📦', 'Self-Contained Single-File HTML', 'Large inline <style> + <script> with no external CSS = AI assistant default output format.');

  const cssVars = (html.match(/--[a-z][a-z0-9-]+\s*:/g) || []).length;
  check(cssVars >= 8, 18, '🎨', 'Systematic CSS Variable Architecture', `${cssVars} CSS custom properties in :root. AI assistants use systematic variable naming.`);

  const aiSecs = ['hero', 'features', 'about', 'testimonial', 'pricing', 'faq', 'contact', 'footer', 'cta'];
  const secHits = aiSecs.filter((s) => new RegExp(`(id|class)=["'][^"']*${s}`, 'i').test(html));
  check(secHits.length >= 4, 22, '📏', 'Complete AI Landing Page Structure', `${secHits.length} canonical sections found: ${secHits.join(', ')}`);

  const templateVars = (html.match(/\{\{[A-Z_][A-Z0-9_]{2,}\}\}/g) || []).length;
  check(templateVars >= 1, 45, '🚨', 'Unfilled Template Variables Found', `${templateVars} unfilled {{PLACEHOLDER}} variables found in source. Dead giveaway of AI generation.`);

  const maxScore = 680;
  const ratio = Math.min(1, totalScore / maxScore);
  const normalised = Math.min(100, Math.round(Math.sqrt(ratio * 3.5) * 100));
  const uniqueTools = Array.from(new Set(toolHints.filter(Boolean)));

  return { score: normalised, signals, tools: uniqueTools };
}

export function detectTechStack(html: string): TechStackItem[] {
  const techs: TechStackItem[] = [];
  const add = (cat: string, name: string, icon: string, evidence: string) => {
    techs.push({ cat, name, icon, evidence });
  };

  // CMS
  if (/wp-content|wp-includes|wordpress/i.test(html)) add('CMS', 'WordPress', '🔵', 'wp-content / wp-includes paths');
  if (/ghost\.io|content\.ghost\.io/i.test(html)) add('CMS', 'Ghost', '👻', 'Ghost CMS CDN / theme');
  if (/strapi\.io|strapi-admin/i.test(html)) add('CMS', 'Strapi', '💜', 'Strapi CMS markers');

  // Frameworks
  if (/__NEXT_DATA__|_next\/static/i.test(html)) add('Framework', 'Next.js', '⚡', '__NEXT_DATA__ / _next paths');
  if (/nuxt|__NUXT__|_nuxt\//i.test(html)) add('Framework', 'Nuxt.js', '💚', '__NUXT__ global / _nuxt paths');
  if (/data-reactroot|react\.development|react\.production|__REACT/i.test(html)) add('Framework', 'React', '⚛️', 'React DOM markers');
  if (/vue\.runtime|__vue__|v-bind:|v-if=/i.test(html)) add('Framework', 'Vue.js', '💚', 'Vue directives / runtime');
  if (/svelte\.|__svelte|svelte-kit/i.test(html)) add('Framework', 'Svelte / SvelteKit', '🔥', 'Svelte component markers');
  if (/tailwindcss|tailwind\.config/i.test(html)) add('Library', 'Tailwind CSS', '🌊', 'Tailwind class patterns');

  // Libraries
  const jqMatch = html.match(/jquery[.-]([\d.]+)\.(?:min\.)?js/i);
  if (jqMatch || /\$\.fn\.jquery|\$\(document\)\.ready/i.test(html)) add('Library', `jQuery ${jqMatch ? 'v' + jqMatch[1] : ''}`, '💲', 'jQuery detected');
  if (/three\.js|THREE\./i.test(html)) add('Library', 'Three.js', '🎲', 'THREE 3D canvas library');
  if (/gsap|TweenMax|ScrollTrigger/i.test(html)) add('Library', 'GSAP', '🟩', 'GSAP animation suite');

  // Analytics
  if (/google-analytics\.com|gtag\(|ga\('create/i.test(html)) add('Analytics', 'Google Analytics', '📊', 'gtag() / ga() tracking calls');
  if (/googletagmanager\.com\/gtm/i.test(html)) add('Analytics', 'Google Tag Manager', '🏷️', 'GTM script container');
  if (/static\.hotjar\.com|hj\(/i.test(html)) add('Analytics', 'Hotjar', '🔥', 'Hotjar tracking script');

  // Backend / Cloud
  if (/firebase\.app|firebaseapp\.com|initializeApp\(/i.test(html)) add('Backend', 'Firebase', '🔥', 'Firebase SDK initialization');
  if (/supabase\.co|createClient.*supabase/i.test(html)) add('Backend', 'Supabase', '💚', 'Supabase client init');
  if (/cloudflare\.com|__cf_chl/i.test(html)) add('Backend', 'Cloudflare', '🟠', 'Cloudflare CDN / proxy edge');
  if (/vercel\.com\/_next|vercel\.app/i.test(html)) add('Backend', 'Vercel', '▲', 'Vercel serverless deployment');

  // Auth & Payments
  if (/clerk\.dev|clerk\.com/i.test(html)) add('Auth', 'Clerk', '🔐', 'Clerk authentication');
  if (/stripe\.com\/v3|Stripe\(/i.test(html)) add('Payments', 'Stripe', '💳', 'Stripe.js payment engine');
  if (/paypal\.com\/sdk/i.test(html)) add('Payments', 'PayPal', '💳', 'PayPal checkout SDK');

  // Fonts
  if (/fonts\.googleapis\.com/i.test(html)) add('Fonts', 'Google Fonts', '🔤', 'Google Fonts CDN');
  if (/lucide\.dev|lucide-react/i.test(html)) add('Fonts', 'Lucide Icons', '✨', 'Lucide icon package');

  return techs;
}

export function runClientSideAnalysis(html: string, targetUrl: string) {
  return {
    findings: analyseVulnerabilities(html, targetUrl),
    aiAnalysis: detectAIGeneration(html),
    techStack: detectTechStack(html),
  };
}
