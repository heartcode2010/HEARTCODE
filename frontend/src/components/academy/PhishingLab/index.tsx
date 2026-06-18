import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../../store/academyStore';
import type { PhishingSample } from '../../../types';

const PHISHING_SAMPLES: PhishingSample[] = [
  {
    id: 'ph-email-paypal',
    type: 'email',
    difficulty: 'easy',
    sender: 'security-alert@paypaI-updates.com',
    subject: 'URGENT: Your account has been restricted',
    content: `Dear Customer,

We detected suspicious login attempts on your account from an unrecognized location. For your safety, we have temporarily restricted account access.

To restore access, you must verify your identity immediately by clicking the link below:

[Restore My Account Now](https://paypaI-updates-login-secure.net/auth)

If you do not verify within 24 hours, your funds may be frozen indefinitely.

Sincerely,
PayPal Security Services`,
    isPhishing: true,
    redFlags: [
      { text: 'paypaI-updates.com', indicator: 'Sender Address Domain', location: 'The domain uses an uppercase "I" instead of a lowercase "l" to impersonate PayPal.' },
      { text: 'https://paypaI-updates-login-secure.net/auth', indicator: 'Hyperlink Target', location: 'The link points to a non-PayPal domain updates-login-secure.net.' },
      { text: 'Dear Customer', indicator: 'Generic Salutation', location: 'Legitimate financial services address you by your full registered name.' },
      { text: 'within 24 hours / frozen indefinitely', indicator: 'Urgency / Fear Tactics', location: 'Pressure to act quickly is a key social engineering tactic.' }
    ],
    explanation: 'This email impersonates PayPal but has several major red flags, including spelling manipulation (typosquatting), an unauthorized link target, generic greetings, and high urgency threats.'
  },
  {
    id: 'ph-wa-nigerian-promo',
    type: 'whatsapp',
    sender: '+234 812 345 6789',
    content: `CONGRATULATIONS!!! 🎉
Your phone number has been selected as the grand prize winner of 5,000,000 Naira in the ongoing CBN National Empowerment Grant Promotion.

Please fill the form online to claim your cash reward instantly:
👉 https://cbn-empowerment-fund-ng.online/grant-cbn

Ref Code: CBN-992-EMPW
Do not share this link with anyone. Claim must be processed within 48 hours.`,
    isPhishing: true,
    difficulty: 'medium',
    redFlags: [
      { text: 'https://cbn-empowerment-fund-ng.online/...', indicator: 'Suspicious Domain Name', location: 'The domain does not end in gov.ng. Official CBN sites use official federal government domains.' },
      { text: '5,000,000 Naira grand prize', indicator: 'Too Good to be True', location: 'Offers of massive free money are almost always scams.' },
      { text: 'CBN-992-EMPW', indicator: 'Fake Authority Credentials', location: 'Including official-looking reference codes is done to establish fake credibility.' }
    ],
    explanation: 'This is a typical advance-fee/grant fraud attempt commonly targeting mobile users. The Central Bank of Nigeria (CBN) never distributes grants or prizes via WhatsApp messages.'
  },
  {
    id: 'ph-sms-delivery',
    type: 'sms',
    sender: '+1 202 555 0199',
    content: `NIPOST Alert: Your package has arrived at our sorting hub but cannot be delivered due to an incorrect address. Please update your details and pay 250 NGN fee to dispatch:
https://nipost-delivery-redirect.cc/shipping`,
    isPhishing: true,
    difficulty: 'easy',
    redFlags: [
      { text: 'https://nipost-delivery-redirect.cc/...', indicator: 'Foreign/Strange Extension', location: 'The web address ends in .cc and does not belong to the Nigerian Postal Service.' },
      { text: 'incorrect address / 250 NGN', indicator: 'Baiting Fee', location: 'Small delivery charges are used to extract credit card credentials from victims.' }
    ],
    explanation: 'Postal redirection scams are extremely common. They look low-risk due to the tiny charge, but are designed to capture card information.'
  },
  {
    id: 'ph-email-work-invoice',
    type: 'email',
    sender: 'finance-manager@company-partners.org',
    subject: 'OVERDUE: Invoice #9822 - Action Required',
    content: `Hi team,

Please find attached invoice #9822 for our contracting work last month. The payment of $12,450 is now overdue by 5 days.

Kindly download the invoice PDF from our cloud share and process the wire payment immediately to avoid legal escalation:

[Download_Invoice_9822.exe](https://drive.company-partners.org/files/Download_Invoice_9822.exe)

Thank you,
John Cole
Operations Director`,
    isPhishing: true,
    difficulty: 'hard',
    redFlags: [
      { text: 'Download_Invoice_9822.exe', indicator: 'Executable File Extension', location: 'The download link points to an .exe (executable) file instead of a real PDF. Running this executes malware.' },
      { text: 'finance-manager@company-partners.org', indicator: 'Slightly Mismatched Sender', location: 'The domain company-partners.org is slightly different from the actual vendor domain.' }
    ],
    explanation: 'This is a spear-phishing / BEC invoice scam. It tries to trick employees in finance into installing malware payload masquerading as a PDF invoice.'
  },
  {
    id: 'ph-email-github-legit',
    type: 'email',
    sender: 'noreply@github.com',
    subject: '[GitHub] Security Alert: New login detected',
    content: `Hey username,

We detected a new login to your GitHub account from IP address 197.210.64.12 in Lagos, Nigeria.

If this was you, no action is needed.
If this was not you, please secure your account by changing your password:
https://github.com/settings/security

Thanks,
The GitHub Team`,
    isPhishing: false,
    difficulty: 'medium',
    redFlags: [],
    explanation: 'This is a legitimate security notification from GitHub. The sender address is noreply@github.com, the links point directly to github.com, and it does not make threats or demand rapid financial transfers.'
  }
];

const PhishingLab: React.FC = () => {
  const navigate = useNavigate();
  const { phishingLab, updatePhishingLab, addXP, earnBadge } = useAcademyStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userGuess, setUserGuess] = useState<'safe' | 'phishing' | null>(null);
  const [revealedFlags, setRevealedFlags] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const sample = PHISHING_SAMPLES[currentIdx];

  const handleGuess = (guess: 'safe' | 'phishing') => {
    setUserGuess(guess);
    const isCorrect = (guess === 'phishing' && sample.isPhishing) || (guess === 'safe' && !sample.isPhishing);

    const newCorrect = phishingLab.answeredCorrectly + (isCorrect ? 1 : 0);
    const newIncorrect = phishingLab.answeredIncorrectly + (isCorrect ? 0 : 1);
    const newStreak = isCorrect ? phishingLab.currentStreak + 1 : 0;
    const newBest = Math.max(phishingLab.bestStreak, newStreak);

    updatePhishingLab({
      answeredCorrectly: newCorrect,
      answeredIncorrectly: newIncorrect,
      totalAttempted: phishingLab.totalAttempted + 1,
      currentStreak: newStreak,
      bestStreak: newBest,
      score: phishingLab.score + (isCorrect ? 50 : -20)
    });

    if (isCorrect) {
      addXP(40);
      if (newCorrect >= 10) earnBadge('phishing-detector');
    }

    setRevealedFlags(true);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setUserGuess(null);
    setRevealedFlags(false);
    setShowFeedback(false);
    setCurrentIdx((prev) => (prev + 1) % PHISHING_SAMPLES.length);
  };

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
        
        {/* Streak & Score Panel */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="bg-cyber-surface border border-cyber-border px-3 py-1 rounded">
            SCORE: <span className="text-cyber-cyan font-bold">{phishingLab.score}</span>
          </div>
          <div className="bg-cyber-surface border border-cyber-border px-3 py-1 rounded">
            STREAK: <span className="text-cyber-amber font-bold">{phishingLab.currentStreak} 🔥</span>
          </div>
          <div className="bg-cyber-surface border border-cyber-border px-3 py-1 rounded">
            ACCURACY: <span className="text-cyber-green font-bold">
              {phishingLab.totalAttempted > 0
                ? Math.round((phishingLab.answeredCorrectly / phishingLab.totalAttempted) * 100)
                : 100}%
            </span>
          </div>
        </div>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">🐟 Phishing Simulation Lab</h2>
        <p className="academy-section-desc">Test your critical analysis. Identify whether the messages are Legitimate/Safe or Threat vectors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Device Preview Panel */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center">
          {sample.type === 'email' ? (
            <div className="w-full bg-cyber-surface border border-cyber-border rounded overflow-hidden">
              {/* Email Client Header */}
              <div className="bg-cyber-bg2 px-4 py-2 border-b border-cyber-border flex items-center gap-2">
                <span className="text-cyber-red text-xs font-bold">✉ EMAIL CLIENT</span>
                <span className="text-[0.66rem] text-cyber-ash3">// PREVIEW_MODE</span>
              </div>
              <div className="p-4 border-b border-cyber-border space-y-1 bg-cyber-bg/50">
                <div className="text-xs text-cyber-ash2">
                  <span className="text-white font-mono">From:</span> {sample.sender}
                </div>
                <div className="text-xs text-cyber-ash2">
                  <span className="text-white font-mono">Subject:</span> <span className="text-cyber-ash">{sample.subject}</span>
                </div>
              </div>
              <div className="p-5 font-sans text-sm text-cyber-ash bg-cyber-bg whitespace-pre-wrap leading-relaxed select-text">
                {sample.content}
              </div>
            </div>
          ) : sample.type === 'whatsapp' ? (
            <div className="w-[340px] max-w-full bg-[#0b141a] border border-cyber-border rounded-[24px] overflow-hidden flex flex-col shadow-[0_4px_32px_rgba(0,0,0,0.5)]">
              {/* Phone Status Bar */}
              <div className="bg-[#0b141a] h-6 flex justify-between items-center px-6 text-[0.62rem] text-cyber-ash3 font-mono">
                <span>HEARTCODE SIM</span>
                <span>12:00 PM</span>
              </div>
              {/* WhatsApp Header */}
              <div className="bg-[#128c7e] px-4 py-2.5 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cyber-surface3 flex items-center justify-center font-bold text-sm">👤</div>
                  <div>
                    <div className="text-xs font-bold">{sample.sender}</div>
                    <div className="text-[0.55rem] opacity-80">online</div>
                  </div>
                </div>
              </div>
              {/* WhatsApp Message Body */}
              <div className="p-4 flex-1 min-h-[300px] flex items-end bg-[#0b141a] bg-opacity-95" style={{ backgroundImage: 'radial-gradient(#1f2c34 1px, transparent 0)', backgroundSize: '16px 16px' }}>
                <div className="bg-[#202c33] border border-[#233138] rounded-lg p-3 text-xs text-white max-w-[85%] leading-relaxed whitespace-pre-wrap select-text">
                  {sample.content}
                  <div className="text-right text-[0.52rem] text-cyber-ash2 mt-1">11:58 AM</div>
                </div>
              </div>
            </div>
          ) : (
            /* SMS Client */
            <div className="w-[320px] max-w-full bg-[#121214] border border-cyber-border rounded-[24px] overflow-hidden flex flex-col shadow-[0_4px_32px_rgba(0,0,0,0.5)]">
              {/* Phone Status Bar */}
              <div className="bg-[#121214] h-6 flex justify-between items-center px-6 text-[0.62rem] text-cyber-ash3 font-mono">
                <span>NIPOST COMMS</span>
                <span>12:00 PM</span>
              </div>
              {/* SMS Header */}
              <div className="bg-[#1c1c1e] px-4 py-3 border-b border-cyber-border flex items-center gap-3 text-white">
                <div className="w-6 h-6 rounded-full bg-cyber-surface3 flex items-center justify-center text-xs">💬</div>
                <div className="text-xs font-mono font-bold">{sample.sender}</div>
              </div>
              {/* SMS Message Body */}
              <div className="p-4 flex-1 min-h-[220px] bg-black">
                <div className="bg-[#262629] rounded-2xl p-3 text-xs text-white leading-relaxed whitespace-pre-wrap select-text">
                  {sample.content}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-cyber-surface border border-cyber-border rounded p-4 space-y-4">
            <h3 className="font-display font-bold text-white text-xs tracking-wider">LABORATORY CONTROL UNIT</h3>
            <p className="text-xs text-cyber-ash2 leading-relaxed">
              Analyze the sender details, hyperlink targets, greetings, file extensions, and language quality. Make your diagnosis.
            </p>

            {userGuess === null ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleGuess('safe')}
                  className="bg-cyber-bg hover:bg-cyber-green-dim border border-cyber-border hover:border-cyber-green text-cyber-green text-xs font-mono py-2 rounded transition-all cursor-pointer"
                >
                  ✓ VERIFIED / SAFE
                </button>
                <button
                  onClick={() => handleGuess('phishing')}
                  className="bg-cyber-bg hover:bg-cyber-red-dim border border-cyber-border hover:border-cyber-red text-cyber-red text-xs font-mono py-2 rounded transition-all cursor-pointer"
                >
                  ⚠ PHISHING ATTACK
                </button>
              </div>
            ) : (
              <div className="bg-cyber-bg p-3.5 rounded border border-cyber-border text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-mono font-bold">
                  <span>DIAGNOSIS:</span>
                  {((userGuess === 'phishing' && sample.isPhishing) || (userGuess === 'safe' && !sample.isPhishing)) ? (
                    <span className="text-cyber-green">CORRECT [ANALYSIS COMPLETED]</span>
                  ) : (
                    <span className="text-cyber-red">INCORRECT [SIGNALS MISSED]</span>
                  )}
                </div>
                <div className="text-cyber-ash">{sample.explanation}</div>
              </div>
            )}
          </div>

          {/* Feedback & Red Flags */}
          {showFeedback && sample.isPhishing && (
            <div className="bg-cyber-surface border border-cyber-border rounded p-4 space-y-3">
              <h4 className="font-mono text-xs font-bold text-cyber-cyan flex items-center gap-1">
                <span>🔍</span> IDENTIFIED THREAT INDICATORS
              </h4>
              <div className="space-y-3">
                {sample.redFlags.map((flag, idx) => (
                  <div key={idx} className="bg-cyber-bg p-3 rounded border-l-2 border-cyber-amber text-xs space-y-1">
                    <div className="font-mono text-cyber-amber font-bold">
                      {flag.indicator}: <span className="text-white select-all">"{flag.text}"</span>
                    </div>
                    <div className="text-cyber-ash2">{flag.location}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Button */}
          {userGuess !== null && (
            <button
              onClick={handleNext}
              className="w-full bg-cyber-surface hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan text-xs font-mono py-2.5 rounded transition-all cursor-pointer shadow-[0_0_12px_rgba(0,245,255,0.1)]"
            >
              LOAD NEXT SIMULATION CASE →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhishingLab;
