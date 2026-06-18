import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../../store/academyStore';
import { api } from '../../../services/api';

const CampaignBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { addXP } = useAcademyStore();

  const [topic, setTopic] = useState('Phishing Scams');
  const [style, setStyle] = useState('Social Media Alert Copy');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await api.post('/academy/campaign', {
        topic,
        style
      });

      if (response.data?.success && response.data?.data) {
        setContent(response.data.data);
        addXP(25);
      } else {
        throw new Error('API offline');
      }
    } catch (err) {
      console.warn('Backend campaign service offline, utilizing local template compiler...');
      
      let text = '';
      if (style.includes('Social Media')) {
        text = `🚨 CYBER SECURITY ALERT: SPOT THE FAKE! 🚨

Are you sure that SMS is from your bank? Scammers are sending fake bank credit alerts to steal goods and accounts.

⚠️ RED FLAGS:
1. Sender name masking errors (extra characters, numbers).
2. Urgency demands: "Act within 24 hours!"
3. Requests for your 6-digit WhatsApp PIN or verification codes.

🛡️ PROTECT YOURSELF:
- Never read SMS codes over the phone.
- Log in to your official banking app to check ledger updates.
- Enable Two-Step Verification.

Retweet to save a friend today! #CyberHygiene #NigeriaCyberAware #SecurityTips`;
      } else {
        text = `================================================================================
AWARENESS FLYER: ${topic.toUpperCase()} SECURITY POSTER PLAN
================================================================================
CLASSIFICATION: COMMUNITY PUBLIC ACCESS
THEME: CYBER HYGIENE IN THE WORKPLACE

[HEADER HEADLINE]
STOP. THINK. VERIFY.
YOUR CREDENTIALS ARE THE SHIELD!

[BODY PARAGRAPH 1: THE RISK]
Did you know that over 80% of corporate data breaches start with a single clicked
phishing link or a reused password? Attackers masquerade as managers or service
providers to extract login tokens.

[BODY PARAGRAPH 2: THE CHECKS]
- Hover over all email links to inspect their true URL destinations.
- Use a dedicated Password Manager instead of writing keys down.
- Enforce App-Based Two-Factor Authentication.

[FOOTER LOGO & CONTACT]
HEARTCODE DIGITAL COMPLIANCE MATRIX // ENGAGE SECURELY`;
      }

      setContent(text);
      addXP(10);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">📢 Public Awareness Campaign Builder</h2>
        <p className="academy-section-desc">Generate ready-to-use social media copy, flyers, and poster outlines to educate your school or office teams.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 bg-cyber-surface border border-cyber-border rounded p-4 space-y-4">
          <h3 className="font-display font-bold text-white text-xs tracking-wider">CAMPAIGN TEMPLATE TUNER</h3>
          
          <div className="space-y-3 font-mono text-xs text-cyber-ash2">
            <div className="space-y-1">
              <span className="text-white block text-[0.6rem] font-bold">AWARENESS TOPIC:</span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-cyber-bg border border-cyber-border text-white rounded p-1.5 focus:outline-none"
              >
                <option value="Phishing Scams">Phishing Scams</option>
                <option value="Password Strength">Password Strength</option>
                <option value="Two-Factor Security">Two-Factor Security</option>
                <option value="Public Wi-Fi Risks">Public Wi-Fi Risks</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-white block text-[0.6rem] font-bold">OUTPUT STYLE:</span>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-cyber-bg border border-cyber-border text-white rounded p-1.5 focus:outline-none"
              >
                <option value="Social Media Alert Copy">Social Media Alert Copy</option>
                <option value="Printable Awareness Flyer">Printable Awareness Flyer</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-cyber-surface2 hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan disabled:text-cyber-ash3 text-xs font-mono py-2.5 rounded cursor-pointer"
          >
            {loading ? 'COMPILING COPYWRITING LOGS...' : 'GENERATE CAMPAIGN LAYOUT'}
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="bg-cyber-bg border border-cyber-border rounded p-8 text-center text-cyber-cyan font-mono text-xs flex flex-col items-center justify-center min-h-[260px]">
              <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-ping mb-3" />
              <span>AI COMPILING INSTRUCTIONAL ADVISORY...</span>
            </div>
          ) : content ? (
            <div className="bg-cyber-surface border border-cyber-border rounded overflow-hidden">
              <div className="bg-cyber-bg2 px-4 py-2 border-b border-cyber-border flex justify-between font-mono text-[0.66rem] text-cyber-ash">
                <span>COMPILED MATERIALS DECREE</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(content); alert('Copied to clipboard'); }}
                  className="text-cyber-cyan hover:underline text-[0.66rem] font-mono cursor-pointer"
                >
                  [COPY]
                </button>
              </div>
              <pre className="p-5 font-mono text-[0.6rem] text-cyber-ash leading-relaxed whitespace-pre-wrap select-text max-h-[300px] overflow-y-auto">
                {content}
              </pre>
            </div>
          ) : (
            <div className="bg-cyber-bg border border-cyber-border border-dashed rounded p-12 text-center text-cyber-ash3 font-mono text-xs flex flex-col items-center justify-center min-h-[260px]">
              <span>📢 CAMPAIGN TEXT STANDBY</span>
              <span className="text-[0.58rem] mt-1.5 max-w-xs leading-normal">Configure campaign options on the left and start the AI compilation engine.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilder;
