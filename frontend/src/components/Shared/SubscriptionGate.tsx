import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscriptionStore, { SubscriptionTier } from '../../store/subscriptionStore';
import { ShieldAlert, ArrowLeft, Crown } from 'lucide-react';

interface SubscriptionGateProps {
  children: React.ReactNode;
  requiredTier?: SubscriptionTier;
  feature?: string;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  children,
  requiredTier = 'pro',
  feature,
}) => {
  const navigate = useNavigate();
  const { tier } = useSubscriptionStore();

  const tiers: SubscriptionTier[] = ['free', 'pro', 'premium', 'enterprise', 'education', 'creator'];
  const userTierIndex = tiers.indexOf(tier);
  const requiredTierIndex = tiers.indexOf(requiredTier);

  const hasAccess = userTierIndex >= requiredTierIndex;

  if (!hasAccess) {
    return (
      <div className="min-h-[300px] bg-[#111114] border border-[#2a2a2e] rounded-2xl p-8 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-12 font-sans select-none">
        <ShieldAlert size={48} className="text-[#e02840] mb-4 animate-bounce" />
        <h2 className="text-lg font-bold text-white mb-2 uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Feature Locked
        </h2>
        <p className="text-xs text-[#b0a8a8] leading-relaxed mb-6">
          Accessing {feature ? `"${feature}"` : 'this workspace section'} requires a **{requiredTier.toUpperCase()}** plan. Your current subscription tier is **{tier.toUpperCase()}**.
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-2.5 border border-[#2a2a2e] hover:bg-white/5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-white flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={14} /> Back to Hub
          </button>
          <button
            onClick={() => navigate('/subscription-plans')}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Crown size={14} /> Upgrade Plan
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGate;
