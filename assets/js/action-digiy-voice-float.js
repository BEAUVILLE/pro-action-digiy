(function(){
  "use strict";

  function addCss(){
    if(document.getElementById("digiyVoiceFloatCss")) return;
    var css = document.createElement("style");
    css.id = "digiyVoiceFloatCss";
    css.textContent = [
      ".digiyVoiceFloat{position:fixed;right:16px;bottom:16px;z-index:80;min-height:58px;padding:0 18px;border:0;border-radius:999px;background:linear-gradient(135deg,#fff2bf,#f6c453,#7ee6a7);color:#102015;font:1000 15px system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 18px 46px rgba(18,60,45,.22);display:inline-flex;align-items:center;gap:9px;cursor:pointer}",
      ".digiyVoiceFloatIcon{font-size:22px}",
      ".digiyVoiceFloatSmall{display:block;font-size:10px;font-weight:900;opacity:.76;line-height:1}",
      "@media(max-width:560px){.digiyVoiceFloat{left:12px;right:12px;bottom:12px;justify-content:center;min-height:62px;font-size:16px}.foot{padding-bottom:92px}}"
    ].join("\n");
    document.head.appendChild(css);
  }

  function makeButton(){
    if(document.getElementById("digiyVoiceFloat")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "digiyVoiceFloat";
    btn.className = "digiyVoiceFloat";
    btn.setAttribute("aria-label", "Parler à DIGIY sur la vitrine publique");

    var icon = document.createElement("span");
    icon.className = "digiyVoiceFloatIcon";
    icon.textContent = "🎙️";

    var label = document.createElement("span");
    label.textContent = "Parler à DIGIY";

    var small = document.createElement("small");
    small.className = "digiyVoiceFloatSmall";
    small.textContent = "vitrine publique";
    label.appendChild(small);

    btn.appendChild(icon);
    btn.appendChild(label);

    btn.addEventListener("click", function(){
      var section = document.getElementById("voix");
      if(section) section.scrollIntoView({behavior:"smooth", block:"start"});
      setTimeout(function(){
        var q = document.getElementById("q");
        if(q && q.focus) q.focus({preventScroll:true});
        var listen = document.getElementById("listenBtn");
        if(listen && !/indispo/i.test(listen.textContent || "")) listen.click();
      }, 420);
    });

    document.body.appendChild(btn);
  }

  function init(){ addCss(); makeButton(); }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
