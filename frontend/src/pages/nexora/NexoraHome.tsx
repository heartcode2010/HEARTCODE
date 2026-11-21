import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscriptionStore from '../../store/subscriptionStore';
import { ArrowLeft, Sparkles, Video, Camera, ShieldCheck, Heart, User, Award, ArrowUpRight, Compass, ShieldAlert } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import api from '../../services/api';

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
  const [aiProvider, setAiProvider] = useState('');
  const [aiError, setAiError] = useState('');
  const [brandName, setBrandName] = useState('');
  const [brandIndustry, setBrandIndustry] = useState('');
  const [brandAudience, setBrandAudience] = useState('');
  const [brandTone, setBrandTone] = useState('Confident and modern');
  const [brandOutput, setBrandOutput] = useState('');
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandError, setBrandError] = useState('');

  // Copyright Hunter alert state
  const [alerts] = useState<any[]>([]);
  const [serviceNotice, setServiceNotice] = useState('');

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setIsLoading(true);
    setAiError('');
    setAiOutput('');
    try {
      const { data } = await api.post('/ai-tools/nexora/script', { promptText, contentType, platform });
      setAiOutput(data.content || '');
      setAiProvider(data.provider || 'AI provider');
    } catch (error: any) {
      setAiError(error?.response?.data?.message || 'AI generation failed. Check the backend provider configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBrandBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandLoading(true);
    setBrandError('');
    setBrandOutput('');
    try {
      const { data } = await api.post('/ai-tools/nexora/brand-brief', {
        brandName, industry: brandIndustry, audience: brandAudience, tone: brandTone,
      });
      setBrandOutput(data.content || '');
    } catch (error: any) {
      setBrandError(error?.response?.data?.message || 'Brand brief generation failed. Check the AI provider configuration.');
    } finally {
      setBrandLoading(false);
    }
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
              <p className="text-xs text-[#6e6868] mt-1">AI-assisted script and brand strategy tools. Studio booking, equipment rental and copyright monitoring are not connected yet.</p>
            </div>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Camera size={14} /> Creator Marketplace
            </button>
          </div>

          {serviceNotice && <div className="mb-4 p-3 rounded-lg border border-[#794056] bg-[#321c29] text-[#ffc4d1] text-xs">{serviceNotice}</div>}

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
                {aiError && <div className="mb-3 p-3 rounded-lg border border-[#794056] bg-[#321c29] text-[#ffc4d1] text-xs">{aiError}</div>}
                {aiOutput ? (
                  <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl select-text">
                    <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">AI Director Output · {aiProvider.toUpperCase()}</h3>
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
              <form onSubmit={handleGenerateBrandBrief} className="space-y-4">
                <div>
                  <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Nexora AI Brand Strategist</h3>
                  <p className="text-xs text-[#b0a8a8] leading-relaxed">Generate a practical brand strategy brief using a configured AI provider. This creates a text brief, not a finished logo or visual identity.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={brandName} onChange={e=>setBrandName(e.target.value)} placeholder="Brand or business name" className="bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl text-white" required />
                  <input value={brandIndustry} onChange={e=>setBrandIndustry(e.target.value)} placeholder="Industry" className="bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl text-white" required />
                  <input value={brandAudience} onChange={e=>setBrandAudience(e.target.value)} placeholder="Target audience" className="bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl text-white" required />
                  <select value={brandTone} onChange={e=>setBrandTone(e.target.value)} className="bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl text-white"><option>Confident and modern</option><option>Friendly and approachable</option><option>Premium and elegant</option><option>Bold and energetic</option><option>Simple and trustworthy</option></select>
                </div>
                <button disabled={brandLoading} className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-xs font-extrabold text-white disabled:opacity-50">{brandLoading?'Generating…':'Generate brand strategy brief'}</button>
              </form>
              {brandError&&<p className="text-xs text-[#ffc4d1]">{brandError}</p>}
              {brandOutput&&<pre className="whitespace-pre-wrap bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl p-5 text-xs leading-relaxed text-[#c8c3d4]">{brandOutput}</pre>}
              <div>
                <h4 className="text-[0.62rem] font-mono text-[#6e6868] uppercase tracking-wider mb-3">TECHNOVA sample palette reference</h4>
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
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Studio directory preview</h3>
                <p className="text-[0.65rem] text-[#f0b27d] mb-3">Illustrative sample listings only. Booking is not connected and no reservation can be made.</p>
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
                        onClick={() => setServiceNotice('Studio booking is not connected yet. No reservation was made.')}
                        className="px-3 py-1.5 bg-white text-black hover:opacity-90 font-extrabold text-[0.62rem] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                      >
                        Book {studio.price.split(' ')[0]}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Equipment directory preview</h3>
                <p className="text-[0.65rem] text-[#f0b27d] mb-3">Illustrative sample listings only. Rental inventory and payment are not connected.</p>
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
                        onClick={() => setServiceNotice('Equipment rental is not connected yet. No rental was created.')}
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
                Live web monitoring, rights matching and takedown integrations are not connected yet. No automated monitoring is being performed.
              </p>
              <div className="space-y-3">
                {alerts.length === 0 && <p className="text-xs text-[#8a8080] p-4 bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl">No live copyright alerts. Connect a rights-monitoring provider before relying on this feature.</p>}
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
