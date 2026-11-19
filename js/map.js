// ----- Map -----
const you = [55.6253, 12.0808]; 

const map = L.map("map").setView(you, 16);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// ----- Trees -----
const trees = [
    { name: "Roskilde Tekniske Skole", pos: [55.6249, 12.0812] },
    { name: "Pulsen", pos: [55.6258, 12.0797] },
    { name: "Ragnarock", pos: [55.6279, 12.0821] },
    { name: "Lydmuren", pos: [55.6286, 12.0838] },
    { name: "Rabalderparken", pos: [55.6271, 12.0871] },
    { name: "Musicon Nord", pos: [55.6297, 12.0856] },
    { name: "Musicon Syd", pos: [55.6231, 12.0838] },
    { name: "Ladetræ Øst", pos: [55.6252, 12.0902] },
    { name: "Ladetræ Vest", pos: [55.6263, 12.0762] },
    { name: "Ladetræ Syd", pos: [55.6224, 12.0789] }
];

// green pin
const treeIcon = L.divIcon({
    className: "",
    html: '<svg width="26" height="36" viewBox="0 0 26 36"><path d="M13 0C5.8 0 0 5.6 0 12.6 0 22 13 36 13 36s13-14 13-23.4C26 5.6 20.2 0 13 0Z" fill="#1c8a4a"/><circle cx="13" cy="12.5" r="4.5" fill="white"/></svg>',
    iconSize: [26, 36],
    iconAnchor: [13, 36],
    popupAnchor: [0, -32]
});

trees.forEach(function (tree) {
    L.marker(tree.pos, { icon: treeIcon }).addTo(map).bindPopup(tree.name);
});


// -----3 closest trees -----
const scanButton = document.getElementById("scan");
const nearestList = document.getElementById("nearest");

function showNearest(from) {
    trees.sort(function (a, b) {
        return map.distance(from, a.pos) - map.distance(from, b.pos);
    });

    nearestList.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        nearestList.innerHTML += '<li><span class="badge">GÅ</span><span class="name">' + trees[i].name + '</span></li>';
    }
}

scanButton.addEventListener("click", function () {
    showNearest(you);
    scanButton.textContent = "SCAN COMPLETE";
});


// ----- Search -----
const searchInput = document.getElementById("search");

searchInput.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;

    const text = searchInput.value.trim().toLowerCase();
    if (!text) return;

    searchInput.blur(); 

    const tree = trees.find(function (t) {
        return t.name.toLowerCase().includes(text);
    });
    if (tree) {
        map.flyTo(tree.pos, 18);
        showNearest(tree.pos);
        return;
    }

    const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1"
        + "&viewbox=12.03,55.66,12.13,55.60&bounded=1"
        + "&q=" + encodeURIComponent(text);

    fetch(url)
        .then(function (res) { return res.json(); })
        .then(function (results) {
            if (results.length === 0) {
                searchInput.value = "";
                searchInput.placeholder = "Ingen resultater";
                return;
            }
            const pos = [Number(results[0].lat), Number(results[0].lon)];
            map.flyTo(pos, 17);
            showNearest(pos);
        })
        .catch(function () {
            searchInput.value = "";
            searchInput.placeholder = "Ingen internet";
        });
});


searchInput.addEventListener("focus", function () {
    searchInput.placeholder = "Søg lokation";
});
