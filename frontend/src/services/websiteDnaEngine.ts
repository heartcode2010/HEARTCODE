import { WebsiteDNAProfile } from '../types';

export const websiteDnaEngine = {
  getArchitectureBadge(profile: WebsiteDNAProfile | null): string {
    if (!profile) return 'UNKNOWN';
    return profile.architectureSignature.toUpperCase();
  },

  getDevelopmentStyleBadge(profile: WebsiteDNAProfile | null): string {
    if (!profile) return 'STANDARD';
    return profile.developmentStyle.toUpperCase();
  },

  getIndicators(profile: WebsiteDNAProfile | null) {
    if (!profile) return [];
    return [
      { label: 'Architecture', value: profile.architectureSignature, confidence: 95, icon: '🏛️' },
      { label: 'Style Engine', value: profile.developmentStyle, confidence: 90, icon: '🎨' },
      { label: 'Team Footprint', value: profile.estimatedTeamSize, confidence: 70, icon: '👥' },
      { label: 'Pattern Signal', value: `${profile.aiContributionLevel}%`, confidence: 85, icon: '📊' },
    ];
  }
};

export default websiteDnaEngine;
