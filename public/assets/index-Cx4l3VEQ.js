const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomePage-DSQ9p8ao.js","assets/vendor-BXjfuAV2.js","assets/animations-x2k2uirx.js","assets/HomePage-qm3HWWiL.css","assets/AdminLogin-DfJHZu2l.js","assets/AdminStyles-CobNpjRZ.css","assets/AdminDashboard-BgcCUSH7.js","assets/AdminLayout-j9XR6kY5.js","assets/AdminLayout-R6VXoLDI.css","assets/AdminGallery-J6FfwWYU.js","assets/AdminProjects-D2lWtXMS.js","assets/AdminWorkers-CbDgn8sP.js","assets/AdminClients-Vk3kkdLQ.js","assets/AdminHours-CY2eA4q1.js","assets/AdminCenovnik-BrPqWbK4.js","assets/AdminObracunPonude-DrhvB-08.js","assets/AdminKreiranjePonude-Dm1g1a_j.js","assets/WorkerProfile-EpoLYMka.js","assets/WorkerStyles-CLuxr92B.js","assets/WorkerStyles-Boqna4eY.css","assets/WorkerProjects-D7cvBbZt.js","assets/WorkerDamageReport-FMTQSpN7.js","assets/WorkerHours-CXXdiBe6.js"])))=>i.map(i=>d[i]);
import{r as s,a as Ae,b as Ie,c as D,R as Oe,B as Ce}from"./vendor-BXjfuAV2.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function r(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=r(n);fetch(n.href,i)}})();var he={exports:{}},Z={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ze=s,Te=Symbol.for("react.element"),Ne=Symbol.for("react.fragment"),Re=Object.prototype.hasOwnProperty,Le=ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,He={key:!0,ref:!0,__self:!0,__source:!0};function ye(e,t,r){var o,n={},i=null,a=null;r!==void 0&&(i=""+r),t.key!==void 0&&(i=""+t.key),t.ref!==void 0&&(a=t.ref);for(o in t)Re.call(t,o)&&!He.hasOwnProperty(o)&&(n[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps,t)n[o]===void 0&&(n[o]=t[o]);return{$$typeof:Te,type:e,key:i,ref:a,props:n,_owner:Le.current}}Z.Fragment=Ne;Z.jsx=ye;Z.jsxs=ye;he.exports=Z;var m=he.exports,le={},me=Ae;le.createRoot=me.createRoot,le.hydrateRoot=me.hydrateRoot;const We="modulepreload",Me=function(e){return"/"+e},pe={},A=function(t,r,o){let n=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),d=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(r.map(p=>{if(p=Me(p),p in pe)return;pe[p]=!0;const k=p.endsWith(".css"),b=k?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${b}`))return;const u=document.createElement("link");if(u.rel=k?"stylesheet":We,k||(u.as="script"),u.crossOrigin="",u.href=p,d&&u.setAttribute("nonce",d),document.head.appendChild(u),k)return new Promise((l,c)=>{u.addEventListener("load",l),u.addEventListener("error",()=>c(new Error(`Unable to preload CSS for ${p}`)))})}))}function i(a){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=a,window.dispatchEvent(d),!d.defaultPrevented)throw a}return n.then(a=>{for(const d of a||[])d.status==="rejected"&&i(d.reason);return t().catch(i)})};function Fe(){return m.jsx("div",{className:"loading-screen",children:m.jsxs("div",{className:"loading-content",children:[m.jsx("div",{className:"loading-logo",children:m.jsx("i",{className:"bi bi-box-seam"})}),m.jsx("div",{className:"loading-spinner"}),m.jsx("p",{className:"loading-text",children:"Učitavanje..."})]})})}const Ke=s.lazy(()=>A(()=>import("./HomePage-DSQ9p8ao.js"),__vite__mapDeps([0,1,2,3]))),Be=s.lazy(()=>A(()=>import("./AdminLogin-DfJHZu2l.js"),__vite__mapDeps([4,1,2,5]))),Ge=s.lazy(()=>A(()=>import("./AdminDashboard-BgcCUSH7.js"),__vite__mapDeps([6,1,7,2,8,5]))),Je=s.lazy(()=>A(()=>import("./AdminGallery-J6FfwWYU.js"),__vite__mapDeps([9,1,7,2,8,5]))),Ye=s.lazy(()=>A(()=>import("./AdminProjects-D2lWtXMS.js"),__vite__mapDeps([10,1,7,2,8,5]))),Ve=s.lazy(()=>A(()=>import("./AdminWorkers-CbDgn8sP.js"),__vite__mapDeps([11,1,7,2,8,5]))),Ue=s.lazy(()=>A(()=>import("./AdminClients-Vk3kkdLQ.js"),__vite__mapDeps([12,1,7,2,8,5]))),qe=s.lazy(()=>A(()=>import("./AdminHours-CY2eA4q1.js"),__vite__mapDeps([13,1,7,2,8,5]))),Ze=s.lazy(()=>A(()=>import("./AdminCenovnik-BrPqWbK4.js"),__vite__mapDeps([14,1,7,2,8,5]))),Qe=s.lazy(()=>A(()=>import("./AdminObracunPonude-DrhvB-08.js"),__vite__mapDeps([15,1,7,2,8,5]))),Xe=s.lazy(()=>A(()=>import("./AdminKreiranjePonude-Dm1g1a_j.js"),__vite__mapDeps([16,1,7,2,8,5]))),et=s.lazy(()=>A(()=>import("./WorkerProfile-EpoLYMka.js"),__vite__mapDeps([17,1,18,2,19]))),tt=s.lazy(()=>A(()=>import("./WorkerProjects-D7cvBbZt.js"),__vite__mapDeps([20,1,18,2,19]))),rt=s.lazy(()=>A(()=>import("./WorkerDamageReport-FMTQSpN7.js"),__vite__mapDeps([21,1,18,2,19]))),at=s.lazy(()=>A(()=>import("./WorkerHours-CXXdiBe6.js"),__vite__mapDeps([22,1,18,2,19])));function ot(){return m.jsx(s.Suspense,{fallback:m.jsx(Fe,{}),children:m.jsxs(Ie,{children:[m.jsx(D,{path:"/",element:m.jsx(Ke,{})}),m.jsx(D,{path:"/admin/login",element:m.jsx(Be,{})}),m.jsx(D,{path:"/admin/dashboard",element:m.jsx(Ge,{})}),m.jsx(D,{path:"/admin/gallery",element:m.jsx(Je,{})}),m.jsx(D,{path:"/admin/projects",element:m.jsx(Ye,{})}),m.jsx(D,{path:"/admin/workers",element:m.jsx(Ve,{})}),m.jsx(D,{path:"/admin/clients",element:m.jsx(Ue,{})}),m.jsx(D,{path:"/admin/hours",element:m.jsx(qe,{})}),m.jsx(D,{path:"/admin/cenovnik",element:m.jsx(Ze,{})}),m.jsx(D,{path:"/admin/obracun-ponude",element:m.jsx(Qe,{})}),m.jsx(D,{path:"/admin/kreiranje-ponude",element:m.jsx(Xe,{})}),m.jsx(D,{path:"/worker/profile",element:m.jsx(et,{})}),m.jsx(D,{path:"/worker/projects",element:m.jsx(tt,{})}),m.jsx(D,{path:"/worker/damage-report",element:m.jsx(rt,{})}),m.jsx(D,{path:"/worker/hours",element:m.jsx(at,{})})]})})}const ve=s.createContext(),te=[{id:1,title:"Kuhinja sa sankom",description:"Kompletna izrada kuhinje sa sankom.",image:"/images/gallery/kuhinja-po-meri-9.jpg",category:"kreacije",featured:!0,createdAt:"2024-12-01"},{id:2,title:"Montaža kuhinje",description:"Montaža kuhinje rađene po meri sa šankom",image:"/images/gallery/kuhinja-po-meri-10.jpg",category:"kreacije",featured:!1,createdAt:"2024-11-28"},{id:3,title:"Izrada i montaža kuhinje",description:"Izrada i montaža kuhinje po meri",image:"/images/gallery/kuhinja-npm-1.png",category:"kreacije",featured:!0,createdAt:"2024-11-25"},{id:4,title:"Kuhinja 3D Render",description:"Izrada kuhinje u 3D-u",image:"/images/gallery/render-kuhinja-1.jpg",category:"renderi",featured:!1,createdAt:"2024-11-20"},{id:5,title:"Montaža lavaboa",description:"Profesionalna montaža lavaboa",image:"/images/gallery/montaza-lavabo.png",category:"montaza",featured:!1,createdAt:"2024-11-18"},{id:6,title:"Montaža kuhinje po meri",description:"Kompletna montaža kuhinje",image:"/images/gallery/montaza-kuhinja-1.png",category:"montaza",featured:!0,createdAt:"2024-11-15"},{id:7,title:"Montaža vrata",description:"Profesionalna montaža vrata",image:"/images/gallery/montaza-vrata.png",category:"montaza",featured:!1,createdAt:"2024-11-12"},{id:8,title:"Montaža ormara",description:"Montaža ugradnog ormara",image:"/images/gallery/montaza-ormar.png",category:"montaza",featured:!1,createdAt:"2024-11-10"},{id:9,title:"Izrada kreveta po meri",description:"Krevet izrađen po meri klijenta",image:"/images/gallery/krevet-po-meri.png",category:"kreacije",featured:!0,createdAt:"2024-11-05"}],re="npm_gallery_data";function nt({children:e}){const[t,r]=s.useState([]),[o,n]=s.useState(!0);s.useEffect(()=>{(()=>{try{const l=localStorage.getItem(re);l?r(JSON.parse(l)):(r(te),localStorage.setItem(re,JSON.stringify(te)))}catch(l){console.error("Error loading gallery data:",l),r(te)}finally{n(!1)}})()},[]),s.useEffect(()=>{!o&&t.length>0&&localStorage.setItem(re,JSON.stringify(t))},[t,o]);const b={galleryItems:t,isLoading:o,addGalleryItem:u=>{const l={...u,id:Date.now(),createdAt:new Date().toISOString().split("T")[0]};return r(c=>[l,...c]),l},updateGalleryItem:(u,l)=>{r(c=>c.map(x=>x.id===u?{...x,...l}:x))},deleteGalleryItem:u=>{r(l=>l.filter(c=>c.id!==u))},getItemsByCategory:u=>u==="all"?t:t.filter(l=>l.category===u),getFeaturedItems:()=>t.filter(u=>u.featured)};return m.jsx(ve.Provider,{value:b,children:e})}function Xt(){const e=s.useContext(ve);if(!e)throw new Error("useGallery must be used within a GalleryProvider");return e}const je=s.createContext(),ae=[{id:1,title:"Kuhinja po meri - Porodica Petrović",client:"Marko Petrović",email:"marko.petrovic@email.com",phone:"+381 64 123 4567",type:"kuhinja",status:"u_toku",priority:"high",startDate:"2024-11-15",deadline:"2024-12-20",budget:"250000",description:"Kompletna izrada i montaža kuhinje po meri sa ostrvom i ugradnim aparatima.",notes:"Klijent preferira belu boju sa drvenim detaljima.",progress:65,createdAt:"2024-11-10"},{id:2,title:"Ugradni plakari - Stan Novi Beograd",client:"Jelena Nikolić",email:"jelena.nikolic@email.com",phone:"+381 65 987 6543",type:"plakar",status:"u_toku",priority:"medium",startDate:"2024-11-20",deadline:"2024-12-15",budget:"180000",description:"Dva ugradna plakara sa kliznim vratima za spavaću sobu.",notes:"",progress:40,createdAt:"2024-11-18"},{id:3,title:"Kancelarijski nameštaj - IT Kompanija",client:"TechSoft d.o.o.",email:"office@techsoft.rs",phone:"+381 11 123 4567",type:"kancelarija",status:"novi",priority:"high",startDate:"2024-12-01",deadline:"2025-01-15",budget:"450000",description:"Kompletno opremanje kancelarijskog prostora za 20 radnih mesta.",notes:"Potrebna je koordinacija sa električarima.",progress:10,createdAt:"2024-11-25"},{id:4,title:"Dečija soba - Porodica Jovanović",client:"Ana Jovanović",email:"ana.jovanovic@email.com",phone:"+381 63 456 7890",type:"soba",status:"zavrsen",priority:"low",startDate:"2024-10-01",deadline:"2024-11-01",budget:"120000",description:"Krevet na sprat, radni sto i police za dečiju sobu.",notes:"Uspešno završeno. Klijent zadovoljan.",progress:100,createdAt:"2024-09-28"},{id:5,title:"Montaža kuhinje - IKEA elementi",client:"Stefan Ilić",email:"stefan.ilic@email.com",phone:"+381 62 111 2222",type:"montaza",status:"u_toku",priority:"medium",startDate:"2024-12-05",deadline:"2024-12-10",budget:"35000",description:"Montaža kupljenih IKEA elemenata za kuhinju.",notes:"Samo montaža, elementi već kupljeni.",progress:80,createdAt:"2024-12-01"}],oe="npm_projects_data";function st({children:e}){const[t,r]=s.useState([]),[o,n]=s.useState(!0);s.useEffect(()=>{(()=>{try{const c=localStorage.getItem(oe);c?r(JSON.parse(c)):(r(ae),localStorage.setItem(oe,JSON.stringify(ae)))}catch(c){console.error("Error loading projects data:",c),r(ae)}finally{n(!1)}})()},[]),s.useEffect(()=>{!o&&t.length>=0&&localStorage.setItem(oe,JSON.stringify(t))},[t,o]);const u={projects:t,isLoading:o,addProject:l=>{const c={...l,id:Date.now(),progress:0,createdAt:new Date().toISOString().split("T")[0]};return r(x=>[c,...x]),c},updateProject:(l,c)=>{r(x=>x.map(I=>I.id===l?{...I,...c}:I))},deleteProject:l=>{r(c=>c.filter(x=>x.id!==l))},getProjectsByStatus:l=>l==="all"?t:t.filter(c=>c.status===l),getActiveProjects:()=>t.filter(l=>l.status==="novi"||l.status==="u_toku"),getProjectStats:()=>({total:t.length,active:t.filter(l=>l.status==="novi"||l.status==="u_toku").length,completed:t.filter(l=>l.status==="zavrsen").length,cancelled:t.filter(l=>l.status==="otkazan").length})};return m.jsx(je.Provider,{value:u,children:e})}function er(){const e=s.useContext(je);if(!e)throw new Error("useProjects must be used within a ProjectsProvider");return e}const y="https://npmenterijeri.rs/api",J={baseUrl:y,auth:{login:`${y}/login`,register:`${y}/register`,logout:`${y}/logout`,user:`${y}/user`},klijenti:{list:`${y}/klijenti`,create:`${y}/klijenti`,get:e=>`${y}/klijenti/${e}`,update:e=>`${y}/klijenti/${e}`,delete:e=>`${y}/klijenti/${e}`},cenovnik:{list:`${y}/cenovnik`,create:`${y}/cenovnik`,get:e=>`${y}/cenovnik/${e}`,update:e=>`${y}/cenovnik/${e}`,delete:e=>`${y}/cenovnik/${e}`},obracuni:{list:`${y}/obracuni-ponuda`,create:`${y}/obracuni-ponuda`,get:e=>`${y}/obracuni-ponuda/${e}`,update:e=>`${y}/obracuni-ponuda/${e}`,delete:e=>`${y}/obracuni-ponuda/${e}`,byYear:e=>`${y}/obracuni-ponuda/year/${e}`},ponude:{list:`${y}/ponude`,create:`${y}/ponude`,get:e=>`${y}/ponude/${e}`,update:e=>`${y}/ponude/${e}`,delete:e=>`${y}/ponude/${e}`,pdf:e=>`${y}/ponude/${e}/pdf`,byYear:e=>`${y}/ponude/year/${e}`},projekti:{list:`${y}/projekti`,create:`${y}/projekti`,get:e=>`${y}/projekti/${e}`,update:e=>`${y}/projekti/${e}`,delete:e=>`${y}/projekti/${e}`,faze:e=>`${y}/projekti/${e}/faze`,radnici:e=>`${y}/projekti/${e}/radnici`},radnici:{list:`${y}/radnici`,create:`${y}/radnici`,get:e=>`${y}/radnici/${e}`,update:e=>`${y}/radnici/${e}`,delete:e=>`${y}/radnici/${e}`}},K=async(e,t={})=>{const r={headers:{"Content-Type":"application/json",Accept:"application/json"},credentials:"include"},o=localStorage.getItem("auth_token");o&&(r.headers.Authorization=`Bearer ${o}`);const n=await fetch(e,{...r,...t});if(!n.ok){const i=await n.json().catch(()=>({message:"Network error"}));throw new Error(i.message||`HTTP error! status: ${n.status}`)}return n.json()},ke=s.createContext();function Y(e){return e?{id:e.id,firstName:e.ime||"",lastName:e.prezime||"",position:e.pozicija||"",startDate:e.datum_zaposlenja?e.datum_zaposlenja.split("T")[0]:"",hourlyRate:e.satnica!=null?parseFloat(e.satnica):0,gender:e.pol||"muški",birthDate:e.datum_rodjenja?e.datum_rodjenja.split("T")[0]:"",jmbg:e.jmbg||"",image:e.slika||"",phone:e.telefon||"",email:e.email||"",address:e.adresa||"",active:e.status==="aktivan",createdAt:e.created_at?e.created_at.split("T")[0]:""}:null}function ne(e){return{ime:e.firstName,prezime:e.lastName,jmbg:e.jmbg||"",email:e.email||null,telefon:e.phone||null,adresa:e.address||null,datum_zaposlenja:e.startDate||null,pozicija:e.position||null,satnica:e.hourlyRate!=null?parseFloat(e.hourlyRate):null,status:e.active?"aktivan":"neaktivan"}}function it({children:e}){const[t,r]=s.useState([]),[o,n]=s.useState(!0),[i,a]=s.useState(null),d=s.useCallback(async()=>{try{a(null);const v=await K(J.radnici.list),g=Array.isArray(v.data)?v.data:[];r(g.map(Y))}catch(v){console.error("Error loading workers:",v),a(v.message),r([])}finally{n(!1)}},[]);s.useEffect(()=>{d()},[d]);const F={workers:t,isLoading:o,error:i,fetchWorkers:d,addWorker:async v=>{try{const g=ne(v),E=await K(J.radnici.create,{method:"POST",body:JSON.stringify(g)}),$=Y(E.data);return r(O=>[$,...O]),$}catch(g){throw console.error("Error adding worker:",g),g}},updateWorker:async(v,g)=>{try{const E=t.find(C=>C.id===v);if(!E)return;const $=ne({...E,...g}),O=await K(J.radnici.update(v),{method:"PUT",body:JSON.stringify($)}),z=Y(O.data);return r(C=>C.map(T=>T.id===v?z:T)),z}catch(E){throw console.error("Error updating worker:",E),E}},deleteWorker:async v=>{try{await K(`https://npmenterijeri.rs/api/radnici/${v}`,{method:"DELETE"}),r(g=>g.filter(E=>E.id!==v))}catch(g){throw console.error("Error deleting worker:",g),g}},toggleWorkerStatus:async v=>{try{const g=t.find(C=>C.id===v);if(!g)return;const E=!g.active,$=ne({...g,active:E}),O=await K(J.radnici.update(v),{method:"PUT",body:JSON.stringify($)}),z=Y(O.data);return r(C=>C.map(T=>T.id===v?z:T)),z}catch(g){throw console.error("Error toggling worker status:",g),g}},getActiveWorkers:()=>t.filter(v=>v.active),getWorkersByPosition:v=>t.filter(g=>g.position===v),getWorkerStats:()=>({total:t.length,active:t.filter(v=>v.active).length,inactive:t.filter(v=>!v.active).length}),calculateAge:v=>{if(!v)return"—";const g=new Date,E=new Date(v);let $=g.getFullYear()-E.getFullYear();const O=g.getMonth()-E.getMonth();return(O<0||O===0&&g.getDate()<E.getDate())&&$--,$},calculateEmploymentDuration:v=>{if(!v)return"—";const g=new Date,E=new Date(v),$=g.getFullYear()-E.getFullYear(),O=g.getMonth()-E.getMonth();let z=$*12+O;g.getDate()<E.getDate()&&z--;const C=Math.floor(z/12),T=z%12;return C>0?`${C} god. ${T} mes.`:`${T} mes.`}};return m.jsx(ke.Provider,{value:F,children:e})}function tr(){const e=s.useContext(ke);if(!e)throw new Error("useWorkers must be used within a WorkersProvider");return e}const be=s.createContext(),se=[{id:1,companyName:"TechSoft d.o.o.",address:"Bulevar Mihajla Pupina 10, Novi Beograd",contactPerson:"Marko Marković",phone:"+381 11 123 4567",email:"office@techsoft.rs",website:"www.techsoft.rs",notes:"IT kompanija, veliki klijent",category:"kompanija",createdAt:"2024-01-15"},{id:2,companyName:"Porodica Petrović",address:"Knez Mihailova 25, Beograd",contactPerson:"Marko Petrović",phone:"+381 64 123 4567",email:"marko.petrovic@email.com",website:"",notes:"Kuhinja po meri",category:"fizicko_lice",createdAt:"2024-02-20"},{id:3,companyName:"Restoran Kod Mire",address:"Skadarska 15, Beograd",contactPerson:"Mira Jovanović",phone:"+381 63 456 7890",email:"info@kodmire.rs",website:"www.kodmire.rs",notes:"Kompletno uređenje restorana",category:"kompanija",createdAt:"2024-03-10"},{id:4,companyName:"Porodica Nikolić",address:"Vojvode Stepe 100, Voždovac",contactPerson:"Jelena Nikolić",phone:"+381 65 987 6543",email:"jelena.nikolic@email.com",website:"",notes:"Ugradni plakari",category:"fizicko_lice",createdAt:"2024-04-05"},{id:5,companyName:"Hotel Splendid",address:"Terazije 8, Beograd",contactPerson:"Dragan Stanković",phone:"+381 11 222 3333",email:"recepcija@hotelsplendid.rs",website:"www.hotelsplendid.rs",notes:"Renoviranje hotelskih soba",category:"kompanija",createdAt:"2024-05-12"}],ie="npm_clients_data";function lt({children:e}){const[t,r]=s.useState([]),[o,n]=s.useState(!0);s.useEffect(()=>{(()=>{try{const c=localStorage.getItem(ie);c?r(JSON.parse(c)):(r(se),localStorage.setItem(ie,JSON.stringify(se)))}catch(c){console.error("Error loading clients data:",c),r(se)}finally{n(!1)}})()},[]),s.useEffect(()=>{!o&&t.length>=0&&localStorage.setItem(ie,JSON.stringify(t))},[t,o]);const u={clients:t,isLoading:o,addClient:l=>{const c={...l,id:Date.now(),createdAt:new Date().toISOString().split("T")[0]};return r(x=>[c,...x]),c},updateClient:(l,c)=>{r(x=>x.map(I=>I.id===l?{...I,...c}:I))},deleteClient:l=>{r(c=>c.filter(x=>x.id!==l))},getClientsByCategory:l=>l==="all"?t:t.filter(c=>c.category===l),getClientStats:()=>({total:t.length,companies:t.filter(l=>l.category==="kompanija").length,individuals:t.filter(l=>l.category==="fizicko_lice").length}),searchClients:l=>{const c=l.toLowerCase();return t.filter(x=>x.companyName.toLowerCase().includes(c)||x.contactPerson.toLowerCase().includes(c)||x.address.toLowerCase().includes(c))}};return m.jsx(be.Provider,{value:u,children:e})}function rr(){const e=s.useContext(be);if(!e)throw new Error("useClients must be used within a ClientsProvider");return e}const we=s.createContext(),fe="npm_work_hours_data";function ct({children:e}){const[t,r]=s.useState([]),[o,n]=s.useState(!0);s.useEffect(()=>{(()=>{try{const f=localStorage.getItem(fe);f&&r(JSON.parse(f))}catch(f){console.error("Error loading work hours:",f)}finally{n(!1)}})()},[]),s.useEffect(()=>{o||localStorage.setItem(fe,JSON.stringify(t))},[t,o]);const i=h=>{const f={...h,id:Date.now(),status:"draft",adminNote:"",submittedAt:null,reviewedAt:null,createdAt:new Date().toISOString()};return r(w=>[f,...w]),f},a=h=>{const f=new Date().toISOString();r(w=>w.map(j=>h.includes(j.id)&&j.status==="draft"?{...j,status:"pending",submittedAt:f}:j))},d=(h,f="")=>{r(w=>w.map(j=>j.id===h?{...j,status:"approved",adminNote:f,reviewedAt:new Date().toISOString()}:j))},p=(h,f="")=>{r(w=>w.map(j=>j.id===h?{...j,status:"rejected",adminNote:f,reviewedAt:new Date().toISOString()}:j))},k=()=>t.filter(h=>h.status==="pending").length,b=()=>t.filter(h=>h.status==="pending"),u=(h,f)=>t.filter(w=>w.workerId===h&&w.date===f&&w.status==="draft"),l=h=>t.filter(f=>f.workerId===h&&f.status==="draft"),c=(h,f)=>{r(w=>w.map(j=>j.id===h?{...j,...f}:j))},x=h=>{r(f=>f.filter(w=>w.id!==h))},I=h=>t.filter(f=>f.workerId===h),M=(h,f,w)=>t.filter(j=>{const _=new Date(j.date);return j.workerId===h&&_.getFullYear()===f&&_.getMonth()===w}),F=(h,f,w,j=!1)=>t.filter(_=>{const S=new Date(_.date),G=S.getDate(),ee=j||_.status==="approved"||!_.status;return _.workerId===h&&S.getFullYear()===f&&S.getMonth()===w&&G>=1&&G<=15&&ee}),v=(h,f,w,j=!1)=>t.filter(_=>{const S=new Date(_.date),G=S.getDate(),ee=j||_.status==="approved"||!_.status;return _.workerId===h&&S.getFullYear()===f&&S.getMonth()===w&&G>=16&&ee}),g=(h,f,w)=>t.filter(j=>{const _=new Date(j.date),S=_.getDate();return j.workerId===h&&_.getFullYear()===f&&_.getMonth()===w&&S>=1&&S<=15}),E=(h,f,w)=>t.filter(j=>{const _=new Date(j.date),S=_.getDate();return j.workerId===h&&_.getFullYear()===f&&_.getMonth()===w&&S>=16}),$=h=>h.reduce((f,w)=>{const j=w.hours||0,_=(w.minutes||0)/60;return f+j+_},0),T={workHours:t,isLoading:o,addWorkHours:i,updateWorkHours:c,deleteWorkHours:x,getWorkerHours:I,getMonthlyHours:M,getFirstHalfHours:F,getSecondHalfHours:v,getWorkerFirstHalfHours:g,getWorkerSecondHalfHours:E,calculateTotalHours:$,calculateTotalPay:(h,f)=>$(h)*f,getAllWorkersSummary:(h,f)=>[...new Set(t.map(j=>j.workerId))].map(j=>{const _=F(j,h,f),S=v(j,h,f);return{workerId:j,firstHalfHours:$(_),secondHalfHours:$(S),firstHalfEntries:_,secondHalfEntries:S,totalHours:$([..._,...S])}}),formatHours:h=>{const f=Math.floor(h),w=Math.round((h-f)*60);return w===0?`${f}h`:`${f}h ${w}min`},submitForApproval:a,approveHours:d,rejectHours:p,getPendingCount:k,getPendingEntries:b,getDraftEntriesByDate:u,getWorkerDraftEntries:l};return m.jsx(we.Provider,{value:T,children:e})}function ar(){const e=s.useContext(we);if(!e)throw new Error("useWorkHours must be used within a WorkHoursProvider");return e}let dt={data:""},ut=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||dt},mt=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,pt=/\/\*[^]*?\*\/|  +/g,ge=/\n+/g,H=(e,t)=>{let r="",o="",n="";for(let i in e){let a=e[i];i[0]=="@"?i[1]=="i"?r=i+" "+a+";":o+=i[1]=="f"?H(a,i):i+"{"+H(a,i[1]=="k"?"":t)+"}":typeof a=="object"?o+=H(a,t?t.replace(/([^,])+/g,d=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,p=>/&/.test(p)?p.replace(/&/g,d):d?d+" "+p:p)):i):a!=null&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),n+=H.p?H.p(i,a):i+":"+a+";")}return r+(t&&n?t+"{"+n+"}":n)+o},R={},xe=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+xe(e[r]);return t}return e},ft=(e,t,r,o,n)=>{let i=xe(e),a=R[i]||(R[i]=(p=>{let k=0,b=11;for(;k<p.length;)b=101*b+p.charCodeAt(k++)>>>0;return"go"+b})(i));if(!R[a]){let p=i!==e?e:(k=>{let b,u,l=[{}];for(;b=mt.exec(k.replace(pt,""));)b[4]?l.shift():b[3]?(u=b[3].replace(ge," ").trim(),l.unshift(l[0][u]=l[0][u]||{})):l[0][b[1]]=b[2].replace(ge," ").trim();return l[0]})(e);R[a]=H(n?{["@keyframes "+a]:p}:p,r?"":"."+a)}let d=r&&R.g?R.g:null;return r&&(R.g=R[a]),((p,k,b,u)=>{u?k.data=k.data.replace(u,p):k.data.indexOf(p)===-1&&(k.data=b?p+k.data:k.data+p)})(R[a],t,o,d),a},gt=(e,t,r)=>e.reduce((o,n,i)=>{let a=t[i];if(a&&a.call){let d=a(r),p=d&&d.props&&d.props.className||/^go/.test(d)&&d;a=p?"."+p:d&&typeof d=="object"?d.props?"":H(d,""):d===!1?"":d}return o+n+(a??"")},"");function Q(e){let t=this||{},r=e.call?e(t.p):e;return ft(r.unshift?r.raw?gt(r,[].slice.call(arguments,1),t.p):r.reduce((o,n)=>Object.assign(o,n&&n.call?n(t.p):n),{}):r,ut(t.target),t.g,t.o,t.k)}let _e,ce,de;Q.bind({g:1});let L=Q.bind({k:1});function ht(e,t,r,o){H.p=t,_e=e,ce=r,de=o}function W(e,t){let r=this||{};return function(){let o=arguments;function n(i,a){let d=Object.assign({},i),p=d.className||n.className;r.p=Object.assign({theme:ce&&ce()},d),r.o=/ *go\d+/.test(p),d.className=Q.apply(r,o)+(p?" "+p:"");let k=e;return e[0]&&(k=d.as||e,delete d.as),de&&k[0]&&de(d),_e(k,d)}return n}}var yt=e=>typeof e=="function",q=(e,t)=>yt(e)?e(t):e,vt=(()=>{let e=0;return()=>(++e).toString()})(),Ee=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),jt=20,ue="default",Pe=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(a=>a.id===t.toast.id?{...a,...t.toast}:a)};case 2:let{toast:o}=t;return Pe(e,{type:e.toasts.find(a=>a.id===o.id)?1:0,toast:o});case 3:let{toastId:n}=t;return{...e,toasts:e.toasts.map(a=>a.id===n||n===void 0?{...a,dismissed:!0,visible:!1}:a)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(a=>a.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+i}))}}},U=[],$e={toasts:[],pausedAt:void 0,settings:{toastLimit:jt}},N={},Se=(e,t=ue)=>{N[t]=Pe(N[t]||$e,e),U.forEach(([r,o])=>{r===t&&o(N[t])})},De=e=>Object.keys(N).forEach(t=>Se(e,t)),kt=e=>Object.keys(N).find(t=>N[t].toasts.some(r=>r.id===e)),X=(e=ue)=>t=>{Se(t,e)},bt={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},wt=(e={},t=ue)=>{let[r,o]=s.useState(N[t]||$e),n=s.useRef(N[t]);s.useEffect(()=>(n.current!==N[t]&&o(N[t]),U.push([t,o]),()=>{let a=U.findIndex(([d])=>d===t);a>-1&&U.splice(a,1)}),[t]);let i=r.toasts.map(a=>{var d,p,k;return{...e,...e[a.type],...a,removeDelay:a.removeDelay||((d=e[a.type])==null?void 0:d.removeDelay)||(e==null?void 0:e.removeDelay),duration:a.duration||((p=e[a.type])==null?void 0:p.duration)||(e==null?void 0:e.duration)||bt[a.type],style:{...e.style,...(k=e[a.type])==null?void 0:k.style,...a.style}}});return{...r,toasts:i}},xt=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||vt()}),B=e=>(t,r)=>{let o=xt(t,e,r);return X(o.toasterId||kt(o.id))({type:2,toast:o}),o.id},P=(e,t)=>B("blank")(e,t);P.error=B("error");P.success=B("success");P.loading=B("loading");P.custom=B("custom");P.dismiss=(e,t)=>{let r={type:3,toastId:e};t?X(t)(r):De(r)};P.dismissAll=e=>P.dismiss(void 0,e);P.remove=(e,t)=>{let r={type:4,toastId:e};t?X(t)(r):De(r)};P.removeAll=e=>P.remove(void 0,e);P.promise=(e,t,r)=>{let o=P.loading(t.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(n=>{let i=t.success?q(t.success,n):void 0;return i?P.success(i,{id:o,...r,...r==null?void 0:r.success}):P.dismiss(o),n}).catch(n=>{let i=t.error?q(t.error,n):void 0;i?P.error(i,{id:o,...r,...r==null?void 0:r.error}):P.dismiss(o)}),e};var _t=1e3,Et=(e,t="default")=>{let{toasts:r,pausedAt:o}=wt(e,t),n=s.useRef(new Map).current,i=s.useCallback((u,l=_t)=>{if(n.has(u))return;let c=setTimeout(()=>{n.delete(u),a({type:4,toastId:u})},l);n.set(u,c)},[]);s.useEffect(()=>{if(o)return;let u=Date.now(),l=r.map(c=>{if(c.duration===1/0)return;let x=(c.duration||0)+c.pauseDuration-(u-c.createdAt);if(x<0){c.visible&&P.dismiss(c.id);return}return setTimeout(()=>P.dismiss(c.id,t),x)});return()=>{l.forEach(c=>c&&clearTimeout(c))}},[r,o,t]);let a=s.useCallback(X(t),[t]),d=s.useCallback(()=>{a({type:5,time:Date.now()})},[a]),p=s.useCallback((u,l)=>{a({type:1,toast:{id:u,height:l}})},[a]),k=s.useCallback(()=>{o&&a({type:6,time:Date.now()})},[o,a]),b=s.useCallback((u,l)=>{let{reverseOrder:c=!1,gutter:x=8,defaultPosition:I}=l||{},M=r.filter(g=>(g.position||I)===(u.position||I)&&g.height),F=M.findIndex(g=>g.id===u.id),v=M.filter((g,E)=>E<F&&g.visible).length;return M.filter(g=>g.visible).slice(...c?[v+1]:[0,v]).reduce((g,E)=>g+(E.height||0)+x,0)},[r]);return s.useEffect(()=>{r.forEach(u=>{if(u.dismissed)i(u.id,u.removeDelay);else{let l=n.get(u.id);l&&(clearTimeout(l),n.delete(u.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:p,startPause:d,endPause:k,calculateOffset:b}}},Pt=L`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,$t=L`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,St=L`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Dt=W("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Pt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${$t} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${St} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,At=L`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,It=W("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${At} 1s linear infinite;
`,Ot=L`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Ct=L`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,zt=W("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Ot} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Ct} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Tt=W("div")`
  position: absolute;
`,Nt=W("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Rt=L`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Lt=W("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Rt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Ht=({toast:e})=>{let{icon:t,type:r,iconTheme:o}=e;return t!==void 0?typeof t=="string"?s.createElement(Lt,null,t):t:r==="blank"?null:s.createElement(Nt,null,s.createElement(It,{...o}),r!=="loading"&&s.createElement(Tt,null,r==="error"?s.createElement(Dt,{...o}):s.createElement(zt,{...o})))},Wt=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Mt=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,Ft="0%{opacity:0;} 100%{opacity:1;}",Kt="0%{opacity:1;} 100%{opacity:0;}",Bt=W("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Gt=W("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Jt=(e,t)=>{let r=e.includes("top")?1:-1,[o,n]=Ee()?[Ft,Kt]:[Wt(r),Mt(r)];return{animation:t?`${L(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${L(n)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Yt=s.memo(({toast:e,position:t,style:r,children:o})=>{let n=e.height?Jt(e.position||t||"top-center",e.visible):{opacity:0},i=s.createElement(Ht,{toast:e}),a=s.createElement(Gt,{...e.ariaProps},q(e.message,e));return s.createElement(Bt,{className:e.className,style:{...n,...r,...e.style}},typeof o=="function"?o({icon:i,message:a}):s.createElement(s.Fragment,null,i,a))});ht(s.createElement);var Vt=({id:e,className:t,style:r,onHeightUpdate:o,children:n})=>{let i=s.useCallback(a=>{if(a){let d=()=>{let p=a.getBoundingClientRect().height;o(e,p)};d(),new MutationObserver(d).observe(a,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return s.createElement("div",{ref:i,className:t,style:r},n)},Ut=(e,t)=>{let r=e.includes("top"),o=r?{top:0}:{bottom:0},n=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:Ee()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...o,...n}},qt=Q`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,V=16,Zt=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:o,children:n,toasterId:i,containerStyle:a,containerClassName:d})=>{let{toasts:p,handlers:k}=Et(r,i);return s.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:V,left:V,right:V,bottom:V,pointerEvents:"none",...a},className:d,onMouseEnter:k.startPause,onMouseLeave:k.endPause},p.map(b=>{let u=b.position||t,l=k.calculateOffset(b,{reverseOrder:e,gutter:o,defaultPosition:t}),c=Ut(u,l);return s.createElement(Vt,{id:b.id,key:b.id,onHeightUpdate:k.updateHeight,className:b.visible?qt:"",style:c},b.type==="custom"?q(b.message,b):n?n(b):s.createElement(Yt,{toast:b,position:u}))}))},or=P;le.createRoot(document.getElementById("root")).render(m.jsx(Oe.StrictMode,{children:m.jsx(Ce,{children:m.jsx(nt,{children:m.jsx(st,{children:m.jsx(it,{children:m.jsx(lt,{children:m.jsxs(ct,{children:[m.jsx(ot,{}),m.jsx(Zt,{position:"top-right",toastOptions:{duration:3e3,style:{background:"#212a33",color:"#f0f4f8",border:"1px solid rgba(255,255,255,0.1)"}}})]})})})})})})}));export{tr as a,er as b,rr as c,ar as d,m as j,Xt as u,or as z};
