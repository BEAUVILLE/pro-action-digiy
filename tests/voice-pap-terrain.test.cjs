const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=[{id:'mbaye',categorie:'BUILD',nom:'Mbaye',keys:['piscine'],priorite:100}];
const window={
  DIGIY_PUBLIC_DIRECTORY:base.slice(),
  DIGIY_GET_PUBLIC_DIRECTORY:()=>base.slice(),
  DIGIY_ANNUAIRE_PUBLIC:{fiches:base.slice()},
  DIGIY_ANNUAIRE_MULTI:{
    annuaire:base.slice(),
    chercherFiches:(q)=>q.includes('piscine')?base.slice():[],
    traiterDemande:(q)=>q.includes('piscine')?base.slice():[],
    toVoiceCard:x=>x
  },
  dispatchEvent:()=>{}
};
const ctx={window,CustomEvent:function(name,opts){this.type=name;this.detail=opts&&opts.detail}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('pap-piscine-action-pro-patch.js','utf8'),ctx);
const route=window.DIGIY_ANNUAIRE_MULTI;
assert.equal(route.chercherFiches('entretien piscine à Saly')[0].id,'pap-piscine-saly');
assert.equal(route.chercherFiches('jardinier à Saly')[0].id,'pap-piscine-saly');
assert.equal(route.chercherFiches('tonte de pelouse Petite Côte')[0].categorie,'TERRAIN');
assert(!route.chercherFiches('piscine à Dakar').some(x=>x.id==='pap-piscine-saly'));
assert(window.DIGIY_GET_PUBLIC_DIRECTORY().some(x=>x.id==='pap-piscine-saly'));
console.log('PAP Piscine terrain routing: PASS');
