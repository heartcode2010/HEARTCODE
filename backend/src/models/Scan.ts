import { Schema, model, Document, Types } from 'mongoose';

export interface IScan extends Document {
  url: string;
  userId: Types.ObjectId;
  htmlSource: string;
  size: string;
  lines: number;
  tagsCount: number;
  scriptsCount: number;
  stylesCount: number;
  imagesCount: number;
  headers: Record<string, string>;
  createdAt: Date;
}

const ScanSchema = new Schema<IScan>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    htmlSource: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    lines: {
      type: Number,
      required: true,
    },
    tagsCount: {
      type: Number,
      required: true,
    },
    scriptsCount: {
      type: Number,
      required: true,
    },
    stylesCount: {
      type: Number,
      required: true,
    },
    imagesCount: {
      type: Number,
      required: true,
    },
    headers: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Scan = model<IScan>('Scan', ScanSchema);
export default Scan;
