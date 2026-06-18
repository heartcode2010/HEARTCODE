import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class TechnologyScanner implements ScannerModule {
  moduleName = 'TechnologyScanner';
  category = 'TECHNOLOGY STACK ANALYSIS';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const html = target.html;

    const add = (cat: string, name: string, evidence: string) => {
      findings.push({
        id: `TECH-${findings.length + 1}`,
        category: this.category,
        severity: 'Informational',
        confidence: 'Firm',
        name: `Technology Detected: ${name}`,
        description: `Identified ${name} (${cat}) in the technology stack.`,
        technicalExplanation: `The scanner matched a known fingerprint (e.g., a specific global variable, HTML attribute, or file path) associated with ${name}.`,
        businessImpact: 'Technology disclosure itself is generally low risk, but it allows attackers to focus their efforts on finding vulnerabilities specific to this technology version.',
        remediation: 'Ensure the identified technology is kept up-to-date with the latest security patches. Where possible, obscure technology footprints.',
        evidence: evidence,
      });
    };

    /* CMS / SITE BUILDERS */
    if (/wp-content|wp-includes|wordpress/i.test(html)) add('CMS', 'WordPress', 'wp-content/wp-includes paths');
    if (/drupal\.js|Drupal\.settings|drupal\/misc/i.test(html)) add('CMS', 'Drupal', 'Drupal.settings or paths');
    if (/joomla|\/components\/com_/i.test(html)) add('CMS', 'Joomla', 'Joomla component paths');
    if (/ghost\.io|content\.ghost\.io|ghost-theme/i.test(html)) add('CMS', 'Ghost', 'Ghost CMS CDN/theme');
    
    /* E-COMMERCE */
    if (/shopify\.com|Shopify\.|cdn\.shopify/i.test(html)) add('E-Commerce', 'Shopify', 'Shopify CDN/JS globals');
    if (/woocommerce|wc-cart|wc-ajax/i.test(html)) add('E-Commerce', 'WooCommerce', 'WooCommerce hooks/classes');
    if (/magento|Mage\.|mage\/|varien\//i.test(html)) add('E-Commerce', 'Magento', 'Magento JS globals/paths');

    /* JS FRAMEWORKS */
    if (/__NEXT_DATA__|_next\/static/i.test(html)) add('Framework', 'Next.js', '__NEXT_DATA__ / _next paths');
    if (/nuxt|__NUXT__|_nuxt\//i.test(html)) add('Framework', 'Nuxt.js', '__NUXT__ global / _nuxt paths');
    if (/data-reactroot|react\.development|react\.production|__REACT/i.test(html)) add('Framework', 'React', 'React DOM markers');
    if (/ng-version|angular\.js|ng-controller|angularjs/i.test(html)) add('Framework', 'Angular', 'ng-version / ng-controller');
    if (/vue\.runtime|__vue__|v-bind:|v-if=|data-v-[a-f0-9]+/i.test(html)) add('Framework', 'Vue.js', 'Vue directives / runtime');
    if (/svelte\.|__svelte|svelte-kit/i.test(html)) add('Framework', 'Svelte', 'Svelte component markers');

    /* JS LIBRARIES */
    const jqMatch = html.match(/jquery[.-]([\d.]+)\.(?:min\.)?js/i);
    if (jqMatch || /\$\.fn\.jquery|\$\(document\)\.ready/i.test(html)) {
      add('Library', 'jQuery' + (jqMatch ? ' v'+jqMatch[1] : ''), 'jQuery detected');
    }
    if (/bootstrap[.-]([\d.]+)|data-bs-|bootstrap\.bundle/i.test(html)) add('Library', 'Bootstrap', 'Bootstrap CSS/JS');
    if (/tailwindcss|tailwind\.config|tw-/i.test(html)) add('Library', 'Tailwind CSS', 'Tailwind class patterns');

    /* SECURITY / CLOUD */
    if (/cloudflare|__cf_email__/i.test(html) || (target.headers && target.headers['server'] && target.headers['server'].toLowerCase().includes('cloudflare'))) {
        add('Infrastructure', 'Cloudflare', 'Cloudflare markers or headers');
    }

    return findings;
  }
}
