import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminStore from '../store/adminStore';
import { Shield, Users, Check, X, Search, DollarSign, Wallet, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const admin = useAdminStore();
  const [tab, setTab] = useState<'metrics' | 'withdrawals' | 'users'>('metrics');
  const [search, setSearch] = useState('');

  const filteredUsers = admin.users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans select-none">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-3 cursor-pointer font-mono uppercase tracking-wider">
                <ArrowLeft size={14} /> Back to Hub
              </button>
              <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <Shield size={24} className="text-[#e02840]" /> ADMIN CONTROL CENTER
              </h1>
              <p className="text-xs text-[#6e6868] mt-1">Platform management: approvals, commissions, system metrics, and developer controls.</p>
            </div>
          </div>

          <div className="flex gap-1 mb-8 bg-[#111114] rounded-xl p-1 border border-[#2a2a2e] w-fit">
            {(['metrics', 'withdrawals', 'users'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${tab === t ? 'bg-[#1a1a20] text-white shadow-md' : 'text-[#6e6868] hover:text-white'}`}
              >
                {t === 'withdrawals' ? 'Pending Withdrawals' : t}
              </button>
            ))}
          </div>

          {tab === 'metrics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {admin.getMetrics().map((metric, idx) => (
                  <div key={idx} className="bg-[#111114] border border-[#2a2a2e] p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[0.62rem] font-mono uppercase text-[#6e6868]">{metric.label}</span>
                      <span className="text-sm">{metric.icon}</span>
                    </div>
                    <div className="text-lg font-extrabold text-white">{metric.value}</div>
                    {metric.change && (
                      <span className="text-[0.58rem] font-mono text-[#2ea86a] mt-1 block">
                        {metric.change} vs last month
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl">
                  <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-4">Top Performers / Sellers</h3>
                  <div className="space-y-4">
                    {admin.topSellers.map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-[#0c0c0e] rounded-xl border border-[#1a1a20]">
                        <div>
                          <h4 className="text-xs font-extrabold text-white">{s.name}</h4>
                          <span className="text-[0.58rem] font-mono text-[#6e6868]">{s.sales} products sold</span>
                        </div>
                        <span className="text-xs font-extrabold text-[#2ea86a]">₦{s.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl">
                  <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-4">Revenue Distribution</h3>
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#b0a8a8]">Subscriptions (Vite Containers, AI quotas)</span>
                      <span className="font-extrabold text-white">80%</span>
                    </div>
                    <div className="h-1.5 bg-[#0c0c0e] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] w-[80%]" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#b0a8a8]">Marketplace Commissions (10%)</span>
                      <span className="font-extrabold text-white">15%</span>
                    </div>
                    <div className="h-1.5 bg-[#0c0c0e] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#2ea86a] to-[#10b981] w-[15%]" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#b0a8a8]">Enterprise / Academy Certifications</span>
                      <span className="font-extrabold text-white">5%</span>
                    </div>
                    <div className="h-1.5 bg-[#0c0c0e] rounded-full overflow-hidden">
                      <div className="h-full bg-[#e02840] w-[5%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'withdrawals' && (
            <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl">
              <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-4">Pending Bank Withdrawals</h3>
              {admin.withdrawals.filter(w => w.status === 'pending').length === 0 ? (
                <div className="text-center py-8 text-[#6e6868] text-xs font-mono">No pending withdrawal requests to review.</div>
              ) : (
                <div className="space-y-4">
                  {admin.withdrawals.filter(w => w.status === 'pending').map(wd => (
                    <div key={wd.id} className="p-4 bg-[#0c0c0e] rounded-xl border border-[#1a1a20] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-extrabold text-white">₦{wd.amount.toLocaleString()}</span>
                          <span className="text-[0.58rem] font-mono text-[#6e6868] bg-white/5 px-2 py-0.5 rounded uppercase">{wd.bankName}</span>
                        </div>
                        <p className="text-[0.62rem] text-[#b0a8a8] font-mono">
                          Recipient: {wd.accountName} · Acct: {wd.accountNumber}
                        </p>
                        <span className="text-[0.55rem] font-mono text-[#6e6868] block mt-1">Requested by {wd.userName}</span>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={() => {
                            admin.approveWithdrawal(wd.id);
                            alert('Withdrawal request approved successfully!');
                          }}
                          className="flex-1 md:flex-initial px-4 py-2 bg-gradient-to-r from-[#2ea86a] to-[#10b981] text-white hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Check size={12} /> Approve / Pay
                        </button>
                        <button
                          onClick={() => {
                            const reason = window.prompt('Specify rejection reason:');
                            if (reason !== null) {
                              admin.rejectWithdrawal(wd.id, reason);
                              alert('Withdrawal request rejected.');
                            }
                          }}
                          className="flex-1 md:flex-initial px-4 py-2 bg-transparent border border-[#e02840]/30 text-[#e02840] hover:bg-[#e02840]/5 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <X size={12} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'users' && (
            <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-4">
              <div className="flex items-center bg-[#0c0c0e] border border-[#2a2a2e] px-3 py-2 rounded-xl gap-2 w-full max-w-sm">
                <Search size={14} className="text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search user profile records..."
                  className="bg-transparent border-none outline-none text-xs text-white placeholder-cyber-ash3 w-full"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[0.62rem] font-mono text-[#6e6868] uppercase border-b border-[#2a2a2e]">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Subscription Tier</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-[#1a1a20] hover:bg-white/[0.01]">
                        <td className="p-2 text-white font-semibold">{u.name}</td>
                        <td className="p-2 font-mono text-[#6e6868]">{u.email}</td>
                        <td className="p-2">
                          <span className="bg-white/5 px-2.5 py-0.5 rounded text-[0.58rem] font-mono uppercase font-bold text-[#8b5cf6]">
                            {u.tier}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={`text-[0.58rem] font-mono uppercase ${u.status === 'active' ? 'text-[#2ea86a]' : 'text-[#e02840]'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          {u.status === 'active' ? (
                            <button
                              onClick={() => admin.suspendUser(u.id)}
                              className="text-[0.58rem] font-mono uppercase text-[#e02840] hover:underline cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => admin.unsuspendUser(u.id)}
                              className="text-[0.58rem] font-mono uppercase text-[#2ea86a] hover:underline cursor-pointer"
                            >
                              Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
