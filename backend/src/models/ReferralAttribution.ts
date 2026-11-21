import { Schema, model, Types, Document } from 'mongoose';

export interface IReferralAttribution extends Document {
  affiliateId: Types.ObjectId;
  referredUserId: Types.ObjectId;
  referralCode: string;
  attributedAt: Date;
}

const ReferralAttributionSchema = new Schema<IReferralAttribution>({
  affiliateId: { type: Schema.Types.ObjectId, ref: 'Affiliate', required: true, index: true },
  referredUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  referralCode: { type: String, required: true, index: true },
  attributedAt: { type: Date, default: Date.now },
}, { timestamps: true });

ReferralAttributionSchema.index({ affiliateId: 1, attributedAt: -1 });
export const ReferralAttribution = model<IReferralAttribution>('ReferralAttribution', ReferralAttributionSchema);
export default ReferralAttribution;
