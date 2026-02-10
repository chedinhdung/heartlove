window.exploded = false;
window.explodeTime = 0;

window.images = [];

for (let i = 1; i <= 10; i++) {
    const img = new Image();

    img.onload = () => {
        console.log("✔ loaded:", img.src);
    };

    img.onerror = () => {
        console.error("❌ load fail:", img.src);
    };

    img.src = "images/snoopy" + i + ".png";
    window.images.push(img);
}

window.addEventListener("mousedown", () => {
    window.exploded = !window.exploded;

    if (window.exploded === true) {
        window.explodeTime = performance.now();
    }
});

window.addEventListener("touchstart", (e) => {
    e.preventDefault(); 
    window.exploded = !window.exploded;

    if (window.exploded === true) {
        window.explodeTime = performance.now();
    }
}, { passive: false });
