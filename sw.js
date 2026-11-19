// Service worker: makes the site installable and lets it open without internet.

const CACHE = "powerhub-v2";

// The files the app needs to start
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
    "./img/appikon.png"
];

// Save the files when the service worker is installed
self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE).then(function (cache) {
            return cache.addAll(FILES);
        })
    );
    self.skipWaiting();
});

// Delete old caches when CACHE gets a new name (e.g. "powerhub-v2")
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

// Try the internet first (so you always see your newest changes).
// If there is no internet, use the saved copy.
self.addEventListener("fetch", function (e) {
    if (e.request.method !== "GET") return;

    e.respondWith(
        fetch(e.request).then(function (response) {
            // save a copy of our own files for next time
            if (response.ok && e.request.url.startsWith(self.location.origin)) {
                const copy = response.clone();
                caches.open(CACHE).then(function (cache) {
                    cache.put(e.request, copy);
                });
            }
            return response;
        }).catch(function () {
            return caches.match(e.request);
        })
    );
});
