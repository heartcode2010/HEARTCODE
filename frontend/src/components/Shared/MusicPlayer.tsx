import React from 'react';
import useMusicStore, { PLAYLISTS } from '../../store/musicStore';
import { Play, Pause, SkipForward, SkipBack, Volume2, X, Disc, Maximize2, Minimize2 } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMiniPlayerVisible,
    isPlayerExpanded,
    pause,
    resume,
    next,
    previous,
    setVolume,
    toggleMiniPlayer,
    toggleExpanded,
    setPlaylist,
  } = useMusicStore();

  if (!isMiniPlayerVisible || !currentTrack) return null;

  return (
    <div
      className={`fixed right-6 bottom-6 bg-[#111114] border border-[#2a2a2e] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.4)] z-50 font-sans transition-all duration-300 overflow-hidden ${
        isPlayerExpanded ? 'w-80 p-5' : 'w-72 p-3.5'
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-[0.58rem] font-mono text-[#6e6868] uppercase tracking-wider flex items-center gap-1">
          <Disc size={12} className={isPlaying ? 'animate-spin text-[#8b5cf6]' : ''} /> Persistent Player
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleExpanded}
            className="p-1 hover:bg-white/5 rounded text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            {isPlayerExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
          <button
            onClick={toggleMiniPlayer}
            className="p-1 hover:bg-[#e02840]/10 rounded text-gray-500 hover:text-[#e02840] transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {isPlayerExpanded ? (
        <div className="space-y-4">
          <div className="flex gap-3.5 items-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: `${currentTrack.coverColor}20`, border: `1px solid ${currentTrack.coverColor}40` }}
            >
              🎵
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-white truncate">{currentTrack.title}</h4>
              <p className="text-[0.58rem] font-mono text-[#6e6868] mt-0.5 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          <div>
            <span className="text-[0.55rem] font-mono text-[#6e6868] uppercase tracking-wider block mb-2">Ambient Channels</span>
            <div className="grid grid-cols-2 gap-1.5 max-h-[100px] overflow-y-auto pr-1">
              {PLAYLISTS.map(pl => (
                <button
                  key={pl.id}
                  onClick={() => setPlaylist(pl.id)}
                  className="p-1.5 bg-[#0c0c0e] hover:bg-[#1a1a20] border border-[#2a2a2e] rounded-lg text-center transition-all cursor-pointer truncate text-[0.58rem] font-bold text-white"
                >
                  {pl.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#00d4ff]/20 flex items-center justify-center text-xs">
              🎧
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-[0.68rem] text-white truncate">{currentTrack.title}</h4>
              <p className="text-[0.55rem] font-mono text-[#6e6868] truncate">{currentTrack.category.toUpperCase()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1a1a20]">
        <div className="flex items-center gap-3">
          <button onClick={previous} className="p-1 text-gray-500 hover:text-white cursor-pointer transition-colors">
            <SkipBack size={14} />
          </button>
          <button
            onClick={isPlaying ? pause : resume}
            className="p-2 bg-white text-black rounded-full hover:scale-105 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause size={12} className="fill-black" /> : <Play size={12} className="fill-black" />}
          </button>
          <button onClick={next} className="p-1 text-gray-500 hover:text-white cursor-pointer transition-colors">
            <SkipForward size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 size={12} className="text-gray-500" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 bg-[#1a1a20] rounded-lg appearance-none h-0.5 cursor-pointer accent-[#8b5cf6]"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
