/* DIGIYLYFE — LA VOIX · RAILS TERRITORIAUX V1
 * LA VOIX reste un moteur de recherche transversal.
 * PAYS -> ZONE borne l'annuaire et les routes métier.
 * Aucun module métier n'est recréé ici.
 */
(function(){
  'use strict';

  if(window.DIGIY_VOICE_TERRITORY_RAILS_V1)return;
  window.DIGIY_VOICE_TERRITORY_RAILS_V1=true;

  var TERRITORIES={
    'petite-cote':{country:'sn',flag:'🇸🇳',countryLabel:'SÉNÉGAL',zoneLabel:'PETITE CÔTE',queryZone:'Petite Côte',markers:['saly','mbour','thies','thiès','aibd','ngaparou','somone','petite cote','petite côte']},
    'dakar':{country:'sn',flag:'🇸🇳',countryLabel:'SÉNÉGAL',zoneLabel:'DAKAR',queryZone:'Dakar',markers:['dakar']},
    'vallee-dordogne':{country:'fr',flag:'🇫🇷',countryLabel:'FRANCE',zoneLabel:'VALLÉE DE LA DORDOGNE',queryZone:'Sarlat Dordogne',markers:['sarlat','dordogne','perigord','périgord']},
    'bordeaux':{country:'fr',flag:'🇫🇷',countryLabel:'FRANCE',zoneLabel:'BORDEAUX',queryZone:'Bordeaux',markers:['bordeaux']}
  };
  var COUNTRY_ZONES={sn:['petite-cote','dakar'],fr:['vallee-dordogne','bordeaux']};
  var LANGS=['fr','en','es','pt','de','it','nl','ar'];
  var TXT={
    fr:{country:'RÉGION',zone:'ZONE',chooseCountry:'Choisir la région',chooseZone:'Choisir la zone',needZone:'Choisis d’abord une région puis une zone pour que LA VOIX cherche au bon endroit.',context:'RAIL ACTIF'},
    en:{country:'REGION',zone:'ZONE',chooseCountry:'Choose region',chooseZone:'Choose zone',needZone:'Choose a region and zone first so THE VOICE searches in the right place.',context:'ACTIVE RAIL'},
    es:{country:'REGIÓN',zone:'ZONA',chooseCountry:'Elegir región',chooseZone:'Elegir zona',needZone:'Elige primero una región y una zona para que LA VOZ busque en el lugar correcto.',context:'RUTA ACTIVA'},
    pt:{country:'REGIÃO',zone:'ZONA',chooseCountry:'Escolher região',chooseZone:'Escolher zona',needZone:'Escolha primeiro uma região e uma zona para que A VOZ pesquise no lugar certo.',context:'ROTA ATIVA'},
    de:{country:'REGION',zone:'GEBIET',chooseCountry:'Region wählen',chooseZone:'Gebiet wählen',needZone:'Wähle zuerst Region und Gebiet, damit DIE STIMME am richtigen Ort sucht.',context:'AKTIVE ROUTE'},
    it:{country:'REGIONE',zone:'ZONA',chooseCountry:'Scegli regione',chooseZone:'Scegli zona',needZone:'Scegli prima regione e zona affinché LA VOCE cerchi nel posto giusto.',context:'ROTAIA ATTIVA'},
    nl:{country:'REGIO',zone:'GEBIED',chooseCountry:'Kies regio',chooseZone:'Kies gebied',needZone:'Kies eerst regio en gebied zodat DE STEM op de juiste plek zoekt.',context:'ACTIEVE ROUTE'},
    ar:{country:'النطاق',zone:'المنطقة',chooseCountry:'اختر النطاق',chooseZone:'اختر المنطقة',needZone:'اختر النطاق والمنطقة أولاً حتى يبحث الصوت في المكان الصحيح.',context:'المسار النشط'}
  };

  function qs(){try{return new URLSearchParams(location.search)}catch(e){return new URLSearchParams()}}
  function lang(){var p=qs(),l=(p.get('lang')||document.documentElement.lang||'fr').slice(0,2).toLowerCase();return LANGS.indexOf(l)>=0?l:'fr'}
  function territory(){var p=qs(),t=p.get('territory')||p.get('zone')||'';return TERRITORIES[t]?t:''}
  function local(){return qs().get('local')||''}
  function clean(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
  function itemText(item){return clean([item&&item.secteur].concat(item&&item.zones||[],item&&item.title,item&&item.titre,item&&item.nom,item&&item.url).filter(Boolean).join(' '))}
  function matchesTerritory(item,t){
    var meta=TERRITORIES[t];if(!meta)return false;
    var txt=itemText(item);
    return meta.markers.some(function(m){return txt.indexOf(clean(m))>=0});
  }
  function moduleUrl(module,t){
    var u=new URL('https://digiylyfe.com/module-territoire.html');
    u.searchParams.set('module',module);u.searchParams.set('territory',t);
    if(local())u.searchParams.set('local',local());
    u.searchParams.set('lang',lang());
    return u.toString();
  }
  function routeItem(id,icon,title,module,keys,t){
    var meta=TERRITORIES[t];
    return {
      id:'voice-rail-'+id+'-'+t,
      kind:'directory',public:true,priority:12,priorite:12,icon:icon,
      title:title+' · '+meta.zoneLabel,titre:title+' · '+meta.zoneLabel,nom:title,
      metier:title,categorie:'TERRITOIRE',sousCategorie:module,
      secteur:meta.zoneLabel,zones:[meta.zoneLabel,meta.countryLabel],
      statut:'rail_territorial',labelStatut:'LA VOIX · '+meta.countryLabel+' · '+meta.zoneLabel,
      phone:'',whatsapp:'',keys:keys,mots:keys,
      description:'LA VOIX ouvre le bon rail territorial sans mélanger les pays ni les zones.',
      url:moduleUrl(module,t),wa:''
    };
  }
  function routeItems(t){
    if(!TERRITORIES[t])return[];
    function one(id,icon,title,module,metier,keys){
      var item=routeItem(id,icon,title,module,keys,t);
      item.metier=metier;item.activite=metier;item.zones.push(TERRITORIES[t].queryZone);
      item.statut='fiche_territoriale';item.labelStatut='RAIL TERRITORIAL · '+TERRITORIES[t].zoneLabel;
      item.priority=20;item.priorite=20;
      return item;
    }
    return [
      one('driver','🚗','DRIVER','transport','chauffeur',['chauffeur','driver','taxi','vtc','transport','trajet','course','transfert','aibd']),
      one('plumber','🔧','PLOMBIER · BUILD','artisan','plombier',['plombier','plomberie','fuite','robinet','sanitaire']),
      one('electrician','⚡','ÉLECTRICIEN · BUILD','artisan','électricien',['electricien','électricien','electricite','électricité','courant','panne electrique']),
      one('mason','🏗️','CONSTRUCTION · BUILD','artisan','maçon',['macon','maçon','construction','batisseur','bâtisseur','chantier','renovation','rénovation']),
      one('solar','☀️','SOLAIRE · BUILD','artisan','solaire',['solaire','panneau solaire','batterie solaire','energie solaire','énergie solaire']),
      one('artisan','🛠️','ARTISANS · BUILD','artisan','artisan',['artisan','travaux','reparation','réparation','dépannage','depannage']),
      one('loc','🏠','DORMIR & LOUER · LOC','accommodation','logement',['chambre','logement','maison','studio','appartement','villa','louer','location','dormir','hebergement','hébergement']),
      one('resto','🍽️','MANGER · RESTO','food','restaurant',['restaurant','resto','manger','table','diner','dîner','repas','snack','traiteur','boulangerie']),
      one('commerce','🛍️','ACHETER LOCAL · COMMERCE','shopping','commerce',['commerce','commerces','boutique','magasin','acheter','produit','article','commande','shopping','linge','vetement','vêtement']),
      one('beauty','💅','BEAUTÉ & BIEN-ÊTRE','beauty','beauté',['beaute','beauté','onglerie','ongles','massage','bien etre','bien-être','coiffure','spa','hammam','sauna','soins']),
      one('jobs','💼','EMPLOI & MISSIONS','jobs','emploi',['emploi','job','jobs','mission','travail','recrute','recrutement','postuler','candidature']),
      one('announcements','⚡','ANNONCES · BONNE AFFAIRE','announcements','annonce',['annonce','annonces','bonne affaire','publier','vente','occasion','materiel','matériel']),
      one('resa','📅','RÉSA MULTI','resa','réservation',['resa','réservation','reservation','réserver','reserver','rendez vous','rendez-vous','creneau','créneau'])
    ];
  }

  function installDirectoryRail(){
    var original=window.DIGIY_GET_PUBLIC_DIRECTORY;
    if(typeof original!=='function'||original.__digiyTerritoryRail)return false;
    var wrapped=function(){
      var t=territory();
      if(!t)return[];
      var base=[];try{base=original()||[]}catch(e){base=[]}
      base=Array.isArray(base)?base.filter(function(item){return matchesTerritory(item,t)}):[];
      return base.concat(routeItems(t));
    };
    wrapped.__digiyTerritoryRail=true;
    window.DIGIY_GET_PUBLIC_DIRECTORY=wrapped;
    try{window.DIGIY_PUBLIC_DIRECTORY=wrapped()}catch(e){}
    return true;
  }

  function goTerritory(t){
    if(!TERRITORIES[t])return;
    var u=new URL(location.href);u.searchParams.set('territory',t);u.searchParams.delete('zone');
    u.searchParams.set('country',TERRITORIES[t].country);u.searchParams.set('lang',lang());u.searchParams.delete('local');
    location.href=u.toString();
  }
  function buildRailUI(){
    if(document.getElementById('digiyVoiceTerritoryRail'))return;
    var ask=document.querySelector('.panel.ask');var q=document.getElementById('q');if(!ask||!q)return;
    var L=TXT[lang()]||TXT.fr,t=territory(),selectedCountry=t?TERRITORIES[t].country:(qs().get('country')||'');
    var box=document.createElement('div');box.id='digiyVoiceTerritoryRail';
    box.innerHTML='<style>#digiyVoiceTerritoryRail{display:grid;gap:7px;padding:9px;border:1px solid rgba(22,129,67,.22);border-radius:20px;background:rgba(243,251,236,.82)}.dvr-line{display:grid;grid-template-columns:54px 1fr;gap:7px;align-items:center}.dvr-label{font-size:9px;font-weight:1000;letter-spacing:.07em;color:#46685b}.dvr-buttons{display:flex;gap:6px;overflow:auto;scrollbar-width:none}.dvr-buttons::-webkit-scrollbar{display:none}.dvr-btn{flex:0 0 auto;min-height:36px;padding:7px 10px;border:1px solid rgba(18,60,45,.14);border-radius:999px;background:#fff;color:#102f24;font-size:10px;font-weight:1000;box-shadow:none}.dvr-btn.active{background:linear-gradient(135deg,#fff2bf,#7ee6a7);border-color:rgba(22,129,67,.35)}.dvr-context{font-size:10px;font-weight:900;color:#32614d;text-align:center;padding-top:2px}</style>'+ '<div class="dvr-line"><div class="dvr-label">'+L.country+'</div><div class="dvr-buttons" data-country-buttons></div></div>'+ '<div class="dvr-line"><div class="dvr-label">'+L.zone+'</div><div class="dvr-buttons" data-zone-buttons></div></div>'+ '<div class="dvr-context" data-context></div>';
    ask.insertBefore(box,q);
    var cb=box.querySelector('[data-country-buttons]'),zb=box.querySelector('[data-zone-buttons]'),ctx=box.querySelector('[data-context]');
    [['sn','🇸🇳 SÉNÉGAL'],['fr','🇪🇺 EUROPE']].forEach(function(row){
      var b=document.createElement('button');b.type='button';b.className='dvr-btn'+(selectedCountry===row[0]?' active':'');b.textContent=row[1];
      b.addEventListener('click',function(){renderZones(row[0]);Array.prototype.forEach.call(cb.querySelectorAll('.dvr-btn'),function(x){x.classList.toggle('active',x===b)})});cb.appendChild(b);
    });
    function renderZones(country){
      selectedCountry=country;zb.innerHTML='';(COUNTRY_ZONES[country]||[]).forEach(function(slug){var m=TERRITORIES[slug],b=document.createElement('button');b.type='button';b.className='dvr-btn'+(t===slug?' active':'');b.textContent=m.flag+' '+m.zoneLabel;b.addEventListener('click',function(){goTerritory(slug)});zb.appendChild(b)});
    }
    if(selectedCountry)renderZones(selectedCountry);
    if(t){var m=TERRITORIES[t];ctx.textContent=L.context+' · '+m.flag+' '+m.countryLabel+' → '+m.zoneLabel+(local()?' → '+local():'')}
    else ctx.textContent=L.needZone;
  }

  function applyContextToQueries(){
    var t=territory();if(!t)return;var suffix=' '+TERRITORIES[t].queryZone;
    Array.prototype.forEach.call(document.querySelectorAll('[data-q]'),function(el){var v=el.getAttribute('data-q')||'';if(v&&clean(v).indexOf(clean(TERRITORIES[t].queryZone))<0)el.setAttribute('data-q',v+suffix)});
    document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#searchBtn');if(!b)return;var q=document.getElementById('q');if(!q||!q.value.trim())return;if(clean(q.value).indexOf(clean(TERRITORIES[t].queryZone))<0)q.value=q.value.trim()+suffix},true);
  }

  function blockSearchWithoutTerritory(){
    document.addEventListener('click',function(e){
      var b=e.target.closest&&e.target.closest('#searchBtn');if(!b||territory())return;
      e.preventDefault();e.stopImmediatePropagation();var box=document.getElementById('digiyVoiceTerritoryRail');if(box){box.scrollIntoView({behavior:'smooth',block:'center'});box.style.outline='3px solid rgba(246,196,83,.65)';setTimeout(function(){box.style.outline=''},1200)}
    },true);
  }

  function centralizeGenericLinks(){
    var t=territory();if(!t)return;
    var map={
      'driver-client.digiylyfe.com':'transport','galerie-chauffeurs.digiylyfe.com':'transport',
      'build.digiylyfe.com':'artisan','loc.digiylyfe.com':'accommodation','resto.digiylyfe.com':'food',
      'resa-table-resto.digiylyfe.com':'resa','mon-commerce.digiylyfe.com':'shopping','market.digiylyfe.com':'shopping',
      'jobs.digiylyfe.com':'jobs','reseau-digiy.digiylyfe.com':'announcements'
    };
    var SN=['babacar-plombier-pro.digiylyfe.com','helage-plombier.digiylyfe.com','mbaye-macon.digiylyfe.com','kourant.digiylyfe.com','digiy-solaire.digiylyfe.com','astou-boutique.digiylyfe.com','bcheikh.digiylyfe.com','part-chez-baptiste.digiylyfe.com','partenaire-lamine.digiylyfe.com','digiy-driver-part-bapt.digiylyfe.com','galerie-chauffeurs.digiylyfe.com'];
    var FR=['sarlat-chez-baptiste.digiylyfe.com','malraux-entre2.digiylyfe.com'];
    var cards=document.getElementById('cards');if(!cards)return;
    var busy=false;
    function apply(){
      if(busy)return;busy=true;
      Array.prototype.forEach.call(cards.querySelectorAll('.card'),function(card){
        var country='';Array.prototype.forEach.call(card.querySelectorAll('a[href]'),function(a){try{var u=new URL(a.href,location.href);if(SN.indexOf(u.hostname)>=0)country='sn';if(FR.indexOf(u.hostname)>=0)country='fr';var mod=map[u.hostname];if(mod)a.href=moduleUrl(mod,t)}catch(e){}});
        if(country&&country!==TERRITORIES[t].country)card.remove();
      });
      var summary=document.getElementById('resultsSummary');if(summary&&cards.querySelector('.card')){summary.hidden=false;summary.innerHTML='<strong>'+((TXT[lang()]||TXT.fr).context)+' · '+TERRITORIES[t].flag+' '+TERRITORIES[t].countryLabel+' → '+TERRITORIES[t].zoneLabel+'</strong>'+(lang()==='en'?'Results are limited to this zone.':'Résultats limités à cette zone.');}
      busy=false;
    }
    apply();new MutationObserver(function(){setTimeout(apply,0)}).observe(cards,{childList:true,subtree:true});
  }

  installDirectoryRail();
  buildRailUI();
  applyContextToQueries();
  blockSearchWithoutTerritory();
  centralizeGenericLinks();
})();
