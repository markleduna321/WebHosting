import{r as c,j as e}from"./app-DszHqU9W.js";const h=c.forwardRef(({label:o,name:s,type:a="text",disabled:p=!1,required:d=!1,iconLeft:l,iconRight:r,error:t,readOnly:n=!1,className:x="",...u},i)=>e.jsxs("div",{className:"w-full",children:[e.jsxs("div",{className:"relative",children:[l&&e.jsx("div",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-500",children:l}),e.jsx("input",{autoComplete:"off",ref:i,id:s,name:s,type:a,disabled:p,required:d,readOnly:n,step:a==="number"?"any":void 0,placeholder:" ",...u,className:`
              peer w-full rounded-md border bg-white py-2.5 px-4 text-sm text-black transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 
             
              ${l?"pl-10":""} ${r?"pr-10":""}
              ${t?"border-red-500 focus:ring-red-500":"border-gray-300"}
              ${x}
            `}),e.jsx("label",{htmlFor:s,className:`
              absolute left-3 top-2.5 bg-white px-1 text-blue-500 text-sm
              transition-all duration-200 ease-out pointer-events-none
              peer-placeholder-shown:top-2.5
              peer-placeholder-shown:text-sm
              peer-placeholder-shown:text-blue-500
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
              peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-700
              peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs
            `,children:o}),r&&e.jsx("div",{className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-500",children:r})]}),t&&e.jsx("p",{className:"mt-1 text-sm text-red-500",children:t.message??t})]}));h.displayName="Input";export{h as I};
