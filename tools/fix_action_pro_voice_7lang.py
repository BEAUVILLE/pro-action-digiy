from pathlib import Path

INDEX = Path("index.html")
html = INDEX.read_text(encoding="utf-8")

old_build = 'action-pro-7lang-monofichier-20260731-v1'
new_build = 'action-pro-7lang-monofichier-20260731-v2-voice'
html = html.replace(old_build, new_build, 1)

old_speak = '''  function speakOwn(text){
    if(!NativeUtterance||!("speechSynthesis"in window))return;
    window.speechSynthesis.cancel();const u=new NativeUtterance(text);u.lang=locale();u.rate=actual()==="ar"?.84:.9;window.__DIGIY_NATIVE_SPEAK__(u);
  }
'''

new_speak = '''  function bestVoiceForLocale(code){
    const voices=window.speechSynthesis?.getVoices?.()||[];
    const wanted=String(code||"fr-FR").toLowerCase();
    const base=wanted.split("-")[0];
    return voices.find(function(v){return String(v.lang||"").toLowerCase()===wanted&&v.localService})
      ||voices.find(function(v){return String(v.lang||"").toLowerCase()===wanted})
      ||voices.find(function(v){return String(v.lang||"").toLowerCase().startsWith(base)&&v.localService})
      ||voices.find(function(v){return String(v.lang||"").toLowerCase().startsWith(base)})
      ||null;
  }

  function speakOwn(text){
    if(!text||!NativeUtterance||!("speechSynthesis"in window))return;
    const engine=window.speechSynthesis;
    const start=function(){
      const u=new NativeUtterance(String(text));
      u.lang=locale();
      u.rate=actual()==="ar"?.84:.9;
      u.pitch=1;
      u.volume=1;
      const selected=bestVoiceForLocale(u.lang);
      if(selected)u.voice=selected;
      (window.__DIGIY_NATIVE_SPEAK__||engine.speak.bind(engine))(u);
    };
    try{engine.cancel()}catch(_){}
    /* Safari/iPhone a souvent besoin d'un court délai après cancel(). */
    setTimeout(start,45);
  }
'''

if old_speak not in html:
    raise SystemExit("Bloc speakOwn introuvable")
html = html.replace(old_speak, new_speak, 1)

anchor = '''  const NativeRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(NativeRecognition){
    function WrappedRecognition(){
      const recognition=new NativeRecognition();
      return new Proxy(recognition,{set:function(target,property,value){target[property]=property==="lang"?locale():value;return true}});
    }
    WrappedRecognition.prototype=NativeRecognition.prototype;
    window.SpeechRecognition=WrappedRecognition;window.webkitSpeechRecognition=WrappedRecognition;
  }

'''

replacement = '''  const NativeRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  let sevenLangRecognition=null;

  function setVoiceStatus(icon,label){
    const status=document.getElementById("status");
    if(status){
      status.textContent=icon;
      status.title=label;
      status.setAttribute("aria-label",label);
    }
  }

  function stopSevenLangRecognition(){
    try{sevenLangRecognition&&sevenLangRecognition.stop()}catch(_){}
    sevenLangRecognition=null;
    document.getElementById("listenBtn")?.classList.remove("listening");
  }

  function startSevenLangRecognition(){
    const field=document.getElementById("q");
    const button=document.getElementById("listenBtn");
    field?.focus();

    if(sevenLangRecognition){
      stopSevenLangRecognition();
      return;
    }

    if(!NativeRecognition){
      setVoiceStatus("⌨️",actual()==="en"?"Browser microphone unavailable: use the keyboard microphone.":"Micro navigateur indisponible : utilise le micro du clavier.");
      return;
    }

    try{
      const recognition=new NativeRecognition();
      sevenLangRecognition=recognition;
      recognition.lang=locale();
      recognition.continuous=false;
      recognition.interimResults=true;
      recognition.maxAlternatives=1;
      button?.classList.add("listening");
      setVoiceStatus("👂",(UI[actual()]||UI.fr).label);

      recognition.onresult=function(event){
        let transcript="";
        for(let i=event.resultIndex;i<event.results.length;i++){
          transcript+=event.results[i][0].transcript||"";
        }
        if(field&&transcript.trim())field.value=transcript.trim();
      };

      recognition.onerror=function(event){
        button?.classList.remove("listening");
        sevenLangRecognition=null;
        setVoiceStatus("⚠️",event&&event.error?"Micro : "+event.error:"Micro arrêté");
      };

      recognition.onend=function(){
        button?.classList.remove("listening");
        sevenLangRecognition=null;
        if(field&&field.value.trim()){
          document.getElementById("searchBtn")?.click();
        }else{
          setVoiceStatus("•",actual()==="en"?"Ready":"Prêt");
        }
      };

      recognition.start();
    }catch(error){
      button?.classList.remove("listening");
      sevenLangRecognition=null;
      setVoiceStatus("⚠️",actual()==="en"?"Microphone not started":"Micro non lancé");
    }
  }

'''

if anchor not in html:
    raise SystemExit("Bloc reconnaissance introuvable")
html = html.replace(anchor, replacement, 1)

click_anchor = '''    if(target.dataset.lang7){event.preventDefault();event.stopImmediatePropagation();setLanguage(target.dataset.lang7);return}
    const lang=actual(),u=UI[lang]||UI.fr;
'''
click_replacement = '''    if(target.dataset.lang7){event.preventDefault();event.stopImmediatePropagation();setLanguage(target.dataset.lang7);return}
    if(target.id==="listenBtn"){
      event.preventDefault();
      event.stopImmediatePropagation();
      startSevenLangRecognition();
      return;
    }
    const lang=actual(),u=UI[lang]||UI.fr;
'''

if click_anchor not in html:
    raise SystemExit("Gestionnaire de clic introuvable")
html = html.replace(click_anchor, click_replacement, 1)

checks = [
    new_build in html,
    'recognition.lang=locale();' in html,
    'target.id==="listenBtn"' in html,
    'bestVoiceForLocale' in html,
    '<iframe' not in html.lower(),
]
if not all(checks):
    raise SystemExit("Contrôle vocal échoué")

INDEX.write_text(html, encoding="utf-8")
print("Correctif vocal natif 7 langues appliqué")
