/* DIGIYLYFE — Verrou central de publication publique — Supabase décide — 2026-08-26 */
(function(global){
  "use strict";

  var SUPABASE_URL = "https://wesqmwjjtsefyjnluosj.supabase.co";
  var SUPABASE_PUBLISHABLE_KEY = "sb_publishable_2KVRayr3oWcewu0Y7xMkOQ_D6522h1E";
  var ENDPOINT = SUPABASE_URL + "/rest/v1/digiy_annuaire_public?select=public_url";

  function normalizeUrl(value){
    var raw = String(value || "").trim();
    if(!raw || raw === "#") return "";
    try{
      var u = new URL(raw, global.location && global.location.href ? global.location.href : undefined);
      var path = u.pathname.replace(/\/+$/, "");
      return (u.origin + path).toLowerCase();
    }catch(_){
      return raw.split("?")[0].split("#")[0].replace(/\/+$/, "").toLowerCase();
    }
  }

  var allowedUrls = new Set();
  var gateReady = false;

  try{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", ENDPOINT, false);
    xhr.setRequestHeader("apikey", SUPABASE_PUBLISHABLE_KEY);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send(null);

    if(xhr.status >= 200 && xhr.status < 300){
      var rows = JSON.parse(xhr.responseText || "[]");
      if(Array.isArray(rows)){
        rows.forEach(function(row){
          var url = normalizeUrl(row && row.public_url);
          if(url) allowedUrls.add(url);
        });
        gateReady = true;
      }
    }
  }catch(err){
    gateReady = false;
    try{ console.warn("DIGIY public gate indisponible : fiches directes fermées par sécurité.", err); }catch(_){}
  }

  function filterDirectory(source){
    var list = Array.isArray(source) ? source : [];
    if(!gateReady) return [];

    return list.filter(function(item){
      if(!item || item.public === false) return false;
      var url = normalizeUrl(item.url || item.public_url || item.publicUrl);
      return !!url && allowedUrls.has(url);
    });
  }

  var previousGetter = typeof global.DIGIY_GET_PUBLIC_DIRECTORY === "function"
    ? global.DIGIY_GET_PUBLIC_DIRECTORY.bind(global)
    : null;

  global.DIGIY_GET_PUBLIC_DIRECTORY = function(){
    var base = [];
    try{
      if(previousGetter) base = previousGetter();
      else if(Array.isArray(global.DIGIY_PUBLIC_DIRECTORY)) base = global.DIGIY_PUBLIC_DIRECTORY;
      else if(global.DIGIY_ANNUAIRE_PUBLIC && Array.isArray(global.DIGIY_ANNUAIRE_PUBLIC.fiches)) base = global.DIGIY_ANNUAIRE_PUBLIC.fiches;
    }catch(_){
      base = [];
    }
    return filterDirectory(base);
  };

  if(Array.isArray(global.DIGIY_PUBLIC_DIRECTORY)){
    global.DIGIY_PUBLIC_DIRECTORY = filterDirectory(global.DIGIY_PUBLIC_DIRECTORY);
  }

  if(global.DIGIY_ANNUAIRE_PUBLIC && Array.isArray(global.DIGIY_ANNUAIRE_PUBLIC.fiches)){
    global.DIGIY_ANNUAIRE_PUBLIC.fiches = filterDirectory(global.DIGIY_ANNUAIRE_PUBLIC.fiches);
  }

  global.DIGIY_PUBLIC_MEMBERSHIP_GATE = {
    version: "20260826-subscription-gate-v1",
    ready: gateReady,
    allowedCount: allowedUrls.size
  };
})(window);
