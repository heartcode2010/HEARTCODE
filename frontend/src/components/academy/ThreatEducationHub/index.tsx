import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ThreatPattern {
  id: string;
  title: string;
  localTerm: string;
  description: string;
  scamVector: string;
  exampleScenario: string;
  redFlags: string[];
  preventions: string[];
}

const THREATS: ThreatPattern[] = [
  {
    id: 'whatsapp-takeover',
    title: 'WhatsApp Verification Code Theft',
    localTerm: 'OTP Hijack',
    description: 'Attackers register WhatsApp using your phone number and manipulate you into sending them the 6-digit verification code.',
    scamVector: 'Scammer calls or messages pretending to be a group admin (church, alumni, association) claiming you need to verify your status.',
    exampleScenario: '“Hello, I am the admin of the association. We are updating our list. I sent a code to your SMS, please read it to me so I can add you back to the group.”',
    redFlags: [
      'Someone asking for a code sent to your SMS inbox',
      'Sudden calls from unknown numbers asking you to confirm group memberships',
      'SMS text stating "Your WhatsApp code is..." when you did not request it'
    ],
    preventions: [
      'NEVER share your 6-digit WhatsApp registration code with anyone, including admins.',
      'Enable Two-Step Verification inside your WhatsApp Settings (Settings > Account > Two-step verification).',
      'If you lose your account, re-verify immediately by requesting a new SMS verification code.'
    ]
  },
  {
    id: 'fake-credit-alerts',
    title: 'Fake SMS Credit Alerts',
    localTerm: 'POS Alert Fraud',
    description: 'Scammers buy goods from merchants and send custom, spoofed SMS messages that mimic banking notification alerts.',
    scamVector: 'Custom SMS gateway senders masquerading as your bank, matching real transaction text formats.',
    exampleScenario: 'A buyer purchases items from a shop. He requests a bank transfer and sends an alert. The vendor sees the SMS notification and hands over the goods, only to discover later that no money entered the account.',
    redFlags: [
      'The SMS notification does not appear in the official bank thread on your phone.',
      'The alert does not contain your actual bank ledger update details.',
      'A buyer is rushing you to release goods immediately after transfer.'
    ],
    preventions: [
      'Always log in to your official banking app or dial USSD code to confirm the updated ledger balance.',
      'Never release goods or services solely based on an SMS alert or transfer receipt screenshots.',
      'Sign up for email alerts alongside SMS notifications as dual verification.'
    ]
  },
  {
    id: 'fake-job-scams',
    title: 'Fake Recruitment & Job Scams',
    localTerm: 'Registration Fee Bait',
    description: 'Scammers advertise high-paying remote job postings and demand upfront fees for processing, biometrics, or work laptops.',
    scamVector: 'Job boards, LinkedIn postings, or Telegram channels promising daily pay for liking videos or posting links.',
    exampleScenario: '“Congratulations, you have been selected for the Data Analyst role at Shell. You are required to pay 15,000 Naira for biometric registration and security clearance background check.”',
    redFlags: [
      'Requests for upfront payments for registration, materials, or equipment',
      'The recruiter uses a generic email address (e.g. gmail.com) instead of a company domain',
      'Extremely high pay for minimal work (e.g. liking YouTube videos)'
    ],
    preventions: [
      'Legitimate companies will NEVER ask you to pay money to get hired or work.',
      'Verify the company details on the Corporate Affairs Commission (CAC) registry.',
      'Verify the hiring manager’s identity through official corporate communication channels.'
    ]
  }
];

const ThreatEducationHub: React.FC = () => {
  const navigate = useNavigate();
  const [selectedThreat, setSelectedThreat] = useState<ThreatPattern | null>(THREATS[0]);

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">🌍 Nigerian Threat Education Hub</h2>
        <p className="academy-section-desc">Localized cyber safety education addressing common social engineering and financial fraud vectors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Select threat list */}
        <div className="lg:col-span-4 space-y-2">
          {THREATS.map((threat) => (
            <button
              key={threat.id}
              onClick={() => setSelectedThreat(threat)}
              className={`w-full text-left p-3.5 border rounded cursor-pointer transition-all flex flex-col gap-1 ${
                selectedThreat?.id === threat.id
                  ? 'bg-cyber-surface border-cyber-cyan text-white shadow-[0_0_8px_rgba(0,245,255,0.15)]'
                  : 'bg-cyber-bg/40 border-cyber-border text-cyber-ash2 hover:border-cyber-ash2'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold font-display">{threat.title}</span>
                <span className="text-[0.54rem] bg-cyber-red-dim border border-cyber-border-red text-cyber-red px-1.5 py-0.5 rounded font-mono uppercase">
                  {threat.localTerm}
                </span>
              </div>
              <span className="text-[0.62rem] line-clamp-2 mt-1 leading-relaxed">{threat.description}</span>
            </button>
          ))}
        </div>

        {/* Right Side: Threat Dossier */}
        <div className="lg:col-span-8">
          {selectedThreat ? (
            <div className="bg-cyber-surface border border-cyber-border rounded overflow-hidden">
              {/* Dossier Header */}
              <div className="bg-cyber-bg2 px-4 py-2.5 border-b border-cyber-border flex justify-between items-center">
                <span className="font-mono text-[0.66rem] text-cyber-ash">THREAT DOSSIER // ID_{selectedThreat.id.toUpperCase()}</span>
                <span className="font-mono text-[0.66rem] text-cyber-red font-bold">STATUS: CRITICAL VECTOR</span>
              </div>

              <div className="p-5 space-y-4 text-xs font-sans">
                {/* Title */}
                <div>
                  <h3 className="text-white text-sm font-bold font-display tracking-wider uppercase">{selectedThreat.title}</h3>
                  <div className="text-[0.66rem] text-cyber-red font-mono mt-0.5">LOCAL ALIAS: {selectedThreat.localTerm}</div>
                </div>

                {/* Vector */}
                <div className="bg-cyber-bg p-3.5 border-l-2 border-cyber-red rounded space-y-1">
                  <h4 className="text-white font-mono text-[0.64rem] font-bold">🚨 THE ATTACK VECTOR:</h4>
                  <p className="text-cyber-ash leading-relaxed">{selectedThreat.scamVector}</p>
                </div>

                {/* Scenario */}
                <div className="bg-cyber-bg p-3.5 border-l-2 border-cyber-cyan rounded space-y-1">
                  <h4 className="text-white font-mono text-[0.64rem] font-bold">🎭 SCENARIO IN ACTION:</h4>
                  <p className="text-cyber-ash italic leading-relaxed">{selectedThreat.exampleScenario}</p>
                </div>

                {/* Red Flags & Preventions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Red Flags */}
                  <div className="bg-cyber-bg p-3.5 border border-cyber-border rounded space-y-2">
                    <h4 className="text-cyber-amber font-mono text-[0.64rem] font-bold">⚠️ RED FLAGS TO WATCH:</h4>
                    <ul className="space-y-1.5 list-inside list-disc text-cyber-ash text-[0.66rem] leading-relaxed">
                      {selectedThreat.redFlags.map((flag, idx) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Preventions */}
                  <div className="bg-cyber-bg p-3.5 border border-cyber-border rounded space-y-2">
                    <h4 className="text-cyber-green font-mono text-[0.64rem] font-bold">🛡️ COUNTER-MEASURES / PREVENTIONS:</h4>
                    <ul className="space-y-1.5 list-inside list-disc text-cyber-ash text-[0.66rem] leading-relaxed">
                      {selectedThreat.preventions.map((prev, idx) => (
                        <li key={idx}>{prev}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-cyber-bg border border-cyber-border border-dashed rounded p-12 text-center text-cyber-ash3 font-mono text-xs">
              Select a threat dossier from the index to review analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatEducationHub;
