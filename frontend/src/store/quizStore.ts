import { create } from 'zustand';
import api from '../services/api';

export interface QuizItem {
  _id?: string;
  title: string;
  description: string;
  category: string;
  accessMode: 'free' | 'paid' | 'subscription' | 'institution';
  price: number;
  tags: string[];
  questions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
  isPublished?: boolean;
  rating?: number;
  reviews?: number;
}

interface QuizStore {
  quizzes: QuizItem[];
  loading: boolean;
  fetchQuizzes: () => Promise<void>;
  createQuiz: (quiz: QuizItem) => Promise<QuizItem | null>;
}

export const useQuizStore = create<QuizStore>((set) => ({
  quizzes: [],
  loading: false,
  fetchQuizzes: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/quizzes');
      set({ quizzes: res.data?.quizzes || [], loading: false });
    } catch {
      set({ loading: false });
    }
  },
  createQuiz: async (quiz) => {
    try {
      const res = await api.post('/quizzes', quiz);
      return res.data?.quiz || null;
    } catch {
      return null;
    }
  },
}));

export default useQuizStore;
