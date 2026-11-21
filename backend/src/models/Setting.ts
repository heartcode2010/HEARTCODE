import { Schema, model, Document, Types } from 'mongoose';

export interface ISetting extends Document {
  userId: Types.ObjectId;
  defaultView: 'raw' | 'highlighted' | 'stripped';
  enableAutoScan: boolean;
  theme: 'cyberpunk' | 'dark';
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    defaultView: {
      type: String,
      enum: ['raw', 'highlighted', 'stripped'],
      default: 'highlighted',
    },
    enableAutoScan: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      enum: ['cyberpunk', 'dark'],
      default: 'cyberpunk',
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = model<ISetting>('Setting', SettingSchema);
export default Setting;
