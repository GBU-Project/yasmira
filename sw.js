/* Yasmira Mart: aplikasi tetap jalan tanpa internet setelah pertama kali dibuka.
   Naikkan angka VERSI saat file index.html diganti supaya HP mengambil versi baru. */
const VERSI = "yasmira-v1";
const FILE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSI).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (r.mode === "navigate") {
    /* halaman: coba internet dulu (agar pembaruan masuk), cadangan dari cache bila offline */
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(VERSI).then(c => c.put("./index.html", cp)); return res; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { const cp = res.clone(); caches.open(VERSI).then(c => c.put(r, cp)); return res; })));
});
