/* DIGIYLYFE ACTION — correctif Astou chargé par SRC.
   Une seule fiche boutique remonte quand la demande parle de linge/serviettes à Saly.
*/
(function(){
  "use strict";
  var TEL = "221771342889";
  var URL = "https://astou-boutique.digiylyfe.com/";
  function el(id){ return document.getElementById(id); }
  function clean(v){ return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
  function has(t,a){ return a.some(function(w){ return t.indexOf(clean(w)) >= 0; }); }
  function match(v){
    var t = clean(v);
    return has(t,["serviette","linge","drap","bain","peignoir","fouta"])
      && has(t,["saly","petite cote","petite côte"])
      && has(t,["boutique","magasin","acheter","commerce","market","cherche","veux"]);
  }
  function wa(text){ return "https://wa.me/"+TEL+"?text="+encodeURIComponent(text); }
  function render(raw){
    var box = el("cards"), empty = el("empty"), intro = el("resultIntro"), status = el("status");
    if(!box || !match(raw)) return false;
    var msg = "Bonjour, je cherche des serviettes ou du linge à Saly via DIGIY." + (raw ? "\n\nRecherche client : "+raw : "");
    box.innerHTML = '<article class="card"><div class="cover">🛍️</div><div class="body"><span class="tag">#boutique · Saly</span><h3>Astou Boutique — linge & serviettes</h3><p>Serviettes, draps, linge et articles utiles. Fiche publique, contact direct, sans commission.</p><div class="card-actions"><a class="btn primary" href="'+URL+'" target="_blank" rel="noopener noreferrer">Voir la fiche</a><a class="btn green" href="'+wa(msg)+'" target="_blank" rel="noopener noreferrer">WhatsApp</a></div></div></article>';
    if(empty) empty.style.display = "none";
    if(intro) intro.textContent = "Une fiche boutique qualifiée remonte pour cette demande.";
    if(status) status.textContent = "Fiche Astou Boutique trouvée. Contact direct.";
    return true;
  }
  function check(){ var q = el("q"); var raw = q ? q.value : ""; setTimeout(function(){ render(raw); }, 60); }
  function init(){
    ["searchBtn","msgBtn"].forEach(function(id){ var b=el(id); if(b) b.addEventListener("click",check); });
    document.querySelectorAll(".chip").forEach(function(b){ b.addEventListener("click",function(){ setTimeout(check,90); }); });
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
