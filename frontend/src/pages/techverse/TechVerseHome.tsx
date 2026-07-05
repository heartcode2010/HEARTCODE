import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscriptionStore from '../../store/subscriptionStore';
import { ArrowLeft, Code, Database, Server, Cloud, ShieldAlert, Cpu, Laptop, Terminal, BookOpen, Star } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const TechVerseHome: React.FC = () => {
  const navigate = useNavigate();
  const { tier } = useSubscriptionStore();
  const [selectedTrack, setSelectedTrack] = useState<'frontend' | 'backend' | 'cyber' | 'ai'>('frontend');

  const tracks = [
    { id: 'frontend' as const, name: 'Web Dev & Frontend', icon: Laptop, color: '#00d4ff', desc: 'HTML, CSS, JavaScript, TypeScript, React, Next.js' },
    { id: 'backend' as const, name: 'Backend & DB systems', icon: Server, color: '#8b5cf6', desc: 'Node.js, Express, PostgreSQL, MySQL, Redis, AWS' },
    { id: 'cyber' as const, name: 'Cybersecurity Masterclass', icon: Terminal, color: '#e02840', desc: 'Ethical Hacking, Network Security, Cloud Security, OWASP audits' },
    { id: 'ai' as const, name: 'AI & Data Engineering', icon: Cpu, color: '#10b981', desc: 'Python, ML models, Neural nets, GPT-4, prompt engineering' },
  ];

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
                <Code size={24} className="text-[#00d4ff]" /> TECHVERSE PROGRAMMING ACADEMY
              </h1>
              <p className="text-xs text-[#6e6868] mt-1">Structured developer paths covering frontend, backend systems, cybersecurity, and machine learning models.</p>
            </div>
            <button
              onClick={() => navigate('/learning-dashboard')}
              className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <BookOpen size={14} /> Learn & Earn Syllabus
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {tracks.map(track => {
              const Icon = track.icon;
              const isSelected = selectedTrack === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-36 ${isSelected ? 'bg-[#111114] border-white/20 text-white shadow-lg' : 'bg-transparent border-[#2a2a2e] text-[#6e6868] hover:text-white'}`}
                >
                  <Icon size={24} style={{ color: isSelected ? track.color : undefined }} />
                  <div>
                    <h3 className="text-xs font-bold text-white leading-snug mb-1">{track.name}</h3>
                    <p className="text-[0.62rem] text-[#b0a8a8] leading-tight">{track.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-[#1a1a20] pb-4">
              <div>
                <span className="text-[0.58rem] font-mono uppercase text-[#6e6868] block mb-1">Active Roadmap Curriculum</span>
                <h3 className="font-extrabold text-sm text-white capitalize">{selectedTrack} Pathway Chapters</h3>
              </div>
              <button
                onClick={() => navigate('/learning-dashboard')}
                className="px-3.5 py-1.5 bg-white text-black hover:opacity-90 font-extrabold text-[0.62rem] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
              >
                Enroll Path
              </button>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Chapter 1: Getting Started Fundamentals', time: '1 hr 30 mins', difficulty: 'Beginner', xp: 50 },
                { title: 'Chapter 2: Variables, Structures and Methods', time: '3 hrs 20 mins', difficulty: 'Intermediate', xp: 120 },
                { title: 'Chapter 3: Asynchronous Loops & Data Telemetry', time: '5 hrs', difficulty: 'Advanced', xp: 200 },
              ].map((chap, idx) => (
                <div key={idx} className="p-4 bg-[#0c0c0e] rounded-xl border border-[#1a1a20] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-white mb-1.5">{chap.title}</h4>
                    <div className="flex gap-3 text-[0.62rem] font-mono text-[#6e6868] uppercase">
                      <span>Duration: {chap.time}</span>
                      <span>Level: {chap.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[0.58rem] font-mono text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded font-bold">
                      +{chap.xp} XP
                    </span>
                    <button
                      onClick={() => navigate('/learning-dashboard')}
                      className="px-3 py-1.5 bg-white/5 border border-[#2a2a2e] rounded-lg text-[0.62rem] font-bold uppercase hover:bg-white/10 text-white cursor-pointer"
                    >
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TechVerseHome;
