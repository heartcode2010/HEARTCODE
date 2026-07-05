import { create } from 'zustand';

export interface AdminMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  tier: string;
  joinedAt: number;
  lastActive: number;
  totalSpent: number;
  status: 'active' | 'suspended' | 'banned';
}

export interface AdminWithdrawal {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: number;
}

interface AdminStoreState {
  totalRevenue: number;
  monthlyRevenue: number;
  totalUsers: number;
  activeSubscriptions: number;
  marketplaceTransactions: number;
  commissionRevenue: number;
  totalProducts: number;
  totalGigs: number;
  pendingWithdrawals: number;
  revenueHistory: { month: string; amount: number }[];
  users: AdminUser[];
  withdrawals: AdminWithdrawal[];
  topSellers: { name: string; revenue: number; sales: number }[];

  getMetrics: () => AdminMetric[];
  approveWithdrawal: (id: string) => void;
  rejectWithdrawal: (id: string, reason: string) => void;
  suspendUser: (userId: string) => void;
  unsuspendUser: (userId: string) => void;
}

export const useAdminStore = create<AdminStoreState>((set, get) => ({
  totalRevenue: 4_850_000,
  monthlyRevenue: 680_000,
  totalUsers: 12_450,
  activeSubscriptions: 3_200,
  marketplaceTransactions: 8_740,
  commissionRevenue: 485_000,
  totalProducts: 1_240,
  totalGigs: 380,
  pendingWithdrawals: 12,
  revenueHistory: [
    { month: 'Jan', amount: 320000 },
    { month: 'Feb', amount: 410000 },
    { month: 'Mar', amount: 480000 },
    { month: 'Apr', amount: 520000 },
    { month: 'May', amount: 610000 },
    { month: 'Jun', amount: 680000 },
  ],
  users: [
    { id: 'u1', name: 'Chinedu Obi', email: 'chinedu@email.com', tier: 'pro', joinedAt: Date.now() - 7776000000, lastActive: Date.now() - 3600000, totalSpent: 35000, status: 'active' },
    { id: 'u2', name: 'Fatima Musa', email: 'fatima@email.com', tier: 'premium', joinedAt: Date.now() - 5184000000, lastActive: Date.now() - 7200000, totalSpent: 68000, status: 'active' },
    { id: 'u3', name: 'Emeka Nwankwo', email: 'emeka@email.com', tier: 'free', joinedAt: Date.now() - 2592000000, lastActive: Date.now() - 86400000, totalSpent: 5000, status: 'active' },
  ],
  withdrawals: [
    { id: 'wd1', userId: 'u1', userName: 'Chinedu Obi', amount: 25000, bankName: 'OPay', accountNumber: '8012345678', accountName: 'Chinedu Obi', status: 'pending', requestedAt: Date.now() - 43200000 },
    { id: 'wd2', userId: 'u2', userName: 'Fatima Musa', amount: 15000, bankName: 'GTBank', accountNumber: '0123456789', accountName: 'Fatima Musa', status: 'pending', requestedAt: Date.now() - 86400000 },
  ],
  topSellers: [
    { name: 'Ambassador Heartcode', revenue: 285000, sales: 142 },
    { name: 'Fatima Musa', revenue: 124000, sales: 89 },
    { name: 'Chinedu Obi', revenue: 67000, sales: 34 },
  ],

  getMetrics: () => {
    const s = get();
    return [
      { label: 'Total Revenue', value: `₦${s.totalRevenue.toLocaleString()}`, change: '+18%', trend: 'up', icon: '💰' },
      { label: 'Monthly Revenue', value: `₦${s.monthlyRevenue.toLocaleString()}`, change: '+11%', trend: 'up', icon: '📈' },
      { label: 'Total Users', value: s.totalUsers.toLocaleString(), change: '+340', trend: 'up', icon: '👥' },
      { label: 'Active Subscriptions', value: s.activeSubscriptions.toLocaleString(), change: '+8%', trend: 'up', icon: '💳' },
      { label: 'Commission Revenue', value: `₦${s.commissionRevenue.toLocaleString()}`, change: '+22%', trend: 'up', icon: '🏦' },
      { label: 'Marketplace Sales', value: s.marketplaceTransactions.toLocaleString(), change: '+15%', trend: 'up', icon: '🛒' },
      { label: 'Pending Withdrawals', value: s.pendingWithdrawals, trend: 'neutral', icon: '⏳' },
      { label: 'Products Listed', value: s.totalProducts.toLocaleString(), change: '+45', trend: 'up', icon: '📦' },
    ];
  },

  approveWithdrawal: (id) => set(s => ({
    withdrawals: s.withdrawals.map(w => w.id === id ? { ...w, status: 'approved' } : w),
    pendingWithdrawals: Math.max(0, s.pendingWithdrawals - 1),
  })),

  rejectWithdrawal: (id, reason) => set(s => ({
    withdrawals: s.withdrawals.map(w => w.id === id ? { ...w, status: 'rejected' } : w),
    pendingWithdrawals: Math.max(0, s.pendingWithdrawals - 1),
  })),

  suspendUser: (userId) => set(s => ({
    users: s.users.map(u => u.id === userId ? { ...u, status: 'suspended' } : u),
  })),

  unsuspendUser: (userId) => set(s => ({
    users: s.users.map(u => u.id === userId ? { ...u, status: 'active' } : u),
  })),
}));

export default useAdminStore;
