import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../../store/academyStore';
import { api } from '../../../services/api';
import type { ScamAnalysis, ScamCategory, ScamRedFlag } from '../../../types';

const ScamDetector: React.FC = () => {
  const navigate = useNavigate();
  const { addScamAnalysis, setScamLoading, scamLoading, addXP, earnBadge } = useAcademyStore();
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<ScamAnalysis | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim() || scamLoading) return;

    setDiagnosing(true);
    setScamLoading(true);

    try {
      const response = await api.post('/academy/scam-analyze', {
        content: inputText
      });

      if (response.data?.success && response.data?.data) {
        const analysis: ScamAnalysis = response.data.data;
        setResult(analysis);
        addScamAnalysis(analysis);
        addXP(20);
        earnBadge('scam-buster');
      } else {
        throw new Error('Fallback to local engine');
      }
    } catch (err) {
      console.warn('Scam API offline, running client-side diagnostic logic.');
      
      // Client-side rule-based analysis
      const lower = inputText.toLowerCase();
      let isScam = false;
      let score = 0;
      let category: ScamCategory = 'safe';
      const flags: ScamRedFlag[] = [];
      const recs: string[] = [];
      let explanation = 'No critical social engineering markers detected.';

      // Rules
      if (lower.includes('winner') || lower.includes('won') || lower.includes('prize') || lower.includes('draw')) {
        isScam = true;
        score = 85;
        category = 'fake-giveaway';
        flags.push({ indicator: 'Giveaway/Prize notification', severity: 'high', explanation: 'Promises of unrequested payouts or lottery winnings are primary baits.' });
        recs.push('Do not transfer fees to claim any prizes.', 'Ignore the message and block the sender.');
        explanation = 'The message claims you have won a prize or drawing. Legitimate promotions require prior entry and do not notify winners with urgent, high-value claims via messages.';
      } else if (lower.includes('otp') || lower.includes('verification code') || lower.includes('6-digit')) {
        isScam = true;
        score = 95;
        category = 'identity-theft';
        flags.push({ indicator: 'OTP/Verification Request', severity: 'high', explanation: 'One-Time Passcodes are security boundaries. Requests to share them indicate account hijacking attempts.' });
        recs.push('Never share OTPs, SMS codes, or account passwords under any circumstances.', 'Set up two-factor verification on the target application.');
        explanation = 'The input is requesting access codes or verification details, characteristic of account hijack operations.';
      } else if (lower.includes('empowerment') || lower.includes('cbn') || lower.includes('grant') || lower.includes('fund')) {
        isScam = true;
        score = 90;
        category = 'advance-fee';
        flags.push({ indicator: 'Government Grant Bait', severity: 'high', explanation: 'Federal grant claims (like CBN, empowerment funds) are used to extract processing fees.' });
        recs.push('Check the official CBN or government domain (.gov.ng) for confirmation.', 'Never pay any processing or registration fees to access grants.');
        explanation = 'The message mentions government empowerment or grants. Federal institutions do not notify beneficiaries via SMS or request processing fees.';
      } else if (lower.includes('bitcoin') || lower.includes('investment') || lower.includes('crypto') || lower.includes('doubling') || lower.includes('roi')) {
        isScam = true;
        score = 88;
        category = 'crypto';
        flags.push({ indicator: 'Investment Doubling', severity: 'high', explanation: 'Guarantees of high returns on crypto or investments within hours indicate Ponzi/crypto fraud.' });
        recs.push('Do not transfer cryptocurrency or cash to unknown wallets.', 'Research investment services on official SEC portals.');
        explanation = 'The text promises rapid capital multipliers or risk-free crypto assets, typical of digital financial scams.';
      } else if (lower.includes('verify') || lower.includes('restrict') || lower.includes('update billing') || lower.includes('netflix') || lower.includes('paypal')) {
        isScam = true;
        score = 80;
        category = 'phishing';
        flags.push({ indicator: 'Account Update/Billing Alert', severity: 'medium', explanation: 'Urgent requests to update credit card or login credentials to prevent restriction.' });
        recs.push('Always navigate to the service site directly to verify. Do not click message links.', 'Check the sender address for typosquatting.');
        explanation = 'The message attempts to impersonate popular brands and demands rapid credential updates to avoid restrictions.';
      } else {
        // Safe check
        score = 15;
        recs.push('Practice standard hygiene.', 'Confirm sender credentials on important notifications.');
      }

      const analysis: ScamAnalysis = {
        inputType: 'email', // default mock
        inputContent: inputText,
        confidenceScore: score,
        isLikelyScam: isScam,
        scamCategory: category,
        redFlags: flags,
        safetyRecommendations: recs,
        explanation,
        analyzedAt: new Date().toISOString()
      };

      setResult(analysis);
      addScamAnalysis(analysis);
      addXP(10);
    } finally {
      setTimeout(() => {
        setDiagnosing(false);
        setScamLoading(false);
      }, 800);
    }
  };

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">🛡️ AI Scam Analysis Engine</h2>
        <p className="academy-section-desc">Paste emails, SMS alerts, WhatsApp links, or job pitches. The engine extracts structural markers and alerts you of social engineering cues.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Paste Area */}
        <div className="lg:col-span-6 bg-cyber-surface border border-cyber-border rounded p-4 space-y-4">
          <h3 className="font-display font-bold text-white text-xs tracking-wider">SUSPICIOUS SAMPLE DEPOSITION</h3>
          <div className="space-y-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste the message content, email body, or WhatsApp link here..."
              rows={8}
              className="w-full bg-cyber-bg border border-cyber-border text-white text-xs font-mono rounded p-3 focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim() || diagnosing}
            className="w-full bg-cyber-surface2 hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan disabled:text-cyber-ash3 disabled:border-cyber-border disabled:bg-cyber-bg text-xs font-mono py-2.5 rounded cursor-pointer transition-all"
          >
            {diagnosing ? 'ISOLATING METADATA STRIPS...' : 'RUN FORENSIC TEXT INQUEST'}
          </button>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-6">
          {diagnosing ? (
            <div className="bg-cyber-bg border border-cyber-border rounded p-8 text-center text-cyber-cyan font-mono text-xs flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-ping mb-3" />
              <span>EXTRACTING LINGUISTIC SEED PATTERNS...</span>
            </div>
          ) : result ? (
            <div className="bg-cyber-surface border border-cyber-border rounded overflow-hidden">
              <div className="bg-cyber-bg2 px-4 py-2 border-b border-cyber-border flex justify-between font-mono text-[0.66rem] text-cyber-ash">
                <span>SCAM DETECTOR RADIAL INQUEST</span>
                <span>ANALYZED: {new Date(result.analyzedAt).toLocaleTimeString()}</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Result Hero */}
                <div className="flex justify-between items-center bg-cyber-bg p-4 rounded border border-cyber-border">
                  <div>
                    <div className="text-[0.6rem] text-cyber-ash3 font-mono">LIKELY SCAM RATING</div>
                    <div className={`text-base font-bold font-display tracking-wider ${result.isLikelyScam ? 'text-cyber-red' : 'text-cyber-green'}`}>
                      {result.isLikelyScam ? '⚠️ DANGER: HIGH SUSPICION' : '✓ CLEAN: LOW PROBABILITY'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[0.6rem] text-cyber-ash3 font-mono">CONFIDENCE INDEX</div>
                    <div className={`text-lg font-bold font-mono ${result.isLikelyScam ? 'text-cyber-red' : 'text-cyber-green'}`}>
                      {result.confidenceScore}%
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-1 font-sans text-xs">
                  <span className="text-white font-mono text-[0.62rem] font-bold block">ANALYSIS DOSSIER:</span>
                  <p className="text-cyber-ash leading-relaxed">{result.explanation}</p>
                </div>

                {/* Red Flags */}
                {result.redFlags.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-cyber-amber font-mono text-[0.62rem] font-bold block">EXTRACTED THREAT SIGNALS:</span>
                    <div className="space-y-2 text-xs font-sans">
                      {result.redFlags.map((flag, idx) => (
                        <div key={idx} className="bg-cyber-bg border border-cyber-border/40 p-2.5 rounded border-l-2 border-cyber-amber">
                          <div className="font-bold font-mono text-white text-[0.66rem]">{flag.indicator}</div>
                          <div className="text-cyber-ash2 mt-0.5">{flag.explanation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="space-y-2">
                  <span className="text-cyber-green font-mono text-[0.62rem] font-bold block">RECOMMENDED ACTIONS:</span>
                  <ul className="list-inside list-disc text-xs text-cyber-ash space-y-1">
                    {result.safetyRecommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-cyber-bg border border-cyber-border border-dashed rounded p-12 text-center text-cyber-ash3 font-mono text-xs flex flex-col items-center justify-center min-h-[300px]">
              <span>🛡️ DEPOSITION CORRELATOR STANDBY</span>
              <span className="text-[0.58rem] mt-1.5 max-w-xs leading-normal">Input suspicious message strings in the panel on the left and start the analysis parser.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScamDetector;
