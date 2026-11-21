import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
        setError(res.data?.message || 'Access Denied.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication link failed. Check local server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cyber-bg flex items-center justify-center p-4">
      {/* Scanline pattern overlay */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.09)_2px,rgba(0,0,0,0.09)_4px)] pointer-events-none z-10" />
      
      <div className="w-full max-w-md bg-cyber-surface border border-cyber-border-red rounded-lg p-8 shadow-[0_0_24px_rgba(224,40,64,0.08)] relative overflow-hidden z-20">
        
        {/* Glow header overlay */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-red to-transparent shadow-[0_0_12px_var(--red)]" />

        <div className="text-center mb-8">
          <div className="logo-group inline-flex items-baseline gap-2.5">
            <div className="logo text-4xl" data-text="SECURE">HEARTCODE</div>
            <span className="logo-tag text-[0.58rem] tracking-[0.22em] border border-cyber-border-red px-2 py-0.5 rounded text-cyber-red-hi font-mono">AUTH</span>
          </div>
          <p className="mt-3 text-xs font-mono text-cyber-ash2 uppercase tracking-widest">
            {isRegister ? 'SYSTEM REGISTRATION PROTOCOL' : 'SECURE CONNECTION INBOUND'}
          </p>
        </div>

        {error && (
          <div className="mb-6 border border-cyber-red bg-cyber-red-dim rounded p-3 text-xs font-mono text-cyber-red-hi leading-relaxed shadow-[0_0_8px_rgba(224,40,64,0.1)]">
            <span className="font-bold">⚠️ CRITICAL EXCEPTION:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[0.66rem] font-bold font-mono text-cyber-ash uppercase tracking-wider mb-2">
              [ ACCESS KEY ID ]
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="operator_name"
              disabled={loading}
              className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-red focus:shadow-[0_0_0_3px_var(--red-dim)] rounded px-4 py-3 font-mono text-sm text-cyber-ash outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-[0.66rem] font-bold font-mono text-cyber-ash uppercase tracking-wider mb-2">
              [ PASSCODE SECURE ]
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={loading}
              className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-red focus:shadow-[0_0_0_3px_var(--red-dim)] rounded px-4 py-3 font-mono text-sm text-cyber-ash outline-none transition-all duration-200"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-[0.66rem] font-bold font-mono text-cyber-ash uppercase tracking-wider mb-2">
                [ SECURITY CLEARANCE LEVEL ]
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                disabled={loading}
                className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-red focus:shadow-[0_0_0_3px_var(--red-dim)] rounded px-4 py-3 font-mono text-sm text-cyber-ash outline-none transition-all duration-200"
              >
                <option value="user">USER (Standard inspection & scanning)</option>
                <option value="admin">ADMIN (Export reports & edit preferences)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-cyber-red hover:bg-cyber-red-hi hover:shadow-[0_0_18px_rgba(224,40,64,0.4)] text-white font-display text-xs font-bold tracking-widest uppercase rounded cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">DECRYPTING...</span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{isRegister ? 'INITIALIZE CREDENTIALS' : 'ACCESS PORTAL'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs font-mono text-cyber-ash2 hover:text-cyber-ash cursor-pointer transition-colors duration-150"
          >
            {isRegister ? '‹ Return to Access Portal' : 'Request Security Credentials ›'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
