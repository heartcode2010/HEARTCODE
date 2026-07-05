import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscriptionStore, { SubscriptionTier, TIER_CONFIG } from '../store/subscriptionStore';
import { Shield, Sparkles, Check, Crown, Flame, Zap, Award } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const SubscriptionPlans: React.FC = () => {
  const navigate = useNavigate();
  const { tier, upgradeTier, paymentProvider, setPaymentProvider, initiateCheckout, isProcessingPayment } = useSubscriptionStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectTier = async (selectedTier: SubscriptionTier) => {
    if (selectedTier === 'free') {
      upgradeTier('free');
      alert('Switched to Free Tier');
      return;
    }
    await initiateCheckout(selectedTier);
  };

  const getTierIcon = (t: SubscriptionTier) => {
    switch (t) {
      case 'free': return <Zap size={24} className="text-gray-400" />;
      case 'pro': return <Flame size={24} className="text-[#f59e0b]" />;
      case 'premium': return <Crown size={24} className="text-[#8b5cf6]" />;
      case 'enterprise': return <Shield size={24} className="text-[#e02840]" />;
      case 'education': return <Award size={24} className="text-[#10b981]" />;
      case 'creator': return <Sparkles size={24} className="text-[#ec4899]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans select-none">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-transparent bg-clip-text" style={{ fontFamily: "'Outfit', sans-serif" }}>
              CHOOSE YOUR TECHNOVA VERSE PLAN
            </h1>
            <p className="text-sm text-[#8a8080] max-w-xl mx-auto">
              Unlock dedicated AI quotas, advanced vulnerability scanners, token mints, studio rentals, and production-grade App builders.
            </p>

            <div className="flex justify-center mt-6">
              <div className="bg-[#111114] p-1 rounded-xl border border-[#2a2a2e] flex">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${billingCycle === 'monthly' ? 'bg-[#1a1a20] text-white shadow-md' : 'text-[#6e6868] hover:text-white'}`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${billingCycle === 'yearly' ? 'bg-[#1a1a20] text-white shadow-md' : 'text-[#6e6868] hover:text-white'}`}
                >
                  Yearly Billing (Save 20%)
                </button>
              </div>
            </div>

            <div className="flex justify-center items-center gap-4 mt-6">
              <span className="text-xs font-mono text-[#6e6868] uppercase">Local Checkout Vector:</span>
              <div className="bg-[#111114] p-1 rounded-xl border border-[#2a2a2e] flex gap-1">
                {(['paystack', 'flutterwave', 'stripe'] as const).map(provider => (
                  <button
                    key={provider}
                    onClick={() => setPaymentProvider(provider)}
                    className={`px-3 py-1.5 rounded-lg text-[0.68rem] font-bold uppercase transition-all cursor-pointer ${paymentProvider === provider ? 'bg-[#1a1a20] text-white border border-[#2a2a2e]' : 'text-[#6e6868] hover:text-white'}`}
                  >
                    {provider}
                  </button>
                ))}
              </div>
            </div>
            {paymentProvider !== 'stripe' && (
              <p className="text-[0.68rem] text-[#2ea86a] mt-2 font-mono">
                ✓ Supports OPay, GTBank, Zenith Bank, Card payments, and Bank Transfers
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(TIER_CONFIG) as SubscriptionTier[]).map(t => {
              const config = TIER_CONFIG[t];
              const price = billingCycle === 'monthly' ? config.price.monthly : Math.round(config.price.yearly / 12);
              const isActive = tier === t;

              return (
                <div
                  key={t}
                  className={`bg-[#111114] border rounded-2xl p-6 transition-all hover:scale-[1.01] flex flex-col justify-between ${isActive ? 'border-[#8b5cf6] shadow-[0_8px_32px_rgba(139,92,246,0.15)] bg-gradient-to-b from-[#111114] to-[#15121c]' : 'border-[#2a2a2e] hover:border-[#383842]'}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getTierIcon(t)}
                        <h3 className="font-extrabold capitalize text-sm tracking-wide">{t}</h3>
                      </div>
                      {isActive && (
                        <span className="text-[0.6rem] bg-[#8b5cf6]/20 text-[#a78bfa] border border-[#8b5cf6]/30 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="mb-6">
                      <span className="text-2xl font-bold text-white">₦{price.toLocaleString()}</span>
                      <span className="text-[#6e6868] text-xs font-mono"> / month</span>
                      {billingCycle === 'yearly' && (
                        <div className="text-[0.62rem] text-[#10b981] font-mono mt-1">₦{(config.price.yearly).toLocaleString()} billed yearly</div>
                      )}
                    </div>

                    <div className="space-y-3 mb-8 border-t border-[#1a1a20] pt-4">
                      <div className="flex items-start gap-2 text-xs">
                        <Check size={14} className="text-[#10b981] mt-0.5 flex-shrink-0" />
                        <span>Daily Scans: <strong>{config.dailyScans === 999 ? 'Unlimited' : config.dailyScans}</strong></span>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <Check size={14} className="text-[#10b981] mt-0.5 flex-shrink-0" />
                        <span>AI Messages: <strong>{config.aiMessagesPerDay === 9999 ? 'Unlimited' : config.aiMessagesPerDay}/day</strong></span>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <Check size={14} className="text-[#10b981] mt-0.5 flex-shrink-0" />
                        <span>Storage Limits: <strong>{config.storageGB} GB Storage</strong></span>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <Check size={14} className="text-[#10b981] mt-0.5 flex-shrink-0" />
                        <span>Support: <strong className="capitalize">{config.supportLevel} Support</strong></span>
                      </div>
                      {config.messagingVideoCalls && (
                        <div className="flex items-start gap-2 text-xs">
                          <Check size={14} className="text-[#10b981] mt-0.5 flex-shrink-0" />
                          <span>Unlock Voice & Video Group Calls</span>
                        </div>
                      )}
                      {config.customBots && (
                        <div className="flex items-start gap-2 text-xs">
                          <Check size={14} className="text-[#10b981] mt-0.5 flex-shrink-0" />
                          <span>Custom Bot Platform Unlocked</span>
                        </div>
                      )}
                      {config.aiResumeBuilder && (
                        <div className="flex items-start gap-2 text-xs">
                          <Check size={14} className="text-[#10b981] mt-0.5 flex-shrink-0" />
                          <span>AI Resume Builder Workspace</span>
                        </div>
                      )}
                      {config.oneClickDeploy && (
                        <div className="flex items-start gap-2 text-xs">
                          <Check size={14} className="text-[#10b981] mt-0.5 flex-shrink-0" />
                          <span>One-Click Cloud Deployment</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectTier(t)}
                    disabled={isActive || isProcessingPayment}
                    className={`w-full py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${isActive ? 'bg-[#1a1a20] text-[#6e6868] border border-[#2a2a2e] cursor-not-allowed' : isProcessingPayment ? 'bg-gray-800 text-gray-500 cursor-wait' : 'bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white hover:opacity-90 shadow-md'}`}
                  >
                    {isActive ? 'Active Plan' : isProcessingPayment ? 'Processing...' : `Upgrade with ${paymentProvider}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionPlans;
