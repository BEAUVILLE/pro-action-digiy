/* DIGIYLYFE — Taxonomie commune V1
   Référentiel léger partagé par La Voix.
   Ne contient aucune fiche professionnelle et ne dépend d'aucune IA.
*/
(function(global){
  "use strict";
  if(global.DIGIY_TAXONOMY_V1)return;
  global.DIGIY_TAXONOMY_V1=true;

  const MODULES={
    DRIVER:{code:"DRIVER",label:"DRIVER",icon:"🚗",aliases:["driver","chauffeur","transport"]},
    LOC:{code:"LOC",label:"LOC",icon:"🏠",aliases:["loc","location","logement","hebergement","hébergement"]},
    RESA:{code:"RESA",label:"RÉSERVATION",icon:"📅",aliases:["resa","réservation","reservation","resto"]},
    BUILD:{code:"BUILD",label:"BÂTIMENT",icon:"🏗️",aliases:["build","bâtiment","batiment","artisan"]},
    COMMERCE:{code:"COMMERCE",label:"MON COMMERCE",icon:"🛍️",aliases:["commerce","mon commerce","market","boutique","shopping"]},
    JOBS:{code:"JOBS",label:"TRAVAIL",icon:"💼",aliases:["jobs","job","emploi","travail"]},
    EXPLORE:{code:"EXPLORE",label:"EXPLORE",icon:"🗺️",aliases:["explore","sortie","visite","activité","activite"]},
    CARNET:{code:"CARNET",label:"CARNET",icon:"💳",aliases:["carnet","pay","paiement","wave"]},
    RESEAU:{code:"RESEAU",label:"RÉSEAU",icon:"📣",aliases:["reseau","réseau","annonce"]},
    SANTE:{code:"SANTE",label:"SANTÉ",icon:"🩺",aliases:["sante","santé","soin","soins","medecin","médecin"]}
  };

  const TERRITORIES={
    "petite-cote":{slug:"petite-cote",country:"SN",label:"Petite Côte",markers:["saly","mbour","ngaparou","somone","petite cote","petite côte"]},
    "dakar":{slug:"dakar",country:"SN",label:"Dakar",markers:["dakar"]},
    "aibd":{slug:"aibd",country:"SN",label:"AIBD",markers:["aibd","diass","aeroport blaise diagne","aéroport blaise diagne"]},
    "thies":{slug:"thies",country:"SN",label:"Thiès",markers:["thies","thiès"]},
    "sarlat":{slug:"sarlat",country:"FR",label:"Sarlat",markers:["sarlat","sarlat la caneda","sarlat-la-caneda","perigord noir","périgord noir","dordogne"]},
    "bordeaux":{slug:"bordeaux",country:"FR",label:"Bordeaux",markers:["bordeaux"]},
    "paris":{slug:"paris",country:"FR",label:"Paris",markers:["paris","ile de france","île de france","ile-de-france","île-de-france"]},
    "miami":{slug:"miami",country:"US",label:"Miami",markers:["miami","florida","floride","usa","etats unis","états unis","etats-unis","états-unis"]}
  };

  function clean(v){
    return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\u0600-\u06ff]+/g," ").replace(/\s+/g," ").trim();
  }
  function module(value){
    const t=clean(value);
    if(!t)return null;
    for(const key of Object.keys(MODULES)){
      const m=MODULES[key];
      if(clean(m.code)===t||clean(m.label)===t||m.aliases.some(a=>clean(a)===t))return m;
    }
    return null;
  }
  function moduleCode(value){
    const m=module(value);
    return m?m.code:String(value||"").toUpperCase();
  }
  function territory(value){
    const t=" "+clean(value)+" ";
    if(!t.trim())return null;
    for(const key of Object.keys(TERRITORIES)){
      const x=TERRITORIES[key];
      if(x.markers.some(m=>t.includes(" "+clean(m)+" ")))return x;
    }
    return null;
  }

  global.DIGIY_TAXONOMY={
    version:"20260926-taxonomy-v1",
    modules:MODULES,
    territories:TERRITORIES,
    clean,
    module,
    moduleCode,
    territory
  };
})(window);
