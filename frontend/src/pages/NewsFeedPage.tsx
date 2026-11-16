import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFeedStore, { FeedCategory, FeedPost } from '../store/feedStore';
import { Globe, Heart, MessageSquare, Share2, Bookmark, Plus, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const NewsFeedPage: React.FC = () => {
  const navigate = useNavigate();
  const { getFilteredPosts, activeCategory, setCategory, likePost, bookmarkPost, sharePost, votePoll, createPost } = useFeedStore();
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newCat, setNewCat] = useState<FeedCategory>('opportunities');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const categories: { id: FeedCategory; label: string }[] = [
    { id: 'all', label: 'All Updates' },
    { id: 'tech', label: 'Tech News' },
    { id: 'cyber', label: 'CyberVerse' },
    { id: 'blockchain', label: 'BlockchainVerse' },
    { id: 'education', label: 'EduVerse' },
    { id: 'creative', label: 'Nexora Studio' },
    { id: 'opportunities', label: 'Scholarships' },
  ];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    createPost({
      title: newTitle,
      content: newContent,
      category: newCat,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setShowCreateForm(false);
    alert('Post published successfully in the feed!');
  };

  const handleShare = (post: FeedPost) => {
    sharePost(post.id);
    navigator.clipboard.writeText(`${window.location.origin}/feed#post-${post.id}`);
    alert('Post share link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-3 cursor-pointer font-mono uppercase tracking-wider">
                <ArrowLeft size={14} /> Back to Hub
              </button>
              <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <Globe size={24} className="text-[#00d4ff]" /> INTELLIGENT NEWS STREAM
              </h1>
              <p className="text-xs text-[#6e6868] mt-1">Location-aware updates, technical announcements, global opportunities, and scholarships.</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-[#111114] border border-[#2a2a2e] text-white hover:bg-white/5 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} /> Share Update
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handlePostSubmit} className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl mb-8 space-y-4">
              <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Publish an update loop</h3>
              <div>
                <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Summarize your update..."
                  className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Content Details</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share details, tutorial links, or announcements..."
                  rows={4}
                  className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Category Stream</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as FeedCategory)}
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                  >
                    <option value="tech">Tech News</option>
                    <option value="cyber">CyberVerse</option>
                    <option value="blockchain">BlockchainVerse</option>
                    <option value="education">EduVerse</option>
                    <option value="opportunities">Opportunities / Scholarships</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. hackathon, python, jamb"
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-transparent text-[#6e6868] text-xs font-bold uppercase rounded-lg hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white text-xs font-bold uppercase rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Publish Post
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-wrap gap-2 mb-8 border-b border-[#2a2a2e] pb-4">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeCategory === c.id ? 'bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff]' : 'bg-transparent border border-transparent text-[#6e6868] hover:text-white'}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {getFilteredPosts().map(post => {
              const formattedTime = new Date(post.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

              return (
                <div key={post.id} className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl hover:border-[#383842] transition-colors relative">
                  <span className="absolute top-4 right-4 text-[0.58rem] font-mono uppercase bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-lg text-[#6e6868]">
                    {post.category}
                  </span>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#00d4ff]/20 flex items-center justify-center font-bold text-xs text-[#00d4ff]">
                      {post.author.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-xs text-white">{post.author.name}</h4>
                        {post.author.verified && <span className="text-[0.62rem]" title="Official Ambassador Vector">👑</span>}
                      </div>
                      <span className="text-[0.58rem] font-mono text-[#6e6868] block mt-0.5">{post.author.role} · {formattedTime}</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-white mb-2 leading-snug">{post.title}</h3>
                  <p className="text-xs text-[#b0a8a8] leading-relaxed whitespace-pre-line mb-4 select-text">{post.content}</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {post.tags.map((t, idx) => (
                      <span key={idx} className="text-[0.58rem] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[#00d4ff]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-[#1a1a20] pt-4 text-[#6e6868]">
                    <div className="flex gap-4">
                      <button
                        onClick={() => likePost(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors ${post.liked ? 'text-[#e02840]' : 'hover:text-white'}`}
                      >
                        <Heart size={14} className={post.liked ? 'fill-[#e02840]' : ''} /> {post.likes}
                      </button>
                      <button
                        onClick={() => navigate(`/messages`)}
                        className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:text-white transition-colors"
                      >
                        <MessageSquare size={14} /> {post.comments}
                      </button>
                      <button
                        onClick={() => handleShare(post)}
                        className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:text-white transition-colors"
                      >
                        <Share2 size={14} /> {post.shares}
                      </button>
                    </div>

                    <button
                      onClick={() => bookmarkPost(post.id)}
                      className={`cursor-pointer transition-colors ${post.bookmarked ? 'text-[#f59e0b]' : 'hover:text-white'}`}
                    >
                      <Bookmark size={14} className={post.bookmarked ? 'fill-[#f59e0b]' : ''} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsFeedPage;
