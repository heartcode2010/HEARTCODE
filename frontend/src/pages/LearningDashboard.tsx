import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearningStore } from '../store/learningStore';
import { ArrowLeft, BookOpen, Award, Flame, Play, CheckCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const LearningDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { courses, skills, learningStyle, dailyStreaks, setLearningStyle } = useLearningStore();
  const [tab, setTab] = useState<'courses' | 'skills' | 'settings'>('courses');

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-6 cursor-pointer font-mono uppercase tracking-wider">
            <ArrowLeft size={14} /> Back to Hub
          </button>

          <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#34d399] rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>PERSONALIZED ACADEMY</h1>
                <p className="text-xs text-[#6e6868]">Adaptive learning syllabus matching your style: visual, auditory, kinesthetic or reading.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#1a1a20] border border-[#2a2a2e] px-4 py-2 rounded-xl text-center flex items-center gap-2">
                <Flame size={16} className="text-[#f97316]" />
                <div>
                  <div className="text-[0.55rem] text-[#6e6868] uppercase font-mono">Streak</div>
                  <div className="text-sm font-bold text-white">{dailyStreaks} Days</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-1 mb-8 bg-[#111114] rounded-xl p-1 border border-[#2a2a2e] w-fit">
            {(['courses', 'skills', 'settings'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${tab === t ? 'bg-[#1a1a20] text-white shadow-md' : 'text-[#6e6868] hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'courses' && (
            <div className="space-y-6">
              <h2 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Recommended Course Workspaces</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => {
                  const completedLessons = course.lessons.filter(l => l.isCompleted).length;
                  const totalLessons = course.lessons.length;
                  const percent = Math.round((completedLessons / totalLessons) * 100);

                  return (
                    <div key={course.id} className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl hover:border-[#383842] transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[0.58rem] font-mono uppercase bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/20 px-2 py-0.5 rounded">
                            {course.verse}
                          </span>
                          <span className="text-[0.58rem] font-mono text-[#6e6868] capitalize">Difficulty: {course.difficulty}</span>
                        </div>

                        <h3 className="font-extrabold text-sm text-white mb-2 leading-snug">{course.title}</h3>
                        <p className="text-xs text-[#b0a8a8] leading-relaxed mb-4">{course.description}</p>

                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between items-center text-[0.62rem] font-mono text-[#6e6868]">
                            <span>Course Progress</span>
                            <span>{completedLessons}/{totalLessons} Lessons ({percent}%)</span>
                          </div>
                          <div className="h-1.5 bg-[#0c0c0e] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/course/${course.id}`)}
                          className="flex-1 py-2 bg-gradient-to-r from-[#10b981] to-[#34d399] text-white hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Play size={12} className="fill-white" /> Continue Learning
                        </button>
                        {course.certUnlocked && (
                          <button
                            onClick={() => {
                              alert(`Certificate generated for "${course.title}". Added to profile!`);
                            }}
                            className="px-3 bg-white/5 border border-[#2a2a2e] rounded-xl hover:bg-white/10 text-white cursor-pointer"
                            title="Claim Certificate"
                          >
                            <Award size={14} className="text-[#f59e0b]" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'skills' && (
            <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl">
              <h2 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-4">Mastery Skill Trees</h2>
              <div className="space-y-4">
                {skills.map(skill => (
                  <div key={skill.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${skill.isUnlocked ? 'bg-[#0c0c0e]/30 border-[#2a2a2e]' : 'bg-[#0c0c0e]/10 border-[#1a1a20] opacity-40'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{skill.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{skill.name}</h4>
                        <p className="text-[0.62rem] text-[#6e6868] mt-0.5">{skill.description}</p>
                      </div>
                    </div>
                    <div>
                      {skill.isCompleted ? (
                        <span className="text-[0.58rem] font-mono text-[#2ea86a] uppercase bg-[#2ea86a]/10 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                          <CheckCircle size={10} /> Mastered
                        </span>
                      ) : skill.isUnlocked ? (
                        <button
                          onClick={() => alert(`Unlocked challenge exercises for ${skill.name}`)}
                          className="px-3 py-1.5 bg-white text-black hover:opacity-90 font-extrabold text-[0.58rem] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                        >
                          Start Exercises
                        </button>
                      ) : (
                        <span className="text-[0.58rem] font-mono text-gray-500 uppercase">Locked</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-2">Adaptive Learning Style</h3>
                <p className="text-xs text-[#b0a8a8] leading-relaxed mb-4">
                  Technova customizes educational materials according to your primary sensory preference vectors.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['reading', 'visual', 'auditory', 'kinesthetic'] as const).map(style => (
                    <button
                      key={style}
                      onClick={() => setLearningStyle(style)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer capitalize font-bold text-xs ${learningStyle === style ? 'bg-white text-black border-white' : 'bg-transparent border-[#2a2a2e] text-[#6e6868] hover:text-white'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LearningDashboard;
