import { DOMSurveillanceResult } from '../types';

export const domSurveillance = {
  getSeverityColor(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'critical': return 'var(--red)';
      case 'high': return '#ff7700';
      case 'medium': return '#ffcc00';
      default: return 'var(--cyan)';
    }
  },

  getSummary(result: DOMSurveillanceResult | null) {
    if (!result) return 'DOM secure. No dynamic injections detected.';
    return `Surveillance: ${result.hiddenElements.length} hidden layouts, ${result.injectedIframes.length} custom iframes, ${result.shadowDomCount} shadow subtrees detected.`;
  }
};

export default domSurveillance;
