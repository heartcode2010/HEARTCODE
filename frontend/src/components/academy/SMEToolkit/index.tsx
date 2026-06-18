import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SMEToolkit: React.FC = () => {
  const navigate = useNavigate();

  // Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'c-1': false,
    'c-2': false,
    'c-3': false,
    'c-4': false,
    'c-5': false
  });

  // Policy Generator State
  const [bizName, setBizName] = useState('');
  const [mfaSetting, setMfaSetting] = useState('Enforced');
  const [pwExpiry, setPwExpiry] = useState('90 Days');
  const [generatedPolicy, setGeneratedPolicy] = useState<string | null>(null);

  // Risk Matrix State
  const [threatType, setThreatType] = useState('Phishing');
  const [likelihood, setLikelihood] = useState<number>(3); // 1-5
  const [impact, setImpact] = useState<number>(4); // 1-5
  const [riskResult, setRiskResult] = useState<{ score: number; rating: string; color: string } | null>(null);

  const calculateRisk = () => {
    const score = likelihood * impact;
    let rating = 'Low';
    let color = 'text-cyber-green';
    if (score >= 15) {
      rating = 'Critical';
      color = 'text-cyber-red font-bold animate-pulse';
    } else if (score >= 10) {
      rating = 'High';
      color = 'text-cyber-red';
    } else if (score >= 5) {
      rating = 'Medium';
      color = 'text-cyber-amber';
    }
    setRiskResult({ score, rating, color });
  };

  const handleGeneratePolicy = () => {
    if (!bizName.trim()) return;

    const text = `================================================================================
${bizName.toUpperCase()} — INFORMATION SECURITY POLICY DEFINITION
================================================================================
CLASSIFICATION: INTERNAL USE ONLY
ESTABLISHED: ${new Date().toLocaleDateString()}
VERSION: 1.0.0

1. PURPOSE
The purpose of this policy is to establish baseline controls to safeguard
systems and data belonging to ${bizName.toUpperCase()}.

2. PASSWORD MANAGEMENT & SECURITY
- All passwords must contain a minimum of 12 mixed characters.
- Passwords must expire and be changed every ${pwExpiry}.
- Re-use of passwords across corporate or personal systems is strictly prohibited.

3. MULTI-FACTOR AUTHENTICATION (2FA/MFA)
- Multi-factor authentication is ${mfaSetting.toUpperCase()} for all access controls.
- Staff must use secure authenticator applications rather than SMS codes where supported.

4. INCIDENT AUDITING
- Suspicious activity, spam invoices, or unauthorized access signals must be
  reported to security focal points within 1 hour.

================================================================================
EOF // CRYPTO ENVELOPE SECURE
================================================================================`;
    setGeneratedPolicy(text);
  };

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">🏢 SME Security Toolkit</h2>
        <p className="academy-section-desc">Practical checklists, calculators, and automated policies for small and medium business protections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Checklist & Risk Calculator */}
        <div className="lg:col-span-6 space-y-4">
          {/* Checklist */}
          <div className="bg-cyber-surface border border-cyber-border rounded p-4 space-y-3">
            <h3 className="font-display font-bold text-white text-xs tracking-wider">BUSINESS SECURITY CHECKLIST</h3>
            <div className="space-y-2 text-xs font-sans text-cyber-ash">
              {[
                { id: 'c-1', text: 'MFA active on all domain administrator panels' },
                { id: 'c-2', text: 'Daily offline backups verified for recovery continuity' },
                { id: 'c-3', text: 'Staff trained to verify invoicing links out-of-band' },
                { id: 'c-4', text: 'HttpOnly/Secure flags configured on internal application databases' },
                { id: 'c-5', text: 'Router admin credentials changed from factory default settings' }
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-3 bg-cyber-bg border border-cyber-border p-2.5 rounded cursor-pointer hover:border-cyber-cyan transition-all">
                  <input
                    type="checkbox"
                    checked={checklist[item.id]}
                    onChange={(e) => setChecklist({ ...checklist, [item.id]: e.target.checked })}
                    className="w-4 h-4 cursor-pointer accent-cyber-cyan"
                  />
                  <span>{item.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Risk assessment */}
          <div className="bg-cyber-surface border border-cyber-border rounded p-4 space-y-3">
            <h3 className="font-display font-bold text-white text-xs tracking-wider">QUANTITATIVE RISK CALCULATOR</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-cyber-ash2 block text-[0.6rem] font-bold">LIKELIHOOD (1-5):</span>
                <select
                  value={likelihood}
                  onChange={(e) => setLikelihood(Number(e.target.value))}
                  className="w-full bg-cyber-bg border border-cyber-border text-white rounded p-1.5 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v} ({v === 1 ? 'Rare' : v === 5 ? 'Almost Certain' : 'Possible'})</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-cyber-ash2 block text-[0.6rem] font-bold">BUSINESS IMPACT (1-5):</span>
                <select
                  value={impact}
                  onChange={(e) => setImpact(Number(e.target.value))}
                  className="w-full bg-cyber-bg border border-cyber-border text-white rounded p-1.5 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v} ({v === 1 ? 'Negligible' : v === 5 ? 'Catastrophic' : 'Moderate'})</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={calculateRisk}
              className="w-full bg-cyber-bg hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan text-xs font-mono py-2 rounded cursor-pointer"
            >
              RUN MATRIX ALGORITHM
            </button>

            {riskResult && (
              <div className="bg-cyber-bg border border-cyber-border p-3 rounded font-mono text-xs flex justify-between items-center">
                <div>
                  <span className="text-cyber-ash3">RISK SCORE:</span> <span className="text-white font-bold">{riskResult.score} / 25</span>
                </div>
                <div>
                  <span className="text-cyber-ash3">RATING:</span> <span className={riskResult.color}>{riskResult.rating}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Corporate Policy Builder */}
        <div className="lg:col-span-6 bg-cyber-surface border border-cyber-border rounded p-4 space-y-4">
          <h3 className="font-display font-bold text-white text-xs tracking-wider">POLICY GENERATOR</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-cyber-ash2 block text-[0.6rem] font-bold">COMPANY LEGAL NAME:</span>
              <input
                type="text"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                placeholder="E.G. CHIP NETWORKS"
                className="w-full bg-cyber-bg border border-cyber-border text-white rounded px-2.5 py-1.5 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <span className="text-cyber-ash2 block text-[0.6rem] font-bold">PASSWORD EXPIRY TIMER:</span>
              <select
                value={pwExpiry}
                onChange={(e) => setPwExpiry(e.target.value)}
                className="w-full bg-cyber-bg border border-cyber-border text-white rounded p-1.5 focus:outline-none"
              >
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="90 Days">90 Days</option>
                <option value="Never Recommended">Never Expire</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGeneratePolicy}
            disabled={!bizName.trim()}
            className="w-full bg-cyber-bg hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan disabled:text-cyber-ash3 disabled:border-cyber-border disabled:bg-cyber-bg text-xs font-mono py-2 rounded cursor-pointer"
          >
            COMPILE DECREE POLICY
          </button>

          {generatedPolicy && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[0.6rem] text-cyber-ash3 font-mono">COMPILED TEXT OUTPUT:</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(generatedPolicy); alert('Copied to clipboard'); }}
                  className="text-cyber-cyan hover:underline text-[0.66rem] font-mono cursor-pointer"
                >
                  [COPY TEXT]
                </button>
              </div>
              <pre className="bg-cyber-bg border border-cyber-border rounded p-3 text-[0.58rem] font-mono text-cyber-ash overflow-x-auto whitespace-pre leading-relaxed select-text max-h-[200px]">
                {generatedPolicy}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMEToolkit;
