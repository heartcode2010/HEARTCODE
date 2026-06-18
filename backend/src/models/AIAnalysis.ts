import { Schema, model, Document, Types } from 'mongoose';

export interface ISignal {
  fired: boolean;
  weight: number;
  icon: string;
  label: string;
  detail: string;
}

export interface IAIAnalysis extends Document {
  scanId: Types.ObjectId;
  score: number;
  tools: string[];
  signals: ISignal[];
  createdAt: Date;
}

const SignalSchema = new Schema<ISignal>({
  fired: { type: Boolean, required: true },
  weight: { type: Number, required: true },
  icon: { type: String, required: true },
  label: { type: String, required: true },
  detail: { type: String, default: '' },
});

const AIAnalysisSchema = new Schema<IAIAnalysis>(
  {
    scanId: {
      type: Schema.Types.ObjectId,
      ref: 'Scan',
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
    },
    tools: [{ type: String }],
    signals: [SignalSchema],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AIAnalysis = model<IAIAnalysis>('AIAnalysis', AIAnalysisSchema);
export default AIAnalysis;
