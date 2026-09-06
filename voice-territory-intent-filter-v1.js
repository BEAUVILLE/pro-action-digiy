/* DIGIYLYFE — LA VOIX · FILTRE INTENTION + TERRITOIRE V2
 * Une seule règle publique : besoin -> métier -> territoire -> fiches.
 * Le lieu écrit dans la demande peut activer le territoire sans clic préalable.
 * Sénégal uniquement ici ; France reste gérée par son rail existant.
 */
(function(){
  'use strict';
  if(window.DIGIY_VOICE_INTENT_FILTER_V2)return;
  window.DIGIY_VOICE_INTENT_FILTER_V2=true;

  var TERRITORIES={
    'petite-cote':{label:'PETITE CÔTE',markers:['saly','mbour','thies','thiès','aibd','ngaparou','somone','petite cote','petite côte']},
    'dakar':{label:'DAKAR',markers:['dakar']}
  };

  function qs(){try{return new URLSearchParams(location.search)}catch(e){return new URLSearchParams()}}
  function clean(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
  function has(t,words){return words.some(function(w){return t.indexOf(clean(w))>=0})}
  function queryText(){var q=document.getElementById('q');return clean(q&&q.value||'')}

  function territoryFromUrl(){
    var p=qs(),t=p.get('territory')||p.get('zone')||'';
    return TERRITORIES[t]?t:'';
  }

  function territoryFromQuery(){
    var t=queryText();if(!t)return'';
    var keys=Object.keys(TERRITORIES);
    for(var i=0;i<keys.length;i++){
      var slug=keys[i],meta=TERRITORIES[slug];
      if(has(t,meta.markers))return slug;
    }
    return'';
  }

  function territory(){return territoryFromUrl()||territoryFromQuery()}

  function detectNeed(){
    var t=queryText();if(!t)return null;

    if(has(t,['appartement','chambre','logement','studio','villa','maison','louer','location','dormir','nuit','hebergement','hébergement','hotel','hôtel']))
      return{family:'accommodation',specialty:''};

    if(has(t,['chauffeur','driver','taxi','vtc','aibd','aeroport','aéroport','trajet','course','transfert','transport']))
      return{family:'transport',specialty:''};

    if(has(t,['plombier','plomberie','fuite','robinet','sanitaire']))
      return{family:'artisan',specialty:'plumber'};
    if(has(t,['electricien','électricien','electricite','électricité','courant','panne electrique','panne électrique']))
      return{family:'artisan',specialty:'electrician'};
    if(has(t,['macon','maçon','maconnerie','maçonnerie','construction','batisseur','bâtisseur','chantier']))
      return{family:'artisan',specialty:'mason'};
    if(has(t,['solaire','panneau solaire','batterie solaire','energie solaire','énergie solaire']))
      return{family:'artisan',specialty:'solar'};
    if(has(t,['artisan','travaux','reparation','réparation','depannage','dépannage']))
      return{family:'artisan',specialty:''};

    if(has(t,['restaurant','resto','manger','table','diner','dîner','repas','snack','traiteur','boulangerie','patisserie','pâtisserie']))
      return{family:'food',specialty:''};
    if(has(t,['beaute','beauté','onglerie','ongles','massage','bien etre','bien-être','coiffure','spa','hammam','sauna','soin','soins']))
      return{family:'beauty',specialty:''};
    if(has(t,['emploi','job','jobs','mission','travail','recrute','recrutement','postuler','candidature']))
      return{family:'jobs',specialty:''};
    if(has(t,['annonce','annonces','bonne affaire','publier','occasion','materiel','matériel']))
      return{family:'announcements',specialty:''};
    if(has(t,['commerce','commerces','boutique','magasin','acheter','produit','article','commande','shopping','linge','vetement','vêtement']))
      return{family:'shopping',specialty:''};
    if(has(t,['rendez vous','rendez-vous','creneau','créneau','reservation','réservation','reserver','réserver']))
      return{family:'resa',specialty:''};
    return null;
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

  function artisanSpecialty(card){
    var links=card.querySelectorAll('a[href]');
    for(var i=0;i<links.length;i++){
      try{
        var host=new URL(links[i].href,location.href).hostname;
        if(host==='babacar-plombier-pro.digiylyfe.com'||host==='helage-plombier.digiylyfe.com')return'plumber';
        if(host==='kourant.digiylyfe.com')return'electrician';
        if(host==='mbaye-macon.digiylyfe.com')return'mason';
        if(host==='digiy-solaire.digiylyfe.com')return'solar';
      }catch(e){}
    }
    var t=clean(card.textContent||'');
    if(has(t,['plombier','plomberie']))return'plumber';
    if(has(t,['electricien','électricien','electricite','électricité']))return'electrician';
    if(has(t,['macon','maçon','batisseur','bâtisseur','construction']))return'mason';
    if(has(t,['solaire','panneau solaire']))return'solar';
    return'';
  }

  function compatibleFamily(family,module){
    if(!family)return true;
    if(family==='food')return module==='food'||module==='resa';
    if(family==='beauty')return module==='beauty'||module==='resa';
    return module===family;
  }

  function compatibleNeed(need,module,card){
    if(!need)return true;
    if(!compatibleFamily(need.family,module))return false;
    if(need.family==='artisan'&&need.specialty){
      return artisanSpecialty(card)===need.specialty;
    }
    return true;
  }

  function cardMatchesTerritory(card,slug){
    if(!slug||!TERRITORIES[slug])return true;
    var t=clean(card.textContent||'');
    var links=card.querySelectorAll('a[href]');
    for(var i=0;i<links.length;i++)t+=' '+clean(links[i].href||'');
    return has(t,TERRITORIES[slug].markers);
  }

  function labelForNeed(need){
    if(!need)return'';
    if(need.family==='artisan'&&need.specialty){
      var s={plumber:'PLOMBIER',electrician:'ÉLECTRICIEN',mason:'MAÇON',solar:'SOLAIRE'};
      return s[need.specialty]||'BUILD';
    }
    var names={accommodation:'LOC',transport:'DRIVER',artisan:'BUILD',food:'MANGER / RÉSA',shopping:'COMMERCE',beauty:'BEAUTÉ',jobs:'EMPLOI',announcements:'ANNONCES',resa:'RÉSA MULTI'};
    return names[need.family]||String(need.family||'').toUpperCase();
  }

  function apply(){
    var cards=document.getElementById('cards');if(!cards)return;
    var need=detectNeed(),slug=territory();
    if(!need&&!slug)return;

    Array.prototype.forEach.call(cards.querySelectorAll('.card'),function(card){
      var module=moduleFromCard(card);
      if(need&&(!module||!compatibleNeed(need,module,card))){card.remove();return}
      if(slug&&!cardMatchesTerritory(card,slug)){card.remove()}
    });

    var remaining=cards.querySelectorAll('.card').length;
    var summary=document.getElementById('resultsSummary');
    var empty=document.getElementById('empty');

    if(remaining){
      if(empty)empty.style.display='none';
      if(summary){
        var strong=summary.querySelector('strong');
        if(strong){
          var parts=[remaining+' résultat'+(remaining>1?'s':'')+' utile'+(remaining>1?'s':'')];
          var needLabel=labelForNeed(need);if(needLabel)parts.push(needLabel);
          if(slug&&TERRITORIES[slug])parts.push(TERRITORIES[slug].label);
          strong.textContent=parts.join(' · ');
        }
        summary.hidden=false;
      }
    }else{
      if(summary)summary.hidden=true;
      if(empty)empty.style.display='block';
    }
  }

  function boot(){
    var cards=document.getElementById('cards');if(!cards)return;
    var timer=0;function later(){clearTimeout(timer);timer=setTimeout(apply,25)}
    later();new MutationObserver(later).observe(cards,{childList:true,subtree:true});
    document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#searchBtn,.chip[data-q],.examplePhrase[data-q]'))later()},true);
    var q=document.getElementById('q');if(q)q.addEventListener('input',later);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
