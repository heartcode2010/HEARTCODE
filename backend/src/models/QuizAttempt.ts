import { Schema, model, Types, Document } from 'mongoose';

export interface IQuizAttempt extends Document {
  quizId: Types.ObjectId;
  userId: Types.ObjectId;
  answers: Array<{ questionId: string; selectedIndex: number }>;
  score: number;
  total: number;
  percentage: number;
  submittedAt: Date;
  createdAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  answers: [{ questionId: { type: String, required: true }, selectedIndex: { type: Number, required: true, min: 0, max: 5 } }],
  score: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 1 },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

QuizAttemptSchema.index({ userId: 1, submittedAt: -1 });

export const QuizAttempt = model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
export default QuizAttempt;
