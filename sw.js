const CACHE = 'meal-archive-v2';
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

// 앱 껍데기(html/css/js)는 "네트워크 우선": 새 버전이 있으면 항상 그걸 먼저 쓰고,
// 인터넷이 안 될 때만 저장해둔 캐시로 대신 보여준다.
// Apps Script API 호출은 캐시하지 않고 항상 네트워크로 직접 보낸다.
self.addEventListener('fetch', e=>{
  const url = e.request.url;
  if(url.includes('script.google.com')) return;

  e.respondWith(
    fetch(e.request)
      .then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=> c.put(e.request, copy));
        return res;
      })
      .catch(()=> caches.match(e.request))
  );
});
