import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Play, Clock3, Trophy, Trash2, Download, CheckCircle2, Circle, BookOpenCheck } from 'lucide-react';
import './QuizVerse.css';

type Question = { id: string; prompt: string; options: string[]; answer: number; explanation: string };
type Quiz = { id: string; title: string; subject: string; minutes: number; questions: Question[]; createdAt: string };
type Attempt = { id: string; quizTitle: string; score: number; total: number; date: string };

const STORAGE = 'technova.quizverse.v1';
const starter: Quiz[] = [
  { id: 'starter-cyber', title: 'Cyber Safety Essentials', subject: 'Cybersecurity', minutes: 5, createdAt: 'Built-in practice set', questions: [
    { id: 'q1', prompt: 'Which action is safest when an unexpected message asks for your bank PIN?', options: ['Reply and ask who sent it', 'Share only part of the PIN', 'Do not share it; contact your bank through an official channel', 'Forward it to friends'], answer: 2, explanation: 'Banks do not need your PIN by message. Use a verified contact channel.' },
    { id: 'q2', prompt: 'What does multi-factor authentication add to an account?', options: ['A second proof of identity', 'A longer username', 'Free data', 'Automatic backups'], answer: 0, explanation: 'MFA asks for another verification factor beyond the password.' },
    { id: 'q3', prompt: 'A job offer asks you to pay a processing fee before an interview. What should you do?', options: ['Pay quickly', 'Verify the employer independently and treat the request as a warning sign', 'Send your ATM card', 'Ignore all future job offers'], answer: 1, explanation: 'Upfront payment demands are a common recruitment scam warning sign.' },
  ] },
  { id: 'starter-web', title: 'Web Development Basics', subject: 'Technology', minutes: 4, createdAt: 'Built-in practice set', questions: [
    { id: 'w1', prompt: 'What does HTML primarily define?', options: ['The structure of a web page', 'The database server', 'The internet connection', 'The browser password'], answer: 0, explanation: 'HTML describes page structure and content.' },
    { id: 'w2', prompt: 'Which language is commonly used to style web pages?', options: ['SQL', 'CSS', 'Bash', 'Python only'], answer: 1, explanation: 'CSS controls presentation such as layout, colour and typography.' },
  ] },
];

function loadData(): { quizzes: Quiz[]; attempts: Attempt[] } {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE) || 'null');
    if (parsed && Array.isArray(parsed.quizzes) && Array.isArray(parsed.attempts)) return parsed;
  } catch { /* use starter data */ }
  return { quizzes: starter, attempts: [] };
}

export default function QuizVerse() {
  const [data, setData] = useState(loadData);
  const [mode, setMode] = useState<'home' | 'create' | 'attempt' | 'result'>('home');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('General Knowledge');
  const [minutes, setMinutes] = useState(10);
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [draftQuestions, setDraftQuestions] = useState<Question[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [lastScore, setLastScore] = useState<{ score: number; total: number } | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify(data)); }, [data]);
  useEffect(() => {
    if (mode !== 'attempt' || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [mode, secondsLeft]);
  useEffect(() => {
    if (mode === 'attempt' && secondsLeft === 0 && activeQuiz) finishAttempt();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, mode]);

  const filtered = useMemo(() => data.quizzes.filter(q => `${q.title} ${q.subject}`.toLowerCase().includes(query.toLowerCase())), [data.quizzes, query]);
  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  function addQuestion() {
    if (!prompt.trim() || options.some(o => !o.trim())) return;
    setDraftQuestions(q => [...q, { id: crypto.randomUUID(), prompt: prompt.trim(), options: options.map(o => o.trim()), answer, explanation: explanation.trim() }]);
    setPrompt(''); setOptions(['', '', '', '']); setAnswer(0); setExplanation('');
  }
  function saveQuiz() {
    if (!title.trim() || draftQuestions.length === 0) return;
    setData(d => ({ ...d, quizzes: [{ id: crypto.randomUUID(), title: title.trim(), subject: subject.trim() || 'General', minutes, questions: draftQuestions, createdAt: new Date().toISOString() }, ...d.quizzes] }));
    setTitle(''); setDraftQuestions([]); setMode('home');
  }
  function startQuiz(quiz: Quiz) {
    setActiveQuiz(quiz); setAnswers({}); setSecondsLeft(quiz.minutes * 60); setLastScore(null); setMode('attempt');
  }
  function finishAttempt() {
    if (!activeQuiz || mode !== 'attempt') return;
    const score = activeQuiz.questions.filter(q => answers[q.id] === q.answer).length;
    setLastScore({ score, total: activeQuiz.questions.length });
    setData(d => ({ ...d, attempts: [{ id: crypto.randomUUID(), quizTitle: activeQuiz.title, score, total: activeQuiz.questions.length, date: new Date().toISOString() }, ...d.attempts] }));
    setMode('result');
  }
  function removeQuiz(id: string) {
    if (id.startsWith('starter-')) return;
    setData(d => ({ ...d, quizzes: d.quizzes.filter(q => q.id !== id) }));
  }
  function exportResults() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'technova-quizverse-data.json'; a.click(); URL.revokeObjectURL(url);
  }

  return <main className="quizverse">
    <header className="qv-top"><Link to="/os" className="qv-back"><ArrowLeft size={16}/> TECHNOVA OS</Link><span>QUIZVERSE <i>ASSESSMENT STUDIO</i></span><button onClick={exportResults}><Download size={15}/> Export data</button></header>
    <section className="qv-hero"><div className="qv-kicker">LEARN • CREATE • CHALLENGE</div><h1>Knowledge,<br/><em>put to the test.</em></h1><p>Create practice assessments, challenge yourself and review your performance. Your current workspace saves data on this device.</p>
      <div className="qv-stats"><div><BookOpenCheck/><strong>{data.quizzes.length}</strong><span>Quizzes available</span></div><div><Trophy/><strong>{data.attempts.length}</strong><span>Attempts recorded</span></div><div><CheckCircle2/><strong>{data.attempts.length ? Math.round(data.attempts.reduce((n,a)=>n+a.score/a.total,0)/data.attempts.length*100)+'%' : '—'}</strong><span>Average score</span></div></div>
    </section>
    {mode === 'home' && <>
      <section className="qv-controls"><div><h2>Your quiz library</h2><p>Pick a practice set or create your own assessment.</p></div><button className="qv-primary" onClick={()=>setMode('create')}><Plus size={16}/> Create a quiz</button></section>
      <div className="qv-search"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search quizzes or subjects…"/></div>
      <section className="qv-grid">{filtered.map(quiz=><article className="qv-card" key={quiz.id}><div className="qv-card-meta"><span>{quiz.subject}</span><span>{quiz.createdAt.startsWith('Built-in') ? 'PRACTICE SET' : 'YOUR QUIZ'}</span></div><h3>{quiz.title}</h3><p>{quiz.questions.length} questions · {quiz.minutes} minutes</p><div className="qv-card-actions"><button onClick={()=>startQuiz(quiz)}><Play size={14}/> Start quiz</button>{!quiz.id.startsWith('starter-') && <button className="qv-delete" aria-label="Delete quiz" onClick={()=>removeQuiz(quiz.id)}><Trash2 size={14}/></button>}</div></article>)}</section>
      <section className="qv-history"><h2>Recent attempts</h2>{data.attempts.length ? data.attempts.slice(0,6).map(a=><div className="qv-attempt-row" key={a.id}><span>{a.quizTitle}</span><strong>{a.score}/{a.total} · {Math.round(a.score/a.total*100)}%</strong><small>{new Date(a.date).toLocaleString()}</small></div>) : <p>No attempts yet. Complete a quiz to see your results here.</p>}</section>
    </>}
    {mode === 'create' && <section className="qv-builder"><button className="qv-text-btn" onClick={()=>setMode('home')}>← Back to library</button><h2>Create an assessment</h2><div className="qv-form-grid"><label>Quiz title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Introduction to HTML"/></label><label>Subject or category<input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="e.g. Web Development"/></label><label>Time limit (minutes)<input type="number" min="1" max="180" value={minutes} onChange={e=>setMinutes(Math.max(1,Math.min(180,Number(e.target.value)||1)))}/></label></div>
      <div className="qv-question-builder"><div className="qv-card-meta"><span>NEW QUESTION</span><span>Multiple choice</span></div><label>Question<input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Write a clear question…"/></label><div className="qv-option-grid">{options.map((o,i)=><label key={i}>Option {String.fromCharCode(65+i)}<input value={o} onChange={e=>setOptions(old=>old.map((v,j)=>i===j?e.target.value:v))} placeholder={`Answer option ${i+1}`}/></label>)}</div><label>Correct answer<select value={answer} onChange={e=>setAnswer(Number(e.target.value))}>{options.map((_,i)=><option value={i} key={i}>Option {String.fromCharCode(65+i)}</option>)}</select></label><label>Explanation (optional)<textarea value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="Explain why this answer is correct…"/></label><button className="qv-secondary" onClick={addQuestion} disabled={!prompt.trim()||options.some(o=>!o.trim())}><Plus size={15}/> Add question</button></div>
      <div className="qv-draft-list"><h3>Questions added ({draftQuestions.length})</h3>{draftQuestions.map((q,i)=><div key={q.id}>{i+1}. {q.prompt}</div>)}</div><button className="qv-primary" disabled={!title.trim()||!draftQuestions.length} onClick={saveQuiz}>Save quiz to this device</button></section>}
    {mode === 'attempt' && activeQuiz && <section className="qv-taking"><div className="qv-timer"><Clock3 size={16}/> {formatTime(secondsLeft)} remaining</div><div className="qv-card-meta"><span>{activeQuiz.subject}</span><span>{activeQuiz.questions.length} QUESTIONS</span></div><h2>{activeQuiz.title}</h2>{activeQuiz.questions.map((q,i)=><article className="qv-question" key={q.id}><span>QUESTION {i+1} / {activeQuiz.questions.length}</span><h3>{q.prompt}</h3>{q.options.map((o,j)=><button className={answers[q.id]===j?'selected':''} key={j} onClick={()=>setAnswers(a=>({...a,[q.id]:j}))}>{answers[q.id]===j?<CheckCircle2/>:<Circle/>}{o}</button>)}</article>)}<button className="qv-primary" onClick={finishAttempt}>Submit answers</button></section>}
    {mode === 'result' && activeQuiz && lastScore && <section className="qv-result"><div className="qv-result-icon"><Trophy size={28}/></div><div className="qv-kicker">ASSESSMENT COMPLETE</div><h2>{lastScore.score===lastScore.total?'Excellent work!':'Your result'}</h2><div className="qv-score">{Math.round(lastScore.score/lastScore.total*100)}<small>%</small></div><p>You answered {lastScore.score} out of {lastScore.total} questions correctly.</p>{activeQuiz.questions.map((q,i)=><article className="qv-review" key={q.id}><strong>{i+1}. {q.prompt}</strong><p className={answers[q.id]===q.answer?'correct':'incorrect'}>{answers[q.id]===q.answer?'Correct':'Review this answer'} · Correct answer: {q.options[q.answer]}</p>{q.explanation && <small>{q.explanation}</small>}</article>)}<button className="qv-primary" onClick={()=>setMode('home')}>Back to QuizVerse</button></section>}
    <footer className="qv-footer">TECHNOVA OS · QUIZVERSE <span>Local prototype · No online accounts, purchases or shared leaderboards yet.</span></footer>
  </main>;
}
