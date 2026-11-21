import { Schema, model, Types, Document } from 'mongoose';

export interface IWalletLedgerEntry extends Document {
  userId: Types.ObjectId;
  direction: 'credit' | 'debit';
  amountKobo: number;
  currency: 'NGN';
  reference: string;
  description: string;
  source: 'paystack' | 'marketplace' | 'subscription' | 'affiliate' | 'admin';
  createdAt: Date;
}

const WalletLedgerSchema = new Schema<IWalletLedgerEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  direction: { type: String, enum: ['credit', 'debit'], required: true },
  amountKobo: { type: Number, required: true, min: 1 },
  currency: { type: String, enum: ['NGN'], default: 'NGN' },
  reference: { type: String, required: true, unique: true },
  description: { type: String, required: true, maxlength: 240 },
  source: { type: String, enum: ['paystack', 'marketplace', 'subscription', 'affiliate', 'admin'], required: true },
}, { timestamps: true });

WalletLedgerSchema.index({ userId: 1, createdAt: -1 });
export const WalletLedger = model<IWalletLedgerEntry>('WalletLedger', WalletLedgerSchema);
export default WalletLedger;
