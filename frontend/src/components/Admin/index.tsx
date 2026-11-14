import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

const ADMIN_EMAIL = 'aniebietabasienobong@gmail.com';
const MASTER_KEY = 'heartcode_admin_9f8e7d6c5b4a3210';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [authorized, setAuthorized] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Check if current user is the super administrator
  useEffect(() => {
    if (user && (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() || user.role === 'admin')) {
      setAuthorized(true);
      fetchMetrics();
    }
  }, [user]);

  const fetchMetrics = async (secretKey?: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const headers: any = {};
      if (secretKey) headers['x-admin-key'] = secretKey;
      else if (sessionStorage.getItem('hc_admin_key')) {
        headers['x-admin-key'] = sessionStorage.getItem('hc_admin_key');
      }

      const res = await api.get('/admin/metrics', { headers });
      setMetrics(res.data);
      setAuthorized(true);
      if (secretKey) sessionStorage.setItem('hc_admin_key', secretKey);
    } catch {
      setErrorMsg('Failed to authenticate as system administrator. Verify master credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKeyInput === MASTER_KEY) {
      sessionStorage.setItem('hc_admin_key', adminKeyInput);
      fetchMetrics(adminKeyInput);
    } else {
      setErrorMsg('Invalid Security Key. Access denied.');
    }
  };

  const handlePurgeLogs = async () => {
    if (!window.confirm('Are you sure you want to purge all scan records and telemetry? This action is irreversible.')) return;
    try {
      const headers: any = {};
      const key = sessionStorage.getItem('hc_admin_key');
      if (key) headers['x-admin-key'] = key;

      await api.delete('/admin/purge-telemetry', { headers });
      alert('System telemetry records cleared successfully.');
      fetchMetrics();
    } catch {
      alert('Failed to purge records.');
    }
  };

  const handleResetDailyScans = () => {
    localStorage.removeItem('heartcode_daily_scans');
    alert('Local daily scan counter reset to 0/5.');
  };

  if (!authorized) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cyber-bg p-6">
        <div className="max-w-md w-full bg-cyber-surface border border-cyber-border-red rounded-2xl p-8 shadow-[0_0_40px_rgba(224,40,64,0.15)] text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyber-red-dim border border-cyber-border-red flex items-center justify-center text-3xl mx-auto mb-4">
            🛡️
          </div>
          <h2 className="text-xl font-display font-black text-white tracking-wide">
            ADMINISTRATOR <span className="text-cyber-red">PORTAL</span>
          </h2>
          <p className="text-cyber-ash2 text-xs font-mono mt-2 mb-6">
            Designated Administrator: <span className="text-cyber-red">{ADMIN_EMAIL}</span>
          </p>

          {errorMsg && (
            <div className="p-3 bg-cyber-red/10 border border-cyber-red text-cyber-red text-xs font-mono rounded mb-4">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleManualUnlock} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-mono text-cyber-ash2 uppercase tracking-wider mb-1.5">
                Master Security Key / Access Token
              </label>
              <input
                type="password"
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                placeholder="Enter admin security key..."
                className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-cyber-red"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyber-red hover:bg-cyber-red-hi text-white font-mono text-xs font-bold uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(224,40,64,0.3)] transition-all cursor-pointer"
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHORIZE ADMIN ACCESS'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal flex-1 bg-cyber-bg p-6 sm:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-red-dim border border-cyber-border-red rounded-full text-cyber-red text-xs font-mono uppercase tracking-widest mb-2">
              <span>🛡️</span> SYSTEM COMMAND CONSOLE
            </div>
            <h1 className="text-3xl font-display font-black text-white tracking-tight">
              ADMINISTRATIVE <span className="text-cyber-red">TELEMETRY</span>
            </h1>
            <p className="text-cyber-ash text-xs font-mono mt-1">
              Active Administrator Session: <strong className="text-white">{ADMIN_EMAIL}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchMetrics()}
              className="px-3.5 py-1.5 bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border rounded font-mono text-xs text-cyber-ash hover:text-white transition-colors cursor-pointer"
            >
              ↻ REFRESH
            </button>
            <button
              onClick={handleResetDailyScans}
              className="px-3.5 py-1.5 bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border rounded font-mono text-xs text-cyber-green transition-colors cursor-pointer"
            >
              RESET DAILY LIMITS
            </button>
            <button
              onClick={handlePurgeLogs}
              className="px-3.5 py-1.5 bg-cyber-red-dim hover:bg-cyber-red border border-cyber-border-red hover:text-white rounded font-mono text-xs text-cyber-red transition-all cursor-pointer"
            >
              PURGE TELEMETRY
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5">
            <span className="text-xs font-mono text-cyber-ash2 uppercase tracking-wider">Total Scans Executed</span>
            <div className="text-3xl font-display font-black text-white mt-2">
              {metrics?.metrics?.totalScans ?? 0}
            </div>
            <span className="text-[11px] font-mono text-cyber-green mt-1 inline-block">● Real-time synced</span>
          </div>

          <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5">
            <span className="text-xs font-mono text-cyber-ash2 uppercase tracking-wider">Vulnerabilities Logged</span>
            <div className="text-3xl font-display font-black text-cyber-red mt-2">
              {metrics?.metrics?.totalVulnerabilities ?? 0}
            </div>
            <span className="text-[11px] font-mono text-cyber-ash2 mt-1 inline-block">Across all inspected targets</span>
          </div>

          <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5">
            <span className="text-xs font-mono text-cyber-ash2 uppercase tracking-wider">Registered Operators</span>
            <div className="text-3xl font-display font-black text-white mt-2">
              {metrics?.metrics?.totalUsers ?? 0}
            </div>
            <span className="text-[11px] font-mono text-cyber-ash2 mt-1 inline-block">Security analysts</span>
          </div>

          <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5">
            <span className="text-xs font-mono text-cyber-ash2 uppercase tracking-wider">Daily Scan Quota</span>
            <div className="text-3xl font-display font-black text-cyber-amber mt-2">
              {metrics?.metrics?.dailyScanLimit ?? 5} / Day
            </div>
            <span className="text-[11px] font-mono text-cyber-ash2 mt-1 inline-block">Reset window: 24h UTC</span>
          </div>
        </div>

        {/* API Integrations Status */}
        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-6">
          <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>🔌</span> Security Scanner & AI Provider Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {metrics?.apis?.map((apiItem: any) => (
              <div
                key={apiItem.name}
                className="bg-cyber-surface2 border border-cyber-border rounded-lg p-3.5 flex items-center justify-between"
              >
                <div>
                  <div className="font-sans text-xs text-white font-medium">{apiItem.name}</div>
                  <div className="text-[10px] font-mono text-cyber-ash2">
                    {apiItem.keySet ? 'Credentials Installed' : 'Using Local Simulation'}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    apiItem.keySet
                      ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/30'
                      : 'bg-cyber-amber/15 text-cyber-amber border border-cyber-amber/30'
                  }`}
                >
                  {apiItem.keySet ? 'ONLINE' : 'STANDBY'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Server Telemetry */}
        {metrics?.system && (
          <div className="bg-cyber-surface border border-cyber-border rounded-xl p-6">
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>🖥️</span> Host Infrastructure Diagnostics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-cyber-surface2 p-3 rounded border border-cyber-border">
                <span className="text-cyber-ash2">Platform / OS</span>
                <div className="text-white mt-1 font-bold">{metrics.system.platform} ({metrics.system.release})</div>
              </div>
              <div className="bg-cyber-surface2 p-3 rounded border border-cyber-border">
                <span className="text-cyber-ash2">Process Uptime</span>
                <div className="text-white mt-1 font-bold">{metrics.system.uptimeSeconds}s</div>
              </div>
              <div className="bg-cyber-surface2 p-3 rounded border border-cyber-border">
                <span className="text-cyber-ash2">Memory RSS</span>
                <div className="text-white mt-1 font-bold">{metrics.system.memoryUsageMB} MB / {metrics.system.totalMemoryMB} MB</div>
              </div>
              <div className="bg-cyber-surface2 p-3 rounded border border-cyber-border">
                <span className="text-cyber-ash2">Runtime</span>
                <div className="text-white mt-1 font-bold">Node {metrics.system.nodeVersion}</div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Scans Log Table */}
        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-6">
          <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>📜</span> Recent Target Analysis Activity
          </h2>
          {metrics?.recentScans?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-cyber-surface2 text-cyber-ash2 border-b border-cyber-border">
                  <tr>
                    <th className="py-2.5 px-3">TARGET URL</th>
                    <th className="py-2.5 px-3">SIZE / LINES</th>
                    <th className="py-2.5 px-3">TAGS / SCRIPTS</th>
                    <th className="py-2.5 px-3">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border text-cyber-ash">
                  {metrics.recentScans.map((scan: any) => (
                    <tr key={scan._id} className="hover:bg-cyber-surface2/50 transition-colors">
                      <td className="py-2.5 px-3 text-white font-medium">{scan.url}</td>
                      <td className="py-2.5 px-3">{scan.size || '—'} / {scan.lines ?? '—'}</td>
                      <td className="py-2.5 px-3">{scan.tagsCount ?? 0} tags / {scan.scriptsCount ?? 0} scripts</td>
                      <td className="py-2.5 px-3 text-cyber-ash2">
                        {new Date(scan.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-xs font-mono text-cyber-ash2">
              No recent scans recorded. The database is clean.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

