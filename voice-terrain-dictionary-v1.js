/* LA VOIX : dictionnaire terrain additif, déterministe. Aucun appel réseau. */
(function(global){
'use strict';
const rules=[
  {
    "intent": "plumber",
    "family": "artisan",
    "specialty": "plumber",
    "canonical": "plombier",
    "expand": "plombier plomberie",
    "direct": [
      "plombier",
      "plomberie"
    ],
    "synonyms": [
      "débouchage",
      "tuyauterie"
    ],
    "expressions": [
      "mon lavabo est bouché",
      "j ai plus d eau",
      "je n ai plus d eau",
      "ça fuit",
      "lavabo bouché",
      "évier bouché",
      "wc bouché",
      "toilettes bouchées",
      "ndox mi",
      "robinet bi",
      "dama am fuite"
    ],
    "variants": [
      "plomb",
      "plombié",
      "plombiers"
    ],
    "signals": [
      [
        "lavabo",
        "évier",
        "wc",
        "toilettes",
        "canalisation",
        "robinet",
        "tuyau"
      ],
      [
        "bouché",
        "fuit",
        "fuite",
        "cassé",
        "réparer"
      ]
    ],
    "negative": [],
    "languages": [
      "fr",
      "wo"
    ],
    "territory": null
  },
  {
    "intent": "driver",
    "family": "transport",
    "specialty": "",
    "canonical": "chauffeur",
    "expand": "chauffeur transport",
    "direct": [
      "chauffeur",
      "taxi",
      "driver"
    ],
    "synonyms": [
      "transport",
      "transfert",
      "navette"
    ],
    "expressions": [
      "quelqu un pour me ramener",
      "quelqu un pour me récupérer",
      "quelqu un pour me chercher",
      "viens me chercher",
      "me déposer",
      "me ramener de l aéroport",
      "dama wut taxi",
      "taxi ci saly"
    ],
    "variants": [
      "chaufeur",
      "chofeur",
      "chauffeurs",
      "taxis"
    ],
    "signals": [
      [
        "aller",
        "récupérer",
        "ramener",
        "déposer"
      ],
      [
        "aéroport",
        "aibd",
        "gare",
        "saly",
        "mbour",
        "dakar",
        "ngaparou",
        "somone"
      ]
    ],
    "negative": [],
    "languages": [
      "fr",
      "wo"
    ],
    "territory": null
  },
  {
    "intent": "loc",
    "family": "accommodation",
    "specialty": "",
    "canonical": "logement",
    "expand": "logement chambre",
    "direct": [
      "logement",
      "chambre",
      "studio",
      "hébergement"
    ],
    "synonyms": [
      "nuitée",
      "auberge",
      "pension"
    ],
    "expressions": [
      "où dormir ce soir",
      "un toit pour ce soir",
      "chambre pas chère",
      "dama wut chambre",
      "fan laa man a fanaan"
    ],
    "variants": [
      "chambres",
      "logemen",
      "hebergement"
    ],
    "signals": [
      [
        "dormir",
        "louer",
        "passer"
      ],
      [
        "nuit",
        "soir",
        "weekend",
        "week",
        "end"
      ]
    ],
    "negative": [],
    "languages": [
      "fr",
      "wo"
    ],
    "territory": null
  },
  {
    "intent": "resto",
    "family": "food",
    "specialty": "",
    "canonical": "restaurant",
    "expand": "restaurant manger",
    "direct": [
      "restaurant",
      "resto",
      "snack"
    ],
    "synonyms": [
      "gargote",
      "dibiterie",
      "fast food"
    ],
    "expressions": [
      "j ai la dalle",
      "où on mange",
      "où manger",
      "dama bëgg lekk",
      "dama begg lekk",
      "dama xiif"
    ],
    "variants": [
      "restau",
      "restos",
      "restaurants"
    ],
    "signals": [
      [
        "manger",
        "repas",
        "déjeuner",
        "dîner"
      ],
      [
        "saly",
        "mbour",
        "soir",
        "midi",
        "emporter"
      ]
    ],
    "negative": [],
    "languages": [
      "fr",
      "wo"
    ],
    "territory": null
  },
  {
    "intent": "jobs",
    "family": "jobs",
    "specialty": "",
    "canonical": "emploi",
    "expand": "emploi recrutement",
    "direct": [
      "emploi",
      "jobs",
      "job",
      "recrutement"
    ],
    "synonyms": [
      "embauche",
      "petit boulot",
      "boulot"
    ],
    "expressions": [
      "qui recrute",
      "je cherche du taf",
      "dama wut liggéey",
      "dama wut liggeey"
    ],
    "variants": [
      "emplois",
      "boulots",
      "recrutemen"
    ],
    "signals": [
      [
        "cherche",
        "trouver",
        "besoin"
      ],
      [
        "travail",
        "boulot",
        "taf",
        "emploi"
      ]
    ],
    "negative": [],
    "languages": [
      "fr",
      "wo"
    ],
    "territory": null
  },
  {
    "intent": "announcements",
    "family": "announcements",
    "specialty": "",
    "canonical": "annonce",
    "expand": "annonce bonne affaire",
    "direct": [
      "annonce",
      "occasion",
      "bonne affaire"
    ],
    "synonyms": [
      "seconde main",
      "bon plan"
    ],
    "expressions": [
      "je veux vendre mon",
      "je vends mon",
      "à vendre d occasion",
      "a vendre d occasion"
    ],
    "variants": [
      "bonnes affaires",
      "ocasion",
      "annonces"
    ],
    "signals": [
      [
        "acheter",
        "vendre"
      ],
      [
        "occasion",
        "seconde",
        "main"
      ]
    ],
    "negative": [],
    "languages": [
      "fr",
      "wo"
    ],
    "territory": null
  },
  {
    "intent": "commerce",
    "family": "shopping",
    "specialty": "",
    "canonical": "commerce",
    "expand": "commerce boutique",
    "direct": [
      "boutique",
      "magasin",
      "commerce"
    ],
    "synonyms": [
      "épicerie",
      "supérette",
      "quincaillerie"
    ],
    "expressions": [
      "où acheter",
      "dama bëgg jënd",
      "dama begg jend"
    ],
    "variants": [
      "boutik",
      "boutiques",
      "magasins"
    ],
    "signals": [
      [
        "acheter",
        "trouver"
      ],
      [
        "chaussures",
        "vêtements",
        "tissu",
        "téléphone"
      ]
    ],
    "negative": [],
    "languages": [
      "fr",
      "wo"
    ],
    "territory": null
  },
  {
    "intent": "services",
    "family": "services",
    "specialty": "",
    "canonical": "services professionnels",
    "expand": "services professionnels",
    "direct": [
      "services pro",
      "services professionnels"
    ],
    "synonyms": [
      "prestataire",
      "secrétariat",
      "traduction"
    ],
    "expressions": [
      "aide pour mes papiers",
      "faire mes démarches",
      "quelqu un pour ma comptabilité"
    ],
    "variants": [
      "service pro"
    ],
    "signals": [],
    "negative": [],
    "languages": [
      "fr",
      "wo"
    ],
    "territory": null
  },
  {
    "intent": "health",
    "family": "health",
    "specialty": "",
    "canonical": "santé",
    "expand": "santé médecin",
    "direct": [
      "médecin",
      "docteur",
      "dentiste",
      "infirmier"
    ],
    "synonyms": [
      "centre de santé",
      "dispensaire",
      "consultation médicale"
    ],
    "expressions": [
      "voir un docteur",
      "dama wut docteur"
    ],
    "variants": [
      "medcin",
      "médecins"
    ],
    "signals": [],
    "negative": [],
    "languages": [
      "fr",
      "wo"
    ],
    "territory": null
  }
];
function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\u0600-\u06ff]+/g,' ').replace(/\s+/g,' ').trim()}
function contains(t,w){return !!w&&(' '+t+' ').includes(' '+norm(w)+' ')}
// Règle ciblée : restaurant est le secteur de l’emploi demandé, pas un repas.
function isJobsRestaurantContext(value){return /\b(?:emploi|travail|job|boulot)\s+(?:dans|dans un|dans une|dans le|dans la|en|au)\s+(?:restaurant|resto)\b/.test(norm(value))}
function resolve(value){
 const t=norm(value);if(!t)return [];
 return rules.flatMap(r=>{
  if(r.intent==='resto'&&isJobsRestaurantContext(t))return [];
  if(r.negative.some(w=>contains(t,w)))return [];
  let score=0,stage='',matched='';
  for(const [name,weight] of [['direct',100],['synonyms',85],['expressions',80],['variants',75]]){
   for(const w of r[name])if(contains(t,w)&&weight>score){score=weight;stage=name;matched=w}
  }
  if(!score&&r.signals.length&&r.signals.every(group=>group.some(w=>contains(t,w)))){score=60;stage='signals'}
  return score?[{intent:r.intent,family:r.family,specialty:r.specialty,canonical:r.canonical,expand:r.expand,score,stage,matched}]:[];
 }).sort((a,b)=>b.score-a.score);
}
function expand(value){const raw=String(value||'');return [raw,...resolve(raw).map(r=>r.expand)].join(' ')}
// Collecte volontaire en session, bornée et expurgée. Jamais envoyée au serveur.
const KEY='voice_unmatched_phrases_v1';let enabled=false;
function redact(v){return String(v||'').slice(0,500).replace(/https?:\/\/\S+/gi,'[lien]').replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,'[email]').replace(/(?:\+?\d[\s().-]*){7,}/g,'[numéro]')}
function read(){try{return JSON.parse(global.sessionStorage.getItem(KEY)||'[]')}catch(_){return []}}
function record(value,context){
 if(!enabled||!norm(value)||resolve(value).length)return null;
 context=context||{};const phrase=redact(value),rows=read();if(rows.some(r=>r.phrase===phrase))return null;
 const row={id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),phrase,transcription_raw:phrase,language:context.language||null,territory:context.territory||null,date:new Date().toISOString(),returned_intent:context.returnedIntent||null,score:null,corrected_intent:null};
 rows.push(row);try{global.sessionStorage.setItem(KEY,JSON.stringify(rows.slice(-50)))}catch(_){}return row;
}
global.DIGIY_VOICE_TERRAIN={version:'20261005-world8-v2',rules,norm,resolve,expand,isJobsRestaurantContext,unmatched:{enable(v){enabled=v===true},record,list:read,clear(){try{global.sessionStorage.removeItem(KEY)}catch(_){}}}};
})(window);
