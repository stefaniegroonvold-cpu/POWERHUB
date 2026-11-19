// ----- Menu -----
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
const menuClose = document.getElementById("menu_close");

menuBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    menu.classList.toggle("open");
});

menuClose.addEventListener("click", function () {
    menu.classList.remove("open");
});

// close the menu when you click outside it
document.addEventListener("click", function (e) {
    if (!menu.contains(e.target)) {
        menu.classList.remove("open");
    }
});


// ----- Bottom sheet -----
const sheet = document.getElementById("sheet");
const sheetHandle = document.getElementById("sheet-handle");
let startY = 0;

// tap the handle to open/close
sheetHandle.addEventListener("click", function () {
    sheet.classList.toggle("closed");
});

// swipe down to close, swipe up to open
sheet.addEventListener("touchstart", function (e) {
    startY = e.touches[0].clientY;
});

sheet.addEventListener("touchend", function (e) {
    const endY = e.changedTouches[0].clientY;

    if (endY - startY > 40) {
        sheet.classList.add("closed");
    }
    if (startY - endY > 40) {
        sheet.classList.remove("closed");
    }
});


// ----- Compass -----
const compass = document.getElementById("compass");
const dial = document.getElementById("compass-dial");
const letters = dial.querySelectorAll("text");

function turnCompass(e) {
    let heading;

    if (typeof e.webkitCompassHeading === "number") {
        heading = e.webkitCompassHeading; // iPhone
    } else if (e.absolute && e.alpha !== null) {
        heading = 360 - e.alpha; // Android
    } else {
        return;
    }

    dial.style.transform = "rotate(" + -heading + "deg)";
    letters.forEach(function (letter) {
        letter.style.transform = "rotate(" + heading + "deg)";
    });

    compass.classList.add("live");
}

window.addEventListener("deviceorientationabsolute", turnCompass);
window.addEventListener("deviceorientation", turnCompass);

// IPHONE
compass.addEventListener("click", function () {
    if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
        DeviceOrientationEvent.requestPermission().catch(function (err) {
            console.log("Compass permission failed:", err);
        });
    }
});
