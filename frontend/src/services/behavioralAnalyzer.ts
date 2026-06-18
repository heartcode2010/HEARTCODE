import { BehavioralProfile } from '../types';

export const behavioralAnalyzer = {
  getRiskLevelBadge(profile: BehavioralProfile | null): string {
    if (!profile) return 'NONE';
    return profile.behavioralRiskLevel.toUpperCase();
  },

  getTrackingDensityDescriptor(intensity: number): string {
    if (intensity > 75) return 'INTENSIVE TELEMETRY';
    if (intensity > 40) return 'STANDARD ANALYTICS';
    return 'MINIMAL RADAR';
  }
};

export default behavioralAnalyzer;
