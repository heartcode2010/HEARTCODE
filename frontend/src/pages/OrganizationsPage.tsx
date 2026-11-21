import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeft,Users,Plus,UserPlus,RefreshCw} from 'lucide-react';
import api from '../services/api';
import './OrganizationsPage.css';
type Organization={_id:string;name:string;slug:string;members:{userId:string;role:string}[]};
export default function OrganizationsPage(){
 const [items,setItems]=useState<Organization[]>([]);
 const [name,setName]=useState('');
 const [identifier,setIdentifier]=useState('');
 const [role,setRole]=useState('learner');
 const [selected,setSelected]=useState('');
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const [error,setError]=useState('');
 async function load(){try{const {data}=await api.get('/v1/platform/organizations');setItems(data.organizations||[])}catch(e:any){setError(e?.response?.data?.message||'Sign in to manage organisations.')}}
 useEffect(()=>{load()},[]);
 async function create(){setBusy(true);setError('');setMessage('');try{const {data}=await api.post('/v1/platform/organizations',{name});setItems(old=>[data.organization,...old]);setName('');setMessage('Organisation created.')}catch(e:any){setError(e?.response?.data?.message||'Could not create organisation.')}finally{setBusy(false)}}
 async function addMember(){if(!selected)return;setBusy(true);setError('');setMessage('');try{const {data}=await api.post('/v1/platform/organizations/'+selected+'/members',{identifier,role});setMessage(data.message);setIdentifier('');await load()}catch(e:any){setError(e?.response?.data?.message||'Could not add member.')}finally{setBusy(false)}}
 return <main className="org-page"><header><Link to="/os"><ArrowLeft size={16}/> TECHNOVA OS</Link><span><Users size={17}/> ORGANISATIONS</span></header><section className="org-hero"><div>TEAM & INSTITUTION WORKSPACE</div><h1>Build together.</h1><p>Create a workspace for your training centre, school, business or creator team. Add existing TECHNOVA accounts as members.</p></section>
 {message&&<div className="org-message">{message}</div>}{error&&<div className="org-error">{error}</div>}
 <section className="org-panel"><h2>Create an organisation</h2><div className="org-create"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Organisation or institution name"/><button onClick={create} disabled={busy||name.trim().length<2}><Plus size={15}/> Create</button></div></section>
 <section className="org-panel"><div className="org-head"><div><h2>Your organisations</h2><p>Account-scoped team spaces.</p></div><button onClick={load}><RefreshCw size={14}/> Refresh</button></div>{items.length?items.map(o=><article className="org-row" key={o._id}><div><strong>{o.name}</strong><small>{o.slug} · {o.members?.length||1} member(s)</small></div><button onClick={()=>setSelected(o._id)}>Manage members</button></article>):<p className="org-empty">No organisations yet. Create one to get started.</p>}</section>
 {selected&&<section className="org-panel"><h2>Add an existing member</h2><p>Members must already have a TECHNOVA account. This does not send an email invitation.</p><div className="org-create"><input value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="Member username or email"/><select value={role} onChange={e=>setRole(e.target.value)}><option value="learner">Learner</option><option value="instructor">Instructor</option><option value="admin">Organisation admin</option></select><button onClick={addMember} disabled={busy||identifier.trim().length<3}><UserPlus size={15}/> Add member</button></div></section>}
 <footer>TECHNOVA OS · ORGANISATIONS <span>Member management · Existing-account additions · Invitations and granular permissions are not enabled yet.</span></footer></main>
}
