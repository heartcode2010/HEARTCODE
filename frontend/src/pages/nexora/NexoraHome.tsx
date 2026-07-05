import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscriptionStore from '../../store/subscriptionStore';
import { ArrowLeft, Sparkles, Video, Camera, ShieldCheck, Heart, User, Award, ArrowUpRight, Compass, ShieldAlert } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const NexoraHome: React.FC = () => {
  const navigate = useNavigate();
  const { tier } = useSubscriptionStore();

  const [tab, setTab] = useState<'director' | 'brand' | 'rentals' | 'copyright'>('director');

  // AI Director form state
  const [contentType, setContentType] = useState('vlog');
  const [platform, setPlatform] = useState('tiktok');
  const [promptText, setPromptText] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Copyright Hunter alert state
  const [alerts, setAlerts] = useState([
    { id: '1', title: 'Unauthorized Video Reupload', platform: 'YouTube', status: 'Flagged / Pending Take-down', date: '2026-07-01' },
    { id: '2', title: 'Asset Logo Copyright Match', platform: 'Instagram Ads', status: 'Take-down complete', date: '2026-06-28' },
  ]);

  const handleGenerateScript = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setAiOutput(`### AI Generated Script: "${promptText}"
- **Platform Optimized:** ${platform.toUpperCase()}
- **Duration Estimate:** 60 seconds
- **Audio Cue:** High-energy lo-fi intro beat (mix t1)

#### Shot List:
1. **[0-5s] Wide Shot:** Creator sitting at TechLabs studio workspace.
   * *Camera Angle:* Eye level, background lighting set to cyan/purple gradient glow.
   * *Lighting suggestion:* Ambient backlights + key softbox at 45°.
2. **[5-30s] Screen Record Overlay:** Compiling Javascript in real time.
3. **[30-60s] Close Up:** Action call-to-action to check out Technova OS subscription plans!

#### Brand Guidelines / Thumbnail Concept:
- High contrast overlay, overlay text: "VIBE CODING SAFELY". Accent color: #00d4ff.`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans select-none">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-3 cursor-pointer font-mono uppercase tracking-wider">
                <ArrowLeft size={14} /> Back to Hub
              </button>
              <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <Sparkles size={24} className="text-[#8b5cf6]" /> NEXORA AI CREATOR OS
              </h1>
              <p className="text-xs text-[#6e6868] mt-1">Futuristic brand manager, smart studio reservations, equipment rentals, and copyright matching.</p>
            </div>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Camera size={14} /> Creator Marketplace
            </button>
          </div>

          <div className="flex gap-1 mb-8 bg-[#111114] rounded-xl p-1 border border-[#2a2a2e] w-fit">
            {(['director', 'brand', 'rentals', 'copyright'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${tab === t ? 'bg-[#1a1a20] text-white shadow-md' : 'text-[#6e6868] hover:text-white'}`}
              >
                {t === 'director' ? 'AI Director Studio' : t === 'brand' ? 'AI Brand Builder' : t === 'rentals' ? 'Rentals & Studios' : 'Copyright Hunter'}
              </button>
            ))}
          </div>

          {tab === 'director' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <form onSubmit={handleGenerateScript} className="md:col-span-1 bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Create Shot list & script</h3>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Content Prompt</label>
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="e.g. Funny student coding life during exam period..."
                    rows={4}
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Target Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                  >
                    <option value="tiktok">TikTok Video</option>
                    <option value="youtube">YouTube Short / Video</option>
                    <option value="instagram">Instagram Reel</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Video size={14} /> {isLoading ? 'Generating Plan...' : 'Generate Script Layout'}
                </button>
              </form>

              <div className="md:col-span-2">
                {aiOutput ? (
                  <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl select-text">
                    <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-4">Director Telemetry Output</h3>
                    <pre className="text-xs text-[#b0a8a8] whitespace-pre-wrap leading-relaxed select-text font-sans">
                      {aiOutput}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl h-full flex flex-col items-center justify-center text-center text-[#6e6868] text-xs font-mono uppercase">
                    Configure targets and prompt script script to trigger director suggestions.
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'brand' && (
            <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Technova Brand Guidelines Builder</h3>
                <p className="text-xs text-[#b0a8a8] leading-relaxed mb-4">
                  Generates colors, logos, and typography structures for content templates.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Primary Accent', color: '#00d4ff' },
                    { name: 'Secondary Highlight', color: '#8b5cf6' },
                    { name: 'Dark Surface', color: '#111114' },
                    { name: 'Alert Glow', color: '#e02840' },
                  ].map((col, idx) => (
                    <div key={idx} className="bg-[#0c0c0e] border border-[#2a2a2e] p-4 rounded-xl text-center">
                      <div className="w-12 h-12 rounded-xl mx-auto mb-2 border border-white/5" style={{ backgroundColor: col.color }} />
                      <div className="text-[0.62rem] font-bold text-white">{col.name}</div>
                      <div className="text-[0.55rem] font-mono text-[#6e6868] uppercase mt-0.5">{col.color}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'rentals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Book Video Production Studios</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Lagos Creative Hub Room 4A', price: '₦15,000 / hr', specs: 'Green screen, 4K cameras, priority lighting rigs' },
                    { name: 'Abuja Podcast Sandbox Room B', price: '₦8,000 / hr', specs: 'Sennheiser mics, acoustic treatment, static desk' },
                  ].map((studio, idx) => (
                    <div key={idx} className="p-4 bg-[#0c0c0e] rounded-xl border border-[#1a1a20] flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-extrabold text-white mb-1">{studio.name}</h4>
                        <p className="text-[0.62rem] text-[#6e6868]">{studio.specs}</p>
                      </div>
                      <button
                        onClick={() => alert(`Reserved ${studio.name} successfully!`)}
                        className="px-3 py-1.5 bg-white text-black hover:opacity-90 font-extrabold text-[0.62rem] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                      >
                        Book {studio.price.split(' ')[0]}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Equipment Rentals</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Sony FX3 Cinema Camera', price: '₦20,000 / day', cat: 'Camera' },
                    { name: 'DJI Mic 2 Wireless Set', price: '₦5,000 / day', cat: 'Audio' },
                  ].map((eq, idx) => (
                    <div key={idx} className="p-4 bg-[#0c0c0e] rounded-xl border border-[#1a1a20] flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-extrabold text-white mb-1">{eq.name}</h4>
                        <span className="text-[0.58rem] font-mono uppercase bg-white/5 px-2 py-0.5 rounded text-gray-500">{eq.cat}</span>
                      </div>
                      <button
                        onClick={() => alert(`Rented ${eq.name} successfully!`)}
                        className="px-3 py-1.5 bg-white/5 border border-[#2a2a2e] text-white hover:bg-white/10 font-extrabold text-[0.62rem] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                      >
                        Rent
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'copyright' && (
            <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-4">
              <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#a78bfa]" /> Copyright Hunter Alerts
              </h3>
              <p className="text-xs text-[#b0a8a8] leading-relaxed">
                Monitors web directories, YouTube channels, and crawlers for unauthorized matches of your creative content.
              </p>
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id} className="p-4 bg-[#0c0c0e] rounded-xl border border-[#1a1a20] flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-extrabold text-white mb-1">{alert.title}</h4>
                      <p className="text-[0.62rem] text-[#6e6868]">Platform: {alert.platform} · Detected: {alert.date}</p>
                    </div>
                    <span className="text-[0.58rem] font-mono uppercase text-[#f59e0b] bg-[#f59e0b]/10 px-2.5 py-0.5 rounded-lg">
                      {alert.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NexoraHome;
