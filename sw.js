const CACHE = "powerhub-v3";


const FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./css/style.css",
    "./js/script.js",
    "./js/map.js",
    "./js/app.js",
    "./img/PowerHub (hvid).png",
    "./img/blad menu.png",
    "./img/appikon.png",
    "./img/icon-192.png",
    "./img/icon-512.png",
    "./media/træ.glb"
];


self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE).then(function (cache) {
            return cache.addAll(FILES);
        })
    );
    self.skipWaiting();
});


self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.filter(function (key) {
                return key !== CACHE;
            }).map(function (key) {
                return caches.delete(key);
            }));
        })
    );
    self.clients.claim();
});


self.addEventListener("fetch", function (e) {
    if (e.request.method !== "GET") return;

    e.respondWith(
        fetch(e.request).then(function (response) {
          
            if (response.ok && e.request.url.startsWith(self.location.origin)) {
                const copy = response.clone();
                caches.open(CACHE).then(function (cache) {
                    cache.put(e.request, copy);
                });
            }
            return response;
        }).catch(function () {
            return caches.match(e.request).then(function (saved) {
        
                if (!saved && e.request.mode === "navigate") {
                    return caches.match("./index.html");
                }
                return saved;
            });
        })
    );
});
