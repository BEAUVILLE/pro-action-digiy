/* DIGIYLYFE — LA VOIX · FILTRE INTENTION TERRITORIAL V1
 * Sénégal uniquement : après PAYS -> ZONE, ne garde que le métier demandé.
 * France laissée intacte : son rail actuel est déjà propre.
 */
(function(){
  'use strict';
  if(window.DIGIY_VOICE_INTENT_FILTER_V1)return;
  window.DIGIY_VOICE_INTENT_FILTER_V1=true;

  function qs(){try{return new URLSearchParams(location.search)}catch(e){return new URLSearchParams()}}
  function territory(){var p=qs();return p.get('territory')||p.get('zone')||''}
  function active(){var t=territory();return t==='petite-cote'||t==='dakar'}
  function clean(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
  function has(t,words){return words.some(function(w){return t.indexOf(clean(w))>=0})}

  function detectIntent(){
    var q=document.getElementById('q'),t=clean(q&&q.value||'');
    if(!t)return'';
    if(has(t,['appartement','chambre','logement','studio','villa','maison','louer','location','dormir','nuit','hebergement','hébergement','hotel','hôtel']))return'accommodation';
    if(has(t,['chauffeur','driver','taxi','vtc','aibd','aeroport','aéroport','trajet','course','transfert','transport']))return'transport';
    if(has(t,['plombier','plomberie','fuite','electricien','électricien','electricite','électricité','macon','maçon','construction','batisseur','bâtisseur','chantier','solaire','artisan','travaux','reparation','réparation','depannage','dépannage']))return'artisan';
    if(has(t,['restaurant','resto','manger','table','diner','dîner','repas','snack','traiteur','boulangerie','patisserie','pâtisserie']))return'food';
    if(has(t,['beaute','beauté','onglerie','ongles','massage','bien etre','bien-être','coiffure','spa','hammam','sauna','soin','soins']))return'beauty';
    if(has(t,['emploi','job','jobs','mission','travail','recrute','recrutement','postuler','candidature']))return'jobs';
    if(has(t,['annonce','annonces','bonne affaire','publier','occasion','materiel','matériel']))return'announcements';
    if(has(t,['commerce','commerces','boutique','magasin','acheter','produit','article','commande','shopping','linge','vetement','vêtement']))return'shopping';
    if(has(t,['rendez vous','rendez-vous','creneau','créneau','reservation','réservation','reserver','réserver']))return'resa';
    return'';
  }

  var HOST_MODULE={
    'part-chez-baptiste.digiylyfe.com':'accommodation',
    'babacar-plombier-pro.digiylyfe.com':'artisan',
    'helage-plombier.digiylyfe.com':'artisan',
    'mbaye-macon.digiylyfe.com':'artisan',
    'kourant.digiylyfe.com':'artisan',
    'digiy-solaire.digiylyfe.com':'artisan',
    'partenaire-lamine.digiylyfe.com':'transport',
    'digiy-driver-part-bapt.digiylyfe.com':'transport',
    'galerie-chauffeurs.digiylyfe.com':'transport',
    'astou-boutique.digiylyfe.com':'shopping',
    'bcheikh.digiylyfe.com':'shopping',
    'driver-client.digiylyfe.com':'transport',
    'build.digiylyfe.com':'artisan',
    'loc.digiylyfe.com':'accommodation',
    'resto.digiylyfe.com':'food',
    'resa-table-resto.digiylyfe.com':'resa',
    'mon-commerce.digiylyfe.com':'shopping',
    'jobs.digiylyfe.com':'jobs',
    'bonne-affaire.digiylyfe.com':'announcements'
  };

  function moduleFromCard(card){
    var links=card.querySelectorAll('a[href]');
    for(var i=0;i<links.length;i++){
      try{
        var u=new URL(links[i].href,location.href);
        if(u.hostname==='digiylyfe.com'&&u.pathname==='/module-territoire.html'){
          var m=u.searchParams.get('module')||'';if(m)return m;
        }
        if(HOST_MODULE[u.hostname])return HOST_MODULE[u.hostname];
      }catch(e){}
    }
    var t=clean(card.textContent||'');
    if(has(t,['loc / appartement','logement','appartement','chambre','dormir & louer']))return'accommodation';
    if(has(t,['build /','plombier','electricien','électricien','batisseur','bâtisseur','macon','maçon','solaire']))return'artisan';
    if(has(t,['driver','chauffeur','transport']))return'transport';
    if(has(t,['restaurant','resto','manger']))return'food';
    if(has(t,['commerce','boutique','shopping']))return'shopping';
    if(has(t,['beaute','beauté','onglerie','massage','coiffure']))return'beauty';
    if(has(t,['emploi','jobs','mission']))return'jobs';
    if(has(t,['annonce','bonne affaire']))return'announcements';
    if(has(t,['resa','réservation','reservation']))return'resa';
    return'';
  }

  function compatible(intent,module){
    if(!intent)return true;
    if(intent==='food')return module==='food'||module==='resa';
    if(intent==='beauty')return module==='beauty'||module==='resa';
    return module===intent;
  }

  function apply(){
    if(!active())return;
    var cards=document.getElementById('cards');if(!cards)return;
    var intent=detectIntent();if(!intent)return;
    Array.prototype.forEach.call(cards.querySelectorAll('.card'),function(card){
      var module=moduleFromCard(card);
      if(!module||!compatible(intent,module))card.remove();
    });
    var summary=document.getElementById('resultsSummary');
    if(summary&&cards.querySelector('.card')){
      var names={accommodation:'LOC',transport:'DRIVER',artisan:'BUILD',food:'MANGER / RÉSA',shopping:'COMMERCE',beauty:'BEAUTÉ',jobs:'EMPLOI',announcements:'ANNONCES',resa:'RÉSA MULTI'};
      var strong=summary.querySelector('strong');if(strong)strong.textContent=strong.textContent+' · FILTRE '+(names[intent]||intent.toUpperCase());
    }
  }

  function boot(){
    if(!active())return;
    var cards=document.getElementById('cards');if(!cards)return;
    var timer=0;function later(){clearTimeout(timer);timer=setTimeout(apply,25)}
    later();new MutationObserver(later).observe(cards,{childList:true,subtree:true});
    document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#searchBtn,.chip[data-q],.examplePhrase[data-q]'))later()},true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
