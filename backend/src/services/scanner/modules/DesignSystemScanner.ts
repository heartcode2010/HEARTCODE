import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class DesignSystemScanner implements ScannerModule {
  moduleName = 'DesignSystemScanner';
  category = 'DESIGN SYSTEM & ARCHITECTURE';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const html = target.html || '';

    const addFinding = (id: string, name: string, description: string, evidence: string, severity: 'Low' | 'Informational' = 'Informational') => {
      findings.push({
        id,
        category: this.category,
        severity,
        confidence: 'Certain',
        name,
        description,
        technicalExplanation: 'The application styling stack, typography families, and theme variables are mapped using classes, link tags, and structural variable declarations in HTML/CSS.',
        businessImpact: 'A public design footprint discloses UI engineering details, libraries used, and standard assets, allowing custom visual overlay attacks or cloning of site skins.',
        remediation: 'Keep style variables clean, use minified CSS code, and remove unused font loaders or UI components from the bundles.',
        evidence,
      });
    };

    // 1. CSS Framework Detection
    if (html.includes('tailwind') || /class="[^"]*\b(space-y-[0-9]|grid-cols-[0-9]|flex-|justify-|items-|bg-|text-|px-|py-)[^"]*"/i.test(html)) {
      addFinding('DES-001', 'CSS Framework Detected: Tailwind CSS', 'The site uses Tailwind CSS as its main design system engine.', 'Tailwind CSS classes or script CDN imports found.');
    } else if (html.includes('bootstrap') || html.includes('btn-group') || html.includes('col-md-') || html.includes('navbar-expand-')) {
      addFinding('DES-002', 'CSS Framework Detected: Bootstrap', 'The site uses the Twitter Bootstrap framework for styling.', 'Bootstrap class attributes detected.');
    } else if (html.includes('bulma') || html.includes('is-primary') || html.includes('columns') || html.includes('hero-body')) {
      addFinding('DES-003', 'CSS Framework Detected: Bulma', 'The website uses the Bulma responsive flexbox CSS framework.', 'Bulma class name attributes detected.');
    }

    // 2. UI Library Detection (Material UI, Ant Design, Chakra UI, Radix/shadcn)
    if (html.includes('MuiButton-') || html.includes('MuiGrid-') || html.includes('mui-')) {
      addFinding('DES-004', 'Component Library: Material UI (MUI)', 'The application integrates Google Material Design components.', 'Mui- prefix class names found.');
    } else if (html.includes('ant-btn') || html.includes('ant-col') || html.includes('ant-row')) {
      addFinding('DES-005', 'Component Library: Ant Design', 'The website incorporates Alibaba Ant Design component framework.', 'Ant- prefix class names found.');
    } else if (html.includes('radix-') || html.includes('data-radix-') || /class="[^"]*\b(ui-)[^"]*"/i.test(html)) {
      addFinding('DES-006', 'Component Library: Radix UI / shadcn/ui', 'The application style utilizes Radix primitive components or shadcn presets.', 'Radix state classes or shadcn primitives found.');
    }

    // 3. Fonts & Typography
    const fontsRegex = /family=([a-zA-Z0-9+]+)/gi;
    const fontMatches = html.match(fontsRegex);
    if (fontMatches) {
      const fonts = Array.from(new Set(fontMatches)).map(f => f.replace('family=', '')).slice(0, 3);
      addFinding('DES-007', 'Typography Stack: Google Fonts Active', `Detected Google Font integrations: ${fonts.join(', ')}`, fontMatches.join('; '));
    }

    // 4. CSS Custom Properties / Design Tokens
    const hasCssVars = html.includes('--') && (html.includes(':root') || html.includes('style'));
    if (hasCssVars) {
      addFinding('DES-008', 'Design System Tokens Detected', 'The application defines modular style configurations using CSS custom properties (variables).', 'Presence of CSS variable names (--*) in code style scopes.');
    }

    return findings;
  }
}
