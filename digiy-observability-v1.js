/* DIGIYLYFE — Observabilité locale V1
   But: comprendre une requête sans modifier le routage.
   Données conservées uniquement dans la session du navigateur.
*/
(function(){
  "use strict";
  if(window.DIGIY_OBSERVABILITY_V1)return;
  window.DIGIY_OBSERVABILITY_V1=true;

  const MAX=100;
  const traces=[];
  let seq=0;

  function norm(v){return String(v==null?"":v).replace(/\s+/g," ").trim()}
  function currentQuery(){
    const el=document.getElementById("q")||document.querySelector("textarea,input[type='search'],input[type='text']");
    return norm(el&&(el.value||el.textContent)||"");
  }
  function now(){return new Date().toISOString()}
  function compact(value){
    if(value==null)return value;
    if(Array.isArray(value))return value.slice(0,8).map(compact);
    if(typeof value==="object"){
      const out={};
      Object.keys(value).slice(0,20).forEach(k=>{
        const v=value[k];
        if(typeof v==="function")return;
        out[k]=compact(v);
      });
      return out;
    }
    return typeof value==="string"?value.slice(0,500):value;
  }
  function log(stage,detail){
    const row={id:++seq,at:now(),stage,query:currentQuery(),detail:compact(detail||{})};
    traces.push(row);
    if(traces.length>MAX)traces.shift();
    window.__DIGIY_LAST_TRACE__=row;
    try{sessionStorage.setItem("digiy_observability_v1",JSON.stringify(traces));}catch(_){}
    if(debug())console.info("[DIGIY OBS]",row);
    render();
    return row;
  }
  function debug(){
    try{return new URLSearchParams(location.search).get("debug")==="1"||localStorage.getItem("digiy_debug")==="1"}catch(_){return false}
  }
  function cards(){
    return Array.from(document.querySelectorAll(".cards .card,#cards .card,.results .card"))
      .filter(el=>getComputedStyle(el).display!=="none"&&!el.hidden)
      .slice(0,8)
      .map(el=>norm(el.querySelector("h3")?.textContent||el.textContent).slice(0,180));
  }
  function snapshot(reason){
    return log("snapshot",{reason,status:document.getElementById("status")?.getAttribute("aria-label")||"",cards:cards()});
  }
  function render(){
    if(!debug())return;
    let box=document.getElementById("digiy-observability-panel");
    if(!box){
      box=document.createElement("details");
      box.id="digiy-observability-panel";
      box.style.cssText="position:fixed;z-index:99999;right:8px;bottom:8px;width:min(94vw,430px);max-height:55vh;overflow:auto;background:#08120f;color:#eafff5;border:1px solid #2dd4bf;border-radius:14px;padding:10px;font:12px/1.35 monospace;box-shadow:0 8px 32px #0008";
      box.innerHTML='<summary style="cursor:pointer;font-weight:900">🧭 DIGIY DEBUG</summary><pre id="digiy-observability-pre" style="white-space:pre-wrap;margin:8px 0 0"></pre>';
      document.body.appendChild(box);
    }
    const pre=document.getElementById("digiy-observability-pre");
    if(pre)pre.textContent=JSON.stringify(traces.slice(-15),null,2);
  }

  const EVENTS=[
    "digiy:route-directe:pending","digiy:route-directe:done","digiy:route-directe:error",
    "digiy:voice","digiy:voice:result","digiy:voice:final","digiy:voice-final",
    "digiy:voice-result","digiy:oreille","digiy:oreille:result","digiy:oreille:final",
    "digiy:transcript","digiy:transcript:final","digiy:language-applied"
  ];
  EVENTS.forEach(name=>{
    window.addEventListener(name,e=>log("event:"+name,e&&e.detail||{}));
    document.addEventListener(name,e=>log("event:"+name,e&&e.detail||{}));
  });

  document.addEventListener("click",e=>{
    const b=e.target.closest&&e.target.closest("button,a,[role='button']");
    if(!b)return;
    const label=norm(b.innerText||b.textContent||b.getAttribute("aria-label")||"").slice(0,120);
    if(/go|voir|cherch|search|ecout|listen|action/i.test(label))log("ui:action",{label});
  },true);

  document.addEventListener("keydown",e=>{
    if(e.key==="Enter")log("ui:enter",{target:e.target&&e.target.id||e.target&&e.target.tagName||""});
  },true);

  let timer=0;
  const results=document.getElementById("cards")||document.querySelector(".cards")||document.querySelector(".results");
  if(results){
    new MutationObserver(()=>{
      clearTimeout(timer);
      timer=setTimeout(()=>snapshot("results-mutated"),80);
    }).observe(results,{childList:true,subtree:true,attributes:true,attributeFilter:["hidden","style","class"]});
  }

  window.addEventListener("error",e=>log("error",{message:e.message,source:e.filename,line:e.lineno,column:e.colno}));
  window.addEventListener("unhandledrejection",e=>log("promise-error",{reason:String(e.reason||"")}));

  window.DIGIY_OBS={
    version:"obs-v1-20260926",
    log,snapshot,
    all:()=>traces.slice(),
    last:()=>traces[traces.length-1]||null,
    clear:()=>{traces.length=0;try{sessionStorage.removeItem("digiy_observability_v1")}catch(_){}render()}
  };

  log("boot",{href:location.href,debug:debug()});
})();