(function(){
  "use strict";
  const SESSION_KEY = "DIGIY_ACTION_PRO_SESSION";
  const HOURS = 8;
  const now = Date.now();
  function valid(){
    try{
      const s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || "null");
      return s && s.ok === true && s.until && now < Number(s.until);
    }catch(e){ return false; }
  }
  if(!valid()){
    const back = encodeURIComponent(location.pathname.split('/').pop() || 'pro.html');
    location.replace("./pin.html?back=" + back);
  }
})();
