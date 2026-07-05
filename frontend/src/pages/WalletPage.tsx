import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWalletStore from '../store/walletStore';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, DollarSign, Users, TrendingUp, ArrowLeft, CreditCard, Building2 } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const w = useWalletStore();
  const [tab, setTab] = useState<'overview' | 'transactions' | 'withdraw'>('overview');
  const [wdAmount, setWdAmount] = useState('');
  const [wdBank, setWdBank] = useState('OPay');
  const [wdAccount, setWdAccount] = useState('');
  const [wdName, setWdName] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(wdAmount);
    if (!amt || amt < 1000) { alert('Minimum withdrawal is ₦1,000'); return; }
    const success = w.requestWithdrawal(amt, wdBank, wdAccount, wdName);
    if (success) { alert(`Withdrawal of ₦${amt.toLocaleString()} submitted for review!`); setWdAmount(''); setWdAccount(''); setWdName(''); }
    else alert('Insufficient withdrawable balance.');
  };

  const statusIcon = (s: string) => {
    if (s === 'completed') return <CheckCircle size={12} className="text-[#2ea86a]" />;
    if (s === 'pending' || s === 'processing' || s === 'pending_review') return <Clock size={12} className="text-[#f59e0b]" />;
    return <XCircle size={12} className="text-[#e02840]" />;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-6 cursor-pointer font-mono uppercase tracking-wider">
            <ArrowLeft size={14} /> Back to Hub
          </button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Balance', value: `₦${w.balance.toLocaleString()}`, icon: <Wallet size={20} className="text-[#00d4ff]" />, color: '#00d4ff' },
              { label: 'Withdrawable', value: `₦${w.withdrawableEarnings.toLocaleString()}`, icon: <ArrowUpRight size={20} className="text-[#2ea86a]" />, color: '#2ea86a' },
              { label: 'Pending', value: `₦${w.pendingEarnings.toLocaleString()}`, icon: <Clock size={20} className="text-[#f59e0b]" />, color: '#f59e0b' },
              { label: 'Total Earned', value: `₦${w.totalEarned.toLocaleString()}`, icon: <TrendingUp size={20} className="text-[#8b5cf6]" />, color: '#8b5cf6' },
            ].map((card, idx) => (
              <div key={idx} className="bg-[#111114] border border-[#2a2a2e] p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">{card.icon}<span className="text-[0.62rem] font-mono uppercase text-[#6e6868]">{card.label}</span></div>
                <div className="text-lg font-extrabold text-white">{card.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Marketplace Revenue', value: `₦${w.marketplaceRevenue.toLocaleString()}`, icon: '🛒' },
              { label: 'Referral Earnings', value: `₦${w.referralEarnings.toLocaleString()}`, icon: '🔗' },
              { label: 'Commission Paid', value: `₦${w.commissionPaid.toLocaleString()}`, icon: '🏦' },
              { label: 'Total Spent', value: `₦${w.totalSpent.toLocaleString()}`, icon: '💸' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#111114] border border-[#2a2a2e] p-4 rounded-xl text-center">
                <span className="text-lg block mb-1">{stat.icon}</span>
                <div className="text-[0.58rem] font-mono text-[#6e6868] uppercase mb-1">{stat.label}</div>
                <div className="text-xs font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-1 mb-6 bg-[#111114] rounded-xl p-1 border border-[#2a2a2e] w-fit">
            {(['overview', 'transactions', 'withdraw'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${tab === t ? 'bg-[#1a1a20] text-white shadow-md' : 'text-[#6e6868] hover:text-white'}`}>
                {t === 'withdraw' ? 'Withdraw Funds' : t}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl">
              <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {w.getRecentTransactions(10).map(txn => (
                  <div key={txn.id} className="flex items-center justify-between p-3 bg-[#0c0c0e] rounded-xl border border-[#1a1a20]">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${txn.amount >= 0 ? 'bg-[#2ea86a]/10' : 'bg-[#e02840]/10'}`}>
                        {txn.amount >= 0 ? <ArrowDownLeft size={14} className="text-[#2ea86a]" /> : <ArrowUpRight size={14} className="text-[#e02840]" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{txn.description}</p>
                        <span className="text-[0.58rem] font-mono text-[#6e6868]">{new Date(txn.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-extrabold ${txn.amount >= 0 ? 'text-[#2ea86a]' : 'text-[#e02840]'}`}>
                        {txn.amount >= 0 ? '+' : ''}₦{Math.abs(txn.amount).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1 justify-end mt-0.5">{statusIcon(txn.status)}<span className="text-[0.55rem] font-mono text-[#6e6868] capitalize">{txn.status}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'transactions' && (
            <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl">
              <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-4">Full Transaction Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="text-[0.62rem] font-mono text-[#6e6868] uppercase border-b border-[#2a2a2e]">
                    <th className="text-left p-2">Date</th><th className="text-left p-2">Type</th><th className="text-left p-2">Description</th><th className="text-right p-2">Amount</th><th className="text-center p-2">Status</th>
                  </tr></thead>
                  <tbody>
                    {w.transactions.map(txn => (
                      <tr key={txn.id} className="border-b border-[#1a1a20] hover:bg-white/[0.01]">
                        <td className="p-2 font-mono text-[#6e6868]">{new Date(txn.timestamp).toLocaleDateString()}</td>
                        <td className="p-2"><span className="bg-white/5 px-2 py-0.5 rounded text-[0.58rem] font-mono uppercase">{txn.type.replace('_', ' ')}</span></td>
                        <td className="p-2 text-white">{txn.description}</td>
                        <td className={`p-2 text-right font-bold ${txn.amount >= 0 ? 'text-[#2ea86a]' : 'text-[#e02840]'}`}>{txn.amount >= 0 ? '+' : ''}₦{Math.abs(txn.amount).toLocaleString()}</td>
                        <td className="p-2 text-center">{statusIcon(txn.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'withdraw' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleWithdraw} className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Request Withdrawal</h3>
                <div className="bg-[#0c0c0e] border border-[#2a2a2e] p-4 rounded-xl mb-4">
                  <span className="text-[0.58rem] font-mono text-[#6e6868]">Available Balance</span>
                  <div className="text-xl font-extrabold text-[#2ea86a]">₦{w.withdrawableEarnings.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Amount (₦)</label>
                  <input type="number" value={wdAmount} onChange={(e) => setWdAmount(e.target.value)} min="1000" placeholder="Minimum ₦1,000" className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white" required />
                </div>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Bank / Wallet</label>
                  <select value={wdBank} onChange={(e) => setWdBank(e.target.value)} className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none text-white">
                    <option value="OPay">OPay</option>
                    <option value="GTBank">GTBank</option>
                    <option value="Zenith Bank">Zenith Bank</option>
                    <option value="Access Bank">Access Bank</option>
                    <option value="First Bank">First Bank</option>
                    <option value="UBA">UBA</option>
                    <option value="Kuda">Kuda</option>
                    <option value="PalmPay">PalmPay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Account Number</label>
                  <input type="text" value={wdAccount} onChange={(e) => setWdAccount(e.target.value)} placeholder="Enter account number" className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white" required />
                </div>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Account Name</label>
                  <input type="text" value={wdName} onChange={(e) => setWdName(e.target.value)} placeholder="Account holder name" className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white" required />
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#2ea86a] to-[#10b981] hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5">
                  <Building2 size={14} /> Submit Withdrawal Request
                </button>
              </form>

              <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl">
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-4">Withdrawal History</h3>
                {w.withdrawalRequests.length === 0 ? (
                  <div className="text-center py-8 text-[#6e6868] text-xs font-mono">No withdrawal requests yet.</div>
                ) : (
                  <div className="space-y-3">
                    {w.withdrawalRequests.map(wd => (
                      <div key={wd.id} className="p-3 bg-[#0c0c0e] rounded-xl border border-[#1a1a20]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-white">₦{wd.amount.toLocaleString()}</span>
                          <span className={`text-[0.58rem] font-mono uppercase px-2 py-0.5 rounded ${wd.status === 'completed' ? 'bg-[#2ea86a]/10 text-[#2ea86a]' : wd.status === 'rejected' ? 'bg-[#e02840]/10 text-[#e02840]' : 'bg-[#f59e0b]/10 text-[#f59e0b]'}`}>{wd.status.replace('_', ' ')}</span>
                        </div>
                        <span className="text-[0.58rem] font-mono text-[#6e6868]">{wd.bankName} · {wd.accountNumber} · {new Date(wd.requestedAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WalletPage;
