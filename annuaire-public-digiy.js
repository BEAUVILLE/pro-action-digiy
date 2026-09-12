/* ACTION PRO — chargeur annuaire + verrou public Supabase — 2026-09-12 */
(function(){
  'use strict';
  document.write('<script src="./annuaire-public-digiy-core.js?v=20260826-fg-retire-v3"><\/script>');
  document.write('<script src="./voice-territory-rails-v1.js?v=20260912-horizontal-arrows-v4"><\/script>');
  document.write('<script src="./voice-territory-intent-filter-v1.js?v=20260906-intent-territory-v2"><\/script>');
  document.write('<script src="./subscription-public-gate.js?v=20260826-subscription-gate-v1"><\/script>');
  document.write('<script>(function(){var a=document.querySelector("a[href^=\\"https://digiy-hub.digiylyfe.com/\\"]");if(a)a.remove();})();<\/script>');

  /* PATCH BUREAU 2026-09-12 — flèches horizontales visibles. Mobile conserve le swipe natif. */
  document.write('<script>(function(){'+
    'function install(){'+
      'if(!document.getElementById("digiyDesktopRailArrowStyle")){'+
        'var s=document.createElement("style");s.id="digiyDesktopRailArrowStyle";'+
        's.textContent=".dvr-arrow-shell{display:grid;grid-template-columns:34px minmax(0,1fr) 34px;gap:6px;align-items:center;min-width:0}.dvr-arrow{width:34px;height:34px;border:1px solid rgba(18,60,45,.18);border-radius:999px;background:#fff;color:#0b5d48;font-size:18px;font-weight:1000;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 7px rgba(16,47,36,.08)}.dvr-arrow:active{transform:scale(.95)}.dvr-arrow:disabled{opacity:.28;cursor:default}.dvr-arrow-shell .dvr-strip{min-width:0;scrollbar-width:none}.dvr-arrow-shell .dvr-strip::-webkit-scrollbar{display:none}@media(max-width:520px){.dvr-arrow-shell{display:block}.dvr-arrow{display:none!important}}";'+
        '(document.head||document.documentElement).appendChild(s);'+
      '}'+
      'document.querySelectorAll(".dvr-strip").forEach(function(strip){'+
        'if(strip.__digiyArrowRail)return;strip.__digiyArrowRail=true;'+
        'var shell=document.createElement("div");shell.className="dvr-arrow-shell";'+
        'var prev=document.createElement("button");prev.type="button";prev.className="dvr-arrow";prev.setAttribute("aria-label","Défiler vers la gauche");prev.textContent="◀";'+
        'var next=document.createElement("button");next.type="button";next.className="dvr-arrow";next.setAttribute("aria-label","Défiler vers la droite");next.textContent="▶";'+
        'strip.parentNode.insertBefore(shell,strip);shell.appendChild(prev);shell.appendChild(strip);shell.appendChild(next);'+
        'function step(dir){var n=Math.max(140,Math.round(strip.clientWidth*.72));strip.scrollBy({left:dir*n,behavior:"smooth"})}'+
        'function state(){var max=Math.max(0,strip.scrollWidth-strip.clientWidth);prev.disabled=strip.scrollLeft<=2;next.disabled=strip.scrollLeft>=max-2}'+
        'prev.addEventListener("click",function(){step(-1)});next.addEventListener("click",function(){step(1)});'+
        'strip.addEventListener("scroll",state,{passive:true});window.addEventListener("resize",state,{passive:true});'+
        'setTimeout(state,0);'+
      '})'+
    '}'+
    'install();setTimeout(install,0);setTimeout(install,250);'+
    'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});'+
    'window.addEventListener("load",install,{once:true});'+
    'document.addEventListener("digiy:language-applied",function(){setTimeout(install,0)});'+
  '})();<\/script>');
})();
