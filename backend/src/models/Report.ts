import { Schema, model, Document, Types } from 'mongoose';

export interface IReport extends Document {
  scanId: Types.ObjectId;
  userId: Types.ObjectId;
  format: 'html' | 'md' | 'json' | 'csv';
  fileName: string;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    scanId: {
      type: Schema.Types.ObjectId,
      ref: 'Scan',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    format: {
      type: String,
      enum: ['html', 'md', 'json', 'csv'],
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Report = model<IReport>('Report', ReportSchema);
export default Report;
