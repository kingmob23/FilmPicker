(()=>{var e={};e.id=215,e.ids=[215],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1017:e=>{"use strict";e.exports=require("path")},2781:e=>{"use strict";e.exports=require("stream")},7310:e=>{"use strict";e.exports=require("url")},7644:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>o.a,__next_app__:()=>u,originalPathname:()=>p,pages:()=>c,routeModule:()=>x,tree:()=>d}),r(4246),r(4856),r(5866);var s=r(3191),n=r(8716),i=r(7922),o=r.n(i),a=r(5231),l={};for(let e in a)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>a[e]);r.d(t,l);let d=["",{children:["subpages",{children:["results",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,4246)),"/Users/johndoe/Desktop/C0des/cure_sore/film-picker/frontend/next-app/app/subpages/results/page.tsx"]}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,7481))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,4856)),"/Users/johndoe/Desktop/C0des/cure_sore/film-picker/frontend/next-app/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,7481))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],c=["/Users/johndoe/Desktop/C0des/cure_sore/film-picker/frontend/next-app/app/subpages/results/page.tsx"],p="/subpages/results/page",u={require:r,loadChunk:()=>Promise.resolve()},x=new s.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/subpages/results/page",pathname:"/subpages/results",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},2734:(e,t,r)=>{Promise.resolve().then(r.bind(r,8886))},7480:(e,t,r)=>{Promise.resolve().then(r.bind(r,4463))},8031:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2994,23)),Promise.resolve().then(r.t.bind(r,6114,23)),Promise.resolve().then(r.t.bind(r,9727,23)),Promise.resolve().then(r.t.bind(r,9671,23)),Promise.resolve().then(r.t.bind(r,1868,23)),Promise.resolve().then(r.t.bind(r,4759,23))},3850:(e,t,r)=>{"use strict";r.d(t,{Z:()=>l});var s=r(326),n=r(7577),i=r.n(n),o=r(5961);let a=i().memo(()=>s.jsx(d,{children:s.jsx("h1",{children:"Film Picker"})}));a.displayName="Header";let l=a,d=o.ZP.header`
  padding: 20px;
  text-align: center;
  background: #282c34;
  color: white;
  margin-bottom: 20px;
`},8886:(e,t,r)=>{"use strict";r.d(t,{UsernamesProvider:()=>o,X:()=>i});var s=r(326),n=r(7577);let i=(0,n.createContext)(void 0),o=({children:e})=>{let[t,r]=(0,n.useState)([]);return s.jsx(i.Provider,{value:{usernames:t,setUsernames:r},children:e})}},4463:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>w});var s=r(326),n=r(7577),i=r(5961),o=r(3850),a=r(5047),l=r(8886);let d=({films:e,usernames:t})=>{let[r,i]=(0,n.useState)(e),[o,a]=(0,n.useState)(null),[l,d]=(0,n.useState)(!1),[v,y]=(0,n.useState)(!1);(0,n.useEffect)(()=>{i(e)},[e]);let P=e=>{1!==r.length&&i(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e])},j=e=>{navigator.clipboard.writeText(e),a(e),setTimeout(()=>a(null),1e3)},w=async()=>{if(1===r.length){d(!0);try{if(!(await fetch("/api/watchlist/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({film:r[0],usernames:t})})).ok){console.error("Failed to remove the film");return}y(!0)}catch(e){console.error("An error occurred while removing the film",e)}finally{d(!1)}}};return(0,s.jsxs)(c,{children:[s.jsx(p,{children:r.map((e,t)=>(0,s.jsxs)(u,{children:[s.jsx(x,{onClick:()=>P(e),$crossedOut:r.length>1&&!r.includes(e),children:e}),s.jsx(h,{onClick:()=>j(e),$isCopied:o===e,children:o===e?"Copied":"Copy"})]},t))}),1===r.length&&(0,s.jsxs)(m,{children:[`You should watch: ${r[0]}`,(0,s.jsxs)(g,{children:[s.jsx(b,{onClick:w,disabled:l||v,children:v?"You sworn to watch it!":"We Will Watch It!"}),!v&&s.jsx(f,{children:"This movie will be removed from our stored copy of watchlist of every participant, so you don't need to update next time."})]})]})]})},c=i.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
`,p=i.ZP.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`,u=i.ZP.li`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 60%;
  max-width: 400px;
  text-align: center;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #e9e9e9;
  }
`,x=i.ZP.span`
  text-decoration: ${({$crossedOut:e})=>e?"line-through":"none"};
  cursor: pointer;
  flex-grow: 1;
`,h=i.ZP.button`
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  background-color: ${({$isCopied:e})=>e?"#a0a0a0":"#dcdcdc"};
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c0c0c0;
  }
`,m=i.ZP.div`
  margin-top: 20px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
`,f=i.ZP.span`
  visibility: hidden;
  width: 330px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
`,g=i.ZP.div`
  position: relative;
  display: inline-block;

  &:hover ${f} {
    visibility: visible;
    opacity: 1;
  }
`,b=i.ZP.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`,v=()=>{let e=(0,a.useSearchParams)(),[t,r]=(0,n.useState)([]),[i,o]=(0,n.useState)(0),{usernames:c=[]}=(0,n.useContext)(l.X)||{};return(0,n.useEffect)(()=>{let t=e.get("intersection"),s=e.get("intersectionLen");t&&r(JSON.parse(t)),s&&o(parseInt(s,10))},[e]),(0,s.jsxs)(y,{children:[s.jsx(P,{children:"What to watch?"}),s.jsx(d,{films:t,usernames:c}),(0,s.jsxs)(j,{children:["btw you have ",i," films in common"]})]})},y=i.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: 20px;
`,P=i.ZP.h2`
  margin-top: 20px;
  margin-bottom: 20px;
`,j=i.ZP.p`
  margin-top: 20px;
  text-align: right;
  width: 60%;
  max-width: 400px;
  font-weight: bold;
`,w=()=>(0,s.jsxs)(k,{children:[s.jsx(o.Z,{}),s.jsx(n.Suspense,{fallback:s.jsx("div",{children:"Loading..."}),children:s.jsx(v,{})})]}),k=i.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding: 20px;
`},5047:(e,t,r)=>{"use strict";var s=r(7389);r.o(s,"useRouter")&&r.d(t,{useRouter:function(){return s.useRouter}}),r.o(s,"useSearchParams")&&r.d(t,{useSearchParams:function(){return s.useSearchParams}})},4856:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>h,metadata:()=>x});var s=r(9510),n=r(5384),i=r.n(n),o=r(4365),a=r.n(o),l=r(8570);let d=(0,l.createProxy)(String.raw`/Users/johndoe/Desktop/C0des/cure_sore/film-picker/frontend/next-app/app/context/UsernamesContext.tsx`),{__esModule:c,$$typeof:p}=d;d.default,(0,l.createProxy)(String.raw`/Users/johndoe/Desktop/C0des/cure_sore/film-picker/frontend/next-app/app/context/UsernamesContext.tsx#UsernamesContext`);let u=(0,l.createProxy)(String.raw`/Users/johndoe/Desktop/C0des/cure_sore/film-picker/frontend/next-app/app/context/UsernamesContext.tsx#UsernamesProvider`);r(7272);let x={title:"Create Next App",description:"Generated by create next app"};function h({children:e}){return(0,s.jsxs)("html",{lang:"en",children:[s.jsx(a(),{children:s.jsx("link",{rel:"preload",href:"/fonts/inter.woff2",as:"font",type:"font/woff2",crossOrigin:"anonymous"})}),s.jsx("body",{className:i().className,style:{minHeight:"100vh"},children:s.jsx(u,{children:e})})]})}},4246:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>o,__esModule:()=>i,default:()=>a});var s=r(8570);let n=(0,s.createProxy)(String.raw`/Users/johndoe/Desktop/C0des/cure_sore/film-picker/frontend/next-app/app/subpages/results/page.tsx`),{__esModule:i,$$typeof:o}=n;n.default;let a=(0,s.createProxy)(String.raw`/Users/johndoe/Desktop/C0des/cure_sore/film-picker/frontend/next-app/app/subpages/results/page.tsx#default`)},7481:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>n});var s=r(6621);let n=e=>[{type:"image/x-icon",sizes:"48x48",url:(0,s.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]},7272:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[948,65,688],()=>r(7644));module.exports=s})();