import { create } from 'zustand';

export interface HallmarkMilestone {
  level: string;
  title: string;
  icon: string;
  xpRequired: number;
  unlocksFeatures: string[];
  unlocksAITools: string[];
}

export const HALLMARK_CONFIG: Record<string, HallmarkMilestone[]> = {
  cyberverse: [
    { level: 'novice', title: 'Novice Auditor', icon: '🛡️', xpRequired: 0, unlocksFeatures: ['Port scanner'], unlocksAITools: ['OWASP analysis'] },
    { level: 'specialist', title: 'Defense Specialist', icon: '🔑', xpRequired: 100, unlocksFeatures: ['Endpoint lookup'], unlocksAITools: ['Secret leak scanning'] },
  ],
  blockchainverse: [
    { level: 'novice', title: 'Token Minter', icon: '🪙', xpRequired: 0, unlocksFeatures: ['Deploy tokens'], unlocksAITools: ['Contract helper'] },
  ],
  nexora: [
    { level: 'novice', title: 'Content Creator', icon: '🎨', xpRequired: 0, unlocksFeatures: ['Image editor'], unlocksAITools: ['Resume optimizer'] },
  ],
  techverse: [
    { level: 'novice', title: 'Script Writer', icon: '💻', xpRequired: 0, unlocksFeatures: ['Compile JS'], unlocksAITools: ['Debug code'] },
  ],
  eduverse: [
    { level: 'novice', title: 'Academy Student', icon: '📚', xpRequired: 0, unlocksFeatures: ['WAEC Prep'], unlocksAITools: ['Quiz helper'] },
  ],
  techlabs: [
    { level: 'novice', title: 'App Architect', icon: '🏗️', xpRequired: 0, unlocksFeatures: ['Preview canvas'], unlocksAITools: ['Vite deployment'] },
  ],
};

interface HallmarkProgress {
  level: string;
  xp: number;
}

interface HallmarkStoreState {
  verseProgress: Record<string, HallmarkProgress>;
  addXP: (verse: string, xp: number) => void;
  getProgressPercent: (verse: string) => number;
  getNextMilestone: (verse: string) => HallmarkMilestone | null;
  getVerseMilestone: (verse: string) => HallmarkMilestone | undefined;
  getOverallLevel: () => number;
}

export const useHallmarkStore = create<HallmarkStoreState>((set, get) => ({
  verseProgress: {
    cyberverse: { level: 'novice', xp: 20 },
    blockchainverse: { level: 'novice', xp: 10 },
    nexora: { level: 'novice', xp: 5 },
    techverse: { level: 'novice', xp: 0 },
    eduverse: { level: 'novice', xp: 0 },
    techlabs: { level: 'novice', xp: 0 },
  },

  addXP: (verse, xp) => set(s => {
    const progress = s.verseProgress[verse] || { level: 'novice', xp: 0 };
    const newXP = progress.xp + xp;
    const config = HALLMARK_CONFIG[verse] || [];
    let currentLvl = progress.level;

    for (const milestone of config) {
      if (newXP >= milestone.xpRequired) {
        currentLvl = milestone.level;
      }
    }

    return {
      verseProgress: {
        ...s.verseProgress,
        [verse]: { level: currentLvl, xp: newXP }
      }
    };
  }),

  getProgressPercent: (verse) => {
    const progress = get().verseProgress[verse];
    const next = get().getNextMilestone(verse);
    if (!next || !progress) return 100;
    const currentMilestone = get().getVerseMilestone(verse);
    const baseXP = currentMilestone ? currentMilestone.xpRequired : 0;
    const reqXP = next.xpRequired - baseXP;
    if (reqXP <= 0) return 100;
    return Math.min(100, Math.round(((progress.xp - baseXP) / reqXP) * 100));
  },

  getNextMilestone: (verse) => {
    const progress = get().verseProgress[verse];
    const config = HALLMARK_CONFIG[verse] || [];
    return config.find(m => m.xpRequired > (progress?.xp || 0)) || null;
  },

  getVerseMilestone: (verse) => {
    const progress = get().verseProgress[verse];
    const config = HALLMARK_CONFIG[verse] || [];
    return [...config].reverse().find(m => (progress?.xp || 0) >= m.xpRequired) || config[0];
  },

  getOverallLevel: () => {
    const progress = get().verseProgress;
    const totalXP = Object.values(progress).reduce((acc, current) => acc + current.xp, 0);
    return Math.max(1, Math.floor(totalXP / 100) + 1);
  },
}));

export default useHallmarkStore;
