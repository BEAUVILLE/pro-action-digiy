/* DIGIYLYFE — ACTION PRO / LA VOIX → MASTER SANTÉ canonique V1
 * Orientation uniquement. Aucun diagnostic, aucune prescription, aucune fiche fictive.
 */
(function(){
  'use strict';
  if(window.DIGIY_ACTION_HEALTH_ROUTE_V1)return;
  window.DIGIY_ACTION_HEALTH_ROUTE_V1=true;

  var WORDS=[
    'sante','santé','soin','soins','medecin','médecin','docteur','dentiste','infirmier','infirmiere','infirmière','sage femme','sage-femme','aide a la personne','aide à la personne',
    'health','care','doctor','dentist','nurse','midwife',
    'salud','cuidados','medico','médico','enfermero','enfermera','matrona',
    'saude','saúde','cuidados','médico','enfermeiro','parteira',
    'gesundheit','pflege','arzt','zahnarzt','hebamme',
    'salute','assistenza','medico','infermiere','ostetrica',
    'gezondheid','zorg','arts','tandarts','verpleegkundige','verloskundige',
    'الصحة','الرعاية','طبيب','ممرض','قابلة'
  ];

  function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,' ').replace(/\s+/g,' ').trim()}
  function input(){
    var el=document.getElementById('q')||document.querySelector('textarea,input[type="search"],input[type="text"]');
    return String(el&&(el.value||el.textContent)||'').trim();
  }
  function isHealth(v){var t=norm(v);return WORDS.some(function(w){return t.indexOf(norm(w))!==-1})}
  function territory(v){
    var t=norm(v),q=new URLSearchParams(location.search),known=q.get('territory')||q.get('zone')||'';
    if(known)return known;
    if(/\b(sarlat|dordogne)\b/.test(t))return 'vallee-dordogne';
    if(/\bbordeaux\b/.test(t))return 'bordeaux';
    if(/\bdakar\b/.test(t))return 'dakar';
    if(/\b(saly|mbour|ngaparou|somone|petite cote)\b/.test(t))return 'petite-cote';
    return '';
  }
  function lang(){var q=new URLSearchParams(location.search),l=(q.get('lang')||document.documentElement.lang||'fr').slice(0,2).toLowerCase();return ['fr','en','es','pt','de','it','nl','ar'].indexOf(l)>=0?l:'fr'}
  function target(v){var u=new URL('https://digiylyfe.com/sante-master.html'),z=territory(v);if(z)u.searchParams.set('territory',z);u.searchParams.set('lang',lang());return u.toString()}
  function route(v){if(!isHealth(v))return false;location.href=target(v);return true}

  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('button,a,[role="button"]');if(!b)return;
    var label=norm(b.textContent||b.getAttribute('aria-label')||'');
    if(!/(go|voir|cherch|search|action|ecout|listen|guid)/.test(label))return;
    var v=input();if(!v||!isHealth(v))return;
    e.preventDefault();e.stopImmediatePropagation();route(v);
  },true);

  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter')return;var v=input();if(!v||!isHealth(v))return;
    e.preventDefault();e.stopImmediatePropagation();route(v);
  },true);

  window.DIGIY_ACTION_HEALTH_ROUTE={isHealth:isHealth,target:target,route:route};
})();