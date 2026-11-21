import type { AIDetectionResult, AIDetectionSignal } from '../types';

/**
 * AI Generation Detection Engine.
 * Complete 1:1 port of detectAIGeneration() from HEARTCODE.html lines 2637-2903.
 * All 40+ signals across 4 tiers preserved exactly.
 */
export function detectAIGeneration(html: string): AIDetectionResult {
  const signals: AIDetectionSignal[] = [];
  const detectedTools: string[] = [];

  function sig(
    weight: number,
    icon: string,
    label: string,
    detail: string,
    fired: boolean
  ): void {
    signals.push({ weight, icon, label, detail, fired });
  }

  // ── TIER 1: Platform fingerprints (most reliable) ─────────────────────────

  let framer = false, webflow = false, wix = false, squarespace = false,
      lovable = false, boltNew = false, v0 = false, cursor = false,
      bubble = false, plasmic = false, dora = false, tempo = false,
      galileo = false, magicpatterns = false, relume = false,
      uizard = false, anima = false, locofy = false, create = false,
      replit = false;

  if (/framer\.com\/m|__framer|FramerApp|framer-motion/i.test(html)) {
    framer = true; detectedTools.push('Framer');
  }
  if (/webflow\.com|WebflowBadge|wf-form/i.test(html)) {
    webflow = true; detectedTools.push('Webflow');
  }
  if (/wix\.com|wixsite\.com|_wix_|wix-thunderbolt/i.test(html)) {
    wix = true; detectedTools.push('Wix');
  }
  if (/squarespace\.com|squarespace-cdn|\/s\/static\/|sqsp/i.test(html)) {
    squarespace = true; detectedTools.push('Squarespace');
  }
  if (/lovable\.dev|lovable-uploads|gpt-engineer/i.test(html)) {
    lovable = true; detectedTools.push('Lovable');
  }
  if (/bolt\.new|stackblitz.*bolt|bolt-project/i.test(html)) {
    boltNew = true; detectedTools.push('Bolt.new');
  }
  if (/v0\.dev|vercel-v0|v0-component/i.test(html)) {
    v0 = true; detectedTools.push('v0.dev');
  }
  if (/cursor\.sh|cursor-generated|cursor-ai/i.test(html)) {
    cursor = true; detectedTools.push('Cursor AI');
  }
  if (/bubble\.io|bubble-element|bbl-page/i.test(html)) {
    bubble = true; detectedTools.push('Bubble.io');
  }
  if (/plasmic\.app|@plasmicapp/i.test(html)) {
    plasmic = true; detectedTools.push('Plasmic');
  }
  if (/dora\.run|dora-app|dora-ai/i.test(html)) {
    dora = true; detectedTools.push('Dora');
  }
  if (/tempo-labs|tempolabs\.ai/i.test(html)) {
    tempo = true; detectedTools.push('Tempo Labs');
  }
  if (/galileo-ai|galileoai/i.test(html)) {
    galileo = true; detectedTools.push('Galileo AI');
  }
  if (/magicpatterns\.com|magic-patterns/i.test(html)) {
    magicpatterns = true; detectedTools.push('Magic Patterns');
  }
  if (/relume\.io|relume-component/i.test(html)) {
    relume = true; detectedTools.push('Relume');
  }
  if (/uizard\.io|uizard-app/i.test(html)) {
    uizard = true; detectedTools.push('Uizard');
  }
  if (/anima-app\.com|AnimaApp/i.test(html)) {
    anima = true; detectedTools.push('Anima');
  }
  if (/locofy\.ai|locofy-export/i.test(html)) {
    locofy = true; detectedTools.push('Locofy');
  }
  if (/create\.xyz|createxyz/i.test(html)) {
    create = true; detectedTools.push('Create.xyz');
  }
  if (/replit\.com|replit-.*-ai|__replit/i.test(html)) {
    replit = true; detectedTools.push('Replit AI');
  }

  const t1fired =
    framer || webflow || wix || squarespace || lovable || boltNew ||
    v0 || cursor || bubble || plasmic || dora || tempo || galileo ||
    magicpatterns || relume || uizard || anima || locofy || create || replit;

  sig(40, '🏭', 'Known AI/Builder Platform Detected',
    detectedTools.length > 0
      ? 'Platform fingerprint: ' + detectedTools.join(', ')
      : 'No known platform fingerprint found.',
    t1fired);

  // ── TIER 2: AI code writing patterns ──────────────────────────────────────

  // Self-contained single file
  const hasInlineStyle = (html.match(/<style/gi) || []).length > 0;
  const hasInlineScript = (html.match(/<script(?![^>]*src=)/gi) || []).length > 0;
  const isLargeFile = html.length > 8000;
  const selfContained = hasInlineStyle && hasInlineScript && isLargeFile;
  sig(12, '📦', 'Self-Contained Single-File Architecture',
    'Embedded <style> + inline <script> + large file suggest AI-generated scaffold.',
    selfContained);

  // CSS variable heavy usage
  const cssVarCount = (html.match(/--[a-zA-Z][\w-]*/g) || []).length;
  sig(8, '🎨', 'Heavy CSS Variable Usage',
    cssVarCount + ' CSS custom properties detected (AI tools prefer variable-heavy systems).',
    cssVarCount >= 10);

  // Tailwind or utility-class heavy
  const hasTailwind = /tailwindcss|cdn\.tailwindcss|class="[^"]*(?:flex|grid|px-|py-|mx-|my-|text-|bg-|border-|rounded-|shadow-|gap-|space-)[^"]*"/i.test(html);
  sig(6, '💨', 'Tailwind / Utility-Class CSS Detected',
    'Heavy use of utility-class frameworks is common in AI-generated frontends.',
    hasTailwind);

  // Semantic class naming
  const semanticNames = (html.match(/class="[^"]*(?:container|wrapper|section|card|hero|feature|cta|button|header|footer|nav|sidebar)[^"]*"/gi) || []).length;
  sig(5, '🏷', 'Canonical Semantic Class Names',
    semanticNames + ' instances of generic semantic class names (very common in AI output).',
    semanticNames >= 5);

  // Gradient-heavy design
  const gradients = (html.match(/linear-gradient|radial-gradient|conic-gradient/gi) || []).length;
  sig(7, '🌈', 'Gradient-Heavy Design',
    gradients + ' gradient declarations — AI tools often produce gradient-heavy UIs.',
    gradients >= 4);

  // CSS animations
  const animations = (html.match(/@keyframes|animation:/gi) || []).length;
  sig(5, '✨', 'CSS Animations Present',
    animations + ' animation definitions — micro-animations are a strong AI-tool signal.',
    animations >= 3);

  // Glassmorphism
  const glass = /backdrop-filter|backdrop-blur|background.*rgba.*0\.[1-4]\)/i.test(html);
  sig(8, '🔮', 'Glassmorphism / Frosted-Glass Effects',
    'backdrop-filter/blur and semi-transparent backgrounds detected — trendy AI aesthetic.',
    glass);

  // Perfect meta/SEO
  const hasOg = /<meta[^>]+og:title/i.test(html);
  const hasDesc = /<meta[^>]+description/i.test(html);
  const hasTwitter = /<meta[^>]+twitter:/i.test(html);
  const hasCanonical = /<link[^>]+canonical/i.test(html);
  const seoScore = [hasOg, hasDesc, hasTwitter, hasCanonical].filter(Boolean).length;
  sig(6, '🔎', 'Near-Perfect SEO Meta Tags',
    'OG, description, Twitter, canonical all present — AI tools generate complete SEO markup.',
    seoScore >= 3);

  // React / modern framework
  const hasReact = /__NEXT_DATA__|_app.*react|react-dom|createRoot\(|ReactDOM\.render/i.test(html);
  sig(4, '⚛️', 'React / Next.js Framework Detected',
    'AI coding tools overwhelmingly produce React/Next.js code.',
    hasReact);

  // Suspiciously clean HTML structure
  const hasDoctype = /<!DOCTYPE html>/i.test(html);
  const hasViewport = /<meta[^>]+viewport/i.test(html);
  const hasCharset = /<meta[^>]+charset/i.test(html);
  const cleanStructure = hasDoctype && hasViewport && hasCharset;
  sig(4, '🧹', 'Clean Boilerplate HTML Structure',
    'DOCTYPE + viewport meta + charset = perfect boilerplate AI always includes.',
    cleanStructure);

  // ── TIER 3: Content signals ────────────────────────────────────────────────

  // AI marketing phrases
  const aiPhrases = [
    'transform your', 'unlock the power', 'seamlessly integrate', 'cutting-edge',
    'next-generation', 'revolutionize', 'streamline your', 'empower your',
    'leverage the', 'game-changing', 'all-in-one solution', 'intuitive interface',
    'robust solution', 'scalable solution', 'harness the power', 'state-of-the-art',
  ];
  const phraseFired = aiPhrases.filter((p) => html.toLowerCase().includes(p));
  sig(9, '📢', 'AI Marketing Phrase Density',
    phraseFired.length > 0
      ? 'Detected: ' + phraseFired.slice(0, 4).join(', ')
      : 'No AI marketing phrases found.',
    phraseFired.length >= 2);

  // ARIA labels on everything
  const ariaCount = (html.match(/aria-label=/gi) || []).length;
  sig(5, '♿', 'Comprehensive ARIA Accessibility Attributes',
    ariaCount + ' aria-label attributes — AI tools generate near-perfect accessibility markup.',
    ariaCount >= 8);

  // Placeholder/example content
  const placeholders = /lorem ipsum|placeholder text|example\.com|your company|your brand|company name/i.test(html);
  sig(7, '📝', 'Placeholder / Template Content',
    'Generic placeholder text found — typical of AI-scaffolded pages.',
    placeholders);

  // Generic font stack
  const genericFonts = /font-family.*(?:Inter|Poppins|Manrope|Plus Jakarta|DM Sans|Outfit|Nunito|Geist)/i.test(html);
  sig(4, '🔤', 'Trendy AI-Preferred Font',
    'AI tools consistently choose Inter, Poppins, Manrope, or similar modern fonts.',
    genericFonts);

  // ── TIER 4: Real-world patterns ───────────────────────────────────────────

  // localStorage used as primary DB
  const lsAsDb = (html.match(/localStorage\.setItem/g) || []).length;
  sig(8, '💾', 'localStorage as Primary Data Store',
    lsAsDb + ' localStorage.setItem calls — AI-generated apps avoid real backends.',
    lsAsDb >= 3);

  // CRUD modal pattern
  const hasModal = /modal|dialog|overlay/i.test(html);
  const hasCrud = /add|edit|delete|create|update|remove/i.test(html);
  sig(5, '🗂', 'CRUD + Modal UI Pattern',
    'Add/Edit/Delete functionality with modal dialogs — signature AI CRUD app pattern.',
    hasModal && hasCrud);

  // Emoji in buttons/UI
  const emojiButtons = (html.match(/<button[^>]*>[^<]*[\u{1F300}-\u{1F9FF}]/giu) || []).length;
  sig(4, '😊', 'Emoji in UI Buttons',
    emojiButtons + ' buttons contain emoji — AI models frequently add emoji to UI.',
    emojiButtons >= 3);

  // Template variables (unfilled)
  const templateVars = /\{\{[A-Z_]+\}\}|\[YOUR_[A-Z]+\]|__PLACEHOLDER__/i.test(html);
  sig(9, '⚠️', 'Unfilled Template Variables',
    'Template-style placeholder variables found in HTML — AI output not fully customised.',
    templateVars);

  // Vite / CRA meta tag or comment
  const hasViteCra = /vite|create-react-app|CRA|Vite \+ React/i.test(html);
  sig(5, '⚡', 'Vite / Create-React-App Scaffold',
    'Vite or CRA scaffold traces detected — standard AI coding tool starter.',
    hasViteCra);

  // Self-detection guard
  const selfMarkers = ['analyseSource', 'detectAIGeneration', 'CODED — Web Recon'];
  if (selfMarkers.every((m) => html.includes(m))) {
    return { score: 0, signals: [], tools: [] };
  }

  // ── SCORING ───────────────────────────────────────────────────────────────
  const firedSignals = signals.filter((s) => s.fired);
  const rawScore = firedSignals.reduce((acc, s) => acc + s.weight, 0);
  // Sqrt × 3.5 compression, cap at 100
  const score = Math.min(100, Math.round(Math.sqrt(rawScore) * 3.5));

  return { score, signals, tools: detectedTools };
}

export default detectAIGeneration;
