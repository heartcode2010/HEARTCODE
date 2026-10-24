import { create } from 'zustand';
import api from '../services/api';

export interface AffiliateProfile {
  _id?: string;
  userId?: string;
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
    status: string;
    requestedAt: string;
  }>;
}

interface AffiliateStore {
  profile: AffiliateProfile | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  applyReferral: (code: string) => Promise<boolean>;
  requestPayout: (amount: number, method: string) => Promise<boolean>;
}

export const useAffiliateStore = create<AffiliateStore>((set) => ({
  profile: null,
  loading: false,
  fetchProfile: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/affiliate/me');
      set({ profile: res.data?.affiliate || null, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  applyReferral: async (code) => {
    try {
      await api.post('/affiliate/apply', { code });
      return true;
    } catch {
      return false;
    }
  },
  requestPayout: async (amount, method) => {
    try {
      const res = await api.post('/affiliate/payout', { amount, method });
      set({ profile: res.data?.affiliate || null });
      return true;
    } catch {
      return false;
    }
  },
}));

export default useAffiliateStore;
