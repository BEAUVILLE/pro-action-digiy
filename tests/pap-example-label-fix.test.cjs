const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');

function row(){
  const line={textContent:''};
  return {attrs:{},line,setAttribute(k,v){this.attrs[k]=v},querySelector(sel){return sel==='.fr'?line:null}};
}
const examples=[row(),row(),row()];
const chips=Array.from({length:9},()=>row());
const listeners={};
const document={
  readyState:'complete',
  documentElement:{lang:'fr',getAttribute(k){return k==='data-digiy-lang'?'fr':null}},
  querySelectorAll(sel){
    if(sel==='.examplePhrase[data-q]')return examples;
    if(sel==='.chip[data-q]')return chips;
    return [];
  },
  addEventListener(name,fn){listeners[name]=fn}
};
const context={document,setTimeout(fn){fn()}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('pap-piscine-example-label-fix.js','utf8'),context);

assert.equal(examples[0].attrs['data-q'],'Je cherche un entretien piscine à Saly');
assert.equal(examples[0].line.textContent,'Je cherche un entretien piscine à Saly');
assert.equal(examples[1].attrs['data-q'],'Je cherche un jardinier à Saly');
assert.equal(examples[1].line.textContent,'Je cherche un jardinier à Saly');
assert.equal(chips[8].attrs['data-q'],'Je cherche un entretien piscine à Saly');

console.log('PAP example labels: PASS');
