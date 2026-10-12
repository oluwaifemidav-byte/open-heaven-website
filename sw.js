const CACHE_NAME = "open-heavens-v3";
const ASSETS = ["./", "index.html", "church-online.html", "styles.css", "script.js", "church-online.js", "church-config.js", "assets/church-logo.png", "assets/home-worship.png"];
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))));
self.addEventListener("activate", (event) => event.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", (event) => { if (event.request.method === "GET") event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request))); });
