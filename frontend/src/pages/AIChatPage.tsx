import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAIStore, { AI_PROVIDERS, AI_PERSONALITIES, AI_TOOLS } from '../store/aiStore';
import { Send, Plus, Trash2, Cpu, Volume2, VolumeX, Mic } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const AIChatPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    conversations,
    activeConversationId,
    activeProvider,
    activePersonality,
    isGenerating,
    activeTool,
    createConversation,
    setActiveConversation,
    setProvider,
    setPersonality,
    sendMessage,
    deleteConversation,
    clearConversations,
    setActiveTool,
  } = useAIStore();

  const activeConvo = conversations.find(c => c.id === activeConversationId);
  const messages = activeConvo ? activeConvo.messages : [];

  const [inputText, setInputText] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText, activeTool || undefined);
    setInputText('');
    setActiveTool(null);
  };

  const handleToolClick = (toolId: string) => {
    const tool = AI_TOOLS.find(t => t.id === toolId);
    if (!tool) return;
    setActiveTool(toolId);
    setInputText(tool.prompt + ' ');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-6 px-4 font-sans select-none flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full">
        <div className="w-full md:w-72 bg-[#111114] border border-[#2a2a2e] p-4 rounded-2xl flex flex-col h-[600px] justify-between">
          <div className="space-y-4 overflow-hidden flex flex-col flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider">ASSISTANT SESSIONS</h3>
              <button
                onClick={() => createConversation()}
                className="p-1.5 bg-white/5 border border-white/5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                title="New Session"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {conversations.map(c => {
                const isActive = activeConversationId === c.id;
                return (
                  <div key={c.id} className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all ${isActive ? 'bg-[#00d4ff]/5 border-[#00d4ff]/30 text-white' : 'bg-transparent border-transparent text-[#6e6868] hover:text-white'}`}>
                    <button
                      onClick={() => setActiveConversation(c.id)}
                      className="flex-1 text-left text-xs font-semibold truncate mr-2"
                    >
                      {c.title}
                    </button>
                    <button
                      onClick={() => deleteConversation(c.id)}
                      className="opacity-0 group-hover:opacity-100 hover:text-[#e02840] transition-opacity cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={clearConversations}
            className="w-full mt-4 py-2 bg-transparent hover:bg-[#e02840]/5 border border-[#e02840]/20 text-[#e02840] text-[0.62rem] font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Clear History
          </button>
        </div>

        <div className="flex-1 bg-[#111114] border border-[#2a2a2e] rounded-2xl flex flex-col overflow-hidden h-[600px] relative">
          <div className="p-4 bg-[#0c0c0e] border-b border-[#2a2a2e] flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[0.55rem] font-mono text-[#6e6868] uppercase">Engine:</span>
              <div className="bg-[#111114] p-0.5 rounded-lg border border-[#2a2a2e] flex">
                {AI_PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id)}
                    className={`px-2.5 py-1 rounded-md text-[0.58rem] font-extrabold uppercase transition-all cursor-pointer ${activeProvider === p.id ? 'bg-[#1a1a20] text-white border border-white/5' : 'text-[#6e6868] hover:text-white'}`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-[#111114] border border-[#2a2a2e] rounded-xl text-gray-400 hover:text-white cursor-pointer"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0c0c0e]/20 select-text">
            {messages.map((m, idx) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id || idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xl p-3.5 rounded-2xl border ${isUser ? 'bg-[#00d4ff]/5 border-[#00d4ff]/30 text-white rounded-tr-none' : 'bg-[#1c1c1f] border-[#2a2a2e] text-[#e8e2e2] rounded-tl-none'}`}>
                    {!isUser && (
                      <span className="block text-[0.55rem] font-mono text-[#00d4ff] uppercase tracking-wider mb-1.5">
                        {m.personality ? AI_PERSONALITIES.find(p => p.id === m.personality)?.name : 'Technova Assistant'}
                      </span>
                    )}
                    {m.isLoading ? (
                      <div className="flex items-center gap-2 text-xs font-mono text-[#6e6868] animate-pulse">
                        <Cpu size={14} className="animate-spin" /> Synthesizing model response...
                      </div>
                    ) : (
                      <div className="text-xs leading-relaxed whitespace-pre-wrap select-text markdown-body">
                        {m.content}
                      </div>
                    )}
                    <span className="block text-[0.55rem] font-mono text-[#6e6868] mt-2 text-right">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-[#0c0c0e] border-t border-[#2a2a2e]">
            {activeTool && (
              <div className="bg-[#00d4ff]/5 border border-[#00d4ff]/15 px-3 py-1.5 rounded-lg mb-3 flex justify-between items-center text-[0.62rem]">
                <span className="font-mono text-[#00d4ff]">Active Tool: {AI_TOOLS.find(t => t.id === activeTool)?.name}</span>
                <button onClick={() => setActiveTool(null)} className="text-white hover:underline">Clear</button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask your AI tutor..."
                className="flex-1 bg-[#111114] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#00d4ff] placeholder-cyber-ash3 text-white"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 bg-[#00d4ff] hover:opacity-90 text-white rounded-xl cursor-pointer"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-3">
            <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider">AI Personality</h3>
            <div className="space-y-2">
              {AI_PERSONALITIES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPersonality(p.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${activePersonality === p.id ? 'bg-[#00d4ff]/5 border-[#00d4ff]/20 text-white' : 'bg-[#0c0c0e] border-[#2a2a2e] text-[#6e6868] hover:text-white'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{p.icon}</span>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs text-white truncate">{p.name}</h4>
                      <span className="text-[0.58rem] font-mono text-[#6e6868] block mt-0.5 truncate">{p.role}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-3">
            <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider">AI Toolbox</h3>
            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {AI_TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  className="p-2 bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl hover:border-[#8b5cf6]/30 text-center transition-all cursor-pointer"
                >
                  <span className="text-lg block mb-1">{tool.icon}</span>
                  <span className="text-[0.58rem] font-bold text-white truncate block">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AIChatPage;
