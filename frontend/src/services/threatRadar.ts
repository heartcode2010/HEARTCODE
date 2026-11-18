import { ThreatRadarData } from '../types';

export const threatRadar = {
  getRadarLabels(): string[] {
    return ['Attack Surface', 'Automation Lvl', 'Privacy Exp.', 'Tracking Int.', 'Obfuscation', 'Infra. Complexity'];
  },

  getRadarValues(data: ThreatRadarData | null): number[] {
    if (!data) return [0, 0, 0, 0, 0, 0];
    return [
      data.attackSurface,
      data.aiUsage,
      data.privacyExposure,
      data.trackingIntensity,
      data.obfuscationLevel,
      data.infrastructureComplexity
    ];
  }
};

export default threatRadar;
