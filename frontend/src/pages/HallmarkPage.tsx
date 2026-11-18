import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useHallmarkStore, { HALLMARK_CONFIG } from '../store/hallmarkStore';
import { Shield, Blocks, Sparkles, Code2, GraduationCap, Wrench, Trophy, Zap, Lock, Unlock, ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const HallmarkPage: React.FC = () => {
  const navigate = useNavigate();
  const { verseProgress, getProgressPercent, getNextMilestone, getVerseMilestone, getOverallLevel } = useHallmarkStore();
  const [selectedVerse, setSelectedVerse] = useState<string>('cyberverse');

  const verses = [
    { id: 'cyberverse', name: 'CyberVerse', icon: Shield, color: '#e02840' },
    { id: 'blockchainverse', name: 'BlockchainVerse', icon: Blocks, color: '#f7931a' },
    { id: 'nexora', name: 'Nexora Studio', icon: Sparkles, color: '#8b5cf6' },
    { id: 'techverse', name: 'TechVerse Compiler', icon: Code2, color: '#00d4ff' },
    { id: 'eduverse', name: 'EduVerse Academy', icon: GraduationCap, color: '#10b981' },
    { id: 'techlabs', name: 'TechLabs Editor', icon: Wrench, color: '#ec4899' },
  ];

  const currentMilestone = getVerseMilestone(selectedVerse);
  const nextMilestone = getNextMilestone(selectedVerse);
  const progressPercent = getProgressPercent(selectedVerse);
  const overallLevel = getOverallLevel();

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-6 cursor-pointer font-mono uppercase tracking-wider">
            <ArrowLeft size={14} /> Back to Hub
          </button>

          <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-[#e02840] rounded-xl flex items-center justify-center shadow-lg">
                <Trophy size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>HALLMARK PROGRESSION</h1>
                <p className="text-xs text-[#6e6868]">Gamified milestones. Complete courses and tasks to unlock custom workspace options.</p>
              </div>
            </div>
            <div className="bg-[#1a1a20] border border-[#2a2a2e] px-4 py-2 rounded-xl text-center">
              <div className="text-[0.62rem] text-[#6e6868] uppercase font-mono tracking-wider font-bold">Overall Rank</div>
              <div className="text-lg font-black text-[#f59e0b]">Level {overallLevel}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
            {verses.map(v => {
              const Icon = v.icon;
              const isSelected = selectedVerse === v.id;
              const lvl = verseProgress[v.id]?.level || 'novice';
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVerse(v.id)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${isSelected ? 'bg-[#111114] text-white border-white/20' : 'bg-transparent text-[#6e6868] border-[#2a2a2e] hover:text-white'}`}
                >
                  <Icon size={20} className="mx-auto mb-2" style={{ color: isSelected ? v.color : undefined }} />
                  <div className="text-[0.68rem] font-bold">{v.name}</div>
                  <div className="text-[0.55rem] font-mono capitalize text-[#6e6868] mt-1">{lvl}</div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl h-fit">
              <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-4">Current Milestone</h3>
              <div className="text-center py-4 border-b border-[#2a2a2e] mb-4">
                <span className="text-4xl block mb-2">{currentMilestone?.icon}</span>
                <h4 className="text-sm font-extrabold text-white">{currentMilestone?.title}</h4>
                <span className="text-[0.58rem] font-mono uppercase bg-white/5 px-2 py-0.5 rounded text-[#6e6868] block w-fit mx-auto mt-2">
                  {currentMilestone?.level}
                </span>
              </div>

              {nextMilestone ? (
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-[#6e6868]">Next Rank Progress</span>
                    <span className="font-mono text-[#f59e0b] font-bold">{progressPercent}%</span>
                  </div>
                  <div className="h-2 bg-[#1a1a20] rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#e02840] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <p className="text-[0.6rem] text-[#6e6868] leading-normal font-mono">
                    XP Required: {verseProgress[selectedVerse]?.xp} / {nextMilestone.xpRequired} XP
                  </p>
                </div>
              ) : (
                <div className="text-center py-2 text-[0.68rem] text-[#2ea86a] font-mono uppercase font-bold">
                  🎉 Max Hallmark Achieved!
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl">
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-4">Milestone Unlocks Roadmap</h3>
                <div className="space-y-4">
                  {HALLMARK_CONFIG[selectedVerse]?.map(milestone => {
                    const currentXP = verseProgress[selectedVerse]?.xp || 0;
                    const isUnlocked = currentXP >= milestone.xpRequired;

                    return (
                      <div key={milestone.level} className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${isUnlocked ? 'bg-white/[0.01] border-[#2a2a2e]' : 'bg-[#0c0c0e]/30 border-[#222226] opacity-40'}`}>
                        <div className="text-2xl mt-0.5">{milestone.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                              {milestone.title}
                              <span className="text-[0.55rem] font-mono text-[#6e6868] uppercase">({milestone.level})</span>
                            </h4>
                            <span className="text-[0.6rem] font-mono text-[#6e6868]">
                              {milestone.xpRequired} XP
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#1a1a20]">
                            <div>
                              <div className="text-[0.58rem] font-mono uppercase text-[#6e6868] mb-1">Unlocks Features</div>
                              <ul className="space-y-1">
                                {milestone.unlocksFeatures.map((f, idx) => (
                                  <li key={idx} className="text-[0.62rem] text-[#b0a8a8] flex items-center gap-1">
                                    {isUnlocked ? <Unlock size={10} className="text-[#2ea86a]" /> : <Lock size={10} className="text-gray-500" />} {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-[0.58rem] font-mono uppercase text-[#6e6868] mb-1">Unlocks AI Tools</div>
                              <ul className="space-y-1">
                                {milestone.unlocksAITools.map((f, idx) => (
                                  <li key={idx} className="text-[0.62rem] text-[#b0a8a8] flex items-center gap-1">
                                    {isUnlocked ? <Unlock size={10} className="text-[#2ea86a]" /> : <Lock size={10} className="text-gray-500" />} {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HallmarkPage;
