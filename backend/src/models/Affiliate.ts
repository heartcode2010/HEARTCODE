import { Schema, model, Types, Document } from 'mongoose';

export interface IAffiliate extends Document {
  userId: Types.ObjectId;
  referralCode: string;
  referralLink: string;
  commissionRate: number;
  minimumPayout: number;
  totalClicks: number;
  registeredReferrals: number;
  activeReferrals: number;
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarnings: number;
  monthlyEarnings: number;
  status: 'active' | 'suspended';
  withdrawals: Array<{
    amount: number;
    method: string;
    status: 'pending' | 'approved' | 'completed' | 'rejected';
    requestedAt: Date;
    processedAt?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const AffiliateSchema = new Schema<IAffiliate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    referralCode: { type: String, required: true, unique: true, trim: true },
    referralLink: { type: String, required: true },
    commissionRate: { type: Number, default: 0.2 },
    minimumPayout: { type: Number, default: 1000 },
    totalClicks: { type: Number, default: 0 },
    registeredReferrals: { type: Number, default: 0 },
    activeReferrals: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    lifetimeEarnings: { type: Number, default: 0 },
    monthlyEarnings: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    withdrawals: [
      {
        amount: Number,
        method: String,
        status: { type: String, enum: ['pending', 'approved', 'completed', 'rejected'], default: 'pending' },
        requestedAt: { type: Date, default: Date.now },
        processedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export const Affiliate = model<IAffiliate>('Affiliate', AffiliateSchema);
export default Affiliate;
