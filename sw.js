const CACHE = 'meal-archive-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

// 앱 껍데기(html/css/js)만 캐시하고, Apps Script API 호출은 항상 네트워크로 보낸다.
self.addEventListener('fetch', e=>{
  const url = e.request.url;
  if(url.includes('script.google.com')) return;
  e.respondWith(
    caches.match(e.request).then(cached=> cached || fetch(e.request))
  );
});
