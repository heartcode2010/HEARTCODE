import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscriptionStore from '../../store/subscriptionStore';
import { ArrowLeft, BookOpen, FileText, HelpCircle, Award, Sparkles, Brain, Plus } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const EduVerseHome: React.FC = () => {
  const navigate = useNavigate();
  const { tier } = useSubscriptionStore();
  const [inputText, setInputText] = useState('');
  const [outputNotes, setOutputNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setOutputNotes(`### AI Generated Lecture Notes: ${inputText}

#### 1. Core Principles
- Technical definition and primary conceptual vectors.
- Operational logic and sandbox compilation parameters.

#### 2. Key Takeaways
- Always validate input boundaries to prevent leaks.
- Leverage entitities encoding for HTML outputs.

#### 3. Summary quiz question
- *Question:* Which method is ideal for sanitizing web crawler inputs?
- *Answer:* Character entity encoding.`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans select-none">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-3 cursor-pointer font-mono uppercase tracking-wider">
                <ArrowLeft size={14} /> Back to Hub
              </button>
              <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <Brain size={24} className="text-[#10b981]" /> EDUVERSE ACADEMY PORTAL
              </h1>
              <p className="text-xs text-[#6e6868] mt-1">WAEC & JAMB companion: generate flashcards, practice CBT quizzes, and download lecture notes.</p>
            </div>
            <button
              onClick={() => navigate('/learning-dashboard')}
              className="px-4 py-2 bg-gradient-to-r from-[#10b981] to-[#34d399] text-white hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <Award size={14} /> My Certificates
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl h-fit space-y-4">
              <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider">CBT Mock Preparations</h3>
              <div className="space-y-2.5">
                {[
                  { name: 'JAMB Mathematics CBT Practice', count: '40 questions' },
                  { name: 'WAEC English Language Essay Study', count: '10 prompts' },
                  { name: 'JAMB Physics CBT Practice', count: '40 questions' },
                ].map((cbt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      alert(`Enrolling in mock exam: ${cbt.name}`);
                      navigate('/learning-dashboard');
                    }}
                    className="w-full text-left p-3.5 bg-[#0c0c0e] hover:bg-[#1a1a20] border border-[#2a2a2e] rounded-xl text-xs font-semibold text-[#b0a8a8] hover:text-white transition-colors cursor-pointer flex justify-between items-center"
                  >
                    <span>{cbt.name}</span>
                    <span className="text-[0.55rem] font-mono text-[#6e6868]">{cbt.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <form onSubmit={handleGenerateNotes} className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#10b981]" /> AI notes & flashcards generator
                </h3>
                <p className="text-xs text-[#b0a8a8] leading-relaxed">
                  Enter any academic topic below. The AI tutor will generate comprehensive study notes, takeaways, and flashcard layouts.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g. Photosynthesis, Binary Search Trees, Matrix Multiplication..."
                    className="flex-1 bg-[#0c0c0e] border border-[#2a2a2e] text-xs p-3 rounded-xl outline-none focus:border-[#10b981] text-white"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 bg-[#10b981] hover:bg-[#10b981]/90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    {isLoading ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </form>

              {outputNotes && (
                <div className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl select-text font-sans">
                  <h4 className="text-xs font-mono text-[#6e6868] uppercase tracking-wider mb-4">Study Output Result</h4>
                  <pre className="text-xs text-[#b0a8a8] whitespace-pre-wrap leading-relaxed select-text font-sans">
                    {outputNotes}
                  </pre>
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

export default EduVerseHome;
