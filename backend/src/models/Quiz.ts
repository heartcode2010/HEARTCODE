import { Schema, model, Types, Document } from 'mongoose';

export interface IQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface IQuiz extends Document {
  title: string;
  description: string;
  category: string;
  creatorId: Types.ObjectId;
  accessMode: 'free' | 'paid' | 'subscription' | 'institution';
  price: number;
  tags: string[];
  questions: IQuizQuestion[];
  isPublished: boolean;
  isLive: boolean;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: '' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  category: { type: String, default: 'general' },
});

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'general' },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accessMode: { type: String, enum: ['free', 'paid', 'subscription', 'institution'], default: 'free' },
    price: { type: Number, default: 0 },
    tags: [{ type: String }],
    questions: [QuizQuestionSchema],
    isPublished: { type: Boolean, default: false },
    isLive: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Quiz = model<IQuiz>('Quiz', QuizSchema);
export default Quiz;
