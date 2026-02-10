const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");


function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);


const scale = Math.min(canvas.width, canvas.height) / 40;

window.particles = [];
const particles = window.particles;


function heart(t) {
    return {
        x: 16 * Math.sin(t) ** 3,
        y: -(13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t))
    };
}

for (let t = 0; t < Math.PI * 2; t += 0.0025) {
    for (let i = 0; i < 3; i++) {


        const p = heart(t);
        const offset = (Math.random() - 0.5) * 1.6;


        particles.push({
            x0: canvas.width / 2 + (p.x + offset) * scale,
            y0: canvas.height / 2 + (p.y + offset) * scale,


            x: canvas.width / 2 + (p.x + offset) * scale,
            y: canvas.height / 2 + (p.y + offset) * scale,


            vx: 0,
            vy: 0,


            phase: Math.random() * Math.PI * 2,
            size: Math.random() * 0.7 + 0.4,
            depth: Math.random(),


            morph: 0,
            img: null,


            explodedOnce: false,
            canBeImage: false,
            imageAssigned: false,
            group: Math.random(),
            life: 0,


            stopPower: 0.02 + Math.random() * 0.12 
        });
    }
}

const IMAGE_COUNT = 1000;
const shuffled = [...particles].sort(() => Math.random() - 0.5);


for (let i = 0; i < IMAGE_COUNT; i++) {
    shuffled[i].canBeImage = true;
}

function drawHeart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    for (const p of particles) {


        if (window.exploded && !p.explodedOnce) {
            p.life = 0;


            const dx = p.x - canvas.width / 2;
            const dy = p.y - canvas.height / 2;
            const angle = Math.atan2(dy, dx);


            const force =
                (Math.random() * 14 + 10) *
                (0.6 + p.depth * 1.4);


            p.vx = Math.cos(angle) * force;
            p.vy = Math.sin(angle) * force;


            if (p.canBeImage && !p.imageAssigned) {
                if (window.images && window.images.length > 0) {
                    p.img =
                        window.images[
                            Math.floor(Math.random() * window.images.length)
                        ];
                    p.imageAssigned = true;
                }
            }


            p.explodedOnce = true;
        }


        if (!window.exploded) {
            p.explodedOnce = false;
            p.imageAssigned = false;
            p.img = null;
        }


        if (window.exploded) {


            p.x += p.vx;
            p.y += p.vy;



            p.vx *= 0.94;
            p.vy *= 0.94;

            if (Math.abs(p.vx) < p.stopPower) p.vx = 0;
            if (Math.abs(p.vy) < p.stopPower) p.vy = 0;
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;


            const dxC = p.x - cx;
            const dyC = p.y - cy;
            const dist = Math.sqrt(dxC * dxC + dyC * dyC);


            const minDist = 140;


            if (dist < minDist) {
                const push = (minDist - dist) * 0.018;
                p.vx += (dxC / dist) * push;
                p.vy += (dyC / dist) * push;
            }


        } else {
            const dx = p.x0 - p.x;
            const dy = p.y0 - p.y;


            p.x += dx * 0.12;
            p.y += dy * 0.12;
        }

        if (window.exploded && p.img) {
            const t = performance.now() - window.explodeTime;
            if (t > 600) {
                p.morph += 0.035;
                if (p.morph > 1) p.morph = 1;
            }
        } else {
            p.morph -= 0.06;
            if (p.morph < 0) p.morph = 0;
        }

        const wobble = Math.sin(Date.now() * 0.002 + p.phase) * 1.1;
        const x = p.x + wobble;
        const y = p.y + wobble;

        if (p.morph < 1) {
            const r = 6 + p.depth * 4;
            const g = ctx.createRadialGradient(x, y, 0, x, y, r);


            g.addColorStop(0, "rgba(255,180,220,1)");
            g.addColorStop(0.5, "rgba(255,100,180,0.9)");
            g.addColorStop(1, "rgba(180,40,120,0)");


            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }


        // ===== ẢNH =====
        if (p.morph > 0 && p.img) {
            const depthScale = 0.5 + p.depth * 0.8;


            ctx.globalAlpha = p.morph * depthScale;


            const size = 40 * depthScale;


            ctx.drawImage(
                p.img,
                x - size / 2,
                y - size / 2,
                size,
                size
            );


            ctx.globalAlpha = 1;
        }
    }


    requestAnimationFrame(drawHeart);
}


drawHeart();



