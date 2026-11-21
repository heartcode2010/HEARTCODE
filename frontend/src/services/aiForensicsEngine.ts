import { AIForensicsResult } from '../types';

export const aiForensicsEngine = {
  getContributionBreakdown(result: AIForensicsResult | null) {
    if (!result) return { human: 100, ai: 0 };
    return {
      human: result.humanVsAiRatio,
      ai: 100 - result.humanVsAiRatio
    };
  },

  getAILikelihood(score: number): 'CERTAIN' | 'PROBABLE' | 'SUSPICIOUS' | 'UNLIKELY' {
    if (score > 80) return 'CERTAIN';
    if (score > 50) return 'PROBABLE';
    if (score > 20) return 'SUSPICIOUS';
    return 'UNLIKELY';
  }
};

export default aiForensicsEngine;
