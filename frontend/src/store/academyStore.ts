import { create } from 'zustand';
import type {
  AcademySection,
  LearningProgress,
  TutorMessage,
  TutorMode,
  PhishingLabState,
  QuizResult,
  Badge,
  Achievement,
  ScamAnalysis,
  SafetyScorecard,
  CertificateData,
} from '../types';

// ══════════════════════════════════════════════════════════════════════════════
// Academy Store — manages all Cyber Academy state
// Completely independent from scanStore and intelligenceStore
// ══════════════════════════════════════════════════════════════════════════════

interface AcademyState {
  // ── Navigation ──
  activeSection: AcademySection;

  // ── Learning Progress ──
  progress: LearningProgress;

  // ── Tutor ──
  tutorMode: TutorMode;
  tutorMessages: TutorMessage[];
  tutorLoading: boolean;

  // ── Phishing Lab ──
  phishingLab: PhishingLabState;

  // ── Quiz / Challenges ──
  quizResults: QuizResult[];
  currentQuizIndex: number;

  // ── Badges & Achievements ──
  badges: Badge[];
  achievements: Achievement[];

  // ── Scam Detector ──
  scamAnalyses: ScamAnalysis[];
  scamLoading: boolean;

  // ── Safety Scorecard ──
  safetyScorecard: SafetyScorecard | null;

  // ── Certificates ──
  certificates: CertificateData[];

  // ── Actions ──
  setActiveSection: (section: AcademySection) => void;
  updateProgress: (update: Partial<LearningProgress>) => void;
  addXP: (amount: number) => void;

  // Tutor
  setTutorMode: (mode: TutorMode) => void;
  addTutorMessage: (msg: TutorMessage) => void;
  setTutorLoading: (loading: boolean) => void;
  clearTutorMessages: () => void;

  // Phishing Lab
  updatePhishingLab: (update: Partial<PhishingLabState>) => void;
  resetPhishingLab: () => void;

  // Quizzes
  addQuizResult: (result: QuizResult) => void;

  // Badges
  earnBadge: (badgeId: string) => void;
  unlockAchievement: (achievementId: string) => void;

  // Scam Detector
  addScamAnalysis: (analysis: ScamAnalysis) => void;
  setScamLoading: (loading: boolean) => void;

  // Safety
  setSafetyScorecard: (scorecard: SafetyScorecard) => void;

  // Certificates
  addCertificate: (cert: CertificateData) => void;

  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

// ── XP Level Thresholds ──
const XP_PER_LEVEL = 500;
const calcLevel = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

// ── Default Badges ──
const DEFAULT_BADGES: Badge[] = [
  { id: 'security-explorer', name: 'Security Explorer', description: 'Complete your first learning module', icon: '🔍', tier: 'bronze', requirement: 'Complete 1 module', earned: false },
  { id: 'threat-hunter', name: 'Threat Hunter', description: 'Pass 5 quizzes', icon: '🎯', tier: 'silver', requirement: 'Pass 5 quizzes', earned: false },
  { id: 'infrastructure-analyst', name: 'Infrastructure Analyst', description: 'Complete the Web Security labs', icon: '🏗️', tier: 'silver', requirement: 'Complete web security labs', earned: false },
  { id: 'cyber-investigator', name: 'Cyber Investigator', description: 'Achieve a safety score above 80', icon: '🕵️', tier: 'gold', requirement: 'Safety score > 80', earned: false },
  { id: 'phishing-detector', name: 'Phishing Detector', description: 'Get 10 correct in phishing lab', icon: '🐟', tier: 'silver', requirement: '10 correct phishing detections', earned: false },
  { id: 'scam-buster', name: 'Scam Buster', description: 'Analyze 5 potential scams', icon: '🛡️', tier: 'gold', requirement: 'Analyze 5 scams', earned: false },
  { id: 'certified-defender', name: 'Certified Defender', description: 'Earn your first certificate', icon: '📜', tier: 'platinum', requirement: 'Earn 1 certificate', earned: false },
  { id: 'streak-master', name: 'Streak Master', description: 'Maintain a 7-day learning streak', icon: '🔥', tier: 'gold', requirement: '7-day streak', earned: false },
];

// ── Default Achievements ──
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'First Steps', description: 'Complete your first lesson', category: 'learning', xpReward: 50, unlocked: false, progress: 0, target: 1 },
  { id: 'quiz-ace', title: 'Quiz Ace', description: 'Score 100% on a quiz', category: 'quiz', xpReward: 100, unlocked: false, progress: 0, target: 1 },
  { id: 'module-master', title: 'Module Master', description: 'Complete 5 learning modules', category: 'learning', xpReward: 200, unlocked: false, progress: 0, target: 5 },
  { id: 'phishing-pro', title: 'Phishing Pro', description: 'Identify 20 phishing attempts', category: 'phishing', xpReward: 150, unlocked: false, progress: 0, target: 20 },
  { id: 'knowledge-seeker', title: 'Knowledge Seeker', description: 'Use the AI Tutor 10 times', category: 'tutor', xpReward: 100, unlocked: false, progress: 0, target: 10 },
];

const INITIAL_PROGRESS: LearningProgress = {
  modulesCompleted: 0,
  totalModules: 15,
  quizzesPassed: 0,
  totalQuizzes: 0,
  badgesEarned: [],
  certificatesEarned: [],
  streakDays: 0,
  totalXP: 0,
  level: 1,
  lastActivity: new Date().toISOString(),
};

const INITIAL_PHISHING: PhishingLabState = {
  currentSample: null,
  answeredCorrectly: 0,
  answeredIncorrectly: 0,
  totalAttempted: 0,
  currentStreak: 0,
  bestStreak: 0,
  score: 0,
};

const STORAGE_KEY = 'heartcode-academy';

export const useAcademyStore = create<AcademyState>((set, get) => ({
  // ── Initial State ──
  activeSection: 'landing',
  progress: { ...INITIAL_PROGRESS },
  tutorMode: 'beginner',
  tutorMessages: [],
  tutorLoading: false,
  phishingLab: { ...INITIAL_PHISHING },
  quizResults: [],
  currentQuizIndex: 0,
  badges: DEFAULT_BADGES.map(b => ({ ...b })),
  achievements: DEFAULT_ACHIEVEMENTS.map(a => ({ ...a })),
  scamAnalyses: [],
  scamLoading: false,
  safetyScorecard: null,
  certificates: [],

  // ── Navigation ──
  setActiveSection: (section) => set({ activeSection: section }),

  // ── Progress ──
  updateProgress: (update) => set((s) => ({
    progress: { ...s.progress, ...update, lastActivity: new Date().toISOString() },
  })),

  addXP: (amount) => set((s) => {
    const newXP = s.progress.totalXP + amount;
    return {
      progress: {
        ...s.progress,
        totalXP: newXP,
        level: calcLevel(newXP),
        lastActivity: new Date().toISOString(),
      },
    };
  }),

  // ── Tutor ──
  setTutorMode: (mode) => set({ tutorMode: mode }),
  addTutorMessage: (msg) => set((s) => ({
    tutorMessages: [...s.tutorMessages, msg],
  })),
  setTutorLoading: (loading) => set({ tutorLoading: loading }),
  clearTutorMessages: () => set({ tutorMessages: [] }),

  // ── Phishing Lab ──
  updatePhishingLab: (update) => set((s) => ({
    phishingLab: { ...s.phishingLab, ...update },
  })),
  resetPhishingLab: () => set({ phishingLab: { ...INITIAL_PHISHING } }),

  // ── Quizzes ──
  addQuizResult: (result) => set((s) => {
    const newResults = [...s.quizResults, result];
    const passed = newResults.filter(r => r.passed).length;
    return {
      quizResults: newResults,
      progress: {
        ...s.progress,
        quizzesPassed: passed,
        totalQuizzes: newResults.length,
      },
    };
  }),

  // ── Badges ──
  earnBadge: (badgeId) => set((s) => ({
    badges: s.badges.map(b =>
      b.id === badgeId ? { ...b, earned: true, earnedAt: new Date().toISOString() } : b
    ),
    progress: {
      ...s.progress,
      badgesEarned: [...new Set([...s.progress.badgesEarned, badgeId])],
    },
  })),

  unlockAchievement: (achievementId) => set((s) => ({
    achievements: s.achievements.map(a =>
      a.id === achievementId ? { ...a, unlocked: true, progress: a.target } : a
    ),
  })),

  // ── Scam Detector ──
  addScamAnalysis: (analysis) => set((s) => ({
    scamAnalyses: [analysis, ...s.scamAnalyses].slice(0, 50),
  })),
  setScamLoading: (loading) => set({ scamLoading: loading }),

  // ── Safety ──
  setSafetyScorecard: (scorecard) => set({ safetyScorecard: scorecard }),

  // ── Certificates ──
  addCertificate: (cert) => set((s) => ({
    certificates: [...s.certificates, cert],
    progress: {
      ...s.progress,
      certificatesEarned: [...new Set([...s.progress.certificatesEarned, cert.id])],
    },
  })),

  // ── Persistence ──
  saveToLocalStorage: () => {
    const s = get();
    try {
      const data = {
        progress: s.progress,
        quizResults: s.quizResults,
        badges: s.badges,
        achievements: s.achievements,
        scamAnalyses: s.scamAnalyses,
        safetyScorecard: s.safetyScorecard,
        certificates: s.certificates,
        phishingLab: { ...s.phishingLab, currentSample: null },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* quota exceeded — silent fail */ }
  },

  loadFromLocalStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      set({
        progress: { ...INITIAL_PROGRESS, ...data.progress },
        quizResults: data.quizResults || [],
        badges: data.badges || DEFAULT_BADGES.map(b => ({ ...b })),
        achievements: data.achievements || DEFAULT_ACHIEVEMENTS.map(a => ({ ...a })),
        scamAnalyses: data.scamAnalyses || [],
        safetyScorecard: data.safetyScorecard || null,
        certificates: data.certificates || [],
        phishingLab: data.phishingLab || { ...INITIAL_PHISHING },
      });
    } catch { /* corrupted data — silent fail */ }
  },
}));

export default useAcademyStore;
