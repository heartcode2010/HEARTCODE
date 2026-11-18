import { create } from 'zustand';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'code' | 'lab';
  content: string;
  isCompleted: boolean;
  xpReward: number;
}

export interface Course {
  id: string;
  verse: 'cyberverse' | 'blockchainverse' | 'nexora' | 'techverse' | 'eduverse' | 'techlabs';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  duration: string;
  rating: number;
  lessons: Lesson[];
  certUnlocked: boolean;
  xpReward: number;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  verse: string;
  prerequisites: string[];
  isUnlocked: boolean;
  isCompleted: boolean;
  icon: string;
}

const mockCourses: Course[] = [
  {
    id: 'course_websec',
    verse: 'cyberverse',
    title: 'OWASP Top 10 Security Audit Loop',
    description: 'Learn how to perform web audits, trace endpoints, analyze SQL injection, XSS vectors, and prevent security breaches.',
    difficulty: 'beginner',
    duration: '4 hours',
    rating: 4.8,
    certUnlocked: false,
    xpReward: 350,
    lessons: [
      { id: 'l1', title: 'Introduction to Web Audit Loops', duration: '15 min', type: 'video', content: 'Web vulnerability scanners trace structural elements. In CyberVerse, audits connect ports to identify potential leaks.', isCompleted: true, xpReward: 50 },
      { id: 'l2', title: 'SQL Injection Vectors & Exploits', duration: '30 min', type: 'code', content: 'Learn SQL injection vectors. Propose queries to trace backends without permission.', isCompleted: false, xpReward: 100 },
      { id: 'l3', title: 'Cross Site Scripting (XSS) Sanitization', duration: '20 min', type: 'quiz', content: 'Sanitize script tags to avoid injection attacks in inputs.', isCompleted: false, xpReward: 100 },
      { id: 'l4', title: 'Final Audits and Reporting Lab', duration: '45 min', type: 'lab', content: 'Run target test scripts to output a PDF vulnerability report.', isCompleted: false, xpReward: 100 },
    ]
  },
  {
    id: 'course_solidity',
    verse: 'blockchainverse',
    title: 'Solidity Smart Contract Lab',
    description: 'Construct staking protocols, token distribution ledgers, and deploy test tokens directly inside the Technova simulator.',
    difficulty: 'intermediate',
    duration: '6 hours',
    rating: 4.9,
    certUnlocked: false,
    xpReward: 500,
    lessons: [
      { id: 'l_sol1', title: 'Solidity Variables and State', duration: '25 min', type: 'text', content: 'Understand state variables, block metrics, gas restrictions, and address indices.', isCompleted: false, xpReward: 75 },
      { id: 'l_sol2', title: 'Deploying ERC-20 Tokens', duration: '40 min', type: 'code', content: 'Compile and mint test tokens with customize name and supply parameters.', isCompleted: false, xpReward: 125 },
      { id: 'l_sol3', title: 'Staking Math and Logic Audit', duration: '30 min', type: 'lab', content: 'Implement mathematical equations to reward lockers without division rounding exploits.', isCompleted: false, xpReward: 200 },
    ]
  },
  {
    id: 'course_edu_jamb',
    verse: 'eduverse',
    title: 'JAMB / UTME Prep: Mathematics Mastery',
    description: 'Comprehensive lessons and mock exams targeting WAEC, NECO, and JAMB syllabus for Nigerian students.',
    difficulty: 'beginner',
    duration: '10 hours',
    rating: 4.7,
    certUnlocked: false,
    xpReward: 600,
    lessons: [
      { id: 'l_jm1', title: 'Quadratic Equations & Polynomials', duration: '30 min', type: 'video', content: 'Master solving polynomials, roots, and equations for exam questions.', isCompleted: false, xpReward: 80 },
      { id: 'l_jm2', title: 'Logarithms and Indices Shortcuts', duration: '20 min', type: 'quiz', content: 'Quick tips and mathematical methods to save time during computer-based tests.', isCompleted: false, xpReward: 120 },
      { id: 'l_jm3', title: 'CBT Mock Examination 1', duration: '60 min', type: 'quiz', content: 'Timed exam containing 40 questions mapping directly to standard syllabus pools.', isCompleted: false, xpReward: 400 },
    ]
  }
];

const mockSkills: SkillNode[] = [
  { id: 'sk_html', name: 'Web Structure (HTML)', description: 'Master semantic structures', verse: 'techverse', prerequisites: [], isUnlocked: true, isCompleted: true, icon: '🌐' },
  { id: 'sk_css', name: 'Web Style (CSS)', description: 'Harmonious color palettes', verse: 'techverse', prerequisites: ['sk_html'], isUnlocked: true, isCompleted: false, icon: '🎨' },
  { id: 'sk_js', name: 'Logic Control (Javascript)', description: 'Interact with target DOM elements', verse: 'techverse', prerequisites: ['sk_css'], isUnlocked: false, isCompleted: false, icon: '⚡' },
];

interface LearningStoreState {
  courses: Course[];
  skills: SkillNode[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  dailyStreaks: number;
  completedCerts: string[];

  completeLesson: (courseId: string, lessonId: string) => void;
  setLearningStyle: (style: 'visual' | 'auditory' | 'kinesthetic' | 'reading') => void;
  unlockSkill: (skillId: string) => void;
  claimCertificate: (courseId: string) => void;
}

export const useLearningStore = create<LearningStoreState>((set, get) => ({
  courses: mockCourses,
  skills: mockSkills,
  learningStyle: 'reading',
  dailyStreaks: 5,
  completedCerts: [],

  completeLesson: (courseId, lessonId) => {
    set(state => {
      let earnedXP = 0;
      const updatedCourses = state.courses.map(c => {
        if (c.id === courseId) {
          const updatedLessons = c.lessons.map(l => {
            if (l.id === lessonId && !l.isCompleted) {
              earnedXP = l.xpReward;
              return { ...l, isCompleted: true };
            }
            return l;
          });
          const allCompleted = updatedLessons.every(l => l.isCompleted);
          return { ...c, lessons: updatedLessons, certUnlocked: allCompleted };
        }
        return c;
      });
      return { courses: updatedCourses };
    });
  },

  setLearningStyle: (style) => set({ learningStyle: style }),

  unlockSkill: (skillId) => {
    set(state => ({
      skills: state.skills.map(s => s.id === skillId ? { ...s, isUnlocked: true } : s)
    }));
  },

  claimCertificate: (courseId) => {
    set(state => {
      const course = state.courses.find(c => c.id === courseId);
      if (course && course.certUnlocked && !state.completedCerts.includes(course.title)) {
        return { completedCerts: [...state.completedCerts, course.title] };
      }
      return {};
    });
  },
}));
