/* Замена claude.use("db"/"user") на Firebase Firestore (REST, без SDK). Без настройки сайт работает офлайн: WhatsApp-отчёты + localStorage. */
(function(){
const C=window.LB_CONFIG||{};
if(!C.projectId||!C.apiKey){window.claude={use:async()=>null};return}
const base="https://firestore.googleapis.com/v1/projects/"+C.projectId+"/databases/(default)/documents",K="?key="+C.apiKey;
const unpack=d=>{try{return JSON.parse(d.fields.j.stringValue)}catch(e){return {}}};
const snap=d=>({id:d.name.split("/").pop(),exists:true,data:()=>unpack(d)});
const api=async(p,o,q)=>{const r=await fetch(base+"/"+p+K+(q||""),o);if(r.status===404)return null;if(!r.ok)throw new Error(r.status);return r.status===200&&(!o||o.method!=="DELETE")?r.json():{}};
const poll=(fn,cb,err)=>{let last="",stop=false;const go=async()=>{if(stop)return;try{const v=await fn();const j=JSON.stringify(v.raw);if(j!==last){last=j;cb(v.snap)}}catch(e){err&&err(e)}setTimeout(go,4000)};go();return()=>{stop=true}};
const db={
 doc:p=>({
  set:o=>api(p,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({fields:{j:{stringValue:JSON.stringify(o)}}})},"&updateMask.fieldPaths=j"),
  get:async()=>{const d=await api(p);return d?snap(d):{exists:false,data:()=>undefined}},
  delete:()=>api(p,{method:"DELETE"}),
  onSnapshot:(cb,err)=>poll(async()=>{const d=await api(p);return {raw:d,snap:d?snap(d):{exists:false,data:()=>undefined}}},cb,err)
 }),
 collection:p=>{const list=async()=>{const r=await api(p,null,"&pageSize=300");const docs=((r&&r.documents)||[]).map(snap);return {raw:r,snap:{docs,size:docs.length,empty:!docs.length}}};
  return {get:async()=>(await list()).snap,onSnapshot:(cb,err)=>poll(list,cb,err)}}
};
const ok=C.teacherPassword?(()=>{let p=sessionStorage.getItem("lb_pw");if(p==null){p=prompt("Пароль учителя")||"";sessionStorage.setItem("lb_pw",p)}return p===C.teacherPassword})():true;
const user={canEdit:async()=>!!window.TEACHER_MODE&&ok,isOwner:async()=>!!window.TEACHER_MODE&&ok,
 id:async()=>{let i=localStorage.getItem("lb_uid");if(!i){i="u"+Date.now().toString(36)+Math.random().toString(36).slice(2,8);localStorage.setItem("lb_uid",i)}return i}};
window.claude={use:async n=>n==="db"?db:n==="user"?user:null};
})();
