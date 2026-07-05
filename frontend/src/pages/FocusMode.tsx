import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMusicStore, { TRACKS, Track } from '../store/musicStore';
import { ArrowLeft, Volume2, Music, Target, Flame, RotateCcw } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const FocusMode: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentTrack,
    isPlaying,
    volume,
    pomodoro,
    playTrack,
    pause,
    resume,
    setVolume,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    setPomodoroWork,
    setPomodoroBreak,
  } = useMusicStore();

  const [activeTask, setActiveTask] = useState('');
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>([]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask.trim()) return;
    setTasks([...tasks, { id: `tsk_${Date.now()}`, text: activeTask, done: false }]);
    setActiveTask('');
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-6 cursor-pointer font-mono uppercase tracking-wider">
            <ArrowLeft size={14} /> Back to Hub
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#111114] border border-[#2a2a2e] p-8 rounded-2xl flex flex-col items-center justify-between text-center relative overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-lg text-[0.58rem] font-mono text-[#6e6868]">
                <Flame size={12} className="text-[#f97316]" /> {pomodoro.sessionsCompleted} Sessions Completed
              </div>

              <div className="space-y-4 my-8">
                <span className="text-xs font-mono uppercase text-[#6e6868] tracking-wider block">
                  {pomodoro.isBreak ? '☕ BREAK TIME' : '🎯 WORK SESSION'}
                </span>
                <h2 className="text-6xl font-black font-mono tracking-tight text-white select-none">
                  {formatTime(pomodoro.timeRemaining)}
                </h2>
              </div>

              <div className="flex gap-4 mb-8">
                {pomodoro.isActive ? (
                  <button
                    onClick={pausePomodoro}
                    className="px-6 py-2.5 bg-[#e02840] hover:bg-[#e02840]/90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Pause Session
                  </button>
                ) : (
                  <button
                    onClick={startPomodoro}
                    className="px-6 py-2.5 bg-[#10b981] hover:bg-[#10b981]/90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Start Session
                  </button>
                )}
                <button
                  onClick={resetPomodoro}
                  className="p-2.5 bg-white/5 border border-[#2a2a2e] rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              <div className="flex gap-4 w-full border-t border-[#1a1a20] pt-6 justify-around text-left">
                <div>
                  <label className="block text-[0.58rem] font-mono uppercase text-[#6e6868] mb-1">Work Period</label>
                  <select
                    value={pomodoro.workMinutes}
                    onChange={(e) => setPomodoroWork(parseInt(e.target.value))}
                    disabled={pomodoro.isActive}
                    className="bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-2 rounded-lg outline-none text-white font-mono"
                  >
                    <option value="15">15 min</option>
                    <option value="25">25 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.58rem] font-mono uppercase text-[#6e6868] mb-1">Break Period</label>
                  <select
                    value={pomodoro.breakMinutes}
                    onChange={(e) => setPomodoroBreak(parseInt(e.target.value))}
                    disabled={pomodoro.isActive}
                    className="bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-2 rounded-lg outline-none text-white font-mono"
                  >
                    <option value="5">5 min</option>
                    <option value="10">10 min</option>
                    <option value="15">15 min</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 space-y-6">
              <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider flex items-center gap-1.5">
                  <Music size={14} /> Ambient Sound Generator
                </h3>
                <div className="space-y-2.5">
                  {TRACKS.map(track => {
                    const isCurrent = currentTrack?.id === track.id;
                    return (
                      <button
                        key={track.id}
                        onClick={() => {
                          if (isCurrent && isPlaying) {
                            pause();
                          } else {
                            playTrack(track);
                          }
                        }}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isCurrent && isPlaying ? 'bg-[#8b5cf6]/10 border-[#8b5cf6] text-white animate-pulse' : 'bg-[#0c0c0e] border-[#2a2a2e] text-[#6e6868] hover:text-white'}`}
                      >
                        <span className="text-xs font-semibold">{track.title}</span>
                        <span className="text-[0.58rem] font-mono uppercase text-[#6e6868]">{track.category}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 border-t border-[#1a1a20] pt-4">
                  <Volume2 size={16} className="text-[#6e6868]" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full bg-[#1a1a20] rounded-lg appearance-none h-1 cursor-pointer accent-[#8b5cf6]"
                  />
                </div>
              </div>

              <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider flex items-center gap-1.5">
                  <Target size={14} /> Focus Tasks checklist
                </h3>

                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    type="text"
                    value={activeTask}
                    onChange={(e) => setActiveTask(e.target.value)}
                    placeholder="New target task..."
                    className="flex-1 bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-2 rounded-xl outline-none focus:border-[#8b5cf6] text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </form>

                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                  {tasks.map(t => (
                    <div key={t.id} className="flex items-center justify-between bg-[#0c0c0e] p-2.5 rounded-xl border border-[#2a2a2e]">
                      <button
                        onClick={() => handleToggleTask(t.id)}
                        className={`text-xs font-semibold truncate flex-1 text-left ${t.done ? 'line-through text-gray-500' : 'text-[#b0a8a8] hover:text-white'}`}
                      >
                        {t.text}
                      </button>
                      <button
                        onClick={() => handleRemoveTask(t.id)}
                        className="text-[0.62rem] text-[#e02840] hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
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

export default FocusMode;
