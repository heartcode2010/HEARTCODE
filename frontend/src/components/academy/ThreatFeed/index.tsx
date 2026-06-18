import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FeedItem {
  id: string;
  date: string;
  source: string;
  threat: string;
  risk: 'critical' | 'high' | 'medium';
  action: string;
}

const FEED_ITEMS: FeedItem[] = [
  {
    id: 'f-1',
    date: 'JUN 16, 2026',
    source: 'CBN Security Advisory',
    threat: 'Fake grant empowerment web links distributing POS credential stealer scripts via WhatsApp threads.',
    risk: 'critical',
    action: 'Block and delete messages with domains ending in .online.'
  },
  {
    id: 'f-2',
    date: 'JUN 14, 2026',
    source: 'NIPOST Comms',
    threat: 'Postal parcel delivery redirect SMS baiting victims with 250 NGN credit card processing fee.',
    risk: 'high',
    action: 'Never enter credit card details on .cc postal redirect domains.'
  },
  {
    id: 'f-3',
    date: 'JUN 11, 2026',
    source: 'National Cert Team',
    threat: 'Active credential spraying campaigns targeting webmail endpoints using default remote desktop ports.',
    risk: 'high',
    action: 'Enforce strong passwords and close standard Port 3389 where unused.'
  },
  {
    id: 'f-4',
    date: 'JUN 08, 2026',
    source: 'Heartcode Threat Intel',
    threat: 'AI-generated voice synthesis deepfakes impersonating company CEOs asking for payroll redirection.',
    risk: 'medium',
    action: 'Establish secondary out-of-band code phrases to authenticate executive voice calls.'
  }
];

const ThreatFeed: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">📡 Educational Threat Intel Feed</h2>
        <p className="academy-section-desc">Emerging social engineering trends, phishing campaign alerts, and real-world fraud pattern advisories.</p>
      </div>

      {/* scrolling ticker ribbon */}
      <div className="w-full bg-[#1b1015] border border-cyber-border-red rounded overflow-hidden p-2.5 flex items-center gap-3">
        <span className="bg-cyber-red border border-cyber-border-red text-white font-mono font-bold text-[0.56rem] px-2 py-0.5 rounded flex-shrink-0 animate-pulse">
          LIVE TAPE TICKER
        </span>
        <div className="flex-1 overflow-hidden whitespace-nowrap text-cyber-red font-mono text-[0.66rem] relative">
          <div className="inline-block animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] cursor-default">
            🚨 CBN GRANT SCAMS SPREADING VIA WHATSAPP // 🚨 FAKE SMS BANKING ALERTS REPORTED BY MERCHANTS // 🚨 PORT 3389 EXPOSURES ON PRIVATE IP SPANS // 🚨 NEW CEO VOICE CLONES DETECTED IN WEBMAIL COMPROMISES
          </div>
        </div>
      </div>

      <div className="bg-cyber-surface border border-cyber-border rounded overflow-hidden">
        <div className="bg-cyber-bg2 px-4 py-2.5 border-b border-cyber-border flex justify-between font-mono text-[0.66rem] text-cyber-ash">
          <span>THREAT INTELLIGENCE FEED DATASET</span>
          <span className="text-cyber-red font-bold">MONITOR ACTIVE</span>
        </div>

        <div className="divide-y divide-cyber-border/40 font-sans text-xs">
          {FEED_ITEMS.map((item) => (
            <div key={item.id} className="p-4 bg-cyber-bg/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 font-mono text-[0.6rem]">
                  <span className="text-cyber-ash3">{item.date}</span>
                  <span className="text-cyber-ash2">•</span>
                  <span className="text-white font-bold">{item.source}</span>
                  <span className="text-cyber-ash2">•</span>
                  <span className={`px-1.5 py-0.5 rounded text-[0.52rem] uppercase font-bold border ${
                    item.risk === 'critical' ? 'bg-cyber-red/10 border-cyber-red text-cyber-red animate-pulse' :
                    item.risk === 'high' ? 'bg-cyber-red/5 border-cyber-border-red text-cyber-red' :
                    'bg-cyber-amber/5 border-cyber-border text-cyber-amber'
                  }`}>
                    {item.risk} Risk
                  </span>
                </div>
                <p className="text-cyber-ash text-[0.72rem] leading-relaxed">{item.threat}</p>
              </div>

              <div className="bg-cyber-surface border border-cyber-border p-2.5 rounded font-mono text-[0.62rem] text-cyber-cyan max-w-xs leading-normal">
                <span className="text-white font-bold block mb-0.5">MITIGATION ACT:</span>
                {item.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreatFeed;
