import axios from 'axios';
import { ScannerEngine } from './scanner/ScannerEngine';
import { SecurityReport, ScanTarget } from './scanner/types';

// Modules
import { HeaderScanner } from './scanner/modules/HeaderScanner';
import { SSLScanner } from './scanner/modules/SSLScanner';
import { CookieScanner } from './scanner/modules/CookieScanner';
import { InformationDisclosureScanner } from './scanner/modules/InformationDisclosureScanner';
import { TechnologyScanner } from './scanner/modules/TechnologyScanner';
import { SecretLeakScanner } from './scanner/modules/SecretLeakScanner';
import { APIScanner } from './scanner/modules/APIScanner';
import { MisconfigurationScanner } from './scanner/modules/MisconfigurationScanner';
import { AuthenticationScanner } from './scanner/modules/AuthenticationScanner';
import { PrivacyScanner } from './scanner/modules/PrivacyScanner';
import { DomainScanner } from './scanner/modules/DomainScanner';
import { ReputationScanner } from './scanner/modules/ReputationScanner';
import { InfrastructureScanner } from './scanner/modules/InfrastructureScanner';
import { EndpointDiscoveryScanner } from './scanner/modules/EndpointDiscoveryScanner';
import { BehavioralScanner } from './scanner/modules/BehavioralScanner';
import { ObfuscationScanner } from './scanner/modules/ObfuscationScanner';
import { ShadowAssetScanner } from './scanner/modules/ShadowAssetScanner';
import { SecurityIntelligenceScanner } from './scanner/modules/SecurityIntelligenceScanner';
import { DesignSystemScanner } from './scanner/modules/DesignSystemScanner';

export interface ScanStats {
  size: string;
  lines: number;
  tagsCount: number;
  scriptsCount: number;
  stylesCount: number;
  imagesCount: number;
}

export interface AISignal {
  fired: boolean;
  weight: number;
  icon: string;
  label: string;
  detail: string;
}

export interface AIDetectionResult {
  score: number;
  signals: AISignal[];
  tools: string[];
}

export class ScanService {
  private static engine: ScannerEngine;

  static {
    this.engine = new ScannerEngine();
    this.engine.registerModule(new SSLScanner());
    this.engine.registerModule(new HeaderScanner());
    this.engine.registerModule(new CookieScanner());
    this.engine.registerModule(new InformationDisclosureScanner());
    this.engine.registerModule(new TechnologyScanner());
    this.engine.registerModule(new SecretLeakScanner());
    this.engine.registerModule(new APIScanner());
    this.engine.registerModule(new MisconfigurationScanner());
    this.engine.registerModule(new AuthenticationScanner());
    this.engine.registerModule(new PrivacyScanner());
    this.engine.registerModule(new DomainScanner());
    this.engine.registerModule(new ReputationScanner());
    this.engine.registerModule(new InfrastructureScanner());
    this.engine.registerModule(new EndpointDiscoveryScanner());
    this.engine.registerModule(new BehavioralScanner());
    this.engine.registerModule(new ObfuscationScanner());
    this.engine.registerModule(new ShadowAssetScanner());
    this.engine.registerModule(new SecurityIntelligenceScanner());
    this.engine.registerModule(new DesignSystemScanner());
  }

  /**
   * Fetches the raw HTML source of a target URL and its headers.
   */
  static async fetchTargetData(url: string): Promise<{ html: string; headers: Record<string, string> }> {
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const lowerUrl = formattedUrl.toLowerCase();
    if (
      lowerUrl.includes('heartcode') ||
      lowerUrl.includes('technova') ||
      lowerUrl.includes('localhost') ||
      lowerUrl.includes('127.0.0.1') ||
      lowerUrl.includes('192.168.') ||
      lowerUrl.includes('10.')
    ) {
      throw new Error("Security Restriction: Can't scan internal system node. Access Denied.");
    }

    const response = await axios.get(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 10000,
    });

    if (typeof response.data !== 'string') {
      throw new Error('Target URL did not return a valid HTML string');
    }

    // Axios returns headers in lower-case automatically
    return {
      html: response.data,
      headers: response.headers as Record<string, string>
    };
  }

  /**
   * Computes file stats from the source HTML.
   */
  static calculateStats(html: string): ScanStats {
    const bytes = Buffer.byteLength(html, 'utf8');
    const kb = bytes / 1024;
    const size = kb >= 100 ? Math.round(kb) + ' KB' : kb.toFixed(1) + ' KB';
    const lines = html.split('\n').length;
    const tagsCount = (html.match(/<[a-zA-Z]/g) || []).length;
    const scriptsCount = (html.match(/<script/gi) || []).length;
    const stylesCount = (html.match(/<style|<link[^>]+stylesheet/gi) || []).length;
    const imagesCount = (html.match(/<img/gi) || []).length;

    return { size, lines, tagsCount, scriptsCount, stylesCount, imagesCount };
  }

  /**
   * Run the advanced modular vulnerability scan.
   */
  static async runAdvancedScan(url: string, html: string, headers: Record<string, string>): Promise<SecurityReport> {
    const target: ScanTarget = { url, html, headers };
    return await this.engine.runScan(target);
  }

  /**
   * Run the original AI generation signal checks.
   */
  static runAIDetect(html: string): AIDetectionResult {
    const signals: AISignal[] = [];
    let totalScore = 0;
    const toolHints: string[] = [];
    const lc = html.toLowerCase();

    const check = (fired: boolean, weight: number, icon: string, label: string, detail: string, tool: string | null = null) => {
      signals.push({ fired, weight, icon, label, detail });
      if (fired) {
        totalScore += weight;
        if (tool) toolHints.push(tool);
      }
    };

    // Self-scan check
    const isSelf = /The Coded X-Ray|CODED.*X-RAY|coded.*x-ray|intro-glitch-layer|intro-img-wrap|aidet-panel|techstack-panel|vuln-panel.*scan|coded_scan_history/i.test(html);
    if (isSelf) {
      return {
        score: 50,
        signals: [{
          fired: true,
          weight: 50,
          icon: '🪞',
          label: 'Self-Scan Detected',
          detail: 'This tool is scanning its own source code. Score is fixed at 50% — it was built with AI assistance but intentionally designed, so neither fully AI nor fully human.'
        }],
        tools: ['The Coded X-Ray']
      };
    }

    // TIER 1: PLATFORM FINGERPRINTS
    const genMeta = html.match(/<meta[^>]+name\s*=\s*["\']generator["\'][^>]*content\s*=\s*["\']([^\"\']+)["\']/i)
                 || html.match(/<meta[^>]+content\s*=\s*["\']([^\"\']+)["\'][^>]*name\s*=\s*["\']generator["\']/i);
    if (genMeta) {
      check(true, 30, '🏷', 'Generator Meta Tag: ' + genMeta[1].substring(0, 40), 'Site openly declares its build tool.', genMeta[1].split(' ')[0]);
    }
    check(/framerusercontent\.com|data-framer-/i.test(html) || (html.match(/class="[^"]*framer-[a-z0-9]{4,}/gi)||[]).length > 3, 38, '🖼', 'Framer Fingerprint', 'Framer CDN/class/data-attr signatures.', 'Framer');
    check(/wix-static\.net|parastorage\.com|static\.wixstatic|wixmp\.com/i.test(html), 38, '🌐', 'Wix Platform CDN', 'Wix-specific CDN domains in asset URLs.', 'Wix');
    check(/assets\.website-files\.com|webflow\.com\/|data-wf-page|data-wf-site/i.test(html), 38, '🔷', 'Webflow Platform', 'Webflow CDN/data attributes detected.', 'Webflow');
    check(/squarespace\.com|sqspcdn\.com|squarespace-headers|data-content-field/i.test(html), 35, '⬛', 'Squarespace Platform', 'Squarespace CDN or structural attrs.', 'Squarespace');
    check(/cdn\.builder\.io|builder\.io\/api/i.test(html), 40, '🤖', 'Builder.io AI Visual Editor', 'Builder.io is AI-generated by definition.', 'Builder.io');
    check(/lovable\.app|lovable\.dev|gpt-engineer|gptengineer\.app/i.test(html), 42, '❤️', 'Lovable / GPT-Engineer Detected', 'Lovable.app/GPT-Engineer signatures found.', 'Lovable');
    check(/bolt\.new|stackblitz\.io.*bolt|bolt-ai/i.test(html), 40, '⚡', 'Bolt.new (StackBlitz AI)', 'Bolt.new AI builder signatures.', 'Bolt.new');
    check(/v0\.dev|vercel\.com\/v0|generated by v0/i.test(html), 40, '▲', 'Vercel v0 AI Generator', 'v0.dev by Vercel signatures detected.', 'v0.dev');
    check(/cursor\.sh|cursor-ai|made with cursor/i.test(html), 35, '💻', 'Cursor AI Editor', 'Cursor AI signatures found.', 'Cursor');
    check(/github\.com\/features\/copilot|copilot-generated/i.test(html), 32, '🐈', 'GitHub Copilot Attribution', 'Copilot attribution in source.', 'GitHub Copilot');
    check(/dora\.run|dora\.ai/i.test(html), 38, '🌟', 'Dora AI Website Builder', 'Dora.run signatures detected.', 'Dora.ai');
    check(/relume\.io|relume-library/i.test(html), 35, '📋', 'Relume AI Component Library', 'Relume.io component signatures.', 'Relume');
    check(/10web\.io|10web-ai/i.test(html), 35, '🔟', '10Web AI WordPress Builder', '10Web AI signatures.', '10Web');
    check(/hostinger\.com\/website-builder|hostinger-ai/i.test(html), 32, '📦', 'Hostinger AI Builder', 'Hostinger AI website builder signatures.', 'Hostinger AI');
    check(/shopify\.com|Shopify\.|cdn\.shopify/i.test(html), 30, '🛒', 'Shopify', 'Shopify CDN/JS globals.', 'Shopify');
    check(/elementor-widget|data-elementor|elementor-section/i.test(html), 28, '🧩', 'Elementor (WordPress)', 'Elementor class/data patterns.', 'Elementor');
    check(/jimdo|jimdofree|jimdosite/i.test(html), 35, '📌', 'Jimdo Website Builder', 'Jimdo platform signatures.', 'Jimdo');
    check(/godaddy\.com|godaddy-static/i.test(html), 30, '📌', 'GoDaddy Website Builder', 'GoDaddy builder signatures.', 'GoDaddy');
    check(/weebly\.com|weebly-static/i.test(html), 32, '📌', 'Weebly Platform', 'Weebly CDN signatures.', 'Weebly');
    check(/notion\.so|notion-static/i.test(html), 28, '📝', 'Notion-Exported Page', 'Notion page export signatures.', 'Notion');

    // TIER 2: AI CODE WRITING PATTERNS
    const hasLargeStyle = /<style[\s\S]{600,}<\/style>/i.test(html);
    const hasLargeScript = /<script[\s\S]{600,}<\/script>/i.test(html);
    const noExtCSS = (html.match(/<link[^>]+stylesheet/gi)||[]).length === 0;
    check(hasLargeStyle && hasLargeScript && noExtCSS, 25, '📦', 'Self-Contained Single-File HTML', 'Large inline <style>+<script> with no external CSS = AI assistant default output format.');

    const cssVars = (html.match(/--[a-z][a-z0-9-]+\s*:/g)||[]).length;
    const rootBlocks = (html.match(/:root\s*\{/gi)||[]).length;
    check(rootBlocks >= 1 && cssVars >= 8, 18, '🎨', 'Systematic CSS Variable Architecture', `${cssVars} CSS custom properties in ${rootBlocks} :root block(s). AI assistants always use systematic variable naming.`);

    const aiSecs = ['hero','features','about','testimonial','pricing','faq','contact','footer','cta','navbar','header','services','portfolio','team','blog'];
    const secHits = aiSecs.filter(s => new RegExp('(id|class)=["\'][^"\']*' + s, 'i').test(html));
    check(secHits.length >= 5, 22, '📏', 'Complete AI Landing Page Structure', `${secHits.length}/15 canonical sections found: ${secHits.join(', ')}`);

    const aiComments = (html.match(/<!--\s*[-=]{0,5}\s*[A-Z][A-Z\s]{3,}(?:SECTION|COMPONENT|BLOCK|AREA|PART)?\s*[-=]{0,5}\s*-->/g)||[]).length;
    check(aiComments >= 3, 20, '💬', 'AI Structural Section Comments', `${aiComments} all-caps section comments found. Claude/ChatGPT consistently write <!-- HERO SECTION --> separators.`);

    const aiClasses = (html.match(/class="[^"]*\b(hero-section|hero-content|features-grid|feature-card|cta-button|cta-btn|nav-links|section-title|card-grid|testimonial-card|pricing-card|contact-form|btn-primary|btn-secondary|gradient-text|container-wrapper|flex-center|glass-card|glow-effect)\b/gi)||[]).length;
    check(aiClasses >= 4, 20, '🏷', 'AI Canonical CSS Class Names', `${aiClasses} class names Claude/ChatGPT consistently generate.`);

    const gradients = (html.match(/linear-gradient|radial-gradient|conic-gradient/gi)||[]).length;
    check(gradients >= 6, 14, '🌈', 'Heavy Gradient Usage', `${gradients} gradient declarations. AI UIs use 3-5x more gradients than hand-coded sites.`);

    const aiFonts = ['Inter','Poppins','Montserrat','Raleway','Nunito','DM Sans','Space Grotesk','Outfit','Plus Jakarta','Geist','Cal Sans','Bricolage'];
    const fontHits = aiFonts.filter(f => html.includes(f));
    check(fontHits.length >= 2, 14, '🔤', 'AI-Preferred Google Font Stack', `Detected: ${fontHits.join(', ')}. These are the top choices for generated UIs.`);

    const keyframes = (html.match(/@keyframes\s+[a-zA-Z]/gi)||[]).length;
    const transitions = (html.match(/transition\s*:/gi)||[]).length;
    check(keyframes >= 3 && transitions >= 5, 14, '✨', 'Systematic Animation Patterns', `${keyframes} @keyframes + ${transitions} transitions. AI systematically adds transitions.`);

    const glassPatterns = (html.match(/backdrop-filter|glass|glassmorphism|blur\(/gi)||[]).length;
    check(glassPatterns >= 3, 12, '🔮', 'Glass Morphism UI Patterns', `${glassPatterns} backdrop-filter/glass class references.`);

    const shadows = (html.match(/box-shadow\s*:/gi)||[]).length;
    const radii = (html.match(/border-radius\s*:/gi)||[]).length;
    check(shadows >= 6 && radii >= 6, 10, '💨', 'Polished UI Micro-styling', `${shadows} box-shadows + ${radii} border-radii. AI applies these uniformly.`);

    const fileSizeKB = html.length / 1024;
    check(fileSizeKB > 40 && noExtCSS, 12, '📏', 'Large Self-Contained File', `${Math.round(fileSizeKB)}KB single-file HTML. AI outputs massive single-page structures.`);

    check(/cdn\.tailwindcss\.com|tailwindcss\.com\/cdn|unpkg\.com\/tailwindcss/i.test(html), 16, '🌊', 'Tailwind CDN via Script Tag', 'Tailwind loaded via script tag — typical configuration for AI assistant drafts.');

    const jsCommentPatterns = (html.match(/\/\/ [A-Z][A-Za-z\s]+ (?:Function|Handler|Logic|State|Component|Setup|Init|Config|Helper|Utility)/g)||[]).length;
    check(jsCommentPatterns >= 4, 15, '💻', 'AI-Style JavaScript Comments', `${jsCommentPatterns} descriptive title-case JS comments. Claude/ChatGPT consistently follow this style.`);

    const emojiHeadings = (html.match(/<h[1-6][^>]*>[^<]*[\uD800-\uDBFF][\uDC00-\uDFFF]/g)||[]).length;
    check(emojiHeadings >= 3, 12, '🌟', 'Emoji in Headings', `${emojiHeadings} headings containing emoji. AI is highly decorative.`);

    // TIER 3: CONTENT SIGNALS
    const aiPhrases = ['discover the difference','unleash your potential','seamlessly integrate','cutting-edge','we are passionate','transform your','take your business to the next level','innovative approach','state-of-the-art','game-changing','empower your','elevate your','unlock the power','revolutionize','streamline your','trusted by thousands','join thousands','get started today','sign up for free','no credit card required','built for teams','boost your productivity','drive results','all-in-one','powerful and intuitive','designed for','made for modern','the future of','say goodbye to','everything you need'];
    const phraseHits = aiPhrases.filter(p => lc.includes(p));
    check(phraseHits.length >= 4, 18, '📝', 'AI Marketing Copywriting', `${phraseHits.length} AI copywriting phrases found.`);

    const ariaAttrs = (html.match(/aria-[a-z]+=/gi)||[]).length;
    const altAttrs  = (html.match(/\balt\s*=\s*["'][^"']{3,}/gi)||[]).length;
    const totalImgs = (html.match(/<img/gi)||[]).length;
    check(ariaAttrs >= 8 && totalImgs > 0 && altAttrs >= totalImgs, 12, '♿', 'Perfect Accessibility Coverage', `${ariaAttrs} ARIA attributes + alt tags for all ${totalImgs} images.`);

    const placeholders = (html.match(/lorem ipsum|John Doe|Jane Doe|User Name|example@email|test@test\.com|placeholder text|sample text|dummy text/gi)||[]).length;
    check(placeholders >= 2, 15, '📋', 'Placeholder/Dummy Content', `${placeholders} mock content strings detected.`);

    // TIER 4: REAL-WORLD AI PATTERNS
    const templateVars = (html.match(/\{\{[A-Z_][A-Z0-9_]{2,}\}\}/g)||[]).length;
    check(templateVars >= 1, 45, '🚨', 'Unfilled Template Variables Found', `${templateVars} unfilled template placeholders.`);

    const localStorageWrites = (html.match(/localStorage\.setItem/gi)||[]).length;
    const localStorageReads  = (html.match(/localStorage\.getItem/gi)||[]).length;
    check(localStorageWrites >= 5, 28, '📁', 'localStorage Used as Primary Database', `${localStorageWrites} writes + ${localStorageReads} reads in client JS.`);

    const addModal    = /add[-_]modal|modal[-_]add|id="add[A-Z]/i.test(html);
    const editModal   = /edit[-_]modal|modal[-_]edit|id="edit[A-Z]/i.test(html);
    const deleteModal = /delete[-_]modal|confirm[-_]modal|modal[-_]delete/i.test(html);
    check(addModal && editModal && deleteModal, 30, '🖼', 'Modal-per-Entity CRUD Pattern', 'Add, Edit, and Delete modals all present in same file.');

    const emojiButtons = (html.match(/<button[^>]*>[^<]*[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}][^<]*<\/button>/gsu)||[]).length;
    check(emojiButtons >= 4, 18, '🚦', 'Emoji Used as Functional UI Icons', `${emojiButtons} buttons contain emoji icons.`);

    const jsArtifacts = (html.match(/\[Object Object\]|NaN%|undefined weeks|null\s*customer|\$\{[^}]+\}/g)||[]).length;
    check(jsArtifacts >= 1, 35, '🐞', 'Unresolved JS Template Artifacts', `${jsArtifacts} uncompiled data string signatures.`);

    const stockImageServices = (html.match(/picsum\.photos|via\.placeholder\.com|placehold\.co|dummyimage\.com|lorempixel\.com|placekitten\.com/gi)||[]).length;
    check(stockImageServices >= 2, 20, '🖼', 'Placeholder Image Services Used', `${stockImageServices} placeholder URLs.`);

    check(/Orbitron/i.test(html), 20, '🔤', 'Orbitron Font Detected', 'Orbitron typography style present.');

    const hasAdminSection = /admin[-_]dashboard|admin[-_]panel|admin[-_]section|id="admin/i.test(html);
    const hasUserSection  = /user[-_]portal|ambassador[-_]portal|dashboard[-_]section|id="dashboard/i.test(html);
    check(hasAdminSection && hasUserSection && noExtCSS, 22, '📊', 'Admin + User Portal Combined in One File', 'Monolithic backend role simulation in client.');

    check(/netlify\.app|netlify-identity|netlify-rum/i.test(html) && noExtCSS, 15, '🚀', 'Netlify Deployed Single-File App', 'Netlify metadata and direct CDN deployment.');

    const loadingText = (html.match(/Checking database\.\.\.|Loading\.\.\.|Please wait\.\.\.|Fetching data\.\.\./gi)||[]).length;
    check(loadingText >= 2, 12, '⏳', 'Generic AI Loading State Text', `${loadingText} default status messages.`);

    const demoData = (html.match(/Samira|Hafisa|Ambassador [A-Z]|Customer Name|Hall \/ Hostel|Select Status\.\.\.|Select Time\.\.\./gi)||[]).length;
    check(demoData >= 3, 14, '👤', 'Hardcoded Demo/Sample Data', `${demoData} raw mock details.`);

    const dividerComments = (html.match(/<!--\s*[=\-]{4,}\s*-->|\/\*\s*[=\-]{6,}\s*\*\//g)||[]).length;
    check(dividerComments >= 3, 14, '📋', 'AI Code Divider Comments', `${dividerComments} comment breaks.`);

    // Scoring logic (sqrt × 3.5 boost)
    const maxScore = 680;
    const ratio = Math.min(1, totalScore / maxScore);
    const score = Math.min(100, Math.round(Math.sqrt(ratio * 3.5) * 100));
    const uniqueTools = Array.from(new Set(toolHints));

    return { score, signals, tools: uniqueTools };
  }
}
export default ScanService;
