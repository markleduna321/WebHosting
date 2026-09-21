import{a as h,j as e,L as a}from"./app-DZ9NkZxb.js";import{c as n}from"./createLucideIcon-CJErMEvU.js";/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],p=n("bell",m);/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],b=n("menu",x);/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],f=n("plus",u);function j({title:l="Dashboard",subtitle:i,onOpenMobileSidebar:o}){const{auth:s}=h().props,t=s==null?void 0:s.user,c=(t==null?void 0:t.plan)??"Student Pro",r=i??`${(t==null?void 0:t.name)??"Account"} · ${c} plan`,d=((t==null?void 0:t.name)??"A").charAt(0).toUpperCase();return e.jsxs("div",{className:"sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-gray-100 bg-white px-4 sm:px-6",children:[e.jsx("button",{type:"button",onClick:o,"aria-label":"Open sidebar",className:"lg:hidden p-1.5 -ml-1 rounded-md text-slate-500 hover:bg-slate-100",children:e.jsx(b,{className:"w-5 h-5"})}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("h1",{className:"text-lg font-bold text-slate-900 truncate",children:l}),e.jsx("p",{className:"text-xs text-slate-500 truncate",children:r})]}),e.jsxs("div",{className:"ml-auto flex items-center gap-3",children:[e.jsx(a,{href:"/hosting-plan",className:"hidden sm:inline-flex items-center rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors",children:"Upgrade plan"}),e.jsx("button",{type:"button","aria-label":"Notifications",className:"relative p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors",children:e.jsx(p,{className:"w-5 h-5"})}),e.jsxs(a,{href:"/websites/create",className:"inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors",children:[e.jsx(f,{className:"w-4 h-4"}),e.jsx("span",{className:"hidden sm:inline",children:"Create New Website"})]}),e.jsx(a,{href:"/account/settings","aria-label":"Account settings",className:"flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white",children:d})]})]})}export{j as default};
