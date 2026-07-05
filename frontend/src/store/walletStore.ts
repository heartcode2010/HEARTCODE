import { create } from 'zustand';

export type TransactionType = 'deposit' | 'withdrawal' | 'marketplace_sale' | 'marketplace_purchase' | 'commission' | 'referral_bonus' | 'subscription' | 'tip' | 'refund';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'processing' | 'approved' | 'rejected';
export type WithdrawalStatus = 'pending_review' | 'approved' | 'processing' | 'completed' | 'rejected';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  status: TransactionStatus;
  reference: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  currency: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: WithdrawalStatus;
  adminNote?: string;
  requestedAt: number;
  processedAt?: number;
}

export interface WalletState {
  balance: number;
  pendingEarnings: number;
  withdrawableEarnings: number;
  totalEarned: number;
  totalSpent: number;
  marketplaceRevenue: number;
  referralEarnings: number;
  commissionPaid: number;
  currency: string;
  transactions: Transaction[];
  withdrawalRequests: WithdrawalRequest[];

  addFunds: (amount: number, type: TransactionType, description: string) => void;
  deductFunds: (amount: number, type: TransactionType, description: string) => boolean;
  requestWithdrawal: (amount: number, bankName: string, accountNumber: string, accountName: string) => boolean;
  processMarketplaceSale: (saleAmount: number, productName: string, commissionRate?: number) => void;
  addReferralBonus: (amount: number, referredUser: string) => void;
  getRecentTransactions: (limit?: number) => Transaction[];
  getTransactionsByType: (type: TransactionType) => Transaction[];
}

const COMMISSION_RATE = 0.10; // 10% default platform commission

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 15000,
  pendingEarnings: 3500,
  withdrawableEarnings: 11500,
  totalEarned: 45000,
  totalSpent: 8500,
  marketplaceRevenue: 28000,
  referralEarnings: 5000,
  commissionPaid: 4200,
  currency: 'NGN',
  transactions: [
    {
      id: 'txn_init_1', type: 'marketplace_sale', amount: 5000, currency: 'NGN',
      description: 'Sold "Cybersecurity Fundamentals" course template', status: 'completed',
      reference: `ref_${Date.now() - 86400000}`, timestamp: Date.now() - 86400000,
    },
    {
      id: 'txn_init_2', type: 'subscription', amount: -7500, currency: 'NGN',
      description: 'Pro Plan - Monthly Subscription', status: 'completed',
      reference: `ref_${Date.now() - 172800000}`, timestamp: Date.now() - 172800000,
    },
    {
      id: 'txn_init_3', type: 'referral_bonus', amount: 2500, currency: 'NGN',
      description: 'Referral bonus - Chinedu Obi signed up via your link', status: 'completed',
      reference: `ref_${Date.now() - 259200000}`, timestamp: Date.now() - 259200000,
    },
  ],
  withdrawalRequests: [],

  addFunds: (amount, type, description) => {
    const txn: Transaction = {
      id: `txn_${Date.now()}`, type, amount, currency: 'NGN', description,
      status: 'completed', reference: `ref_${Date.now()}`, timestamp: Date.now(),
    };
    set(s => ({
      balance: s.balance + amount,
      totalEarned: s.totalEarned + amount,
      transactions: [txn, ...s.transactions],
    }));
  },

  deductFunds: (amount, type, description) => {
    const state = get();
    if (state.balance < amount) return false;
    const txn: Transaction = {
      id: `txn_${Date.now()}`, type, amount: -amount, currency: 'NGN', description,
      status: 'completed', reference: `ref_${Date.now()}`, timestamp: Date.now(),
    };
    set(s => ({
      balance: s.balance - amount,
      totalSpent: s.totalSpent + amount,
      transactions: [txn, ...s.transactions],
    }));
    return true;
  },

  requestWithdrawal: (amount, bankName, accountNumber, accountName) => {
    const state = get();
    if (state.withdrawableEarnings < amount || amount < 1000) return false;
    const req: WithdrawalRequest = {
      id: `wd_${Date.now()}`, amount, currency: 'NGN', bankName, accountNumber, accountName,
      status: 'pending_review', requestedAt: Date.now(),
    };
    set(s => ({
      withdrawableEarnings: s.withdrawableEarnings - amount,
      pendingEarnings: s.pendingEarnings + amount,
      withdrawalRequests: [req, ...s.withdrawalRequests],
    }));
    return true;
  },

  processMarketplaceSale: (saleAmount, productName, commissionRate = COMMISSION_RATE) => {
    const commission = Math.round(saleAmount * commissionRate);
    const sellerEarning = saleAmount - commission;
    const saleTxn: Transaction = {
      id: `txn_sale_${Date.now()}`, type: 'marketplace_sale', amount: sellerEarning, currency: 'NGN',
      description: `Sale: ${productName} (₦${saleAmount} - ₦${commission} commission)`,
      status: 'completed', reference: `sale_${Date.now()}`, timestamp: Date.now(),
      metadata: { grossAmount: saleAmount, commission, commissionRate },
    };
    const commTxn: Transaction = {
      id: `txn_comm_${Date.now()}`, type: 'commission', amount: -commission, currency: 'NGN',
      description: `Platform commission on "${productName}"`,
      status: 'completed', reference: `comm_${Date.now()}`, timestamp: Date.now(),
    };
    set(s => ({
      balance: s.balance + sellerEarning,
      withdrawableEarnings: s.withdrawableEarnings + sellerEarning,
      marketplaceRevenue: s.marketplaceRevenue + sellerEarning,
      commissionPaid: s.commissionPaid + commission,
      totalEarned: s.totalEarned + sellerEarning,
      transactions: [saleTxn, commTxn, ...s.transactions],
    }));
  },

  addReferralBonus: (amount, referredUser) => {
    const txn: Transaction = {
      id: `txn_ref_${Date.now()}`, type: 'referral_bonus', amount, currency: 'NGN',
      description: `Referral bonus - ${referredUser} joined via your link`,
      status: 'completed', reference: `ref_bonus_${Date.now()}`, timestamp: Date.now(),
    };
    set(s => ({
      balance: s.balance + amount,
      referralEarnings: s.referralEarnings + amount,
      withdrawableEarnings: s.withdrawableEarnings + amount,
      totalEarned: s.totalEarned + amount,
      transactions: [txn, ...s.transactions],
    }));
  },

  getRecentTransactions: (limit = 20) => get().transactions.slice(0, limit),
  getTransactionsByType: (type) => get().transactions.filter(t => t.type === type),
}));

export default useWalletStore;
