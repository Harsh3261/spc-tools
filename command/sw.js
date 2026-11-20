/* ISO 9001 Audit Guide offline copy. Caches the app's own files only. */
const CACHE = "qcmd-v3-guide";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon.svg"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x.startsWith("qcmd-") && x !== CACHE).map((x) => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  /* network first so updates show at once; cached copy only when offline */
  e.respondWith(fetch(e.request, { cache: "no-store" }).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return res; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match("./index.html"))));
});
