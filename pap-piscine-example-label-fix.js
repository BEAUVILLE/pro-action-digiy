/* DIGIYLYFE — PAP Piscine · correction libellés exemples multilingues */
(function(){
  "use strict";
  const EXAMPLES={
    fr:["Je cherche un entretien piscine à Saly","Je cherche un jardinier à Saly"],
    en:["I am looking for pool maintenance in Saly","I am looking for a gardener in Saly"],
    es:["Busco mantenimiento de piscina en Saly","Busco un jardinero en Saly"],
    pt:["Procuro manutenção de piscina em Saly","Procuro um jardineiro em Saly"],
    de:["Ich suche Poolpflege in Saly","Ich suche einen Gärtner in Saly"],
    it:["Cerco manutenzione piscina a Saly","Cerco un giardiniere a Saly"],
    nl:["Ik zoek zwembadonderhoud in Saly","Ik zoek een tuinier in Saly"],
    ar:["أبحث عن صيانة مسبح في سالي","أبحث عن بستاني في سالي"]
  };
  const QUICK={
    fr:"Je cherche un entretien piscine à Saly",
    en:"I am looking for pool maintenance in Saly",
    es:"Busco mantenimiento de piscina en Saly",
    pt:"Procuro manutenção de piscina em Saly",
    de:"Ich suche Poolpflege in Saly",
    it:"Cerco manutenzione piscina a Saly",
    nl:"Ik zoek zwembadonderhoud in Saly",
    ar:"أبحث عن صيانة مسبح في سالي"
  };
  function lang(){
    return (document.documentElement.getAttribute("data-digiy-lang")||document.documentElement.lang||"fr").slice(0,2).toLowerCase();
  }
  function apply(){
    const l=EXAMPLES[lang()]?lang():"fr";
    const rows=document.querySelectorAll(".examplePhrase[data-q]");
    [0,1].forEach(function(i){
      const row=rows[i],text=EXAMPLES[l][i];
      if(!row)return;
      row.setAttribute("data-q",text);
      const line=row.querySelector(".fr");
      if(line)line.textContent=text;
    });
    const quick=document.querySelectorAll(".chip[data-q]")[8];
    if(quick){
      quick.setAttribute("data-q",QUICK[l]);
      quick.setAttribute("aria-label",QUICK[l]);
      quick.title=QUICK[l];
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",apply);else apply();
  document.addEventListener("digiy:language-applied",apply);
  setTimeout(apply,0);
  setTimeout(apply,150);
})();
