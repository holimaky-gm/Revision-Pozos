/* Pozos sépticos: copia local para trabajar sin señal. Alcance limitado a esta carpeta. */
const V = 'pozos-septicos-v1';
const BASE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(BASE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('pozos-septicos-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const clave = u.origin + u.pathname;
  e.respondWith(caches.open(V).then(async c => {
    const guardada = await c.match(clave);
    const red = fetch(e.request).then(r => { if (r.ok) c.put(clave, r.clone()); return r; }).catch(() => guardada || Response.error());
    if (guardada) { e.waitUntil(red.catch(() => {})); return guardada; }
    return red;
  }));
});
