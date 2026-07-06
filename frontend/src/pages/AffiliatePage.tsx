import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAffiliateStore } from '../store/affiliateStore';
import { ArrowLeft, Copy, Sparkles, Wallet, TrendingUp, Users } from 'lucide-react';

const AffiliatePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, fetchProfile, requestPayout } = useAffiliateStore();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [copied, setCopied] = useState(false);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const copyLink = async () => {
    if (!profile?.referralLink) return;
    await navigator.clipboard.writeText(profile.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || parsed < 1000) return;
    const ok = await requestPayout(parsed, method);
    if (ok) {
      setAmount('');
      await fetchProfile();
      alert('Payout request submitted.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col">
      <Header />
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={16} /> Back to hub
          </button>
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center gap-2 text-sm text-emerald-300"><Sparkles size={16} /> Affiliate Growth Layer</div>
              <h1 className="mt-4 text-3xl font-semibold">Earn by inviting creators, learners, and teams.</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">Share your referral link, grow a network, and receive commissions from AI credits, courses, and ecosystem purchases.</p>
              <div className="mt-6 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-indigo-200">Your referral code</div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="text-2xl font-semibold">{profile?.referralCode || 'loading...'}</div>
                  <button onClick={copyLink} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/20">
                    <Copy size={14} /> {copied ? 'Copied' : 'Copy link'}
                  </button>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#0f1115] p-4">
                  <div className="flex items-center gap-2 text-slate-400"><Users size={16} /> Referrals</div>
                  <div className="mt-2 text-2xl font-semibold">{profile?.registeredReferrals ?? 0}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0f1115] p-4">
                  <div className="flex items-center gap-2 text-slate-400"><TrendingUp size={16} /> Commission</div>
                  <div className="mt-2 text-2xl font-semibold">{profile?.commissionRate ? `${Math.round(profile.commissionRate * 100)}%` : '20%'}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0f1115] p-4">
                  <div className="flex items-center gap-2 text-slate-400"><Wallet size={16} /> Balance</div>
                  <div className="mt-2 text-2xl font-semibold">₦{(profile?.availableBalance ?? 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
              <h2 className="text-xl font-semibold">Request payout</h2>
              <form onSubmit={handlePayout} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Amount (minimum ₦1,000)</label>
                  <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="1000" className="w-full rounded-2xl border border-white/10 bg-[#0f1115] px-3 py-3 text-sm outline-none focus:border-indigo-400" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Payout method</label>
                  <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0f1115] px-3 py-3 text-sm outline-none focus:border-indigo-400">
                    <option value="bank">Bank transfer</option>
                    <option value="opay">OPay</option>
                    <option value="mobile">Mobile wallet</option>
                  </select>
                </div>
                <button type="submit" className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold transition hover:bg-indigo-400">Submit payout request</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AffiliatePage;
