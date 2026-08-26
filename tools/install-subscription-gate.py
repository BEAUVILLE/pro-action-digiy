from pathlib import Path

path = Path('index.html')
s = path.read_text(encoding='utf-8')

old_loader = './annuaire-public-digiy.js?v=20260731-routing-v4-4'
new_loader = './annuaire-public-digiy.js?v=20260826-subscription-gate-v1'
if old_loader in s:
    s = s.replace(old_loader, new_loader, 1)
elif new_loader not in s:
    raise SystemExit('Loader ACTION PRO attendu introuvable')

old_url = 'const DIGIY_SUPABASE_URL = "REMPLACER_SUPABASE_URL";'
new_url = 'const DIGIY_SUPABASE_URL = "https://wesqmwjjtsefyjnluosj.supabase.co";'
if old_url in s:
    s = s.replace(old_url, new_url, 1)
elif new_url not in s:
    raise SystemExit('Placeholder URL Supabase introuvable')

old_key = 'const DIGIY_SUPABASE_ANON_KEY = "REMPLACER_SUPABASE_ANON_KEY";'
new_key = 'const DIGIY_SUPABASE_ANON_KEY = "sb_publishable_2KVRayr3oWcewu0Y7xMkOQ_D6522h1E";'
if old_key in s:
    s = s.replace(old_key, new_key, 1)
elif new_key not in s:
    raise SystemExit('Placeholder clé publique Supabase introuvable')

start_marker = '  async function matchCardsPublic(text){'
end_marker = '\n\n  const $ = (id) => document.getElementById(id);'
start = s.find(start_marker)
end = s.find(end_marker, start)
if start < 0 or end < 0:
    raise SystemExit('Bloc matchCardsPublic introuvable')

new_gate = r'''  function digiyNormalizePublicUrl(value){
    const raw = String(value || "").trim();
    if(!raw || raw === "#") return "";
    try{
      const u = new URL(raw, window.location.origin);
      const cleanPath = u.pathname.replace(/\/+$/, "") || "";
      return (u.origin + cleanPath).toLowerCase();
    }catch(_){
      return raw.split("?")[0].split("#")[0].replace(/\/+$/, "").toLowerCase();
    }
  }

  let digiyPublicGateCache = {at:0, urls:null};

  async function digiyAllowedPublicUrls(){
    const now = Date.now();
    if(digiyPublicGateCache.urls && (now - digiyPublicGateCache.at) < 60000){
      return digiyPublicGateCache.urls;
    }

    const sb = digiySupabaseClient();
    if(!sb) throw new Error("Supabase public gate unavailable");

    try{
      const {data, error} = await sb
        .from("digiy_annuaire_public")
        .select("public_url");

      if(error) throw error;

      const urls = new Set(
        (Array.isArray(data) ? data : [])
          .map(row => digiyNormalizePublicUrl(row && row.public_url))
          .filter(Boolean)
      );

      digiyPublicGateCache = {at:now, urls};
      return urls;
    }catch(err){
      if(digiyPublicGateCache.urls) return digiyPublicGateCache.urls;
      throw err;
    }
  }

  function digiyAuthorizeDirectoryList(list, allowedUrls){
    const source = Array.isArray(list) ? list : [];
    if(!(allowedUrls instanceof Set)){
      return source.filter(item => item && item.kind !== "directory");
    }
    return source.filter(item => {
      if(!item || item.kind !== "directory") return !!item;
      const url = digiyNormalizePublicUrl(item.url);
      return !!url && allowedUrls.has(url);
    });
  }

  function digiyGenericLocalCards(text){
    const t = clean(digiyExpandQuery(text));
    if(!t) return [];
    return DATA.filter(item => item.keys.some(k => t.includes(clean(k)))).slice(0,4);
  }

  async function matchCardsPublic(text){
    const val = String(text || "").trim();
    if(!val) return [];

    const sb = digiySupabaseClient();
    let allowedUrls = null;

    try{
      allowedUrls = await digiyAllowedPublicUrls();
    }catch(err){
      console.warn("DIGIY gate public indisponible : fiches locales fermées par sécurité.", err);
      setStatus("⚠️", digiyLang() === "en" ? "Public membership gate unavailable" : "Contrôle adhésion indisponible");
    }

    const localDirectFirst = digiyAuthorizeDirectoryList(matchDirectFiches(val), allowedUrls);
    if(localDirectFirst.length) return localDirectFirst.slice(0,4);

    if(sb){
      try{
        setStatus("⏳", digiyLang() === "en" ? "DIGIY memory" : "Mémoire DIGIY");
        const {data, error} = await sb.rpc(DIGIY_RPC_NAME, {
          p_query: digiyExpandQuery(val),
          p_limit: 8
        });

        if(error) throw error;

        const rows = Array.isArray(data) ? data : [];
        const mapped = rows.map(digiyRpcCardFromRow).filter(Boolean);
        const mappedDirectRaw = mapped.filter(x => x && x.kind === "directory");
        const mappedDirect = allowedUrls instanceof Set
          ? digiyAuthorizeDirectoryList(mappedDirectRaw, allowedUrls)
          : mappedDirectRaw;
        if(mappedDirect.length) return mappedDirect.slice(0,4);

        if(mapped.length){
          const localBackup = digiyAuthorizeDirectoryList(matchCards(val), allowedUrls);
          if(localBackup.length) return localBackup.slice(0,4);
          const safeRoutes = mapped.filter(x => x && x.kind !== "directory");
          if(safeRoutes.length) return safeRoutes.slice(0,4);
        }
      }catch(err){
        console.warn("DIGIY RPC indisponible : aucune ancienne fiche locale n'est ouverte sans validation Supabase.", err);
        setStatus("⚠️", digiyLang() === "en" ? "Memory unavailable · safe module backup" : "Mémoire indisponible · secours modules");
      }
    }

    return digiyGenericLocalCards(val);
  }'''

s = s[:start] + new_gate + s[end:]

old_reply = '  function digiyBuildReply(raw) {\n    const list = matchCards(raw || "");\n    const directMsg = responseDirecte(raw || "", list);'
new_reply = '  function digiyBuildReply(raw) {\n    /* La parole synchrone ne cite plus une ancienne fiche locale avant validation Supabase. */\n    const list = [];\n    const directMsg = responseDirecte(raw || "", list);'
if old_reply in s:
    s = s.replace(old_reply, new_reply, 1)
elif new_reply not in s:
    raise SystemExit('Bloc digiyBuildReply attendu introuvable')

old_build = '<meta name="digiy-build" content="action-pro-7lang-monofichier-20260731-v4-4-astou-direct"/>'
new_build = '<meta name="digiy-build" content="action-pro-supabase-subscription-gate-v1-20260826"/>'
if old_build in s:
    s = s.replace(old_build, new_build, 1)
elif new_build not in s:
    raise SystemExit('Marqueur build attendu introuvable')

for token in ('REMPLACER_SUPABASE_URL', 'REMPLACER_SUPABASE_ANON_KEY', 'Supabase peut ensuite renforcer, mais ne doit pas bloquer une fiche directe.'):
    if token in s:
        raise SystemExit(f'Ancien token encore présent: {token}')

for token in ('digiyAllowedPublicUrls', 'digiyAuthorizeDirectoryList', '20260826-subscription-gate-v1', 'action-pro-supabase-subscription-gate-v1-20260826'):
    if token not in s:
        raise SystemExit(f'Nouveau verrou absent: {token}')

path.write_text(s, encoding='utf-8')
print('PATCH_SUBSCRIPTION_GATE_OK')
