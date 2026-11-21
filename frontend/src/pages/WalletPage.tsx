import React,{useEffect,useState} from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import {Wallet,ArrowDownLeft,ArrowLeft,Clock,RefreshCw,ShieldCheck,AlertCircle,CheckCircle,ArrowUpRight} from 'lucide-react';
import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import api from '../services/api';

type WalletData={balance:number;totalCredited:number;totalDebited:number;currency:string};
type WalletTransaction={id:string;direction:'credit'|'debit';amount:number;currency:string;description:string;reference:string;source:string;createdAt:string};

export const WalletPage:React.FC=()=>{
 const location=useLocation();const navigate=useNavigate();
 const [wallet,setWallet]=useState<WalletData|null>(null);
 const [transactions,setTransactions]=useState<WalletTransaction[]>([]);
 const [amount,setAmount]=useState('2000');
 const [tab,setTab]=useState<'overview'|'transactions'>('overview');
 const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');const [notice,setNotice]=useState('');

 const loadWallet=async()=>{
  setLoading(true);setError('');
  try{
   const [summary,history]=await Promise.all([api.get('/wallet/me'),api.get('/wallet/transactions')]);
   setWallet(summary.data.wallet);setTransactions(history.data.transactions||[]);
  }catch(e:any){setError(e?.response?.data?.message||'Sign in to view your account wallet.')}
  finally{setLoading(false)}
 };
 useEffect(()=>{
  const params=new URLSearchParams(location.search);const reference=params.get('reference')||params.get('trxref');
  if(reference){
   setBusy(true);
   api.get('/wallet/deposit/verify/'+encodeURIComponent(reference))
    .then(({data})=>setNotice(data.message||'Payment verified.'))
    .catch((e:any)=>setError(e?.response?.data?.message||'Payment verification is still pending.'))
    .finally(()=>{setBusy(false);window.history.replaceState({},document.title,location.pathname);loadWallet()});
  }else{loadWallet()}
 },[]);
 const startDeposit=async()=>{
  const value=Number(amount);
  if(!Number.isInteger(value)||value<1000||value>5000000){setError('Enter a whole naira amount between ₦1,000 and ₦5,000,000.');return}
  setBusy(true);setError('');setNotice('');
  try{const {data}=await api.post('/wallet/deposit/initialize',{amount:value});window.location.assign(data.checkoutUrl)}
  catch(e:any){setError(e?.response?.data?.message||'Could not start Paystack checkout.')}
  finally{setBusy(false)}
 };
 const money=(value:number)=>'₦'+value.toLocaleString('en-NG',{minimumFractionDigits:2,maximumFractionDigits:2});
 return <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans"><Header/><main className="flex-1 py-8 px-4"><div className="max-w-5xl mx-auto">
  <button onClick={()=>navigate('/os')} className="flex items-center gap-2 text-[#8a8080] hover:text-white text-xs mb-6 cursor-pointer font-mono uppercase tracking-wider"><ArrowLeft size={14}/> TECHNOVA OS</button>
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8"><div><div className="text-[0.62rem] font-mono uppercase tracking-[.16em] text-[#a78bfa]">Account-backed ledger</div><h1 className="text-3xl font-extrabold mt-2" style={{fontFamily:"'Outfit',sans-serif"}}>TECHNOVA Wallet</h1><p className="text-xs text-[#8a8080] mt-2">Your balance is calculated from verified payment records. No demo balance is displayed.</p></div><div className="bg-[#111114] border border-[#2a2a2e] rounded-xl px-5 py-4 min-w-[230px]"><span className="text-[0.6rem] font-mono uppercase text-[#8a8080]">Available balance</span><div className="text-2xl font-extrabold mt-1">{loading?'…':wallet?money(wallet.balance):'—'}</div></div></div>
  {notice&&<div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-[#10271f] border border-[#245d45] text-[#9ce5bf] text-xs"><CheckCircle size={15}/>{notice}</div>}
  {error&&<div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-[#321c29] border border-[#794056] text-[#ffc4d1] text-xs"><AlertCircle size={15}/>{error}</div>}
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-7"><div className="bg-[#111114] border border-[#2a2a2e] p-4 rounded-xl"><span className="text-[0.58rem] text-[#8a8080] uppercase font-mono">Total credited</span><strong className="block mt-2 text-lg">{wallet?money(wallet.totalCredited):'—'}</strong></div><div className="bg-[#111114] border border-[#2a2a2e] p-4 rounded-xl"><span className="text-[0.58rem] text-[#8a8080] uppercase font-mono">Total debited</span><strong className="block mt-2 text-lg">{wallet?money(wallet.totalDebited):'—'}</strong></div><div className="bg-[#111114] border border-[#2a2a2e] p-4 rounded-xl col-span-2 md:col-span-1"><span className="text-[0.58rem] text-[#8a8080] uppercase font-mono">Currency</span><strong className="block mt-2 text-lg">NGN · Nigerian naira</strong></div></div>
  <div className="grid grid-cols-1 md:grid-cols-5 gap-5"><section className="md:col-span-2 bg-[#111114] border border-[#2a2a2e] rounded-2xl p-5 h-fit"><h2 className="font-bold text-sm">Fund your wallet</h2><p className="text-[0.7rem] text-[#8a8080] mt-2 leading-relaxed">Secure checkout through Paystack. Funds are added only after the backend verifies the transaction directly with Paystack.</p><label className="block text-[0.65rem] text-[#b0a8a8] font-mono uppercase mt-5">Amount (NGN)<input type="number" min="1000" max="5000000" step="500" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full mt-2 p-3 bg-[#0b0b0e] border border-[#30303a] rounded-lg text-white text-sm"/></label><button onClick={startDeposit} disabled={busy} className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-bold text-xs disabled:opacity-50">{busy?'Processing…':'Continue to Paystack'} <ArrowUpRight size={14} className="inline ml-1"/></button><div className="flex gap-2 items-start mt-4 text-[0.62rem] text-[#85818a]"><ShieldCheck size={14} className="text-[#2ea86a] shrink-0"/> Your payment is verified server-side before any wallet credit is recorded.</div><div className="mt-5 pt-4 border-t border-[#2a2a2e] text-[0.68rem] text-[#85818a]">Withdrawals and bank payouts are not enabled yet. Do not treat a pending payment as wallet funds.</div></section>
   <section className="md:col-span-3 bg-[#111114] border border-[#2a2a2e] rounded-2xl p-5"><div className="flex justify-between items-center gap-3 mb-5"><div><h2 className="font-bold text-sm">Wallet ledger</h2><p className="text-[0.65rem] text-[#8a8080] mt-1">Verified transactions linked to your account.</p></div><button onClick={loadWallet} className="flex items-center gap-1.5 px-3 py-2 bg-[#1b1b22] border border-[#30303a] rounded-lg text-[0.65rem]"><RefreshCw size={13}/> Refresh</button></div><div className="flex gap-1 mb-4 bg-[#0b0b0e] p-1 rounded-lg w-fit">{(['overview','transactions'] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={'px-3 py-2 rounded-md text-[0.65rem] capitalize '+(tab===t?'bg-[#252535] text-white':'text-[#85818a]')}>{t}</button>)}</div>{loading?<p className="text-xs text-[#85818a] py-8 text-center">Loading ledger…</p>:transactions.length===0?<div className="py-10 text-center"><Wallet size={25} className="mx-auto text-[#5d5870] mb-3"/><p className="text-xs text-[#85818a]">No verified wallet transactions yet.</p></div>:<div className="space-y-2">{transactions.map(txn=><article key={txn.reference} className="flex justify-between items-center gap-3 p-3 rounded-lg bg-[#0b0b0e] border border-[#20202a]"><div className="flex items-center gap-3 min-w-0"><span className={'w-8 h-8 rounded-lg flex items-center justify-center '+(txn.direction==='credit'?'bg-[#2ea86a]/10 text-[#2ea86a]':'bg-[#e02840]/10 text-[#e02840]')}>{txn.direction==='credit'?<ArrowDownLeft size={15}/>:<ArrowUpRight size={15}/>}</span><div className="min-w-0"><strong className="block text-xs truncate">{txn.description}</strong><small className="block text-[0.58rem] text-[#74717d] mt-1">{new Date(txn.createdAt).toLocaleString()} · {txn.source}</small></div></div><b className={'text-xs shrink-0 '+(txn.direction==='credit'?'text-[#2ea86a]':'text-[#e02840]')}>{txn.direction==='credit'?'+':'−'}{money(txn.amount)}</b></article>)}</div>}</section></div>
 </div></main><Footer/></div>;
};
export default WalletPage;
