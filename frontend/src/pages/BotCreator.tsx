import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBotStore } from '../store/botStore';
import { ArrowLeft, Cpu, Info, AlertCircle, Save } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const BotCreator: React.FC = () => {
  const navigate = useNavigate();
  const { createBot, addWorkflow } = useBotStore();

  const [botName, setBotName] = useState('');
  const [botDesc, setBotDesc] = useState('');
  const [botCategory, setBotCategory] = useState('utility');

  const [triggerType, setTriggerType] = useState('on_message');
  const [actionType, setActionType] = useState('send_reply');
  const [replyText, setReplyText] = useState('');
  const [keyword, setKeyword] = useState('');

  const handleCreateBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!botName.trim() || !botDesc.trim()) {
      alert('Fill in bot name and description details.');
      return;
    }
    createBot(botName, botDesc, botCategory);
    alert(`Created bot successfully! Client ID token generated.`);

    if (replyText.trim()) {
      addWorkflow({
        id: `wf_${Date.now()}`,
        name: `${botName} AutoReply`,
        trigger: triggerType,
        triggerConfig: { keyword },
        actions: [{ type: actionType, config: { text: replyText } }],
        isEnabled: true,
      });
    }
    navigate('/bot-marketplace');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/bot-marketplace')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-6 cursor-pointer font-mono uppercase tracking-wider">
            <ArrowLeft size={14} /> Back to Marketplace
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg">
              <Cpu size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>AUTOMATION & WORKFLOW STUDIO</h1>
              <p className="text-xs text-[#6e6868]">Build, trigger, audit, and configure custom Technova automations with visual workflows.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <form onSubmit={handleCreateBot} className="md:col-span-2 space-y-6">
              <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Bot Profile Configuration</h3>

                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Bot Name</label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="e.g. My Smart Assistant"
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Bot Description</label>
                  <textarea
                    value={botDesc}
                    onChange={(e) => setBotDesc(e.target.value)}
                    placeholder="Describe how the bot automates tasks or tutors subjects..."
                    rows={3}
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Bot Category</label>
                    <select
                      value={botCategory}
                      onChange={(e) => setBotCategory(e.target.value)}
                      className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                    >
                      <option value="utility">Utility</option>
                      <option value="moderation">Moderation</option>
                      <option value="education">Education</option>
                      <option value="ai">AI / Productivity</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="text-[0.62rem] text-[#6e6868] font-mono leading-relaxed bg-[#1a1a20] p-2.5 rounded-lg border border-[#2a2a2e]">
                      💡 Generates a public username like <span className="text-[#a78bfa]">@BotNameBot</span> on compile.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider">Visual Trigger Workflows</h3>
                  <span className="text-[0.58rem] font-mono text-[#2ea86a] uppercase bg-[#2ea86a]/10 px-2 py-0.5 rounded font-bold">
                    Trigger Activated
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Event Trigger</label>
                    <select
                      value={triggerType}
                      onChange={(e) => setTriggerType(e.target.value)}
                      className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                    >
                      <option value="on_message">When message contains keyword</option>
                      <option value="on_member_join">When new member joins chat</option>
                      <option value="scheduled">Scheduled cron timer</option>
                    </select>
                  </div>

                  {triggerType === 'on_message' && (
                    <div>
                      <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Keyword Match</label>
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="e.g. hello, pricing, help"
                        className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-3 border-t border-[#1a1a20]">
                  <div>
                    <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Action Flow</label>
                    <select
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value)}
                      className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white mb-3"
                    >
                      <option value="send_reply">Send Automated Response</option>
                      <option value="kick_member">Flag / Moderate message</option>
                      <option value="trigger_webhook">Post payload to external Webhook URL</option>
                    </select>
                  </div>

                  {actionType === 'send_reply' ? (
                    <div>
                      <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Automated Reply Message</label>
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type response text loops here..."
                        className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                      />
                    </div>
                  ) : actionType === 'trigger_webhook' ? (
                    <div>
                      <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Webhook Endpoint URL</label>
                      <input
                        type="text"
                        placeholder="https://mybackendapi.com/webhooks/technova"
                        className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white font-mono"
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
              >
                Compile & Publish Bot
              </button>
            </form>

            <div className="md:col-span-1 space-y-6">
              <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl">
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Info size={12} /> Sandbox Token
                </h3>
                <p className="text-[0.68rem] text-[#b0a8a8] leading-relaxed mb-4">
                  Each Technova bot generates an isolated API client token. Use this token to connect external scripts to groups.
                </p>
                <div className="bg-[#0c0c0e] border border-[#2a2a2e] p-3 rounded-xl font-mono text-[0.6rem] text-gray-500 break-all select-all">
                  Authorization: Bearer client_tkn_sandbox_xyz
                </div>
              </div>

              <div className="bg-[#1e1215] border border-[#e02840]/20 p-5 rounded-2xl flex gap-3">
                <AlertCircle size={20} className="text-[#e02840] flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Sandbox Rate Limits</h4>
                  <p className="text-[0.62rem] text-[#b0a8a8] leading-normal">
                    Free plans allow 1 sandbox webhook loop. Upgrade to **Premium** or **Creator** tier to configure unlimited triggers and monetize bots in the Marketplace.
                  </p>
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

export default BotCreator;
