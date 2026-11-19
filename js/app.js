// Registers the service worker (sw.js) so the browser lets you install/download the site as an app.

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js")
            .then(function () {
                console.log("Service worker registered - the app can be installed");
            })
            .catch(function (err) {
                console.log("Service worker failed:", err);
            });
    });
}
