const CACHE_NAME='action-pro-pwa-20260926-p4-v2';
const APP_SHELL=[
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/offline.html',
  '/icon-action-pro.svg',
  '/digiy-taxonomy-v1.js',
  '/annuaire-public-digiy.js',
  '/annuaire-public-digiy-core.js',
  '/voice-territory-rails-v1.js',
  '/voice-territory-intent-filter-v1.js',
  '/subscription-public-gate.js',
  '/action-pro-health-route-v1.js',
  '/digiy-observability-v1.js'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(APP_SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);

  /* Les dépendances externes ne sont jamais nécessaires au moteur métier local.
     On ne les met donc pas dans le cache critique. */
  if(url.origin!==self.location.origin)return;

  if(event.request.mode==='navigate'){
    event.respondWith(
      fetch(event.request)
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put('/index.html',copy));
          return response;
        })
        .catch(()=>caches.match('/index.html').then(response=>response||caches.match('/offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached=>{
      const network=fetch(event.request).then(response=>{
        if(response&&response.ok){
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
        }
        return response;
      }).catch(()=>cached);
      return cached||network;
    })
  );
});
