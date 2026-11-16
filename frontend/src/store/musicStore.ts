import { create } from 'zustand';

export interface Track {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: number;
  audioUrl: string;
  coverColor: string;
}

export interface Playlist {
  id: string;
  name: string;
  icon: string;
  color: string;
  tracks: string[];
}

export const TRACKS: Track[] = [
  { id: 't1', title: 'Deep Focus', artist: 'Technova Audio', category: 'focus', duration: 300, audioUrl: 'generated', coverColor: '#8b5cf6' },
  { id: 't2', title: 'Cyber Rain', artist: 'Technova Audio', category: 'ambient', duration: 360, audioUrl: 'generated', coverColor: '#10b981' },
];

export const PLAYLISTS: Playlist[] = [
  { id: 'pl-focus', name: '🎯 Focus Mode', icon: '🎯', color: '#8b5cf6', tracks: ['t1', 't2'] },
];

export interface PomodoroState {
  isActive: boolean;
  isBreak: boolean;
  workMinutes: number;
  breakMinutes: number;
  timeRemaining: number;
  sessionsCompleted: number;
}

interface MusicStoreState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  isMiniPlayerVisible: boolean;
  isPlayerExpanded: boolean;
  currentPlaylistId: string | null;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  pomodoro: PomodoroState;

  playTrack: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (vol: number) => void;
  toggleMiniPlayer: () => void;
  toggleExpanded: () => void;
  setPlaylist: (playlistId: string) => void;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  setPomodoroWork: (minutes: number) => void;
  setPomodoroBreak: (minutes: number) => void;
}

export const useMusicStore = create<MusicStoreState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  isMiniPlayerVisible: false,
  isPlayerExpanded: false,
  currentPlaylistId: null,
  shuffle: false,
  repeat: 'off',
  pomodoro: { isActive: false, isBreak: false, workMinutes: 25, breakMinutes: 5, timeRemaining: 25 * 60, sessionsCompleted: 0 },

  playTrack: (track) => set({ currentTrack: track, isPlaying: true, isMiniPlayerVisible: true }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  next: () => {},
  previous: () => {},
  setVolume: (vol) => set({ volume: vol }),
  toggleMiniPlayer: () => set(s => ({ isMiniPlayerVisible: !s.isMiniPlayerVisible })),
  toggleExpanded: () => set(s => ({ isPlayerExpanded: !s.isPlayerExpanded })),
  setPlaylist: (id) => set({ currentPlaylistId: id }),
  startPomodoro: () => set(s => ({ pomodoro: { ...s.pomodoro, isActive: true } })),
  pausePomodoro: () => set(s => ({ pomodoro: { ...s.pomodoro, isActive: false } })),
  resetPomodoro: () => set(s => ({ pomodoro: { ...s.pomodoro, isActive: false, timeRemaining: s.pomodoro.workMinutes * 60 } })),
  setPomodoroWork: (m) => set(s => ({ pomodoro: { ...s.pomodoro, workMinutes: m, timeRemaining: m * 60 } })),
  setPomodoroBreak: (m) => set(s => ({ pomodoro: { ...s.pomodoro, breakMinutes: m } })),
}));

export default useMusicStore;
