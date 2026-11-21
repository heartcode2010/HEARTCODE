import React,{useEffect,useState} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {ArrowLeft,Wallet,RefreshCw,ArrowUpRight,CheckCircle2,AlertCircle} from 'lucide-react';
import api from '../services/api';
import './WalletPage.css';
type Transaction={direction:'credit'|'debit';amountNaira:number;currency:string;description:string;reference:string;createdAt:string};
export default function WalletPage(){
 const [balance,setBalance]=useState<number|null>(null);
 const [transactions,setTransactions]=useState<Transaction[]>([]);
 const [amount,setAmount]=useState(2000);
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const [error,setError]=useState('');
 const location=useLocation();
 async function load(){
  setLoading(true);setError('');
  try{const [w,t]=await Promise.all([api.get('/v1/platform/wallet'),api.get('/v1/platform/wallet/transactions')]);setBalance(w.data.balanceNaira);setTransactions(t.data.transactions||[])}
  catch(e:any){setError(e?.response?.data?.message||'Sign in to view your wallet.')}
  finally{setLoading(false)}
 }
 useEffect(()=>{const ref=new URLSearchParams(location.search).get('reference')||new URLSearchParams(location.search).get('trxref');if(ref){setBusy(true);api.get('/v1/platform/commerce/paystack/verify/'+encodeURIComponent(ref)).then(({data})=>setMessage(data.message||'Payment verified.')).catch((e:any)=>setError(e?.response?.data?.message||'Payment is not yet confirmed.')).finally(()=>{setBusy(false);window.history.replaceState({},document.title,location.pathname);load()})}else{load()}},[]);
 async function topUp(){setBusy(true);setError('');setMessage('');try{const {data}=await api.post('/v1/platform/commerce/paystack/initialize',{amountNaira:amount});window.location.assign(data.authorizationUrl)}catch(e:any){setError(e?.response?.data?.message||'Could not start checkout.')}finally{setBusy(false)}}
 return <main className="wallet-page"><header><Link to="/os"><ArrowLeft size={16}/> TECHNOVA OS</Link><span><Wallet size={17}/> WALLET & PAYMENTS</span></header><section className="wp-hero"><div className="wp-kicker">YOUR ACCOUNT BALANCE</div><h1>Wallet</h1><div className="wp-balance">{loading?'…':balance===null?'—':'₦'+balance.toLocaleString('en-NG',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><p>Wallet balances are calculated from verified ledger entries. Only confirmed Paystack transactions are credited.</p></section>
 {message&&<div className="wp-message"><CheckCircle2 size={16}/>{message}</div>}{error&&<div className="wp-error"><AlertCircle size={16}/>{error}</div>}
 <section className="wp-panel"><div><h2>Add funds</h2><p>Top up your TECHNOVA wallet through Paystack.</p></div><div className="wp-topup"><label>Amount in naira<input type="number" min="1000" max="5000000" step="500" value={amount} onChange={e=>setAmount(Math.max(1000,Math.min(5000000,Number(e.target.value)||1000)))}/></label><button onClick={topUp} disabled={busy||amount<1000}>{busy?'Processing…':'Continue to secure checkout'} <ArrowUpRight size={15}/></button></div><small>Minimum ₦1,000 · Maximum ₦5,000,000 · Checkout availability depends on Paystack server configuration.</small></section>
 <section className="wp-panel"><div className="wp-history-head"><div><h2>Transaction history</h2><p>Your latest wallet activity.</p></div><button onClick={load}><RefreshCw size={14}/> Refresh</button></div>{transactions.length?transactions.map(t=><article className="wp-row" key={t.reference}><div><strong>{t.description}</strong><small>{new Date(t.createdAt).toLocaleString()}</small></div><b className={t.direction==='credit'?'credit':'debit'}>{t.direction==='credit'?'+':'−'}₦{t.amountNaira.toLocaleString('en-NG')}</b></article>):<p className="wp-empty">{loading?'Loading transactions…':'No wallet transactions yet.'}</p>}</section>
 <footer>TECHNOVA OS · WALLET <span>Paystack checkout · NGN ledger · Account-backed</span></footer></main>
}
