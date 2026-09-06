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
    if(!/(go|voir|parl|trouv|cherch|search|action|ecout|listen|guid)/.test(label))return;
    var v=input();if(!v||!isHealth(v))return;
    e.preventDefault();e.stopImmediatePropagation();route(v);
  },true);

  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter')return;var v=input();if(!v||!isHealth(v))return;
    e.preventDefault();e.stopImmediatePropagation();route(v);
  },true);

  /* Couche publique ACTION PRO — vocabulaire aligné terrain.
   * Aucune logique de l'oreille privée n'est exposée ici.
   */
  var WOLOF_EXAMPLES={
    'Je cherche un plombier à Saly':'Damay set plombier Saly.',
    'Je cherche un entrepreneur maçon à Saly':'Damay set maçon Saly.',
    'Je cherche un électricien à Saly':'Damay set électricien Saly.',
    'Je cherche du solaire à Dakar':'Damay set solaire Dakar.',
    'Je cherche des serviettes à Saly':'Damay set serviettes Saly.',
    'Je cherche un appartement à Saly pour 4 personnes':'Damay set appartement Saly ngir ñeenti nit.',
    'Je cherche un chauffeur pour AIBD':'Damay set chauffeur AIBD.',
    'Je veux une idée de sortie sur la Petite Côte':'Damay set activité Petite Côte.',
    'Je veux réserver une table ce soir':'Damay set table resto.',
    'Je cherche un restaurant à Sarlat':'Damay set restaurant Sarlat.',
    'Je cherche une chambre à Sarlat':'Damay set chambre Sarlat.',
    'Je veux envoyer une preuve Wave':'Damay bëgg yónnee preuve Wave.'
  };

  function currentLang(){return String(document.documentElement.lang||'fr').slice(0,2).toLowerCase()}
  function text(el,value){if(el)el.textContent=value}

  function refreshActionProVoiceUI(){
    if(currentLang()!=='fr')return;

    var listen=document.getElementById('listenBtn');
    var search=document.getElementById('searchBtn');
    var field=document.getElementById('q')||document.querySelector('textarea');
    var float=document.getElementById('audioFloat');
    var audioText=document.getElementById('audioText');
    var resultTitle=document.querySelector('.resultTitle');
    var resultIntro=document.querySelector('.resultIntro');
    var consigne=document.querySelector('.consignesLine span');

    if(listen){
      listen.setAttribute('aria-label','Parler maintenant');
      text(listen.querySelector('span'),'PARLER');
    }
    if(search){
      search.setAttribute('aria-label','Trouver les fiches utiles');
      text(search.querySelector('span'),'TROUVER');
    }
    if(field)field.setAttribute('placeholder','PARLE OU ÉCRIS TON BESOIN');
    if(float)text(float.querySelector('span'),'PARLER');
    if(consigne)consigne.innerHTML='📱 Besoin d’aide ? Appuie sur <b>PARLER</b>, dis ton besoin, puis touche <b>TROUVER</b> — DIGIY comprend, la bonne fiche remonte.';
    if(audioText)audioText.textContent='Bienvenue dans La Voix du Business DIGIY. Appuie sur PARLER pour dire ton besoin naturellement, ou choisis une icône rapide. Puis touche TROUVER. DIGIY comprend le besoin, la bonne fiche remonte et le contact reste direct. DIGIY prépare. Le professionnel valide. Le terrain garde la main.';
    text(resultTitle,'Fiches utiles');
    text(resultIntro,'Les fiches utiles remontent directement après la demande.');

    document.querySelectorAll('.examplePhrase').forEach(function(btn){
      var q=String(btn.getAttribute('data-q')||'').trim();
      var wo=btn.querySelector('.wo');
      if(wo&&WOLOF_EXAMPLES[q])wo.textContent=WOLOF_EXAMPLES[q];
    });
  }

  refreshActionProVoiceUI();

  try{
    new MutationObserver(function(){refreshActionProVoiceUI()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang','data-digiy-lang']});
  }catch(_e){}

  document.addEventListener('click',function(){
    setTimeout(refreshActionProVoiceUI,0);
  },false);

  window.DIGIY_ACTION_HEALTH_ROUTE={isHealth:isHealth,target:target,route:route};
})();