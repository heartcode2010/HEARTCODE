import React, { useState } from 'react';
import { X, Check, Shield, Zap, Sparkles, CreditCard } from 'lucide-react';
import useSubscriptionStore, { SubscriptionTier } from '../../store/subscriptionStore';

interface SubscriptionUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredTier?: SubscriptionTier;
  featureName?: string;
}

export const SubscriptionUpgradeModal: React.FC<SubscriptionUpgradeModalProps> = ({
  isOpen,
  onClose,
  requiredTier = 'pro',
  featureName = 'this premium feature'
}) => {
  const { tier, upgradeTier } = useSubscriptionStore();
  const [loadingTier, setLoadingTier] = useState<SubscriptionTier | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = (selectedTier: SubscriptionTier) => {
    setLoadingTier(selectedTier);
    setTimeout(() => {
      upgradeTier(selectedTier);
      setLoadingTier(null);
      onClose();
    }, 1200);
  };

  const plans = [
    {
      id: 'free' as const,
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      color: '#6e6868',
      accentColor: 'rgba(110, 104, 104, 0.2)',
      features: [
        '5 CyberVerse scans per day',
        'Basic BlockchainVerse modules',
        'Standard static Nexora booking',
        'Basic TechVerse tutorials',
        'Less cool Wallpaper vault downloads'
      ]
    },
    {
      id: 'pro' as const,
      name: 'Technova Pro',
      price: '$19',
      period: 'month',
      color: '#8b5cf6',
      accentColor: 'rgba(139, 92, 246, 0.2)',
      popular: true,
      features: [
        'Unlimited CyberVerse scans',
        'Full Smart Contract Lab access',
        'Nexora AI Content Generator',
        'Interactive TechVerse code labs',
        'EduVerse AI exam predictions',
        'Pro wallpapers & templates'
      ]
    },
    {
      id: 'premium' as const,
      name: 'Technova Premium',
      price: '$49',
      period: 'month',
      color: '#00d4ff',
      accentColor: 'rgba(0, 212, 255, 0.2)',
      features: [
        'Everything in Pro tier',
        'All AI Mentors (Tech, Crypto, Nexora)',
        'Full Nexora Vault protection',
        'Unlimited TechLabs container deploys',
        'Unlimited 4K premium wallpapers',
        'Priority withdrawal approval & support'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#111114] border border-[#2a2a2e] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2e] bg-[#0c0c0e]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#8b5cf6]" />
              <h2 className="text-lg font-bold text-white font-display" style={{ fontFamily: "'Outfit', sans-serif" }}>UPGRADE YOUR TECHNOVA SUITE</h2>
            </div>
            {featureName && (
              <p className="text-xs text-[#6e6868] mt-1 font-mono">
                Upgrade required to unlock: <span className="text-[#8b5cf6] font-semibold">{featureName}</span>
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-1 text-[#6e6868] hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {plans.map((plan) => {
            const isCurrent = tier === plan.id;
            const isTarget = plan.id === 'pro' || plan.id === 'premium';
            return (
              <div
                key={plan.id}
                className="bg-[#141416] border rounded-xl p-5 relative flex flex-col justify-between transition-all hover:scale-[1.02]"
                style={{
                  borderColor: plan.popular ? plan.color : '#2a2a2e',
                  boxShadow: plan.popular ? `0 8px 32px ${plan.accentColor}` : 'none'
                }}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#8b5cf6] text-white text-[0.55rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#6e6868]">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2 mb-4">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-[0.68rem] text-[#6e6868] font-mono">/{plan.period}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-[0.68rem] text-[#b0a8a8] leading-relaxed">
                        <Check size={12} className="mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isCurrent || loadingTier !== null}
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-transparent border border-[#2a2a2e] text-[#6e6868] cursor-default'
                      : loadingTier === plan.id
                      ? 'bg-[#1a1a20] text-white opacity-50 cursor-wait'
                      : plan.popular
                      ? 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  {isCurrent ? (
                    'Current Plan'
                  ) : loadingTier === plan.id ? (
                    'Upgrading...'
                  ) : (
                    <>
                      <CreditCard size={12} /> Select Plan
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
