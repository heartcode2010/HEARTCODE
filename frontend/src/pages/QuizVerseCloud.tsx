import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Play, Clock3, Trophy, RefreshCw, BookOpenCheck, Cloud, AlertCircle } from 'lucide-react';
import './QuizVerseCloud.css';
import api from '../services/api';

type Question = { prompt: string; options: string[]; correctIndex: number; explanation?: string };
type Quiz = { _id: string; title: string; subject: string; durationMinutes: number; questions: Question[] };
type Attempt = { _id: string; score: number; total: number; submittedAt: string; quizId?: { title?: string; subject?: string } };

export default function QuizVerseCloud() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'library'|'create'|'attempt'|'result'>('library');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('General');
  const [duration, setDuration] = useState(10);
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState(['','','','']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [draft, setDraft] = useState<Question[]>([]);
  const [active, setActive] = useState<Quiz|null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{score:number;total:number;percentage:number}|null>(null);

  async function request(path:string, init:RequestInit={}) {
    try {
      const response = await api.request({ url: '/v1/platform'+path, method: init.method || 'GET', data: init.body ? JSON.parse(String(init.body)) : undefined });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'The request could not be completed.');
    }
  }
  async function refresh() {
    setBusy(true); setError('');
    try {
      const [q,a] = await Promise.all([request('/quizverse/quizzes'),request('/quizverse/attempts')]);
      setQuizzes(q.quizzes || []); setAttempts(a.attempts || []);
    } catch(e) { setError(e instanceof Error ? e.message : 'Could not load QuizVerse.'); }
    finally { setBusy(false); }
  }
  useEffect(()=>{ refresh(); },[]);
  function addQuestion() {
    if (!prompt.trim() || options.some(x=>!x.trim())) return;
    setDraft(old=>[...old,{prompt:prompt.trim(),options:options.map(x=>x.trim()),correctIndex,explanation:explanation.trim()}]);
    setPrompt(''); setOptions(['','','','']); setCorrectIndex(0); setExplanation('');
  }
  async function saveQuiz() {
    try {
      const body=await request('/quizverse/quizzes',{method:'POST',body:JSON.stringify({title,subject,durationMinutes:duration,questions:draft})});
      setQuizzes(old=>[body.quiz,...old]); setTitle('');setDraft([]);setMode('library');
    } catch(e) { setError(e instanceof Error?e.message:'Could not save quiz.'); }
  }
  async function submitAttempt() {
    if(!active) return;
    try {
      const body=await request('/quizverse/quizzes/'+active._id+'/attempts',{method:'POST',body:JSON.stringify({answers})});
      setResult(body.result); setMode('result'); await refresh();
    } catch(e) { setError(e instanceof Error?e.message:'Could not submit attempt.'); }
  }
  return <main className="qvc">
    <header className="qvc-top"><Link to="/os"><ArrowLeft size={16}/> TECHNOVA OS</Link><span>QUIZVERSE <i>CLOUD ASSESSMENT</i></span><button onClick={refresh}><RefreshCw size={14}/> Sync</button></header>
    <section className="qvc-hero"><div className="qvc-kicker"><Cloud size={14}/> CONNECTED ASSESSMENT SERVICE</div><h1>Knowledge,<br/><em>put to the test.</em></h1><p>Create assessments, publish practice quizzes and record attempts against your TECHNOVA account. Your quizzes and results are stored on the platform.</p>
      <div className="qvc-stats"><div><BookOpenCheck/><strong>{quizzes.length}</strong><small>Your quizzes</small></div><div><Trophy/><strong>{attempts.length}</strong><small>Attempts</small></div><div><Clock3/><strong>{attempts.length?Math.round(attempts.reduce((n,a)=>n+(a.total?a.score/a.total:0),0)/attempts.length*100)+'%':'—'}</strong><small>Average score</small></div></div>
    </section>
    {error&&<div className="qvc-error"><AlertCircle size={16}/>{error}</div>}
    {busy&&<p className="qvc-note">Loading your cloud workspace…</p>}
    {!busy&&mode==='library'&&<><div className="qvc-actions"><div><h2>Your assessment library</h2><p>Quizzes are saved to your account.</p></div><button className="qvc-primary" onClick={()=>setMode('create')}><Plus size={16}/> Create quiz</button></div>
      <div className="qvc-grid">{quizzes.map(q=><article key={q._id}><span>{q.subject}</span><h3>{q.title}</h3><p>{q.questions.length} questions · {q.durationMinutes} minutes</p><button onClick={()=>{setActive(q);setAnswers(q.questions.map(()=>-1));setMode('attempt')}}><Play size={14}/> Start quiz</button></article>)}</div>
      {!quizzes.length&&<p className="qvc-note">No published quizzes yet. Create your first assessment to get started.</p>}
      <section className="qvc-history"><h2>Recent attempts</h2>{attempts.slice(0,10).map(a=><div key={a._id}><span>{a.quizId?.title||'Quiz assessment'}</span><strong>{a.score}/{a.total} · {a.total?Math.round(a.score/a.total*100):0}%</strong><small>{new Date(a.submittedAt).toLocaleString()}</small></div>)}{!attempts.length&&<p>No attempts recorded yet.</p>}</section>
    </>}
    {mode==='create'&&<section className="qvc-builder"><button className="qvc-back" onClick={()=>setMode('library')}>← Back to library</button><h2>Create an assessment</h2><div className="qvc-fields"><label>Quiz title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Introduction to HTML"/></label><label>Subject<input value={subject} onChange={e=>setSubject(e.target.value)}/></label><label>Duration (minutes)<input type="number" min="1" max="180" value={duration} onChange={e=>setDuration(Math.max(1,Math.min(180,Number(e.target.value)||1)))}/></label></div>
      <div className="qvc-question"><label>Question<input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Write your question"/></label><div className="qvc-options">{options.map((v,i)=><label key={i}>Option {String.fromCharCode(65+i)}<input value={v} onChange={e=>setOptions(old=>old.map((x,j)=>j===i?e.target.value:x))}/></label>)}</div><label>Correct option<select value={correctIndex} onChange={e=>setCorrectIndex(Number(e.target.value))}>{options.map((_,i)=><option value={i} key={i}>{String.fromCharCode(65+i)}</option>)}</select></label><label>Explanation<input value={explanation} onChange={e=>setExplanation(e.target.value)}/></label><button className="qvc-secondary" disabled={!prompt.trim()||options.some(x=>!x.trim())} onClick={addQuestion}><Plus size={14}/> Add question</button></div>
      <p className="qvc-note">{draft.length} question(s) added</p>{draft.map((q,i)=><p key={i}>{i+1}. {q.prompt}</p>)}<button className="qvc-primary" disabled={!title.trim()||!draft.length} onClick={saveQuiz}>Publish quiz</button>
    </section>}
    {mode==='attempt'&&active&&<section className="qvc-builder"><button className="qvc-back" onClick={()=>setMode('library')}>← Exit quiz</button><h2>{active.title}</h2>{active.questions.map((q,i)=><article className="qvc-take-question" key={i}><small>QUESTION {i+1} OF {active.questions.length}</small><h3>{q.prompt}</h3>{q.options.map((option,j)=><button className={answers[i]===j?'selected':''} key={j} onClick={()=>setAnswers(old=>old.map((x,k)=>k===i?j:x))}>{option}</button>)}</article>)}<button className="qvc-primary" disabled={answers.some(x=>x<0)} onClick={submitAttempt}>Submit assessment</button></section>}
    {mode==='result'&&result&&<section className="qvc-result"><Trophy size={32}/><h2>Assessment complete</h2><strong>{result.percentage}%</strong><p>{result.score} correct answers out of {result.total}</p><button className="qvc-primary" onClick={()=>setMode('library')}>Return to QuizVerse</button></section>}
    <footer className="qvc-footer">TECHNOVA OS · QUIZVERSE <span>Account-backed assessment service · Payments and AI question generation are not enabled.</span></footer>
  </main>;
}
