import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import useAuthStore from '../store/authStore';

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please provide secure credentials.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister ? { username, password, role } : { username, password };

      const res = await axios.post(endpoint, payload);

      if (res.data?.success) {
        const { accessToken, refreshToken, user } = res.data;
        setSession(accessToken, refreshToken, user);
        navigate('/');
      } else {
        setError(res.data?.message || 'Access denied.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Check the local server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(109,124,255,0.2),transparent_24%),linear-gradient(135deg,#050816_0%,#09111f_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center gap-8 lg:flex-row lg:items-center">
        <div className="max-w-xl rounded-[32px] border border-white/10 bg-white/8 p-8 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-sm text-indigo-200">
            <Sparkles size={14} /> Secure workspace access
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Enter the command center.</h1>
          <p className="mt-4 max-w-lg text-base text-slate-400">Access your analyses, monitor signals, and move from insight to action without friction.</p>

          <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            {[
              'Review security findings in one place',
              'Launch vulnerability and AI intelligence workflows',
              'Keep your workspace consistent across devices',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <ShieldCheck size={15} />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-semibold text-white">H</div>
            <h2 className="mt-4 text-2xl font-semibold text-white">{isRegister ? 'Create your account' : 'Welcome back'}</h2>
            <p className="mt-2 text-sm text-slate-400">{isRegister ? 'Set up secure access to the platform.' : 'Sign in to continue your workflow.'}</p>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Username</label>
              <div className="input-shell">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="operator_name" disabled={loading} className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Password</label>
              <div className="input-shell">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" disabled={loading} className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500" />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Permission level</label>
                <div className="input-shell">
                  <select value={role} onChange={(e) => setRole(e.target.value as 'user' | 'admin')} disabled={loading} className="w-full bg-transparent text-sm text-slate-100 outline-none">
                    <option value="user">User — Standard analysis</option>
                    <option value="admin">Admin — Elevated controls</option>
                  </select>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary h-12 w-full text-sm">
              {loading ? 'Preparing workspace…' : isRegister ? 'Create account' : 'Sign in'}
              <ArrowRight size={16} />
            </button>
          </form>

          <button type="button" disabled={loading} onClick={() => { setIsRegister(!isRegister); setError(''); }} className="mt-5 text-sm text-slate-400 transition hover:text-white">
            {isRegister ? 'Already have access? Sign in' : 'Need an account? Create one'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
