import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../../store/academyStore';
import type { CyberQuiz, QuizQuestion, QuizResult } from '../../../types';

const QUIZZES: CyberQuiz[] = [
  {
    id: 'quiz-web-basics',
    title: 'Web Security Basics',
    description: 'Test your understanding of basic secure headers, HTTPS protocols, and common vulnerability remediations.',
    category: 'web-security',
    passingScore: 70,
    questions: [
      {
        id: 'q-wb-1',
        question: 'What does the "Secure" flag on a cookie instruct the browser to do?',
        options: [
          'Prevent JavaScript scripts from accessing the cookie value',
          'Only transmit the cookie over encrypted HTTPS channels',
          'Enforce strict CORS requirements on target APIs',
          'Automatically encrypt cookie data locally on disk'
        ],
        correctIndex: 1,
        explanation: 'The Secure flag limits cookie transmission to encrypted (HTTPS) connections, preventing interception on public Wi-Fi.',
        difficulty: 'easy',
        category: 'cookies'
      },
      {
        id: 'q-wb-2',
        question: 'Which HTTP header prevents your site from being loaded inside an iframe, blocking clickjacking?',
        options: [
          'Content-Type-Options',
          'Strict-Transport-Security',
          'X-Frame-Options',
          'Access-Control-Allow-Origin'
        ],
        correctIndex: 2,
        explanation: 'X-Frame-Options indicates whether browser should be allowed to render page in <frame>, <iframe>, or <object>.',
        difficulty: 'medium',
        category: 'headers'
      },
      {
        id: 'q-wb-3',
        question: 'What vulnerability does input sanitization directly mitigate?',
        options: [
          'Cross-Site Scripting (XSS)',
          'Brute Force password attacks',
          'Distributed Denial of Service (DDoS)',
          'Session Timeout termination'
        ],
        correctIndex: 0,
        explanation: 'XSS happens when attackers inject script payloads. Escaping input (sanitization) disables browser execution of injected scripts.',
        difficulty: 'medium',
        category: 'xss'
      }
    ]
  },
  {
    id: 'quiz-social-eng',
    title: 'Social Engineering Defense',
    description: 'Learn to detect human psychological attacks, BEC attempts, and mobile fraud vectors.',
    category: 'social-engineering',
    passingScore: 100,
    questions: [
      {
        id: 'q-se-1',
        question: 'What is Business Email Compromise (BEC)?',
        options: [
          'Injecting virus payloads in corporate database systems',
          'Spoofing emails of directors or vendors to execute fraudulent payments',
          'Using computing power to mine crypto using corporate grids',
          'Stealing passwords from office physical desktops'
        ],
        correctIndex: 1,
        explanation: 'BEC attacks use email spoofing or account compromise to impersonate senior staff and direct fraudulent money wires.',
        difficulty: 'medium',
        category: 'bec'
      },
      {
        id: 'q-se-2',
        question: 'What is the safest way to confirm a suspicious payment request from your CEO?',
        options: [
          'Reply directly to the email requesting confirmation',
          'Call the CEO using a verified phone number or speak in person',
          'Transfer the money immediately to avoid urgency threats',
          'Forward the email to another colleague to get their thoughts'
        ],
        correctIndex: 1,
        explanation: 'Always verify monetary requests via out-of-band communication (speaking directly in person or dialing a known phone number).',
        difficulty: 'easy',
        category: 'social'
      }
    ]
  }
];

const MOCK_LEADERBOARD = [
  { name: 'X_HUNTER_99', level: 14, xp: 6850 },
  { name: 'NIGERIAN_DEFENDER', level: 11, xp: 5200 },
  { name: 'ROOT_SHELL', level: 9, xp: 4150 },
  { name: 'CYBER_COPILOT', level: 7, xp: 3200 },
  { name: 'ANONYMOUS_ACADEMY', level: 4, xp: 1850 }
];

const ChallengesPlatform: React.FC = () => {
  const navigate = useNavigate();
  const {
    progress,
    addQuizResult,
    addXP,
    badges,
    earnBadge,
    achievements,
    unlockAchievement,
    saveToLocalStorage
  } = useAcademyStore();

  const [activeQuiz, setActiveQuiz] = useState<CyberQuiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = (quiz: CyberQuiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isAnswered || !activeQuiz) return;
    
    const isCorrect = selectedOpt === activeQuiz.questions[currentQuestionIdx].correctIndex;
    if (isCorrect) setCorrectCount((c) => c + 1);
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;

    if (currentQuestionIdx < activeQuiz.questions.length - 1) {
      setCurrentQuestionIdx((idx) => idx + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      // Finished
      const finalScore = Math.round((correctCount / activeQuiz.questions.length) * 100);
      const passed = finalScore >= activeQuiz.passingScore;
      const xpEarned = passed ? 100 : 20;

      const result: QuizResult = {
        quizId: activeQuiz.id,
        score: finalScore,
        totalQuestions: activeQuiz.questions.length,
        correctAnswers: correctCount,
        timeTaken: 30, // static mock
        passed,
        completedAt: new Date().toISOString(),
        xpEarned
      };

      addQuizResult(result);
      addXP(xpEarned);

      // Badge checks
      if (passed) {
        // Find how many quizzes passed total
        earnBadge('threat-hunter');
        if (finalScore === 100) {
          unlockAchievement('quiz-ace');
        }
      }

      setQuizFinished(true);
      saveToLocalStorage();
    }
  };

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">🏆 Cyber Challenges & Leaderboards</h2>
        <p className="academy-section-desc">Validate your cyber defense intelligence, accumulate XP, and unlock badges.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Quiz Card */}
          {activeQuiz ? (
            <div className="bg-cyber-surface border border-cyber-border rounded overflow-hidden">
              <div className="bg-cyber-bg2 px-4 py-2 border-b border-cyber-border flex justify-between font-mono text-[0.66rem] text-cyber-ash">
                <span>QUIZ IN PROGRESS // {activeQuiz.title.toUpperCase()}</span>
                <span>QUESTION {currentQuestionIdx + 1} OF {activeQuiz.questions.length}</span>
              </div>

              {!quizFinished ? (
                <div className="p-5 space-y-4">
                  {/* Question Title */}
                  <h3 className="font-mono text-sm text-white font-bold leading-relaxed">
                    {activeQuiz.questions[currentQuestionIdx].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2">
                    {activeQuiz.questions[currentQuestionIdx].options.map((opt, idx) => {
                      let btnBorder = 'border-cyber-border hover:border-cyber-cyan';
                      let btnBg = 'bg-cyber-bg';
                      if (selectedOpt === idx) {
                        btnBorder = 'border-cyber-cyan';
                        btnBg = 'bg-cyber-cyan-dim';
                      }

                      if (isAnswered) {
                        const isCorrectOpt = idx === activeQuiz.questions[currentQuestionIdx].correctIndex;
                        if (isCorrectOpt) {
                          btnBorder = 'border-cyber-green text-cyber-green';
                          btnBg = 'bg-cyber-green/5';
                        } else if (selectedOpt === idx) {
                          btnBorder = 'border-cyber-red text-cyber-red';
                          btnBg = 'bg-cyber-red/5';
                        } else {
                          btnBorder = 'border-cyber-border opacity-50';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left font-sans text-xs border rounded p-3 transition-all flex items-center justify-between cursor-pointer ${btnBorder} ${btnBg}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && idx === activeQuiz.questions[currentQuestionIdx].correctIndex && (
                            <span className="text-cyber-green font-mono text-[0.62rem] font-bold">✓ CORRECT</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanations */}
                  {isAnswered && (
                    <div className="bg-cyber-bg p-3.5 border-l-2 border-cyber-cyan text-xs text-cyber-ash leading-relaxed">
                      <strong className="text-white font-mono text-[0.64rem] block mb-1">EDUCATIONAL RATIONALE:</strong>
                      {activeQuiz.questions[currentQuestionIdx].explanation}
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex justify-end pt-2 border-t border-cyber-border">
                    {!isAnswered ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOpt === null}
                        className="bg-cyber-surface2 hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan disabled:text-cyber-ash3 disabled:border-cyber-border disabled:bg-cyber-bg px-5 py-2 text-xs font-mono rounded cursor-pointer transition-all"
                      >
                        SUBMIT RESPONSE
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="bg-cyber-surface2 hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan px-5 py-2 text-xs font-mono rounded cursor-pointer transition-all"
                      >
                        {currentQuestionIdx < activeQuiz.questions.length - 1 ? 'NEXT QUESTION →' : 'COMPLETED'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Finished State */
                <div className="p-6 text-center space-y-4">
                  <div className="text-4xl">🎓</div>
                  <h3 className="font-display font-bold text-cyber-cyan text-sm tracking-wide">
                    CHALLENGE SUMMARY REPORT
                  </h3>
                  <div className="max-w-xs mx-auto bg-cyber-bg border border-cyber-border rounded p-4 space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span>CORRECT ANSWERS:</span>
                      <span className="text-white font-bold">{correctCount} / {activeQuiz.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FINAL ACCURACY:</span>
                      <span className="text-white font-bold">{Math.round((correctCount / activeQuiz.questions.length) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TEST RULING:</span>
                      {correctCount / activeQuiz.questions.length >= activeQuiz.passingScore / 100 ? (
                        <span className="text-cyber-green font-bold">PASSED</span>
                      ) : (
                        <span className="text-cyber-red font-bold font-mono">FAILED</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => startQuiz(activeQuiz)}
                      className="bg-cyber-bg hover:bg-cyber-surface2 text-cyber-ash border border-cyber-border text-xs font-mono px-4 py-2 rounded cursor-pointer"
                    >
                      TRY AGAIN
                    </button>
                    <button
                      onClick={() => setActiveQuiz(null)}
                      className="bg-cyber-surface2 hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan text-xs font-mono px-4 py-2 rounded cursor-pointer"
                    >
                      RETURN TO GRID
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quizzes Selection */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUIZZES.map((quiz) => (
                <div key={quiz.id} className="bg-cyber-surface border border-cyber-border rounded p-4 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="font-display text-white text-xs font-bold tracking-wider">{quiz.title}</h3>
                    <p className="text-cyber-ash2 text-[0.68rem] leading-relaxed mt-1.5">{quiz.description}</p>
                    <div className="flex items-center gap-2 mt-3 font-mono text-[0.62rem] text-cyber-ash3">
                      <span>ITEMS: {quiz.questions.length}</span>
                      <span>•</span>
                      <span>PASS THRESHOLD: {quiz.passingScore}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => startQuiz(quiz)}
                    className="w-full bg-cyber-bg hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan text-xs font-mono py-1.5 rounded cursor-pointer text-center"
                  >
                    RUN DIAGNOSTIC CHALLENGE
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Badges Earned Container */}
          <div className="bg-cyber-surface border border-cyber-border rounded p-4">
            <h3 className="font-display font-bold text-white text-xs tracking-wider mb-3">🏅 SYSTEM ACHIEVEMENTS & BADGES</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`border rounded p-3 flex flex-col items-center text-center gap-1.5 transition-all ${
                    badge.earned
                      ? 'bg-cyber-bg border-cyber-cyan/40 text-cyber-cyan shadow-[0_0_12px_rgba(0,245,255,0.08)]'
                      : 'bg-cyber-bg/40 border-cyber-border opacity-40'
                  }`}
                >
                  <span className="text-xl">{badge.icon}</span>
                  <div className="text-[0.66rem] font-bold truncate max-w-full text-white">{badge.name}</div>
                  <div className="text-[0.52rem] text-cyber-ash2 leading-tight">{badge.description}</div>
                  {badge.earned && <div className="text-[0.5rem] font-mono text-cyber-green">EARNED</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Local Leaderboards */}
        <div className="lg:col-span-4 bg-cyber-surface border border-cyber-border rounded p-4 space-y-4">
          <h3 className="font-display font-bold text-white text-xs tracking-wider">🏆 HIGH SCORE REGISTRY</h3>
          <div className="space-y-1.5 font-mono text-[0.66rem]">
            {MOCK_LEADERBOARD.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b border-cyber-border/40 pb-1.5 text-cyber-ash2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-cyber-ash3">#{idx + 1}</span>
                  <span className="text-cyber-ash">{item.name}</span>
                </div>
                <div>
                  <span className="text-cyber-cyan">LVL {item.level}</span>
                  <span className="text-cyber-ash3 ml-2">{item.xp} XP</span>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements Progression */}
          <div className="space-y-2 pt-2 border-t border-cyber-border">
            <h3 className="font-display font-bold text-white text-xs tracking-wider">XP REWARDS</h3>
            <div className="space-y-2 font-mono text-[0.62rem]">
              {achievements.map((ach) => (
                <div key={ach.id} className="bg-cyber-bg border border-cyber-border p-2 rounded">
                  <div className="flex justify-between text-white font-bold">
                    <span>{ach.title}</span>
                    <span className="text-cyber-cyan">+{ach.xpReward} XP</span>
                  </div>
                  <div className="text-cyber-ash2 mt-0.5">{ach.description}</div>
                  {ach.unlocked ? (
                    <div className="text-cyber-green text-[0.58rem] mt-1">✓ UNLOCKED</div>
                  ) : (
                    <div className="text-cyber-ash3 text-[0.58rem] mt-1">PROGRESS INCOMPLETE</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPlatform;
