import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLearningStore, Lesson } from '../store/learningStore';
import useHallmarkStore from '../store/hallmarkStore';
import { ArrowLeft, Play, CheckCircle, Award, Terminal, Code, HelpCircle, FileText, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, completeLesson, claimCertificate } = useLearningStore();
  const { addXP } = useHallmarkStore();

  const course = courses.find(c => c.id === courseId);
  const [activeLessonId, setActiveLessonId] = useState<string>(course?.lessons[0]?.id || '');

  const [userCode, setUserCode] = useState('// Write code response here\n');
  const [selectedQuizOpt, setSelectedQuizOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center font-mono">
        Course ID not verified.
      </div>
    );
  }

  const activeLesson = course.lessons.find(l => l.id === activeLessonId);

  const handleCompleteLesson = () => {
    if (!activeLesson) return;
    completeLesson(course.id, activeLesson.id);
    addXP(course.verse, activeLesson.xpReward);
    alert(`Completed! Gained +${activeLesson.xpReward} XP in ${course.verse.toUpperCase()}`);

    const nextUncompleted = course.lessons.find(l => l.id !== activeLesson.id && !l.isCompleted);
    if (nextUncompleted) {
      setActiveLessonId(nextUncompleted.id);
    }
  };

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video': return <Play size={14} className="text-[#00d4ff]" />;
      case 'text': return <FileText size={14} className="text-[#a78bfa]" />;
      case 'quiz': return <HelpCircle size={14} className="text-[#f59e0b]" />;
      case 'code': return <Code size={14} className="text-[#ec4899]" />;
      case 'lab': return <Terminal size={14} className="text-[#10b981]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate('/learning-dashboard')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs cursor-pointer font-mono uppercase tracking-wider">
              <ArrowLeft size={14} /> Back to Syllabus
            </button>
            {course.certUnlocked && (
              <button
                onClick={() => {
                  claimCertificate(course.id);
                  alert('Certificate issued successfully. Checked profile records!');
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#f59e0b] to-[#ec4899] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Award size={14} /> Claim Certificate
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-[#111114] border border-[#2a2a2e] p-5 rounded-2xl h-fit space-y-4">
              <div>
                <h2 className="font-extrabold text-sm text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>{course.title}</h2>
                <span className="text-[0.58rem] font-mono uppercase text-[#6e6868]">{course.lessons.length} Modules chapter</span>
              </div>

              <div className="space-y-2 border-t border-[#1a1a20] pt-4">
                {course.lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonId(lesson.id);
                      setQuizSubmitted(false);
                      setSelectedQuizOpt(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${activeLessonId === lesson.id ? 'bg-[#1a1a20] border-white/20 text-white' : 'bg-transparent border-transparent text-[#6e6868] hover:text-white'}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getLessonIcon(lesson.type)}
                      <span className="text-xs font-semibold truncate">{lesson.title}</span>
                    </div>
                    {lesson.isCompleted && <CheckCircle size={12} className="text-[#2ea86a] flex-shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 bg-[#111114] border border-[#2a2a2e] rounded-2xl flex flex-col min-h-[500px]">
              {activeLesson ? (
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="border-b border-[#1a1a20] pb-4 flex justify-between items-center">
                      <div>
                        <span className="text-[0.58rem] font-mono uppercase text-[#6e6868] block mb-1">Module Chapter Active</span>
                        <h3 className="font-extrabold text-sm text-white">{activeLesson.title}</h3>
                      </div>
                      <span className="text-[0.58rem] font-mono text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded">
                        +{activeLesson.xpReward} XP
                      </span>
                    </div>

                    {activeLesson.type === 'video' && (
                      <div className="space-y-4">
                        <div className="aspect-video w-full bg-[#0c0c0e] rounded-2xl flex items-center justify-center border border-[#2a2a2e] relative overflow-hidden">
                          <Play size={40} className="text-[#00d4ff] hover:scale-110 transition-transform cursor-pointer" />
                          <div className="absolute bottom-4 left-4 text-[0.62rem] font-mono text-[#6e6868] uppercase">
                            [Adaptive Video Streaming Player]
                          </div>
                        </div>
                        <p className="text-xs text-[#b0a8a8] leading-relaxed select-text">{activeLesson.content}</p>
                      </div>
                    )}

                    {activeLesson.type === 'text' && (
                      <div className="prose prose-invert max-w-none text-xs text-[#b0a8a8] leading-relaxed space-y-4 select-text">
                        <p>{activeLesson.content}</p>
                      </div>
                    )}

                    {activeLesson.type === 'quiz' && (
                      <div className="space-y-4">
                        <p className="text-xs text-[#b0a8a8] leading-relaxed mb-4">{activeLesson.content}</p>
                        <div className="space-y-2">
                          {[
                            'Option A: Escape target tags using regex filters',
                            'Option B: Deploy zero-permission validation headers',
                            'Option C: Apply HTML entity character encoding to inputs',
                            'Option D: Ignore verification and allow sandbox compilation',
                          ].map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (!quizSubmitted) setSelectedQuizOpt(idx);
                              }}
                              className={`w-full text-left p-3.5 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${selectedQuizOpt === idx ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]' : 'bg-[#0c0c0e] border-[#2a2a2e] hover:border-[#383842]'}`}
                              disabled={quizSubmitted}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        {selectedQuizOpt !== null && !quizSubmitted && (
                          <button
                            onClick={() => {
                              setQuizSubmitted(true);
                              if (selectedQuizOpt === 2) {
                                alert('Correct answer! Click complete to gain XP.');
                              } else {
                                alert('Incorrect option choice. Try encoding tags.');
                              }
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white text-xs font-bold uppercase rounded-lg hover:opacity-90 cursor-pointer"
                          >
                            Submit Answer
                          </button>
                        )}
                      </div>
                    )}

                    {activeLesson.type === 'code' && (
                      <div className="space-y-4">
                        <p className="text-xs text-[#b0a8a8] leading-relaxed mb-3">{activeLesson.content}</p>
                        <div className="bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl overflow-hidden">
                          <div className="bg-[#111114] border-b border-[#2a2a2e] px-4 py-2 flex items-center justify-between text-[0.62rem] font-mono text-[#6e6868]">
                            <span>terminal_compiler.js</span>
                            <span>Node v18.0</span>
                          </div>
                          <textarea
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            rows={8}
                            className="w-full bg-transparent p-4 text-xs font-mono text-[#00d4ff] outline-none resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {activeLesson.type === 'lab' && (
                      <div className="space-y-4">
                        <p className="text-xs text-[#b0a8a8] leading-relaxed mb-4">{activeLesson.content}</p>
                        <div className="bg-black border border-[#2a2a2e] p-4 rounded-xl font-mono text-[0.65rem] text-[#2ea86a] space-y-2">
                          <div>$ technova-audit --target sandbox.internal --port 8080</div>
                          <div className="text-white">Connecting telemetry socket vectors...</div>
                          <div className="text-yellow-500">[WARNING] 1 Exposed endpoint loop detected.</div>
                          <div>$ ready for deployment checks...</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 border-t border-[#1a1a20] pt-6 flex justify-between items-center">
                    <span className="text-[0.62rem] font-mono text-[#6e6868]">
                      XP to gain: +{activeLesson.xpReward} XP
                    </span>
                    <button
                      onClick={handleCompleteLesson}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#10b981] to-[#34d399] hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Complete Module <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-[#6e6868] font-mono">
                  Select a chapter module from the list.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoursePage;
