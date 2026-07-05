import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBotStore, Bot } from '../store/botStore';
import { Bot as BotIcon, ArrowLeft, Star, Play, Cpu } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const BotMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const { bots, installBot, uninstallBot } = useBotStore();
  const [filter, setFilter] = useState<'all' | 'installed' | 'moderation' | 'education' | 'utility'>('all');

  const handleInstallToggle = async (bot: Bot) => {
    if (bot.isInstalled) {
      const confirmRemove = window.confirm(`Uninstall ${bot.name}?`);
      if (confirmRemove) uninstallBot(bot.id);
    } else {
      const success = await installBot(bot.id);
      if (success) {
        alert(`${bot.name} installed successfully!`);
      }
    }
  };

  const filteredBots = bots.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'installed') return b.isInstalled;
    return b.category === filter;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-3 cursor-pointer font-mono uppercase tracking-wider">
                <ArrowLeft size={14} /> Back to Hub
              </button>
              <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <BotIcon size={26} className="text-[#8b5cf6]" /> BOT MARKETPLACE
              </h1>
              <p className="text-xs text-[#6e6868] mt-1">Supercharge DMs, groups, and automated channel streams with Technova Bots.</p>
            </div>
            <button
              onClick={() => navigate('/bot-creator')}
              className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Cpu size={14} /> Custom Bot Studio
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {(['all', 'installed', 'moderation', 'education', 'utility'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${filter === tab ? 'bg-[#111114] border border-white/10 text-white' : 'bg-transparent border border-[#2a2a2e] text-[#6e6868] hover:text-white'}`}
              >
                {tab === 'installed' ? 'My Installed Bots' : `${tab} Bots`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBots.map(bot => (
              <div key={bot.id} className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl flex gap-4 hover:border-[#383842] transition-colors relative overflow-hidden">
                {bot.isInstalled && (
                  <div className="absolute top-0 right-0 bg-[#8b5cf6]/10 text-[#a78bfa] border-b border-l border-[#8b5cf6]/20 px-3 py-1 rounded-bl-xl text-[0.58rem] font-mono uppercase tracking-wider font-bold">
                    ✓ Installed
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#00d4ff]/20 flex items-center justify-center text-2xl flex-shrink-0">
                  {bot.avatarUrl}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-extrabold text-white text-sm">{bot.name}</h3>
                      <span className="text-[0.62rem] font-mono text-[#6e6868]">{bot.username}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[0.62rem] font-mono text-[#6e6868] uppercase mb-3">
                      <span>Dev: {bot.developer}</span>
                      <span className="flex items-center gap-0.5 text-[#f59e0b]"><Star size={10} className="fill-[#f59e0b]" /> {bot.rating}</span>
                      <span>Installs: {bot.installCount}</span>
                    </div>
                    <p className="text-xs text-[#b0a8a8] leading-relaxed mb-4">{bot.description}</p>

                    <div className="mb-4">
                      <span className="text-[0.58rem] font-mono text-[#6e6868] uppercase tracking-wider block mb-1.5">Supported Command Loops</span>
                      <div className="flex flex-wrap gap-1.5">
                        {bot.commands.map((cmd, idx) => (
                          <span key={idx} className="text-[0.58rem] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[#8b5cf6]" title={cmd.description}>
                            {cmd.command}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleInstallToggle(bot)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${bot.isInstalled ? 'bg-transparent border border-[#e02840]/30 text-[#e02840] hover:bg-[#e02840]/5' : 'bg-white text-black hover:opacity-90'}`}
                    >
                      {bot.isInstalled ? 'Uninstall' : bot.isMonetized ? `Buy for ₦${bot.priceNGN}` : 'Get / Install'}
                    </button>
                    {bot.isInstalled && (
                      <button
                        onClick={() => navigate('/messages')}
                        className="px-3 bg-white/5 border border-[#2a2a2e] rounded-xl hover:bg-white/10 text-white cursor-pointer"
                        title="Interact with Bot in Chats Stream"
                      >
                        <Play size={12} className="fill-white" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BotMarketplace;
