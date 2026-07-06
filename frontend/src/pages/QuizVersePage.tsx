import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useQuizStore } from '../store/quizStore';
import { ArrowLeft, Plus, Sparkles, BookOpen, Users } from 'lucide-react';

const QuizVersePage: React.FC = () => {
  const navigate = useNavigate();
  const { quizzes, fetchQuizzes, createQuiz } = useQuizStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('cybersecurity');
  const [accessMode, setAccessMode] = useState<'free' | 'paid' | 'subscription' | 'institution'>('free');
  const [price, setPrice] = useState('0');

  useEffect(() => { fetchQuizzes(); }, [fetchQuizzes]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const quiz = await createQuiz({ title, description, category, accessMode, price: Number(price), tags: [category], questions: [{ question: 'Sample question', options: ['A', 'B', 'C', 'D'], correctIndex: 0, explanation: 'This is a starter quiz.' }] });
    if (quiz) {
      setTitle(''); setDescription(''); setPrice('0');
      await fetchQuizzes();
      alert('Quiz published to QuizVerse.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col">
      <Header />
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={16} /> Back to hub
          </button>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center gap-2 text-sm text-cyan-300"><Sparkles size={16} /> QuizVerse</div>
              <h1 className="mt-4 text-3xl font-semibold">Create, publish, and monetize assessments.</h1>
              <p className="mt-3 text-sm text-slate-400">Build quizzes for students, teams, or communities and publish them into the marketplace with flexible access modes.</p>
              <div className="mt-6 space-y-3">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="rounded-2xl border border-white/10 bg-[#0f1115] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{quiz.title}</div>
                        <div className="mt-1 text-xs text-slate-400">{quiz.description}</div>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.65rem] uppercase">{quiz.accessMode}</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1"><BookOpen size={13} /> {quiz.questions.length} questions</span>
                      <span className="inline-flex items-center gap-1"><Users size={13} /> {quiz.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
              <h2 className="text-xl font-semibold">Create a quiz</h2>
              <form onSubmit={handleCreate} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0f1115] px-3 py-3 text-sm outline-none focus:border-cyan-400" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0f1115] px-3 py-3 text-sm outline-none focus:border-cyan-400" rows={3} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-400">Category</label>
                  <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0f1115] px-3 py-3 text-sm outline-none focus:border-cyan-400" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Access mode</label>
                    <select value={accessMode} onChange={(e) => setAccessMode(e.target.value as any)} className="w-full rounded-2xl border border-white/10 bg-[#0f1115] px-3 py-3 text-sm outline-none focus:border-cyan-400">
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                      <option value="subscription">Subscription</option>
                      <option value="institution">Institution</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Price</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0f1115] px-3 py-3 text-sm outline-none focus:border-cyan-400" />
                  </div>
                </div>
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold transition hover:bg-cyan-400"><Plus size={16} /> Publish quiz</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuizVersePage;
