import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Article {
  id: string;
  category: 'security' | 'privacy' | 'ai-safety' | 'fraud-prevention';
  title: string;
  summary: string;
  content: string;
  warningSigns?: string[];
  preventions?: string[];
}

const ARTICLES: Article[] = [
  {
    id: 'k-1',
    category: 'fraud-prevention',
    title: 'WhatsApp Registration Code Scam',
    summary: 'Attackers hijack accounts by tricking victims into revealing WhatsApp registration SMS codes.',
    content: 'WhatsApp uses a 6-digit SMS code to verify registration on new mobile devices. Attackers request this code by calling victims, posing as administrators of local groups, religious bodies, or event registrations. Once they obtain the code, they register the victim\'s phone number on their device and take full control of the account, locking the victim out.',
    warningSigns: [
      'Unsolicited phone calls requesting code readouts.',
      'Receiving a WhatsApp verification code SMS without starting a login yourself.'
    ],
    preventions: [
      'Never read any authentication codes over the phone.',
      'Enable WhatsApp two-step verification with a secondary security PIN.'
    ]
  },
  {
    id: 'k-2',
    category: 'security',
    title: 'Content Security Policy (CSP)',
    summary: 'An HTTP response header that restricts resource and script execution inside the browser.',
    content: 'Content Security Policy is an effective HTTP header mitigation against Cross-Site Scripting (XSS) and data injection vulnerabilities. By defining CSP directives (like script-src, frame-ancestors, default-src), site owners declare which domains are authorized sources of scripts and frame loaders. The browser restricts execution of inline scripts and unauthorized external CDN files.',
    warningSigns: [
      'Violations are logged in browser console alerts.',
      'Absence of CSP headers allows browser scripts to execute arbitrary injected tags.'
    ],
    preventions: [
      'Serve the Content-Security-Policy header in site configuration files.',
      'Limit script-src origins to self or trusted domains.'
    ]
  },
  {
    id: 'k-3',
    category: 'privacy',
    title: 'Tracking Pixels & Cookies',
    summary: 'Web beacons and cookies that capture visitor behavior, locations, and system configurations.',
    content: 'Third-party tracking cookies and microscopic transparent images (pixels) are embedded on websites to construct behavioral profiles of visitors. These tools record link interactions, browser fingerprint properties, and telemetry logs, often selling user data packages to ad servers. Implementing HttpOnly, Secure, and SameSite flags restricts cookie leakages.',
    warningSigns: [
      'Frequent third-party cookies detected in browser inspector.',
      'Websites utilizing scripts from external advertising domains.'
    ],
    preventions: [
      'Use cookie blockers or privacy-oriented browser configurations.',
      'Implement strict SameSite=Strict properties on application credentials.'
    ]
  },
  {
    id: 'k-4',
    category: 'ai-safety',
    title: 'Deepfake & Synthetic Media Literacy',
    summary: 'Using generative AI tools to synthesize audio and video clips mimicking trusted individuals.',
    content: 'Generative Adversarial Networks (GANs) and diffusion models enable attackers to create highly realistic fake audio calls or videos of directors, political figures, or family members. These synthetic medias are deployed in social engineering calls to request financial wires or compromise company directories.',
    warningSigns: [
      'Mismatched lip synchronization or unusual facial blurs in video calls.',
      'Robotic voice modulations or slight pauses in unexpected telephone instructions.'
    ],
    preventions: [
      'Set up secret family or corporate safety verbal passwords to verify identity out-of-band.',
      'Examine media files for metadata inconsistencies before believing claims.'
    ]
  }
];

const KnowledgeCenter: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(ARTICLES[0]);

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || art.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">📖 Cyber Knowledge & Fraud Database</h2>
        <p className="academy-section-desc">Searchable encyclopedia covering cybersecurity protocols, privacy mechanisms, and social engineering threat patterns.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-shrink-0">
        <div className="md:col-span-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles (e.g. CSP, WhatsApp OTP, Deepfakes)..."
            className="w-full bg-cyber-surface border border-cyber-border text-white text-xs font-mono rounded px-3 py-2.5 focus:outline-none focus:border-cyber-cyan"
          />
        </div>
        <div className="md:col-span-4">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full bg-cyber-surface border border-cyber-border text-white text-xs rounded p-2.5 focus:outline-none"
          >
            <option value="all">ALL CATEGORIES</option>
            <option value="security">WEB SECURITY</option>
            <option value="privacy">PRIVACY & COOKIES</option>
            <option value="ai-safety">AI SAFETY</option>
            <option value="fraud-prevention">FRAUD PREVENTION</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Articles List */}
        <div className="lg:col-span-5 space-y-2">
          {filteredArticles.length === 0 ? (
            <div className="text-center p-6 text-cyber-ash3 font-mono text-xs border border-cyber-border border-dashed rounded">
              NO MATCHING ARTICLES FOUND
            </div>
          ) : (
            filteredArticles.map((art) => (
              <button
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`w-full text-left p-3.5 border rounded cursor-pointer transition-all flex flex-col gap-1 ${
                  selectedArticle?.id === art.id
                    ? 'bg-cyber-surface border-cyber-cyan text-white shadow-[0_0_8px_rgba(0,245,255,0.15)]'
                    : 'bg-cyber-bg/40 border-cyber-border text-cyber-ash2 hover:border-cyber-ash2'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-bold font-display">{art.title}</span>
                  <span className="text-[0.52rem] border border-cyber-border text-cyber-ash3 px-1 rounded uppercase font-mono">
                    {art.category}
                  </span>
                </div>
                <p className="text-[0.62rem] text-cyber-ash2 mt-1 leading-normal line-clamp-2">{art.summary}</p>
              </button>
            ))
          )}
        </div>

        {/* Read Panel */}
        <div className="lg:col-span-7">
          {selectedArticle ? (
            <div className="bg-cyber-surface border border-cyber-border rounded overflow-hidden">
              <div className="bg-cyber-bg2 px-4 py-2 border-b border-cyber-border flex justify-between font-mono text-[0.66rem] text-cyber-ash">
                <span>ENCYCLOPEDIA DICTIONARY SHEET</span>
                <span className="uppercase text-[0.62rem] text-cyber-cyan">{selectedArticle.category} // INF_KNOWLEDGE</span>
              </div>

              <div className="p-5 space-y-4 font-sans text-xs select-text">
                <div>
                  <h3 className="text-white text-sm font-bold font-display tracking-wider uppercase">{selectedArticle.title}</h3>
                  <p className="text-cyber-ash leading-relaxed mt-2">{selectedArticle.content}</p>
                </div>

                {selectedArticle.warningSigns && selectedArticle.warningSigns.length > 0 && (
                  <div className="bg-cyber-bg p-3.5 border border-cyber-border rounded space-y-1.5">
                    <h4 className="text-cyber-amber font-mono text-[0.62rem] font-bold">⚠️ COMMON INDICATORS & WARNINGS:</h4>
                    <ul className="list-inside list-disc text-cyber-ash text-[0.64rem] space-y-1 leading-relaxed">
                      {selectedArticle.warningSigns.map((w, idx) => <li key={idx}>{w}</li>)}
                    </ul>
                  </div>
                )}

                {selectedArticle.preventions && selectedArticle.preventions.length > 0 && (
                  <div className="bg-cyber-bg p-3.5 border border-cyber-border rounded space-y-1.5">
                    <h4 className="text-cyber-green font-mono text-[0.62rem] font-bold">🛡️ COUNTER-MEASURES:</h4>
                    <ul className="list-inside list-disc text-cyber-ash text-[0.64rem] space-y-1 leading-relaxed">
                      {selectedArticle.preventions.map((p, idx) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-cyber-bg border border-cyber-border border-dashed rounded p-12 text-center text-cyber-ash3 font-mono text-xs">
              Select an encyclopedia article to start reading.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeCenter;
