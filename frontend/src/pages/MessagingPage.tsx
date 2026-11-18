import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMessagingStore, { Message, MessageType } from '../store/messagingStore';
import {
  MessageSquare, Phone, Video, Send, Search, Pin, Trash2, MapPin, FileText, Image, Globe, ExternalLink, Paperclip
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const MessagingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeConversationId,
    searchQuery,
    filterType,
    getFilteredConversations,
    setActiveConversation,
    getActiveConversation,
    setFilter,
    setSearchQuery,
    sendMessage,
    deleteMessage,
    reactToMessage,
    getMessages,
  } = useMessagingStore();

  const activeConvo = getActiveConversation();
  const messages = activeConvo ? getMessages(activeConvo.id) : [];

  const [inputText, setInputText] = useState('');
  const [showMediaMenu, setShowMediaMenu] = useState(false);

  const handleSend = () => {
    if (!inputText.trim() || !activeConvo) return;
    sendMessage(activeConvo.id, inputText);
    setInputText('');
  };

  const handleMediaUpload = (type: MessageType, text: string) => {
    if (!activeConvo) return;
    sendMessage(activeConvo.id, `Uploaded ${type}: ${text}`, type, 'uploaded', text);
    setShowMediaMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-6 px-4 font-sans select-none flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full">
        <div className="w-full md:w-80 bg-[#111114] border border-[#2a2a2e] rounded-2xl flex flex-col overflow-hidden h-[600px]">
          <div className="p-4 border-b border-[#2a2a2e] space-y-3 bg-[#0c0c0e]">
            <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider">CHATS CONVERSATION HUB</h3>
            <div className="flex items-center bg-[#111114] border border-[#2a2a2e] px-3 py-2 rounded-xl gap-2">
              <Search size={14} className="text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threads..."
                className="bg-transparent border-none outline-none text-xs text-white placeholder-cyber-ash3 w-full"
              />
            </div>
          </div>

          <div className="flex border-b border-[#1a1a20] text-[0.62rem] font-mono uppercase bg-[#0c0c0e]">
            {(['all', 'dm', 'group', 'channel', 'community'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 py-2 text-center transition-all cursor-pointer border-b ${filterType === tab ? 'border-[#8b5cf6] text-[#a78bfa]' : 'border-transparent text-[#6e6868] hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#1a1a20]">
            {getFilteredConversations().map(convo => {
              const isActive = activeConversationId === convo.id;
              return (
                <button
                  key={convo.id}
                  onClick={() => setActiveConversation(convo.id)}
                  className={`w-full text-left p-3.5 flex justify-between items-start cursor-pointer transition-all ${isActive ? 'bg-[#8b5cf6]/5 border-l-2 border-[#8b5cf6]' : 'hover:bg-white/[0.01]'}`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-xs text-white truncate">{convo.name}</h4>
                      {convo.isPinned && <Pin size={10} className="text-[#8b5cf6] fill-[#8b5cf6]" />}
                    </div>
                    <p className="text-[0.62rem] text-[#8a8080] truncate mt-1">
                      {convo.lastMessage?.content || 'No messages yet'}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                    <span className="text-[0.55rem] font-mono text-[#6e6868]">
                      {convo.lastMessage ? new Date(convo.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-[#2ea86a]/5 border-t border-[#2ea86a]/15 text-center">
            <a
              href="https://chat.whatsapp.com/C4nN1WEjbL1bul736WP8z"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 bg-[#2ea86a] hover:bg-[#2ea86a]/90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              Connect WhatsApp Channel <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="flex-1 bg-[#111114] border border-[#2a2a2e] rounded-2xl flex flex-col overflow-hidden h-[600px] relative">
          {activeConvo ? (
            <>
              <div className="p-4 bg-[#0c0c0e] border-b border-[#2a2a2e] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#00d4ff]/20 flex items-center justify-center font-bold text-xs text-[#8b5cf6]">
                    {activeConvo.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-white">{activeConvo.name}</h3>
                    <span className="text-[0.58rem] font-mono text-[#2ea86a] uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#2ea86a] rounded-full animate-pulse" /> Encrypted Endpoint Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0c0c0e]/20 select-text">
                {messages.map(msg => {
                  const isMe = msg.senderId === 'me';
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md p-3.5 rounded-2xl relative border ${isMe ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/30 text-white rounded-tr-none' : 'bg-[#1c1c1f] border-[#2a2a2e] text-[#e8e2e2] rounded-tl-none'}`}>
                        {!isMe && (
                          <span className="block text-[0.58rem] font-mono text-[#8b5cf6] font-bold mb-1">{msg.senderName}</span>
                        )}

                        {msg.type === 'text' && <p className="text-xs leading-relaxed">{msg.content}</p>}
                        {msg.type === 'image' && (
                          <div className="space-y-2">
                            <div className="w-48 h-32 bg-gradient-to-br from-purple-900/10 to-indigo-900/10 rounded-xl border border-white/5 flex items-center justify-center text-lg">🖼️ Image Upload</div>
                            <span className="text-[0.62rem] text-gray-400 font-mono">{msg.fileName}</span>
                          </div>
                        )}
                        {msg.type === 'file' && (
                          <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5 text-xs font-semibold">
                            <FileText size={16} className="text-[#a78bfa]" />
                            <div>
                              <div>{msg.fileName}</div>
                              <div className="text-[0.58rem] text-gray-500 font-mono">1.2 MB</div>
                            </div>
                          </div>
                        )}
                        {msg.type === 'location' && (
                          <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-[#2a2a2e] text-xs font-semibold">
                            <MapPin size={16} className="text-[#e02840]" />
                            <div>
                              <div>{msg.fileName}</div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center gap-4 mt-2 pt-1.5 border-t border-white/5 text-[0.55rem] font-mono text-gray-500">
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => reactToMessage(activeConvo.id, msg.id, '❤️')} className="hover:text-white" title="Heart react">❤️</button>
                            <button onClick={() => reactToMessage(activeConvo.id, msg.id, '🔥')} className="hover:text-white" title="Fire react">🔥</button>
                            {isMe && (
                              <button onClick={() => deleteMessage(activeConvo.id, msg.id)} className="hover:text-[#e02840]">
                                <Trash2 size={10} />
                              </button>
                            )}
                          </div>
                        </div>

                        {msg.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {msg.reactions.map((r, idx) => (
                              <span key={idx} className="bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-[0.55rem] font-mono">
                                {r.emoji} {r.users.length}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-[#0c0c0e] border-t border-[#2a2a2e] flex items-center gap-2.5 relative">
                <div className="relative">
                  <button onClick={() => setShowMediaMenu(!showMediaMenu)} className="p-2 bg-white/5 border border-[#2a2a2e] rounded-xl hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer">
                    <Paperclip size={14} />
                  </button>
                  {showMediaMenu && (
                    <div className="absolute bottom-12 left-0 bg-[#111114] border border-[#2a2a2e] p-2 rounded-xl shadow-xl space-y-1 z-20 w-36 text-left">
                      <button onClick={() => handleMediaUpload('image', 'profile-image.jpg')} className="w-full text-left p-2 hover:bg-white/5 rounded text-xs flex items-center gap-2"><Image size={12} /> Image / Photo</button>
                      <button onClick={() => handleMediaUpload('file', 'document-v2.pdf')} className="w-full text-left p-2 hover:bg-white/5 rounded text-xs flex items-center gap-2"><FileText size={12} /> Document PDF</button>
                      <button onClick={() => handleMediaUpload('location', 'Yaba, Lagos')} className="w-full text-left p-2 hover:bg-white/5 rounded text-xs flex items-center gap-2"><MapPin size={12} /> Share Location</button>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type message streams here..."
                  className="flex-1 bg-[#111114] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] placeholder-cyber-ash3 text-white"
                />

                <button onClick={handleSend} className="p-3 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] hover:opacity-90 text-white rounded-xl transition-all cursor-pointer">
                  <Send size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-xs text-[#6e6868] font-mono uppercase">
              <MessageSquare size={36} className="mb-3 text-[#6e6868]" />
              Select a chat thread conversation to begin.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MessagingPage;
