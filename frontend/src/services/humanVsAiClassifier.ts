import { CodeClassification } from '../types';

export const humanVsAiClassifier = {
  getClassificationColor(type: 'human' | 'ai' | 'mixed' | 'sensitive'): string {
    switch (type) {
      case 'ai': return 'rgba(255, 0, 85, 0.15)'; // transparent pink
      case 'sensitive': return 'rgba(255, 120, 0, 0.15)'; // transparent orange
      case 'mixed': return 'rgba(0, 204, 204, 0.1)'; // transparent cyan
      default: return 'transparent';
    }
  },

  getClassificationBorder(type: 'human' | 'ai' | 'mixed' | 'sensitive'): string {
    switch (type) {
      case 'ai': return '1px solid var(--red)';
      case 'sensitive': return '1px solid #ff7700';
      case 'mixed': return '1px solid var(--cyan)';
      default: return 'none';
    }
  }
};

export default humanVsAiClassifier;
