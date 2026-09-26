/* DIGIYLYFE — LA VOIX · FILTRE INTENTION + TERRITOIRE V2
 * Une seule règle publique : besoin -> métier -> territoire -> fiches.
 * Le lieu écrit dans la demande peut activer le territoire sans clic préalable.
 * Sénégal + Maroc + USA ici ; France reste gérée par son rail existant.
 */
(function(){
  'use strict';
  if(window.DIGIY_VOICE_INTENT_FILTER_V2)return;
  window.DIGIY_VOICE_INTENT_FILTER_V2=true;

  var TERRITORIES={
    'petite-cote':{label:'PETITE CÔTE',markers:['saly','mbour','thies','thiès','aibd','ngaparou','somone','petite cote','petite côte']},
    'dakar':{label:'DAKAR',markers:['dakar']},
    'casablanca':{label:'CASABLANCA',markers:['casablanca','casa']},
    'marrakech':{label:'MARRAKECH',markers:['marrakech','marrakesh']},
    'miami':{label:'MIAMI',markers:['miami','florida','floride','usa','united states','etats unis','états unis','etats-unis','états-unis']}
  };

  /* P5 cohérence : le registre commun enrichit les territoires déjà connus,
     sans retirer les marqueurs locaux historiques (AIBD, Thiès, Maroc...). */
  var COMMON_TERRITORIES=(window.DIGIY_TAXONOMY&&window.DIGIY_TAXONOMY.territories)||{};
  ['petite-cote','dakar','miami'].forEach(function(slug){
    var common=COMMON_TERRITORIES[slug],local=TERRITORIES[slug];
    if(!common||!local)return;
    var merged=(local.markers||[]).concat(common.markers||[]);
    local.markers=merged.filter(function(v,i,a){return a.indexOf(v)===i});
    if(common.label)local.label=String(common.label).toUpperCase();
  });

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
    if(has(t,TERRITORIES.dakar.markers))return'dakar';
    if(has(t,TERRITORIES['petite-cote'].markers))return'petite-cote';
    if(has(t,TERRITORIES.casablanca.markers))return'casablanca';
    if(has(t,TERRITORIES.marrakech.markers))return'marrakech';
    if(has(t,TERRITORIES.miami.markers))return'miami';
    return'';
  }

  function territory(){return territoryFromUrl()||territoryFromQuery()}

  function detectNeeds(){
    var t=queryText(),needs=[];if(!t)return needs;
    function push(family,specialty){
      specialty=specialty||'';
      if(!needs.some(function(n){return n.family===family&&n.specialty===specialty})){
        needs.push({family:family,specialty:specialty});
      }
    }

    var explicitBuilding=has(t,['architecte','architecture','plans','plan de maison','concevoir','construction','construire','chantier','menuisier','menuiserie','porte','fenetre','fenêtre']);
    var explicitRealEstate=has(t,['immobilier','immobiliere','immobilière','agence immobiliere','agence immobilière','bien immobilier','acheter maison','acheter une maison','maison a vendre','maison à vendre','vendre maison','acheter appartement','appartement a vendre','appartement à vendre','vendre appartement','acheter terrain','terrain a vendre','terrain à vendre','vendre terrain','vente terrain','parcelle a vendre','parcelle à vendre']);
    if(has(t,['chambre','logement','studio','louer','location','dormir','nuit','hebergement','hébergement','hotel','hôtel','room','lodging','stay','rental','rent','night']) ||
       (has(t,['appartement','villa','maison','house','apartment','flat']) && !explicitBuilding && !explicitRealEstate))
      push('accommodation');

    if(has(t,['chauffeur','driver','taxi','vtc','aibd','aeroport','aéroport','airport','trajet','course','ride','trip','transfert','transfer','transport']))
      push('transport');

    if(has(t,['plombier','plomberie','fuite','canalisation','canalisation bouchée','canalisation bouchee','débouchage','debouchage','désengorgement','desengorgement','évacuation','evacuation','tuyau','tuyauterie','robinet','sanitaire','plumber','plumbing']))
      push('artisan','plumber');
    if(has(t,['electricien','électricien','electricite','électricité','courant','panne electrique','panne électrique','electrician','electrical']))
      push('artisan','electrician');
    if(has(t,['architecte','architecture','plan de maison','plans de maison','faire les plans','dessiner les plans','concevoir une maison','concevoir une villa','conception maison','permis de construire']))
      push('services','architect');
    if(has(t,['geometre','géomètre','bornage','borner mon terrain','borner un terrain','bornage terrain','limites terrain','mesure terrain','mesurer une parcelle','superficie terrain','division de parcelle']))
      push('services','surveyor');
    if(has(t,['avocat','avocate','conseil juridique','juriste','probleme de contrat','problème de contrat','litige','affaire commerciale']))
      push('services','lawyer');
    if(has(t,['huissier','commissaire de justice','signification','signifier un document','constat huissier','faire un constat','constater des degats','constater des dégâts']))
      push('services','bailiff');
    if(has(t,['mecanicien','mécanicien','garage','reparation voiture','réparation voiture','panne voiture','moteur voiture','voiture ne demarre plus','voiture ne démarre plus','bruit moteur','voiture chauffe','probleme de frein','problème de frein']))
      push('services','mechanic');
    if(has(t,['comptable','expert comptable','expert-comptable','comptabilite','comptabilité','tenir ma comptabilite','tenir ma comptabilité','faire mon bilan','bilan comptable','declaration fiscale','déclaration fiscale']))
      push('services','accountant');
    if(has(t,['menuisier','menuiserie','porte','porte en bois','fenetre en bois','fenêtre en bois']))
      push('artisan','carpenter');
    if(has(t,['macon','maçon','maconnerie','maçonnerie','construction','batisseur','bâtisseur','chantier']))
      push('artisan','mason');
    if(has(t,['solaire','panneau solaire','batterie solaire','energie solaire','énergie solaire']))
      push('artisan','solar');
    if(has(t,['artisan','travaux','reparation','réparation','depannage','dépannage'])&&!needs.some(function(n){return n.family==='artisan'}))
      push('artisan');

    if(has(t,['restaurant','resto','manger','eat','table','diner','dîner','dinner','repas','meal','snack','traiteur','caterer','boulangerie','bakery','patisserie','pâtisserie','j ai faim','j’ai faim','on a faim','dejeuner','déjeuner','petit dejeuner','petit déjeuner','manger du poisson','poisson grille','poisson grillé','prendre un verre','boire un verre','a emporter','à emporter','livraison repas','table pour deux','table pour 2']))
      push('food');
    if(has(t,['excursion','excursions','sortie','sorties','visite','visiter','decouvrir','découvrir','balade','promenade','guide touristique','guide local','tour guide','activite','activité','activites','activités','peche','pêche','sortie en mer','ile de goree','île de gorée','reserve de bandia','réserve de bandia','lac rose','safari']))
      push('explore');
    if(explicitRealEstate || has(t,['agence immobiliere','agence immobilière','agent immobilier','maison a vendre','maison à vendre','appartement a vendre','appartement à vendre','terrain a vendre','terrain à vendre','parcelle a vendre','parcelle à vendre','acheter un bien','vendre un bien','vente immobiliere','vente immobilière']))
      push('realestate');
    if(has(t,['beaute','beauté','beauty','onglerie','ongles','nails','faire mes ongles','faire les ongles','manucure','pedicure','pédicure','soin des pieds','pieds','vernis','pose gel','faux ongles','massage','bien etre','bien-être','wellness','coiffure','coiffeur','coiffeuse','me faire coiffer','faire coiffer','tresses','tresser','nattes','cheveux','couper mes cheveux','coupe cheveux','brushing','hair','salon de beauté','salon de beaute','salon de coiffure','spa','hammam','sauna','soin','soins']))
      push('beauty');
    if(has(t,['emploi','job','jobs','mission','travail','recrute','recrutement','postuler','candidature']))
      push('jobs');
    if(has(t,['annonce','annonces','bonne affaire','publier','occasion','materiel','matériel']))
      push('announcements');
    if(has(t,['commerce','commerces','boutique','magasin','shop','store','acheter','buy','produit','product','article','commande','shopping','linge','linge de maison','serviette','serviettes','drap','draps','peignoir','peignoirs','vetement','vêtement','vetements','vêtements','tee shirt','tee-shirt','t shirt','t-shirt','polo','polos','robe','robes','chaussure','chaussures','sandale','sandales','sac','sacs','tissu','tissus','telephone','téléphone','accessoire','accessoires']))
      push('shopping');
    if(has(t,['rendez vous','rendez-vous','appointment','creneau','créneau','reservation','réservation','booking','book','reserver','réserver']))
      push('resa');
    return needs;
  }

  function detectNeed(){
    var needs=detectNeeds();
    return needs.length?needs[0]:null;
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
    'explore.digiylyfe.com':'explore',
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
    if(has(t,['explore','excursion','sortie','visite','guide touristique','activité','activite']))return'explore';
    if(has(t,['immobilier','immobiliere','immobilière','agence immobilière','agence immobiliere','agent immobilier','bien immobilier','terrain à vendre','terrain a vendre','maison à vendre','maison a vendre','appartement à vendre','appartement a vendre']))return'realestate';
    if(has(t,['beaute','beauté','onglerie','massage','coiffure']))return'beauty';
    if(has(t,['services','service pro','architecte','géomètre','geometre','avocat','huissier','commissaire de justice','mécanicien','mecanicien','comptable','expert-comptable','expert comptable']))return'services';
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
    if(has(t,['architecte','architecture','faire les plans','plan de maison']))return'architect';
    if(has(t,['menuisier','menuiserie','porte','fenetre en bois','fenêtre en bois']))return'carpenter';
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

  function serviceSpecialty(card){
    var t=clean(card.textContent||'');
    if(has(t,['architecte','architecture']))return'architect';
    if(has(t,['geometre','géomètre','bornage']))return'surveyor';
    if(has(t,['avocat','avocate','juriste']))return'lawyer';
    if(has(t,['huissier','commissaire de justice']))return'bailiff';
    if(has(t,['mecanicien','mécanicien','garage']))return'mechanic';
    if(has(t,['comptable','expert comptable','expert-comptable','comptabilite','comptabilité']))return'accountant';
    return'';
  }

  function compatibleNeed(need,module,card){
    if(!need)return true;
    if(!compatibleFamily(need.family,module))return false;
    if(need.family==='artisan'&&need.specialty){
      return artisanSpecialty(card)===need.specialty;
    }
    if(need.family==='services'&&need.specialty){
      return serviceSpecialty(card)===need.specialty;
    }
    if(need.family==='explore'){
      var links=card.querySelectorAll('a[href]');
      for(var i=0;i<links.length;i++){
        try{
          if(new URL(links[i].href,location.href).hostname==='explore.digiylyfe.com')return false;
        }catch(e){}
      }
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
      var s={plumber:'PLOMBIER',electrician:'ÉLECTRICIEN',carpenter:'MENUISERIE',mason:'MAÇON',solar:'SOLAIRE'};
      return s[need.specialty]||'BUILD';
    }
    if(need.family==='services'&&need.specialty){
      var p={architect:'ARCHITECTE',surveyor:'GÉOMÈTRE',lawyer:'AVOCAT',bailiff:'HUISSIER',mechanic:'MÉCANICIEN',accountant:'COMPTABLE'};
      return p[need.specialty]||'SERVICES';
    }
    var names={accommodation:'LOC',transport:'DRIVER',artisan:'BUILD',services:'SERVICES',food:'MANGER / RÉSA',explore:'EXCURSION / EXPLORE',realestate:'IMMOBILIER',shopping:'COMMERCE',beauty:'BEAUTÉ',jobs:'EMPLOI',announcements:'ANNONCES',resa:'RÉSA MULTI'};
    return names[need.family]||String(need.family||'').toUpperCase();
  }

  function apply(){
    var cards=document.getElementById('cards');if(!cards)return;
    var slug=territory();
    if(!slug)return;
    var needs=detectNeeds();

    Array.prototype.forEach.call(cards.querySelectorAll('.card'),function(card){
      var module=moduleFromCard(card);
      if(needs.length&&(!module||!needs.some(function(need){return compatibleNeed(need,module,card)}))){card.remove();return}
      if(!cardMatchesTerritory(card,slug)){card.remove()}
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
          var needLabels=Array.from(new Set(needs.map(labelForNeed).filter(Boolean)));
          if(needLabels.length)parts.push(needLabels.join(' + '));
          parts.push(TERRITORIES[slug].label);
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
