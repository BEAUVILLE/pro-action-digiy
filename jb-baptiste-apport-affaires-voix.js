/* DIGIYLYFE · LA VOIX · Jean-Baptiste, projet pilote d'apport d'affaires.
 * Les requêtes de métiers techniques restent orientées vers les vrais exécutants.
 */
(function(g){
'use strict';
var P={
 id:'jb-baptiste-services-pro',
 source_id:'1c2092cc-9498-407f-8568-039095fb95d3',
 kind:'directory',public:true,icon:'🤝',
 nom:'Jean-Baptiste',title:'Jean-Baptiste — Apporteur d’affaires à Saly',
 metier:'Apporteur d’affaires indépendant',
 activite:'Mise en relation commerciale · Construction · Études · Fournisseurs',
 categorie:'SERVICES PROFESSIONNELS',
 sousCategorie:'mise en relation commerciale',
 secteur:'Saly · Petite Côte',zones:['Saly','Petite Côte'],
 statut:'presence_pilote',labelStatut:'Pilote DIGIY · Mise en relation',
 priorite:40,priority:40,
 phone:'221771342889',whatsapp:'221771342889',
 url:'https://master-site-digiylyfe.digiylyfe.com/test-apport-affaires-001/',
 cardImageUrl:'https://master-site-digiylyfe.digiylyfe.com/test-apport-affaires-001/photos/hero-connexion.svg',
 description:'À Saly, Jean-Baptiste étudie les demandes et peut rechercher un constructeur, un bureau d’études ou un fournisseur adapté. Les professionnels assurent directement devis, contrat et prestations.',
 keys:[
  'jean-baptiste apporteur','jean baptiste apporteur','jb baptiste apporteur',
  'apporteur affaires','apporteur d’affaires','apporteur d affaires',
  'apport d affaires','apport d’affaires','mise en relation commerciale',
  'intermédiaire commercial','intermediaire commercial','trouver un fournisseur',
  'mettre en relation avec un constructeur'
 ],
 wa:'Bonjour Jean-Baptiste, je vous contacte depuis DIGIY pour une mise en relation commerciale.'
};
function add(source){
 var a=Array.isArray(source)?source.slice():[];
 var i=a.findIndex(function(x){return x&&x.id===P.id});
 if(i<0)a.push(P);else a[i]=P;
 return a;
}
var prev=typeof g.DIGIY_GET_PUBLIC_DIRECTORY==='function'
 ?g.DIGIY_GET_PUBLIC_DIRECTORY.bind(g):null;
g.DIGIY_GET_PUBLIC_DIRECTORY=function(){
 var a=[];try{a=prev?prev():g.DIGIY_PUBLIC_DIRECTORY}catch(_){a=g.DIGIY_PUBLIC_DIRECTORY}
 return add(a);
};
g.DIGIY_PUBLIC_DIRECTORY=add(g.DIGIY_PUBLIC_DIRECTORY);
if(g.DIGIY_ANNUAIRE_PUBLIC&&Array.isArray(g.DIGIY_ANNUAIRE_PUBLIC.fiches))
 g.DIGIY_ANNUAIRE_PUBLIC.fiches=add(g.DIGIY_ANNUAIRE_PUBLIC.fiches);
if(g.DIGIY_ANNUAIRE_MULTI&&Array.isArray(g.DIGIY_ANNUAIRE_MULTI.annuaire))
 g.DIGIY_ANNUAIRE_MULTI.annuaire=add(g.DIGIY_ANNUAIRE_MULTI.annuaire);
})(window);
