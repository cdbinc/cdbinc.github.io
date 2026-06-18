/* CDB Studio — Service Worker (network-first, sans danger pour les données live)
   ---------------------------------------------------------------------------
   • JAMAIS de cache pour /api/* ni pour relay.json : ce sont des données admin
     en direct (états de chantiers, approbations, factures…). Toujours réseau.
   • Tout ce qui est cross-origin (le tunnel Cloudflare, raw.githubusercontent)
     passe directement au réseau, sans interception.
   • Pour la coquille de l'app (HTML/CSS/JS/images same-origin) : NETWORK-FIRST.
     On tente le réseau, on met le cache à jour, et on ne sert le cache QUE si
     le réseau échoue (mode hors-ligne). Les données restent donc fraîches.
   Pour publier une nouvelle version : changer le numéro de CACHE ci-dessous. */
var CACHE = "cdb-studio-v1";
var SHELL = [
  "./",
  "./index.html",
  "./leads.html",
  "./manifest.webmanifest",
  "./brand-logo.png",
  "../config.js"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // add() individuel + catch : un asset manquant ne casse pas l'install.
      return Promise.all(SHELL.map(function (u) {
        return c.add(new Request(u, { cache: "reload" })).catch(function () {});
      }));
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;                      // mutations -> réseau direct
  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;       // tunnel / cross-origin -> réseau
  if (url.pathname.indexOf("/api/") !== -1) return;      // API live -> jamais de cache
  if (/relay\.json$/.test(url.pathname)) return;         // URL du relais -> toujours frais

  // NETWORK-FIRST.
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok && res.type === "basic") {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        if (hit) return hit;
        if (req.mode === "navigate") return caches.match("./index.html");
        return new Response("", { status: 504, statusText: "Hors ligne" });
      });
    })
  );
});
