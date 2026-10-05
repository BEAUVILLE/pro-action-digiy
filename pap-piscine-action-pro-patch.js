/* DIGIYLYFE — PAP Piscine · Services terrain · additif LA VOIX — 2026-10-05 */
(function(global){
'use strict';
var PAP={
  id:"pap-piscine-saly",
  kind:"directory",
  public:true,
  icon:"💧",
  nom:"PAP Piscine",
  title:"PAP Piscine — Piscine & jardinage à Saly",
  metier:"pisciniste · jardinier",
  activite:"Entretien piscine · rénovation · jardinage · espaces verts",
  categorie:"TERRAIN",
  sousCategorie:"piscine-jardinage",
  secteur:"Saly et alentours · Petite Côte",
  zones:["Saly","Ngaparou","Somone","Mbour","Petite Côte"],
  statut:"fiche_officielle",
  labelStatut:"Fiche officielle DIGIYLYFE · Services terrain",
  priorite:140,
  priority:140,
  phone:"221784547029",
  whatsapp:"221784547029",
  url:"https://digiylyfe.com/fiches/pap-piscine-saly.html",
  cardImageUrl:"https://digiylyfe.com/assets/pap-piscine-fiche-officielle.webp",
  description:"Entretien de piscines, nettoyage, traitement de l’eau, rénovation, réparation et jardinage chez les particuliers à Saly et alentours.",
  keys:[
    "pap piscine","piscine","pisciniste","entretien piscine","nettoyage piscine","traitement eau piscine",
    "renovation piscine","réparation piscine","reparation piscine","filtration piscine",
    "jardin","jardinage","jardinier","espaces verts","entretien jardin","tonte","pelouse",
    "taille haie","taille des haies","arbustes","palmiers","desherbage","désherbage",
    "saly","petite cote","petite côte"
  ],
  wa:"Bonjour PAP Piscine, je vous contacte depuis DIGIYLYFE pour une prestation piscine ou jardinage."
};
function norm(v){return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim()}
function match(text){
  var t=norm(text);
  if(!t)return false;
  if(/\b(dakar|aibd|sarlat|miami|casablanca|marrakech)\b/.test(t)&&!/\b(saly|petite cote)\b/.test(t))return false;
  return /\b(pap piscine|pisciniste|piscine|jardinage|jardinier|jardin|tonte|pelouse|haie|haies|espaces verts|desherbage|palmiers)\b/.test(t);
}
function addPap(list){
  var a=Array.isArray(list)?list.slice():[];
  var i=a.findIndex(function(x){return x&&x.id===PAP.id});
  if(i>=0)a[i]=PAP;else a.unshift(PAP);
  return a;
}
var oldGetter=typeof global.DIGIY_GET_PUBLIC_DIRECTORY==="function"?global.DIGIY_GET_PUBLIC_DIRECTORY.bind(global):null;
global.DIGIY_GET_PUBLIC_DIRECTORY=function(){var base=[];try{base=oldGetter?oldGetter():global.DIGIY_PUBLIC_DIRECTORY}catch(_){base=global.DIGIY_PUBLIC_DIRECTORY}return addPap(base)};
global.DIGIY_PUBLIC_DIRECTORY=addPap(global.DIGIY_PUBLIC_DIRECTORY);
if(global.DIGIY_ANNUAIRE_PUBLIC)global.DIGIY_ANNUAIRE_PUBLIC.fiches=addPap(global.DIGIY_ANNUAIRE_PUBLIC.fiches);
var route=global.DIGIY_ANNUAIRE_MULTI;
if(route){
  route.annuaire=addPap(route.annuaire);
  var oldSearch=typeof route.chercherFiches==="function"?route.chercherFiches.bind(route):null;
  route.chercherFiches=function(demande,options){
    var base=oldSearch?oldSearch(demande,options)||[]:[];
    if(!match(demande))return base;
    var result=base.filter(function(x){return x&&x.id!==PAP.id});
    result.unshift(Object.assign({},PAP,{_score:2140}));
    var limit=Number((options&&options.limit)||6);
    return result.slice(0,limit);
  };
  route.traiterDemande=function(demande,options){return route.chercherFiches(demande,options)};
  global.DIGIY_ROUTE_DIRECTE=route;
  if(typeof route.toVoiceCard==="function"){
    global.matchDirectFiches=function(text){return route.chercherFiches(text,{limit:6,fallback:false}).map(route.toVoiceCard)};
  }
}
try{global.dispatchEvent(new CustomEvent("digiy:pap-piscine-ready",{detail:{id:PAP.id,module:"TERRAIN"}}))}catch(_){}
})(window);
