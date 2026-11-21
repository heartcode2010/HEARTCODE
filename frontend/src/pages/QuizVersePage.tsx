import React,{useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeft,Plus,Play,BookOpenCheck,Trophy,Search,RefreshCw,CheckCircle2,AlertCircle,ClipboardList} from 'lucide-react';
import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import api from '../services/api';
import './QuizVersePage.css';

type Question={id:string;question:string;options:string[];correctIndex?:number;explanation?:string;difficulty?:'easy'|'medium'|'hard';category?:string};
type Quiz={_id:string;title:string;description:string;category:string;questions:Question[];isPublished:boolean;isOwner?:boolean;creatorId:string;accessMode:string;price:number};
type Attempt={_id:string;score:number;total:number;percentage:number;submittedAt:string;quizId?:{title?:string;category?:string}};
type Result={score:number;total:number;percentage:number;review:{questionId:string;question:string;options:string[];selectedIndex:number;correctIndex:number;isCorrect:boolean;explanation:string}[]};
type DraftQuestion=Question&{correctIndex:number};

const QuizVersePage:React.FC=()=>{
 const [quizzes,setQuizzes]=useState<Quiz[]>([]);
 const [attempts,setAttempts]=useState<Attempt[]>([]);
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const [mode,setMode]=useState<'library'|'create'|'attempt'|'result'>('library');
 const [query,setQuery]=useState('');
 const [title,setTitle]=useState('');
 const [description,setDescription]=useState('');
 const [category,setCategory]=useState('General Knowledge');
 const [questionText,setQuestionText]=useState('');
 const [options,setOptions]=useState(['','','','']);
 const [correctIndex,setCorrectIndex]=useState(0);
 const [explanation,setExplanation]=useState('');
 const [draft,setDraft]=useState<DraftQuestion[]>([]);
 const [activeQuiz,setActiveQuiz]=useState<Quiz|null>(null);
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [result,setResult]=useState<Result|null>(null);

 async function load(){
  setLoading(true);setError('');
  try{
   const [q,a]=await Promise.all([api.get('/quizzes'),api.get('/quizzes/attempts/me')]);
   setQuizzes(q.data.quizzes||[]);setAttempts(a.data.attempts||[]);
  }catch(e:any){setError(e?.response?.data?.message||'Sign in to load your QuizVerse account.')}
  finally{setLoading(false)}
 }
 useEffect(()=>{load()},[]);
 const filtered=useMemo(()=>quizzes.filter(q=>(q.title+' '+q.category+' '+q.description).toLowerCase().includes(query.toLowerCase())),[quizzes,query]);
 const average=attempts.length?Math.round(attempts.reduce((sum,a)=>sum+(a.percentage??(a.total?100*a.score/a.total:0)),0)/attempts.length):null;

 function addQuestion(){
  if(!questionText.trim()||options.some(o=>!o.trim()))return;
  setDraft(old=>[...old,{id:'q_'+Date.now()+'_'+old.length,question:questionText.trim(),options:options.map(o=>o.trim()),correctIndex,explanation:explanation.trim(),difficulty:'easy',category}]);
  setQuestionText('');setOptions(['','','','']);setCorrectIndex(0);setExplanation('');
 }
 async function publishQuiz(){
  if(!title.trim()||!draft.length)return;
  setBusy(true);setError('');setNotice('');
  try{
   const {data}=await api.post('/quizzes',{title,description,category,accessMode:'free',price:0,questions:draft,isPublished:true});
   setQuizzes(old=>[data.quiz,...old]);setTitle('');setDescription('');setDraft([]);setMode('library');setNotice('Your quiz has been published to QuizVerse.');
  }catch(e:any){setError(e?.response?.data?.message||'Could not publish this quiz.')}
  finally{setBusy(false)}
 }
 async function startQuiz(item:Quiz){
  setBusy(true);setError('');
  try{const {data}=await api.get('/quizzes/'+item._id);setActiveQuiz(data.quiz);setAnswers({});setResult(null);setMode('attempt')}
  catch(e:any){setError(e?.response?.data?.message||'Could not open this quiz.')}
  finally{setBusy(false)}
 }
 async function submitAttempt(){
  if(!activeQuiz)return;
  const payload=activeQuiz.questions.map(q=>({questionId:q.id,selectedIndex:answers[q.id]}));
  setBusy(true);setError('');
  try{const {data}=await api.post('/quizzes/'+activeQuiz._id+'/attempts',{answers:payload});setResult(data.result);setMode('result');await load()}
  catch(e:any){setError(e?.response?.data?.message||'Could not submit your answers.')}
  finally{setBusy(false)}
 }

 return <div className="qvp"><Header/><main className="qvp-main">
  <div className="qvp-topline"><Link to="/os"><ArrowLeft size={15}/> TECHNOVA OS</Link><span>QUIZVERSE · ASSESSMENT STUDIO</span></div>
  <section className="qvp-hero"><div className="qvp-kicker"><BookOpenCheck size={15}/> CREATE · PRACTISE · ASSESS</div><h1>Knowledge,<br/><em>put to the test.</em></h1><p>Build assessments, practise with published quizzes and track your results. Quiz scores are calculated by the server and saved to your account.</p><div className="qvp-stats"><div><ClipboardList/><strong>{quizzes.length}</strong><small>Available quizzes</small></div><div><Trophy/><strong>{attempts.length}</strong><small>Attempts completed</small></div><div><CheckCircle2/><strong>{average===null?'—':average+'%'}</strong><small>Average score</small></div></div></section>
  {notice&&<div className="qvp-notice"><CheckCircle2 size={16}/>{notice}</div>}{error&&<div className="qvp-error"><AlertCircle size={16}/>{error}</div>}
  {mode==='library'&&<><div className="qvp-toolbar"><div><h2>Assessment library</h2><p>Published quizzes and assessments you created.</p></div><button className="qvp-primary" onClick={()=>{setError('');setMode('create')}}><Plus size={15}/> Create quiz</button></div><div className="qvp-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search quizzes, subjects or topics"/></div>
   {loading?<div className="qvp-empty">Loading QuizVerse…</div>:<div className="qvp-grid">{filtered.map(q=><article className="qvp-card" key={q._id}><div className="qvp-card-top"><span>{q.category||'General'}</span><small>{q.isOwner?'YOUR QUIZ':'PUBLISHED'}</small></div><h3>{q.title}</h3><p>{q.description||'Practice questions and knowledge checks.'}</p><div className="qvp-card-foot"><span>{q.questions?.length||0} questions</span><button disabled={busy} onClick={()=>startQuiz(q)}><Play size={13}/> Start</button></div></article>)}</div>}
   {!loading&&!filtered.length&&<div className="qvp-empty">No quizzes match that search. Create one to start your library.</div>}
   <section className="qvp-history"><h2>Recent attempts</h2>{attempts.length?attempts.slice(0,8).map(a=><div className="qvp-attempt" key={a._id}><span>{a.quizId?.title||'Quiz assessment'}</span><strong>{a.score}/{a.total} · {a.percentage}%</strong><small>{new Date(a.submittedAt).toLocaleString()}</small></div>):<p>No attempts yet. Complete a quiz to see your results here.</p>}</section>
  </>}
  {mode==='create'&&<section className="qvp-builder"><button className="qvp-back" onClick={()=>setMode('library')}>← Back to library</button><h2>Create a new quiz</h2><div className="qvp-fields"><label>Quiz title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Web Development Fundamentals"/></label><label>Subject or category<input value={category} onChange={e=>setCategory(e.target.value)} placeholder="e.g. Cybersecurity"/></label><label className="qvp-wide">Description<textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="What will learners practise?"/></label></div><div className="qvp-question-builder"><h3>Question {draft.length+1}</h3><label>Question<input value={questionText} onChange={e=>setQuestionText(e.target.value)} placeholder="Write a clear question"/></label><div className="qvp-options">{options.map((o,i)=><label key={i}>Option {String.fromCharCode(65+i)}<input value={o} onChange={e=>setOptions(old=>old.map((v,j)=>j===i?e.target.value:v))} placeholder={'Answer '+(i+1)}/></label>)}</div><label>Correct answer<select value={correctIndex} onChange={e=>setCorrectIndex(Number(e.target.value))}>{options.map((_,i)=><option value={i} key={i}>Option {String.fromCharCode(65+i)}</option>)}</select></label><label>Explanation (optional)<textarea value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="Explain the correct answer"/></label><button className="qvp-secondary" disabled={!questionText.trim()||options.some(o=>!o.trim())} onClick={addQuestion}><Plus size={14}/> Add question</button></div><div className="qvp-drafts"><h3>Questions added ({draft.length})</h3>{draft.map((q,i)=><div key={q.id}><span>{i+1}. {q.question}</span><small>Answer: {q.options[q.correctIndex]}</small></div>)}</div><button className="qvp-primary" disabled={busy||!title.trim()||!draft.length} onClick={publishQuiz}>{busy?'Publishing…':'Publish quiz'}</button></section>}
  {mode==='attempt'&&activeQuiz&&<section className="qvp-builder"><button className="qvp-back" onClick={()=>setMode('library')}>← Exit quiz</button><div className="qvp-attempt-title"><div className="qvp-kicker">{activeQuiz.category}</div><h2>{activeQuiz.title}</h2><p>{activeQuiz.questions.length} questions · Select one answer for each question.</p></div>{activeQuiz.questions.map((q,i)=><article className="qvp-question" key={q.id}><small>QUESTION {i+1} / {activeQuiz.questions.length}</small><h3>{q.question}</h3>{q.options.map((option,j)=><button className={answers[q.id]===j?'selected':''} key={j} onClick={()=>setAnswers(old=>({...old,[q.id]:j}))}>{option}</button>)}</article>)}<button className="qvp-primary" disabled={busy||Object.keys(answers).length!==activeQuiz.questions.length} onClick={submitAttempt}>{busy?'Submitting…':'Submit answers'}</button></section>}
  {mode==='result'&&result&&<section className="qvp-result"><Trophy size={30}/><div className="qvp-kicker">ASSESSMENT COMPLETE</div><h2>Your result</h2><strong>{result.percentage}%</strong><p>{result.score} correct answers out of {result.total}. Your score has been saved.</p>{result.review.map((q,i)=><article key={q.questionId}><b>{i+1}. {q.question}</b><small className={q.isCorrect?'correct':'incorrect'}>{q.isCorrect?'Correct':'Review this answer'} · Correct answer: {q.options[q.correctIndex]}</small>{q.explanation&&<p>{q.explanation}</p>}</article>)}<button className="qvp-primary" onClick={()=>setMode('library')}>Back to QuizVerse</button></section>}
 </main><Footer/></div>;
};
export default QuizVersePage;
