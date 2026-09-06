/* DIGIYLYFE — ACTION PRO · VOIX WOLOF LOCALE + ROUTE SANTE
 * Couche publique uniquement. Aucune logique de l'oreille privee n'est exposee ici.
 * FR : capture micro locale -> WAV PCM16/16 kHz -> moteur DIGIY local.
 * Autres langues : comportement existant conserve.
 */
(function(){
  'use strict';
  if(window.DIGIY_ACTION_HEALTH_ROUTE_V1)return;
  window.DIGIY_ACTION_HEALTH_ROUTE_V1=true;

  var WOLOF_ENDPOINT='http://127.0.0.1:8787/api/asr/public';
  var MAX_RECORD_MS=8000;
  var capture=null;
  var wolofButton=null;

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

  function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,' ').replace(/\s+/g,' ').trim()}
  function currentLang(){return String(document.documentElement.lang||'fr').slice(0,2).toLowerCase()}
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
  function text(el,value){if(el)el.textContent=value}

  function ensureStyle(){
    if(document.getElementById('digiy-wolof-local-style'))return;
    var style=document.createElement('style');
    style.id='digiy-wolof-local-style';
    style.textContent='#digiyWolofBtn{background:linear-gradient(135deg,#d8ffe6,#7ee6a7);color:#000;border-radius:21px;min-height:58px;font-size:17px;font-weight:1000;display:flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap;border:1px solid rgba(18,60,45,.13);box-shadow:0 10px 28px rgba(18,60,45,.08)}#digiyWolofBtn.listening{animation:digiyPulse 1s infinite;outline:3px solid rgba(22,129,67,.20)}#digiyWolofLocalResult{display:grid;gap:6px;padding:10px 12px;border:1px solid rgba(22,129,67,.22);border-radius:18px;background:rgba(216,255,230,.48);font-size:12px;line-height:1.35;color:#102f24;font-weight:850}#digiyWolofLocalResult[hidden]{display:none!important}#digiyWolofRaw{font-weight:900;word-break:break-word}#digiyWolofDecision{font-weight:1000}#digiyWolofAction{display:none;align-items:center;justify-content:center;min-height:40px;padding:0 12px;border-radius:14px;background:linear-gradient(135deg,#fff2bf,#f6c453);color:#102f24;font-weight:1000;text-decoration:none}';
    document.head.appendChild(style);
  }

  function ensureResultBox(){
    var box=document.getElementById('digiyWolofLocalResult');
    if(box)return box;
    box=document.createElement('div');
    box.id='digiyWolofLocalResult';
    box.hidden=true;
    box.innerHTML='<div id="digiyWolofRaw"></div><div id="digiyWolofDecision"></div><a id="digiyWolofAction" target="_blank" rel="noopener noreferrer"></a>';
    var status=document.getElementById('status');
    if(status&&status.parentNode)status.insertAdjacentElement('afterend',box);
    return box;
  }

  function setStatus(icon,label){
    var status=document.getElementById('status');
    if(!status)return;
    status.textContent=icon||'•';
    status.setAttribute('title',label||'');
    status.setAttribute('aria-label',label||'État micro');
  }

  function showLocalResult(data){
    var box=ensureResultBox();
    var rawEl=document.getElementById('digiyWolofRaw');
    var decisionEl=document.getElementById('digiyWolofDecision');
    var action=document.getElementById('digiyWolofAction');
    var raw=String(data&&data.rawText||'').trim();
    var d=data&&data.decision||{};
    box.hidden=false;
    text(rawEl,'Brut entendu (ASR local) : '+(raw||'—'));
    if(d.accepted){
      var parts=[d.canonicalFr,d.place,d.module].filter(Boolean);
      text(decisionEl,(parts.length?parts.join(' · ')+' — ':'')+'Décision DIGIY : comprise');
      setStatus('✅','Wolof local compris');
      var q=document.getElementById('q');
      if(q)q.value=[d.canonicalFr,d.place].filter(Boolean).join(' ')||raw;
      if(d.actionUrl){
        action.href=d.actionUrl;
        action.style.display='flex';
        action.textContent='OUVRIR '+String(d.module||'LA BONNE PORTE').replace(/^DIGIY\s+/i,'');
      }else{
        action.removeAttribute('href');
        action.style.display='none';
        action.textContent='';
      }
      setTimeout(function(){
        var search=document.getElementById('searchBtn');
        if(search)search.click();
      },80);
    }else{
      text(decisionEl,'Pas assez sûr. Redis-le plus simplement. · Décision DIGIY : à répéter');
      setStatus('❓','Wolof local à répéter');
      var q2=document.getElementById('q');
      if(q2)q2.value=raw;
      action.removeAttribute('href');
      action.style.display='none';
      action.textContent='';
    }
  }

  function showLocalError(message){
    var box=ensureResultBox();
    box.hidden=false;
    text(document.getElementById('digiyWolofRaw'),'Wolof local : '+message);
    text(document.getElementById('digiyWolofDecision'),'Aucun moteur vocal navigateur utilisé en secours.');
    var action=document.getElementById('digiyWolofAction');
    if(action){action.removeAttribute('href');action.style.display='none';action.textContent='';}
    setStatus('⚠️',message);
  }

  function mergeChunks(chunks){
    var total=chunks.reduce(function(n,c){return n+c.length},0);
    var out=new Float32Array(total),offset=0;
    chunks.forEach(function(c){out.set(c,offset);offset+=c.length});
    return out;
  }

  function downsample(inputRate,outputRate,samples){
    if(outputRate>=inputRate)return samples;
    var ratio=inputRate/outputRate;
    var length=Math.max(1,Math.round(samples.length/ratio));
    var result=new Float32Array(length);
    var resultOffset=0,inputOffset=0;
    while(resultOffset<result.length){
      var nextInputOffset=Math.round((resultOffset+1)*ratio);
      var accum=0,count=0;
      for(var i=inputOffset;i<nextInputOffset&&i<samples.length;i++){accum+=samples[i];count++;}
      result[resultOffset]=count?accum/count:0;
      resultOffset++;inputOffset=nextInputOffset;
    }
    return result;
  }

  function wavBlob(chunks,inputRate){
    var samples=downsample(inputRate,16000,mergeChunks(chunks));
    var buffer=new ArrayBuffer(44+samples.length*2);
    var view=new DataView(buffer);
    function writeString(offset,value){for(var i=0;i<value.length;i++)view.setUint8(offset+i,value.charCodeAt(i));}
    writeString(0,'RIFF');view.setUint32(4,36+samples.length*2,true);writeString(8,'WAVE');writeString(12,'fmt ');
    view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,16000,true);view.setUint32(28,32000,true);view.setUint16(32,2,true);view.setUint16(34,16,true);writeString(36,'data');view.setUint32(40,samples.length*2,true);
    var offset=44;
    for(var j=0;j<samples.length;j++,offset+=2){var s=Math.max(-1,Math.min(1,samples[j]));view.setInt16(offset,s<0?s*0x8000:s*0x7fff,true);}
    return new Blob([view],{type:'audio/wav'});
  }

  async function startWolofCapture(){
    if(capture)return stopWolofCapture(true);
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){showLocalError('micro local indisponible dans ce navigateur');return;}
    try{
      var stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
      var Ctx=window.AudioContext||window.webkitAudioContext;
      if(!Ctx){stream.getTracks().forEach(function(t){t.stop()});showLocalError('AudioContext indisponible');return;}
      var ctx=new Ctx();
      var source=ctx.createMediaStreamSource(stream);
      var processor=ctx.createScriptProcessor(4096,1,1);
      var zero=ctx.createGain();zero.gain.value=0;
      var chunks=[];
      processor.onaudioprocess=function(e){chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));};
      source.connect(processor);processor.connect(zero);zero.connect(ctx.destination);
      capture={stream:stream,ctx:ctx,source:source,processor:processor,zero:zero,chunks:chunks,timer:null};
      if(wolofButton)wolofButton.classList.add('listening');
      setStatus('👂','Wolof local · écoute');
      var box=ensureResultBox();box.hidden=true;
      capture.timer=setTimeout(function(){stopWolofCapture(true)},MAX_RECORD_MS);
    }catch(err){
      showLocalError(err&&err.name==='NotAllowedError'?'autorisation micro refusée':'impossible de démarrer le micro local');
    }
  }

  async function stopWolofCapture(send){
    var c=capture;if(!c)return;
    capture=null;
    clearTimeout(c.timer);
    if(wolofButton)wolofButton.classList.remove('listening');
    try{c.processor.disconnect();c.source.disconnect();c.zero.disconnect();}catch(_e){}
    try{c.stream.getTracks().forEach(function(t){t.stop()});}catch(_e2){}
    var blob=null;
    try{blob=wavBlob(c.chunks,c.ctx.sampleRate||48000);}catch(_e3){}
    try{await c.ctx.close();}catch(_e4){}
    if(!send||!blob){setStatus('•','Prêt');return;}
    if(blob.size<1000){showLocalError('enregistrement trop court');return;}
    setStatus('⏳','Wolof local · analyse');
    try{
      var controller=new AbortController();
      var timeout=setTimeout(function(){controller.abort()},15000);
      var response=await fetch(WOLOF_ENDPOINT,{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',headers:{'Content-Type':'audio/wav'},body:blob,signal:controller.signal});
      clearTimeout(timeout);
      var data=await response.json().catch(function(){return {error:'réponse locale invalide'}});
      if(!response.ok)throw new Error(data&&data.error||('HTTP '+response.status));
      showLocalResult(data);
    }catch(err){
      showLocalError('moteur DIGIY Wolof local indisponible sur cet appareil');
    }
  }

  function installWolofButton(){
    ensureStyle();ensureResultBox();
    var original=document.getElementById('listenBtn')||document.getElementById('digiyWolofBtn');
    if(!original)return;
    if(original.id==='listenBtn'&&!original.dataset.digiyWolofClone){
      var clone=original.cloneNode(true);
      clone.dataset.digiyWolofClone='1';
      original.replaceWith(clone);
      original=clone;
    }
    wolofButton=original;
    if(currentLang()==='fr'){
      wolofButton.id='digiyWolofBtn';
      wolofButton.setAttribute('aria-label','Parler en Wolof local');
      text(wolofButton.querySelector('span'),'PARLER WOLOF');
    }else{
      if(capture)stopWolofCapture(false);
      wolofButton.id='listenBtn';
    }
  }

  /* Capture avant le routeur SANTE : le bouton Wolof ne doit jamais tomber dans l'ancien moteur vocal. */
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('#digiyWolofBtn');if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();
    startWolofCapture();
  },true);

  /* Route SANTE conservee pour saisie/clavier et resultats textes. */
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

  function refreshActionProVoiceUI(){
    installWolofButton();
    if(currentLang()!=='fr')return;

    var listen=document.getElementById('digiyWolofBtn');
    var search=document.getElementById('searchBtn');
    var field=document.getElementById('q')||document.querySelector('textarea');
    var float=document.getElementById('audioFloat');
    var audioText=document.getElementById('audioText');
    var resultTitle=document.querySelector('.resultTitle');
    var resultIntro=document.querySelector('.resultIntro');
    var consigne=document.querySelector('.consignesLine span');

    if(listen){listen.setAttribute('aria-label','Parler en Wolof local');text(listen.querySelector('span'),'PARLER WOLOF');}
    if(search){search.setAttribute('aria-label','Trouver les fiches utiles');text(search.querySelector('span'),'TROUVER');}
    if(field)field.setAttribute('placeholder','PARLE WOLOF OU ÉCRIS TON BESOIN');
    if(float)text(float.querySelector('span'),'AIDE');
    if(consigne)consigne.innerHTML='📱 Appuie sur <b>PARLER WOLOF</b>, dis ton besoin, puis DIGIY comprend et remonte la bonne fiche. Le brut entendu reste visible.';
    if(audioText)audioText.textContent='Bienvenue dans La Voix du Business DIGIY. En français, le bouton PARLER WOLOF utilise ton moteur DIGIY local. Le brut entendu reste visible. DIGIY comprend le besoin et remonte la bonne fiche. Aucun moteur vocal navigateur n’est utilisé en secours.';
    text(resultTitle,'Fiches utiles');
    text(resultIntro,'Les fiches utiles remontent directement après la décision DIGIY.');

    document.querySelectorAll('.examplePhrase').forEach(function(btn){
      var q=String(btn.getAttribute('data-q')||'').trim();
      var wo=btn.querySelector('.wo');
      if(wo&&WOLOF_EXAMPLES[q])wo.textContent=WOLOF_EXAMPLES[q];
    });
  }

  refreshActionProVoiceUI();
  setTimeout(refreshActionProVoiceUI,0);
  setTimeout(refreshActionProVoiceUI,600);

  try{
    new MutationObserver(function(){setTimeout(refreshActionProVoiceUI,0)}).observe(document.documentElement,{attributes:true,attributeFilter:['lang','data-digiy-lang']});
  }catch(_e){}

  document.addEventListener('digiy:language-applied',function(){setTimeout(refreshActionProVoiceUI,0)});
  document.addEventListener('click',function(){setTimeout(refreshActionProVoiceUI,0)},false);

  window.DIGIY_ACTION_HEALTH_ROUTE={isHealth:isHealth,target:target,route:route};
  window.DIGIY_WOLOF_LOCAL_PUBLIC={start:startWolofCapture,stop:function(){return stopWolofCapture(true)},endpoint:WOLOF_ENDPOINT};
})();