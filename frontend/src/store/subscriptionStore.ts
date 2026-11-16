import { create } from 'zustand';

// ─── Subscription Tiers ───
export type SubscriptionTier = 'free' | 'pro' | 'premium' | 'enterprise' | 'education' | 'creator';

export interface TierLimits {
  dailyScans: number;
  aiMessagesPerDay: number;
  storageGB: number;
  maxProjects: number;
  maxCollaborators: number;
  messagingDMs: boolean;
  messagingGroups: boolean;
  messagingChannels: boolean;
  messagingCommunities: boolean;
  messagingCalls: boolean;
  messagingVideoCalls: boolean;
  messagingScreenShare: boolean;
  botCreation: boolean;
  botInstallLimit: number;
  customBots: boolean;
  advancedAI: boolean;
  aiCodeAssist: boolean;
  aiResumeBuilder: boolean;
  aiQuizGen: boolean;
  musicPlayer: boolean;
  focusMode: boolean;
  pomodoroTimer: boolean;
  newsPersonalization: boolean;
  certificates: boolean;
  learningPaths: boolean;
  codePlayground: boolean;
  livePreview: boolean;
  oneClickDeploy: boolean;
  wallpaperVault: boolean;
  cryptoTrading: boolean;
  smartContracts: boolean;
  studioBooking: boolean;
  brandBuilder: boolean;
  referralBonus: number;
  supportLevel: 'community' | 'email' | 'priority' | 'dedicated';
  badge: string;
  price: { monthly: number; yearly: number };
}

// ─── Tier Definitions ───
export const TIER_CONFIG: Record<SubscriptionTier, TierLimits> = {
  free: {
    dailyScans: 5,
    aiMessagesPerDay: 15,
    storageGB: 1,
    maxProjects: 2,
    maxCollaborators: 0,
    messagingDMs: true,
    messagingGroups: false,
    messagingChannels: false,
    messagingCommunities: true,
    messagingCalls: false,
    messagingVideoCalls: false,
    messagingScreenShare: false,
    botCreation: false,
    botInstallLimit: 2,
    customBots: false,
    advancedAI: false,
    aiCodeAssist: false,
    aiResumeBuilder: false,
    aiQuizGen: false,
    musicPlayer: true,
    focusMode: false,
    pomodoroTimer: true,
    newsPersonalization: false,
    certificates: false,
    learningPaths: true,
    codePlayground: true,
    livePreview: false,
    oneClickDeploy: false,
    wallpaperVault: true,
    cryptoTrading: false,
    smartContracts: false,
    studioBooking: false,
    brandBuilder: false,
    referralBonus: 0,
    supportLevel: 'community',
    badge: '🆓',
    price: { monthly: 0, yearly: 0 },
  },
  pro: {
    dailyScans: 15,
    aiMessagesPerDay: 100,
    storageGB: 10,
    maxProjects: 10,
    maxCollaborators: 3,
    messagingDMs: true,
    messagingGroups: true,
    messagingChannels: false,
    messagingCommunities: true,
    messagingCalls: true,
    messagingVideoCalls: false,
    messagingScreenShare: false,
    botCreation: false,
    botInstallLimit: 10,
    customBots: false,
    advancedAI: true,
    aiCodeAssist: true,
    aiResumeBuilder: false,
    aiQuizGen: true,
    musicPlayer: true,
    focusMode: true,
    pomodoroTimer: true,
    newsPersonalization: true,
    certificates: true,
    learningPaths: true,
    codePlayground: true,
    livePreview: true,
    oneClickDeploy: false,
    wallpaperVault: true,
    cryptoTrading: true,
    smartContracts: false,
    studioBooking: false,
    brandBuilder: false,
    referralBonus: 5,
    supportLevel: 'email',
    badge: '⚡',
    price: { monthly: 2500, yearly: 25000 },
  },
  premium: {
    dailyScans: 50,
    aiMessagesPerDay: 500,
    storageGB: 50,
    maxProjects: 50,
    maxCollaborators: 10,
    messagingDMs: true,
    messagingGroups: true,
    messagingChannels: true,
    messagingCommunities: true,
    messagingCalls: true,
    messagingVideoCalls: true,
    messagingScreenShare: true,
    botCreation: true,
    botInstallLimit: 50,
    customBots: true,
    advancedAI: true,
    aiCodeAssist: true,
    aiResumeBuilder: true,
    aiQuizGen: true,
    musicPlayer: true,
    focusMode: true,
    pomodoroTimer: true,
    newsPersonalization: true,
    certificates: true,
    learningPaths: true,
    codePlayground: true,
    livePreview: true,
    oneClickDeploy: true,
    wallpaperVault: true,
    cryptoTrading: true,
    smartContracts: true,
    studioBooking: true,
    brandBuilder: true,
    referralBonus: 10,
    supportLevel: 'priority',
    badge: '💎',
    price: { monthly: 5000, yearly: 50000 },
  },
  enterprise: {
    dailyScans: 999,
    aiMessagesPerDay: 9999,
    storageGB: 500,
    maxProjects: 999,
    maxCollaborators: 100,
    messagingDMs: true,
    messagingGroups: true,
    messagingChannels: true,
    messagingCommunities: true,
    messagingCalls: true,
    messagingVideoCalls: true,
    messagingScreenShare: true,
    botCreation: true,
    botInstallLimit: 999,
    customBots: true,
    advancedAI: true,
    aiCodeAssist: true,
    aiResumeBuilder: true,
    aiQuizGen: true,
    musicPlayer: true,
    focusMode: true,
    pomodoroTimer: true,
    newsPersonalization: true,
    certificates: true,
    learningPaths: true,
    codePlayground: true,
    livePreview: true,
    oneClickDeploy: true,
    wallpaperVault: true,
    cryptoTrading: true,
    smartContracts: true,
    studioBooking: true,
    brandBuilder: true,
    referralBonus: 20,
    supportLevel: 'dedicated',
    badge: '🏢',
    price: { monthly: 15000, yearly: 150000 },
  },
  education: {
    dailyScans: 10,
    aiMessagesPerDay: 200,
    storageGB: 20,
    maxProjects: 20,
    maxCollaborators: 5,
    messagingDMs: true,
    messagingGroups: true,
    messagingChannels: true,
    messagingCommunities: true,
    messagingCalls: true,
    messagingVideoCalls: true,
    messagingScreenShare: true,
    botCreation: false,
    botInstallLimit: 15,
    customBots: false,
    advancedAI: true,
    aiCodeAssist: true,
    aiResumeBuilder: true,
    aiQuizGen: true,
    musicPlayer: true,
    focusMode: true,
    pomodoroTimer: true,
    newsPersonalization: true,
    certificates: true,
    learningPaths: true,
    codePlayground: true,
    livePreview: true,
    oneClickDeploy: false,
    wallpaperVault: true,
    cryptoTrading: false,
    smartContracts: false,
    studioBooking: false,
    brandBuilder: false,
    referralBonus: 10,
    supportLevel: 'email',
    badge: '🎓',
    price: { monthly: 1500, yearly: 15000 },
  },
  creator: {
    dailyScans: 30,
    aiMessagesPerDay: 300,
    storageGB: 100,
    maxProjects: 100,
    maxCollaborators: 20,
    messagingDMs: true,
    messagingGroups: true,
    messagingChannels: true,
    messagingCommunities: true,
    messagingCalls: true,
    messagingVideoCalls: true,
    messagingScreenShare: true,
    botCreation: true,
    botInstallLimit: 30,
    customBots: true,
    advancedAI: true,
    aiCodeAssist: true,
    aiResumeBuilder: true,
    aiQuizGen: true,
    musicPlayer: true,
    focusMode: true,
    pomodoroTimer: true,
    newsPersonalization: true,
    certificates: true,
    learningPaths: true,
    codePlayground: true,
    livePreview: true,
    oneClickDeploy: true,
    wallpaperVault: true,
    cryptoTrading: true,
    smartContracts: true,
    studioBooking: true,
    brandBuilder: true,
    referralBonus: 15,
    supportLevel: 'priority',
    badge: '🎨',
    price: { monthly: 7500, yearly: 75000 },
  },
};

// ─── Payment Providers ───
export type PaymentProvider = 'paystack' | 'flutterwave' | 'stripe';

export interface PaymentConfig {
  provider: PaymentProvider;
  publicKey: string;
  currency: string;
}

// ─── Store Interface ───
interface SubscriptionStoreState {
  tier: SubscriptionTier;
  limits: TierLimits;
  paymentProvider: PaymentProvider;
  isProcessingPayment: boolean;
  dailyUsage: Record<string, number>;

  upgradeTier: (tier: SubscriptionTier) => void;
  resetTier: () => void;
  canAccess: (feature: keyof TierLimits) => boolean;
  getQuota: (feature: keyof TierLimits) => any;
  incrementUsage: (feature: string) => void;
  getRemainingQuota: (feature: string) => number;
  setPaymentProvider: (provider: PaymentProvider) => void;
  initiateCheckout: (tier: SubscriptionTier) => Promise<void>;
  getTierConfig: (tier: SubscriptionTier) => TierLimits;
}

export const useSubscriptionStore = create<SubscriptionStoreState>((set, get) => ({
  tier: (localStorage.getItem('technova-sub-tier') as SubscriptionTier) || 'free',
  limits: TIER_CONFIG[(localStorage.getItem('technova-sub-tier') as SubscriptionTier) || 'free'],
  paymentProvider: (localStorage.getItem('technova-pay-provider') as PaymentProvider) || 'paystack',
  isProcessingPayment: false,
  dailyUsage: JSON.parse(localStorage.getItem('technova-daily-usage') || '{}'),

  upgradeTier: (newTier: SubscriptionTier) => {
    localStorage.setItem('technova-sub-tier', newTier);
    set({ tier: newTier, limits: TIER_CONFIG[newTier] });
  },

  resetTier: () => {
    localStorage.setItem('technova-sub-tier', 'free');
    set({ tier: 'free', limits: TIER_CONFIG.free });
  },

  canAccess: (feature: keyof TierLimits) => {
    const val = get().limits[feature];
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val > 0;
    return true;
  },

  getQuota: (feature: keyof TierLimits) => {
    return get().limits[feature];
  },

  incrementUsage: (feature: string) => {
    const usage = { ...get().dailyUsage };
    usage[feature] = (usage[feature] || 0) + 1;
    localStorage.setItem('technova-daily-usage', JSON.stringify(usage));
    set({ dailyUsage: usage });
  },

  getRemainingQuota: (feature: string) => {
    const limits = get().limits as any;
    const maxVal = limits[feature] || 0;
    const used = get().dailyUsage[feature] || 0;
    return Math.max(0, maxVal - used);
  },

  setPaymentProvider: (provider: PaymentProvider) => {
    localStorage.setItem('technova-pay-provider', provider);
    set({ paymentProvider: provider });
  },

  getTierConfig: (tier: SubscriptionTier) => TIER_CONFIG[tier],

  initiateCheckout: async (targetTier: SubscriptionTier) => {
    set({ isProcessingPayment: true });
    const config = TIER_CONFIG[targetTier];
    const provider = get().paymentProvider;

    try {
      if (provider === 'paystack') {
        // Paystack inline checkout
        const paystackKey = (import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY || '';
        if (!paystackKey) {
          alert('Paystack public key not configured. Add VITE_PAYSTACK_PUBLIC_KEY to .env');
          return;
        }
        const handler = (window as any).PaystackPop?.setup({
          key: paystackKey,
          email: localStorage.getItem('technova-user-email') || 'user@technova.app',
          amount: config.price.monthly * 100, // kobo
          currency: 'NGN',
          ref: `technova_${targetTier}_${Date.now()}`,
          metadata: { tier: targetTier, platform: 'technova' },
          callback: (response: any) => {
            console.log('Payment successful:', response);
            get().upgradeTier(targetTier);
            alert(`Upgraded to ${targetTier.toUpperCase()}! Reference: ${response.reference}`);
          },
          onClose: () => {
            console.log('Payment window closed');
          },
        });
        handler?.openIframe();
      } else if (provider === 'flutterwave') {
        const flutterwaveKey = (import.meta as any).env?.VITE_FLUTTERWAVE_PUBLIC_KEY || '';
        if (!flutterwaveKey) {
          alert('Flutterwave public key not configured. Add VITE_FLUTTERWAVE_PUBLIC_KEY to .env');
          return;
        }
        (window as any).FlutterwaveCheckout?.({
          public_key: flutterwaveKey,
          tx_ref: `technova_${targetTier}_${Date.now()}`,
          amount: config.price.monthly,
          currency: 'NGN',
          payment_options: 'card,banktransfer,ussd,opay',
          customer: {
            email: localStorage.getItem('technova-user-email') || 'user@technova.app',
            name: localStorage.getItem('technova-user-name') || 'Technova User',
          },
          customizations: {
            title: 'TECHNOVA OS',
            description: `Upgrade to ${targetTier.toUpperCase()} plan`,
            logo: '/media/images/technova-logo.png',
          },
          callback: (response: any) => {
            console.log('Flutterwave payment:', response);
            if (response.status === 'successful') {
              get().upgradeTier(targetTier);
              alert(`Upgraded to ${targetTier.toUpperCase()}!`);
            }
          },
          onclose: () => console.log('Flutterwave closed'),
        });
      } else if (provider === 'stripe') {
        const stripeKey = (import.meta as any).env?.VITE_STRIPE_PUBLIC_KEY || '';
        if (!stripeKey) {
          alert('Stripe public key not configured. Add VITE_STRIPE_PUBLIC_KEY to .env');
          return;
        }
        // For Stripe, redirect to checkout session (requires backend)
        alert('Stripe checkout requires backend session. Configure VITE_STRIPE_PUBLIC_KEY and backend endpoint.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
    } finally {
      set({ isProcessingPayment: false });
    }
  },
}));

export default useSubscriptionStore;
