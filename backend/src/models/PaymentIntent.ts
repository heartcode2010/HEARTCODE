import { Schema, model, Types, Document } from 'mongoose';

export interface IPaymentIntent extends Document {
  userId: Types.ObjectId;
  reference: string;
  amountKobo: number;
  currency: 'NGN';
  provider: 'paystack';
  status: 'pending' | 'success' | 'failed';
  checkoutUrl?: string;
  providerTransactionId?: string;
  verifiedAt?: Date;
  createdAt: Date;
}

const PaymentIntentSchema = new Schema<IPaymentIntent>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reference: { type: String, required: true, unique: true },
  amountKobo: { type: Number, required: true, min: 100000 },
  currency: { type: String, enum: ['NGN'], default: 'NGN' },
  provider: { type: String, enum: ['paystack'], default: 'paystack' },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending', index: true },
  checkoutUrl: String,
  providerTransactionId: String,
  verifiedAt: Date,
}, { timestamps: true });

PaymentIntentSchema.index({ userId: 1, createdAt: -1 });
export const PaymentIntent = model<IPaymentIntent>('PaymentIntent', PaymentIntentSchema);
export default PaymentIntent;
