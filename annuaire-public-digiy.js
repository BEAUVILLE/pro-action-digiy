/* ACTION PRO — chargeur annuaire + verrou public Supabase — 2026-09-12 */
(function(){
  'use strict';
  document.write('<script src="./annuaire-public-digiy-core.js?v=20260826-fg-retire-v3"><\/script>');
  document.write('<script src="./voice-territory-rails-v1.js?v=20260912-mobile-desktop-scroll-v3"><\/script>');
  document.write('<script src="./voice-territory-intent-filter-v1.js?v=20260906-intent-territory-v2"><\/script>');
  document.write('<script src="./subscription-public-gate.js?v=20260826-subscription-gate-v1"><\/script>');
  document.write('<script>(function(){var a=document.querySelector("a[href^=\\"https://digiy-hub.digiylyfe.com/\\"]");if(a)a.remove();})();<\/script>');

  /* PATCH BUREAU 2026-09-12 — conserve le swipe mobile et ajoute molette + clic-glissé souris. */
  document.write('<script>(function(){'+
    'function install(){'+
      'if(!document.getElementById("digiyDesktopRailScrollStyle")){'+
        'var s=document.createElement("style");s.id="digiyDesktopRailScrollStyle";'+
        's.textContent=".dvr-strip{cursor:grab;user-select:none;scrollbar-width:thin}.dvr-strip.dragging{cursor:grabbing}.dvr-strip::-webkit-scrollbar{height:6px}.dvr-strip::-webkit-scrollbar-thumb{background:rgba(50,97,77,.28);border-radius:999px}@media(max-width:520px){.dvr-strip{scrollbar-width:none}.dvr-strip::-webkit-scrollbar{display:none}}";'+
        '(document.head||document.documentElement).appendChild(s);'+
      '}'+
      'document.querySelectorAll(".dvr-strip").forEach(function(strip){'+
        'if(strip.__digiyDesktopScroll)return;strip.__digiyDesktopScroll=true;'+
        'strip.addEventListener("wheel",function(e){if(strip.scrollWidth<=strip.clientWidth)return;var d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(!d)return;strip.scrollLeft+=d;e.preventDefault()},{passive:false});'+
        'var down=false,startX=0,startScroll=0,moved=false;'+
        'strip.addEventListener("mousedown",function(e){if(e.button!==0)return;down=true;moved=false;startX=e.clientX;startScroll=strip.scrollLeft;strip.classList.add("dragging")});'+
        'document.addEventListener("mousemove",function(e){if(!down)return;var dx=e.clientX-startX;if(Math.abs(dx)>4)moved=true;if(moved){strip.scrollLeft=startScroll-dx;e.preventDefault()}});'+
        'document.addEventListener("mouseup",function(){if(!down)return;down=false;strip.classList.remove("dragging");if(moved){strip.__digiyJustDragged=true;setTimeout(function(){strip.__digiyJustDragged=false},0)}});'+
        'strip.addEventListener("click",function(e){if(!strip.__digiyJustDragged)return;e.preventDefault();e.stopImmediatePropagation()},true);'+
      '})'+
    '}'+
    'install();setTimeout(install,0);'+
    'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});'+
    'window.addEventListener("load",install,{once:true});'+
  '})();<\/script>');
})();
