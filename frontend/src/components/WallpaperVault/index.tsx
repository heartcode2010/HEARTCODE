import React, { useState } from 'react';

interface Wallpaper {
  id: string;
  title: string;
  category: 'Metropolis' | 'Matrix' | 'Neural' | 'Warfare' | 'Synthwave' | 'Quantum';
  resolution: string;
  isPremium: boolean;
  downloads: number;
  bgGradient: string;
  accentColor: string;
  previewUrl: string;
}

const WALLPAPERS: Wallpaper[] = [
  {
    id: 'wp-01',
    title: 'Neon Megacity 2099',
    category: 'Metropolis',
    resolution: '4K Ultra HD',
    isPremium: false,
    downloads: 14280,
    bgGradient: 'from-blue-900 via-indigo-950 to-purple-950',
    accentColor: '#00f5ff',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'wp-02',
    title: 'Sub-Zero Matrix Stream',
    category: 'Matrix',
    resolution: '4K Ultra HD',
    isPremium: false,
    downloads: 18920,
    bgGradient: 'from-emerald-950 via-green-950 to-black',
    accentColor: '#00ff88',
    previewUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'wp-03',
    title: 'Quantum Synapse Core',
    category: 'Neural',
    resolution: '8K HDR Master',
    isPremium: true,
    downloads: 29400,
    bgGradient: 'from-fuchsia-950 via-purple-950 to-black',
    accentColor: '#ff007f',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'wp-04',
    title: 'Red Team Cyber Battlefield',
    category: 'Warfare',
    resolution: '4K Ultra HD',
    isPremium: false,
    downloads: 12150,
    bgGradient: 'from-red-950 via-rose-950 to-black',
    accentColor: '#ff3d55',
    previewUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'wp-05',
    title: 'Zero-Day Exploit Breach',
    category: 'Warfare',
    resolution: '8K HDR Master',
    isPremium: true,
    downloads: 34500,
    bgGradient: 'from-rose-950 via-amber-950 to-black',
    accentColor: '#ff9900',
    previewUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'wp-06',
    title: 'Synthwave Highway Outrun',
    category: 'Synthwave',
    resolution: '4K Ultra HD',
    isPremium: false,
    downloads: 16730,
    bgGradient: 'from-violet-950 via-pink-950 to-slate-950',
    accentColor: '#e02840',
    previewUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'wp-07',
    title: 'Deep Net Autonomous Sentinel',
    category: 'Neural',
    resolution: '8K HDR Master',
    isPremium: true,
    downloads: 41200,
    bgGradient: 'from-cyan-950 via-blue-950 to-black',
    accentColor: '#00f5ff',
    previewUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'wp-08',
    title: 'Silicon Grid Accelerator',
    category: 'Quantum',
    resolution: '4K Ultra HD',
    isPremium: false,
    downloads: 9800,
    bgGradient: 'from-teal-950 via-emerald-950 to-black',
    accentColor: '#2ea86a',
    previewUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'wp-09',
    title: 'Black Ice Perimeter Shield',
    category: 'Quantum',
    resolution: '8K HDR Master',
    isPremium: true,
    downloads: 27800,
    bgGradient: 'from-slate-950 via-blue-950 to-purple-950',
    accentColor: '#7c3aed',
    previewUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=1200&q=80',
  },
];

export const WallpaperVault: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewWallpaper, setPreviewWallpaper] = useState<Wallpaper | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const categories = ['All', 'Metropolis', 'Matrix', 'Neural', 'Warfare', 'Synthwave', 'Quantum'];

  const filtered = selectedCategory === 'All'
    ? WALLPAPERS
    : WALLPAPERS.filter((w) => w.category === selectedCategory);

  const handleDownload = (wp: Wallpaper) => {
    if (wp.isPremium) {
      setPreviewWallpaper(wp);
      setShowPremiumModal(true);
      return;
    }

    setDownloadingId(wp.id);
    setTimeout(() => {
      // Trigger genuine image download
      const link = document.createElement('a');
      link.href = wp.previewUrl;
      link.target = '_blank';
      link.download = `${wp.title.toLowerCase().replace(/\s+/g, '-')}-4k-heartcode.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadingId(null);
    }, 900);
  };

  return (
    <div className="wallpaper-vault flex-1 bg-cyber-bg px-6 py-8 overflow-y-auto">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cyber-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-red-dim border border-cyber-border-red rounded-full text-cyber-red text-xs font-mono uppercase tracking-widest mb-3">
              <span>🖼️</span> High-Density Cyber Gallery
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
              CYBERPUNK <span className="text-cyber-red">WALLPAPER VAULT</span>
            </h1>
            <p className="text-cyber-ash text-sm mt-2 max-w-2xl font-sans">
              Exclusive high-resolution 4K and 8K HDR cyberpunk wallpapers. Free tier includes standard cyber aesthetics; ultra-exclusive neural renderings unlock with Pro Suite.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-cyber-surface2 border border-cyber-border rounded px-4 py-2 font-mono text-xs">
              <span className="text-cyber-ash2">Vault Cache:</span>{' '}
              <span className="text-cyber-red font-bold">1,400,000+ Assets</span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyber-red text-white shadow-[0_0_12px_rgba(224,40,64,0.4)]'
                  : 'bg-cyber-surface2 text-cyber-ash hover:text-white border border-cyber-border hover:border-cyber-ash3'
              }`}
            >
              {cat === 'All' ? '⚡ ALL WALLPAPERS' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Wallpapers */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((wp) => (
          <div
            key={wp.id}
            className="group relative bg-cyber-surface rounded-xl border border-cyber-border hover:border-cyber-border-red overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* Image / Graphic Area */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <img
                src={wp.previewUrl}
                alt={wp.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black/70 backdrop-blur border border-white/10 rounded text-[10px] font-mono text-white tracking-widest uppercase">
                  {wp.resolution}
                </span>
                {wp.isPremium ? (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 rounded text-[10px] font-mono text-black font-bold tracking-wider uppercase shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                    💎 PREMIUM VIP
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-emerald-500/80 backdrop-blur rounded text-[10px] font-mono text-white font-bold tracking-wider uppercase">
                    FREE TIER
                  </span>
                )}
              </div>

              {/* Category pill */}
              <div className="absolute bottom-3 left-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyber-ash bg-black/60 px-2 py-0.5 rounded border border-white/5">
                  #{wp.category}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-white text-base font-bold tracking-wide group-hover:text-cyber-red transition-colors">
                  {wp.title}
                </h3>
                <div className="flex items-center justify-between text-xs font-mono text-cyber-ash2 mt-1.5">
                  <span>📥 {wp.downloads.toLocaleString()} Downloads</span>
                  <span>HDR / 300 DPI</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-cyber-border flex items-center gap-2">
                <button
                  onClick={() => handleDownload(wp)}
                  disabled={downloadingId === wp.id}
                  className={`w-full py-2 px-3 rounded font-mono text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    wp.isPremium
                      ? 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'bg-cyber-surface3 hover:bg-cyber-red hover:text-white border border-cyber-border text-cyber-ash hover:border-cyber-red'
                  }`}
                >
                  {downloadingId === wp.id ? (
                    <span className="animate-spin">🌀</span>
                  ) : wp.isPremium ? (
                    <span>🔒 UNLOCK 8K MASTER</span>
                  ) : (
                    <span>⬇️ DOWNLOAD 4K ASSET</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Upgrade Modal */}
      {showPremiumModal && previewWallpaper && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-cyber-surface border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">💎</span>
                <h3 className="text-lg font-display font-bold text-white tracking-wide">
                  VIP WALLPAPER UNLOCK
                </h3>
              </div>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="text-cyber-ash2 hover:text-white font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video rounded-lg overflow-hidden mb-4 border border-cyber-border">
              <img src={previewWallpaper.previewUrl} alt={previewWallpaper.title} className="w-full h-full object-cover" />
            </div>

            <div className="text-sm font-sans text-cyber-ash mb-5 leading-relaxed">
              <strong className="text-white">{previewWallpaper.title}</strong> is part of the restricted Tier-1 Neural Asset archive, rendered natively in uncompressed 8K HDR resolution.
              <ul className="mt-3 space-y-1.5 text-xs font-mono text-amber-200/80">
                <li>✓ Full commercial and personal license included</li>
                <li>✓ Native dual-monitor and ultrawide aspect ratios (32:9)</li>
                <li>✓ Unlimited downloads with daily scan quota bypass</li>
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-2.5 bg-cyber-surface2 border border-cyber-border text-cyber-ash hover:text-white font-mono text-xs rounded cursor-pointer transition-colors"
              >
                CONTINUE EXPLORING
              </button>
              <button
                onClick={() => {
                  alert('Thank you for your interest! The Pro Pass payment gateway will activate with the upcoming production release.');
                  setShowPremiumModal(false);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold font-mono text-xs rounded shadow-[0_0_16px_rgba(245,158,11,0.4)] hover:brightness-110 cursor-pointer transition-all"
              >
                ⚡ UPGRADE TO PRO ($9)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WallpaperVault;

