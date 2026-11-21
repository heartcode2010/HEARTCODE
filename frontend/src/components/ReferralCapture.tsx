import React,{useEffect,useState} from 'react';
import api from '../services/api';
import {useAuthStore} from '../store/authStore';

const STORAGE_KEY='technova.pendingReferralCode';

const ReferralCapture:React.FC=()=>{
 const accessToken=useAuthStore(state=>state.accessToken);
 const [code,setCode]=useState<string|null>(()=>new URLSearchParams(window.location.search).get('ref')||sessionStorage.getItem(STORAGE_KEY));
 useEffect(()=>{
  if(!code)return;
  sessionStorage.setItem(STORAGE_KEY,code);
  const trackedKey='technova.referralTracked.'+code;
  if(!sessionStorage.getItem(trackedKey)){
   api.get('/affiliate/track/'+encodeURIComponent(code)).then(()=>sessionStorage.setItem(trackedKey,'1')).catch(()=>undefined);
  }
  if(new URLSearchParams(window.location.search).has('ref')){
   const cleanUrl=window.location.pathname+window.location.hash;
   window.history.replaceState({},document.title,cleanUrl);
  }
 },[code]);
 useEffect(()=>{
  if(!code||!accessToken||accessToken==='guest-token-access')return;
  api.post('/affiliate/apply',{code}).then(()=>{
   sessionStorage.removeItem(STORAGE_KEY);
   setCode(null);
  }).catch((error:any)=>{
   const status=error?.response?.status;
   if(status===400||status===404||status===409){sessionStorage.removeItem(STORAGE_KEY);setCode(null)}
  });
 },[code,accessToken]);
 return null;
};
export default ReferralCapture;
