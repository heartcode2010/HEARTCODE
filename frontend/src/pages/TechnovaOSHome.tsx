import React from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight,ShieldCheck,Blocks,Palette,Code2,BookOpen,TerminalSquare,ClipboardList,Wallet,Users,ShoppingBag,Settings2,Sparkles,GraduationCap,Layers3} from 'lucide-react';
import './TechnovaOSHome.css';

const verses=[
 {name:'CyberVerse',number:'01',tag:'CYBER INTELLIGENCE',description:'The security flagship: vulnerability scanning, security analysis and Cyber Academy learning.',icon:ShieldCheck,status:'FLAGSHIP',statusClass:'live',links:[{label:'Open scanner',to:'/'},{label:'Cyber Academy',to:'/academy'}]},
 {name:'BlockchainVerse',number:'02',tag:'WEB3 & BLOCKCHAIN',description:'Learn blockchain concepts, explore Solidity examples and use the virtual trading simulator.',icon:Blocks,status:'SIMULATION',statusClass:'preview',links:[{label:'Enter BlockchainVerse',to:'/blockchainverse'}]},
 {name:'Nexora',number:'03',tag:'CREATOR & BRAND STUDIO',description:'Explore the AI Director, brand builder, creator services and studio workflows.',icon:Palette,status:'PREVIEW',statusClass:'preview',links:[{label:'Enter Nexora',to:'/nexora'}]},
 {name:'TechVerse',number:'04',tag:'DEVELOPER ACADEMY',description:'Explore structured learning paths across frontend, backend, cybersecurity and AI.',icon:Code2,status:'LEARNING PREVIEW',statusClass:'preview',links:[{label:'Enter TechVerse',to:'/techverse'}]},
 {name:'EduVerse',number:'05',tag:'EDUCATION & EXAM PREP',description:'Access the WAEC/JAMB companion interface, revision tools and learning workflows.',icon:BookOpen,status:'PREVIEW',statusClass:'preview',links:[{label:'Enter EduVerse',to:'/eduverse'}]},
 {name:'TechLabs',number:'06',tag:'BUILD & EXPERIMENT',description:'Write HTML, CSS and JavaScript, preview projects locally and export static files.',icon:TerminalSquare,status:'LOCAL SANDBOX',statusClass:'preview',links:[{label:'Open TechLabs',to:'/techlabs'}]},
];
const services=[
 {name:'QuizVerse',description:'Create quizzes, publish assessments and score learner attempts on the server.',icon:ClipboardList,to:'/quizverse',state:'ACCOUNT-BACKED'},
 {name:'Wallet',description:'Account-backed NGN ledger and Paystack funding. Withdrawals are not enabled.',icon:Wallet,to:'/wallet',state:'PAYSTACK-READY'},
 {name:'Affiliate Network',description:'Referral links, click tracking and one-time new-account attribution. Purchase commissions are not connected yet.',icon:Users,to:'/affiliate',state:'PARTIAL'},
 {name:'Marketplace',description:'Browse digital assets and freelance gigs in the current marketplace experience.',icon:ShoppingBag,to:'/marketplace',state:'PREVIEW'},
 {name:'Admin Control',description:'View real account, assessment, wallet and affiliate record counts and integration readiness.',icon:Settings2,to:'/platform-admin',state:'ADMIN-BACKED'},
 {name:'AI Workspace',description:'Open the existing AI chat experience and provider-connected tools.',icon:Sparkles,to:'/ai-chat',state:'PROVIDER-DEPENDENT'},
];
export default function TechnovaOSHome(){
 return <main className="technova-os-home">
  <header className="toh-top"><Link to="/os" className="toh-brand"><span className="toh-mark">T</span>TECHNOVA <i>OS</i></Link><div className="toh-top-right"><span><i/> PLATFORM HUB</span><Link to="/">CYBERVERSE <ArrowUpRight size={14}/></Link></div></header>
  <section className="toh-hero"><div className="toh-eyebrow"><span/> THE UNIFIED TECHNOLOGY ECOSYSTEM</div><h1>One universe.<br/><em>Many ways forward.</em></h1><p>Learn, build, create, secure and grow from one connected technology platform. Choose a Verse or open a shared service.</p><div className="toh-hero-actions"><Link to="/" className="toh-primary"><ShieldCheck size={16}/> Open vulnerability scanner</Link><Link to="/academy" className="toh-secondary"><GraduationCap size={16}/> Explore Cyber Academy</Link></div></section>
  <section className="toh-section"><div className="toh-section-head"><div><small>THE MULTI-VERSE</small><h2>Choose your environment</h2></div><p>Each Verse has its own focus. Preview and simulated features are labelled honestly.</p></div><div className="toh-verse-grid">{verses.map(v=>{const Icon=v.icon;return <article className="toh-verse" key={v.number}><div className="toh-verse-top"><span>{v.number} / VERSE</span><b className={v.statusClass}>{v.status}</b></div><div className="toh-icon"><Icon size={23}/></div><small>{v.tag}</small><h3>{v.name}</h3><p>{v.description}</p><div className="toh-links">{v.links.map(l=><Link key={l.to} to={l.to}>{l.label}<ArrowUpRight size={14}/></Link>)}</div></article>})}</div></section>
  <section className="toh-section toh-services"><div className="toh-section-head"><div><small>SHARED PLATFORM SERVICES</small><h2>One connected foundation</h2></div><p>Cross-platform tools that support learning, commerce and creator workflows.</p></div><div className="toh-service-grid">{services.map(s=>{const Icon=s.icon;return <Link className="toh-service" to={s.to} key={s.name}><Icon size={20}/><div><h3>{s.name}</h3><p>{s.description}</p><small>{s.state}</small></div><ArrowUpRight size={15}/></Link>})}</div></section>
  <footer className="toh-footer"><div><strong>TECHNOVA OS</strong><span>Built to help people learn, build and grow with technology.</span></div><span>CyberVerse scanner and Cyber Academy remain the security flagship.</span></footer>
 </main>;
}
