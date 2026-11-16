import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplaceStore, MarketplaceProduct, FreelanceGig } from '../store/marketplaceStore';
import useWalletStore from '../store/walletStore';
import { ShoppingBag, Search, Tag, ArrowLeft, Plus, DollarSign, Star, Briefcase, UserCheck, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const mStore = useMarketplaceStore();
  const wStore = useWalletStore();

  const [tab, setTab] = useState<'products' | 'gigs'>('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddGig, setShowAddGig] = useState(false);

  // Form states for new product
  const [prodTitle, setProdTitle] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCat, setProdCat] = useState<any>('template');
  const [prodTags, setProdTags] = useState('');

  // Form states for new gig
  const [gigTitle, setGigTitle] = useState('');
  const [gigDesc, setGigDesc] = useState('');
  const [gigCat, setGigCat] = useState<any>('development');
  const [gigMinBudget, setGigMinBudget] = useState('');
  const [gigMaxBudget, setGigMaxBudget] = useState('');
  const [gigSkills, setGigSkills] = useState('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(prodPrice) || 0;
    if (!prodTitle.trim() || !prodDesc.trim()) return;

    mStore.listProduct({
      title: prodTitle,
      description: prodDesc,
      price,
      category: prodCat,
      tags: prodTags.split(',').map(t => t.trim()).filter(Boolean),
      coverImage: prodCat === 'code' ? '💻' : prodCat === 'design' ? '🎨' : '📄',
    });

    setProdTitle('');
    setProdDesc('');
    setProdPrice('');
    setProdTags('');
    setShowAddProduct(false);
    alert('Product listed successfully in the Technova Marketplace!');
  };

  const handleCreateGig = (e: React.FormEvent) => {
    e.preventDefault();
    const min = parseInt(gigMinBudget) || 0;
    const max = parseInt(gigMaxBudget) || 0;
    if (!gigTitle.trim() || !gigDesc.trim()) return;

    mStore.postGig({
      title: gigTitle,
      description: gigDesc,
      category: gigCat,
      budget: { min, max },
      skills: gigSkills.split(',').map(s => s.trim()).filter(Boolean),
    });

    setGigTitle('');
    setGigDesc('');
    setGigMinBudget('');
    setGigMaxBudget('');
    setGigSkills('');
    setShowAddGig(false);
    alert('Freelance gig posted successfully to the community board!');
  };

  const handleBuyProduct = (product: MarketplaceProduct) => {
    if (product.sellerId === 'me') {
      alert('You cannot purchase your own listed asset.');
      return;
    }
    const confirmBuy = window.confirm(`Purchase "${product.title}" for ₦${product.price.toLocaleString()}?`);
    if (!confirmBuy) return;

    const success = wStore.deductFunds(product.price, 'marketplace_purchase', `Purchased "${product.title}"`);
    if (success) {
      mStore.purchaseProduct(product.id);
      // Process sale on seller side (simulate seller receiving funds minus commission)
      wStore.processMarketplaceSale(product.price, product.title);
      alert('Purchase successful! Asset unlocked for download.');
    } else {
      alert('Insufficient wallet balance. Deposit funds or earn revenue to unlock.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-3 cursor-pointer font-mono uppercase tracking-wider">
                <ArrowLeft size={14} /> Back to Hub
              </button>
              <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <ShoppingBag size={24} className="text-[#8b5cf6]" /> TECHNOVA MARKETPLACE
              </h1>
              <p className="text-xs text-[#6e6868] mt-1">Buy digital assets, templates, code boilierplates, or hire expert freelancers in the tech ecosystem.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/wallet')}
                className="px-4 py-2 bg-[#111114] border border-[#2a2a2e] text-white hover:bg-white/5 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                🏦 Ledger Wallet
              </button>
              {tab === 'products' ? (
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
                >
                  <Plus size={14} /> Sell Digital Asset
                </button>
              ) : (
                <button
                  onClick={() => setShowAddGig(!showAddGig)}
                  className="px-4 py-2 bg-gradient-to-r from-[#10b981] to-[#34d399] text-white hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
                >
                  <Plus size={14} /> Post Project Gig
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-1 mb-8 bg-[#111114] rounded-xl p-1 border border-[#2a2a2e] w-fit">
            <button
              onClick={() => setTab('products')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${tab === 'products' ? 'bg-[#1a1a20] text-white shadow-md' : 'text-[#6e6868] hover:text-white'}`}
            >
              Digital Product Store
            </button>
            <button
              onClick={() => setTab('gigs')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${tab === 'gigs' ? 'bg-[#1a1a20] text-white shadow-md' : 'text-[#6e6868] hover:text-white'}`}
            >
              Freelance Gigs Board
            </button>
          </div>

          {/* Sell Product Modal Form */}
          {showAddProduct && (
            <form onSubmit={handleCreateProduct} className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl mb-8 space-y-4">
              <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Publish Product to Store</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Asset Title</label>
                  <input
                    type="text"
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    placeholder="e.g. Next.js Boilerplate"
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Category</label>
                  <select
                    value={prodCat}
                    onChange={(e) => setProdCat(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                  >
                    <option value="template">Templates</option>
                    <option value="notes">Study Notes</option>
                    <option value="report">Security Reports</option>
                    <option value="design">Design Assets</option>
                    <option value="code">Source Code / Packages</option>
                    <option value="guide">Tutorial Guides</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Description</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Detail product features, contents, setup steps..."
                  rows={3}
                  className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={prodTags}
                    onChange={(e) => setProdTags(e.target.value)}
                    placeholder="e.g. logic, setup, web3"
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 bg-transparent text-[#6e6868] text-xs font-bold uppercase rounded-lg hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white text-xs font-bold uppercase rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Publish Asset
                </button>
              </div>
            </form>
          )}

          {/* Post Gig Modal Form */}
          {showAddGig && (
            <form onSubmit={handleCreateGig} className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl mb-8 space-y-4">
              <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Post Freelance Gig Opportunity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Project Title</label>
                  <input
                    type="text"
                    value={gigTitle}
                    onChange={(e) => setGigTitle(e.target.value)}
                    placeholder="e.g. Design Landing Page"
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Category</label>
                  <select
                    value={gigCat}
                    onChange={(e) => setGigCat(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                  >
                    <option value="development">Software Development</option>
                    <option value="design">UI/UX Design</option>
                    <option value="writing">Technical Writing</option>
                    <option value="security">Cybersecurity Audit</option>
                    <option value="research">Academic Research</option>
                    <option value="tutoring">Online Tutoring</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Project Requirements / Brief</label>
                <textarea
                  value={gigDesc}
                  onChange={(e) => setGigDesc(e.target.value)}
                  placeholder="Detail targets, scope of work, timeline, needed milestones..."
                  rows={3}
                  className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Min Budget (₦)</label>
                  <input
                    type="number"
                    value={gigMinBudget}
                    onChange={(e) => setGigMinBudget(e.target.value)}
                    placeholder="e.g. 20000"
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Max Budget (₦)</label>
                  <input
                    type="number"
                    value={gigMaxBudget}
                    onChange={(e) => setGigMaxBudget(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-[#b0a8a8] mb-1">Skills needed (comma-separated)</label>
                  <input
                    type="text"
                    value={gigSkills}
                    onChange={(e) => setGigSkills(e.target.value)}
                    placeholder="e.g. Figma, Photoshop"
                    className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGig(false)}
                  className="px-4 py-2 bg-transparent text-[#6e6868] text-xs font-bold uppercase rounded-lg hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#10b981] to-[#34d399] text-white text-xs font-bold uppercase rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Post Gig
                </button>
              </div>
            </form>
          )}

          {/* Products View */}
          {tab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mStore.getFilteredProducts().map(product => (
                <div key={product.id} className="bg-[#111114] border border-[#2a2a2e] rounded-2xl p-5 flex flex-col justify-between hover:border-[#383842] transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#00d4ff]/20 flex items-center justify-center text-xl">
                        {product.coverImage}
                      </div>
                      <span className="text-[0.58rem] font-mono uppercase bg-white/5 border border-white/5 px-2 py-0.5 rounded text-gray-400">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-xs text-white mb-1.5 leading-snug">{product.title}</h3>
                    <div className="flex items-center gap-2 text-[0.58rem] font-mono text-[#6e6868] mb-3">
                      <span>Seller: {product.sellerName}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-[#f59e0b]"><Star size={10} className="fill-[#f59e0b]" /> {product.rating}</span>
                      <span>·</span>
                      <span>Downloads: {product.downloadCount}</span>
                    </div>

                    <p className="text-[0.68rem] text-[#b0a8a8] leading-relaxed mb-4">{product.description}</p>
                  </div>

                  <div className="border-t border-[#1a1a20] pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[0.55rem] font-mono text-[#6e6868] uppercase block">Price</span>
                      <span className="text-sm font-extrabold text-white">₦{product.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => handleBuyProduct(product)}
                      className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white hover:opacity-90 font-extrabold text-[0.62rem] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      Unlock Asset
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Gigs View */}
          {tab === 'gigs' && (
            <div className="space-y-4">
              {mStore.getFilteredGigs().map(gig => (
                <div key={gig.id} className="bg-[#111114] border border-[#2a2a2e] rounded-2xl p-6 hover:border-[#383842] transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[0.58rem] font-mono uppercase bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/20 px-2 py-0.5 rounded">
                        {gig.category}
                      </span>
                      <span className="text-[0.58rem] font-mono text-[#6e6868]">Posted by {gig.posterName}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-white">{gig.title}</h3>
                    <p className="text-xs text-[#b0a8a8] max-w-3xl leading-relaxed">{gig.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {gig.skills.map((skill, idx) => (
                        <span key={idx} className="text-[0.58rem] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[#10b981]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-left md:text-right flex-shrink-0 flex flex-col justify-between h-full gap-3">
                    <div>
                      <span className="text-[0.55rem] font-mono text-[#6e6868] uppercase block">Budget</span>
                      <span className="text-sm font-extrabold text-white">₦{gig.budget.min.toLocaleString()} - ₦{gig.budget.max.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => {
                        mStore.applyToGig(gig.id);
                        alert(`Proposal application submitted successfully! Proposal coversheet generated.`);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-[#10b981] to-[#34d399] text-white hover:opacity-90 font-extrabold text-[0.62rem] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1"
                    >
                      Apply Contract <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketplacePage;
