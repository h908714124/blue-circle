import {Point} from './modules/Point.js';

const w = window.innerWidth - 4.0;
const h = window.innerHeight - 4.0;
const r = (Math.min(w, h) - 40.0) / 2.0;
const x0 = w / 2;
const y0 = h / 2;
const points = [];
for (let i = 0; i < 43; i++) {
    const phi = 2 * i * Math.PI * (1.0 / 43);
    const x = x0 + r * Math.cos(phi);
    const y = y0 + r * Math.sin(phi);
    points.push(new Point(x, y));
}


const canvas = document.getElementById('canvas');
canvas.width = w;
canvas.height = h;
const ctx = canvas.getContext("2d");

for (let point of points) {
    ctx.fillRect(point.x, point.y, point.w, point.h);
}


/*
canvas.onmousemove = function (e) {

    // important: correct mouse position:
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let r of points) {
        // add a single rect to path:
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.w, r.h);

        // check if we hover it, fill red, if not fill it blue
        ctx.fillStyle = ctx.isPointInPath(x, y) ? "red" : "blue";
        ctx.fill();
    }
};
*/

function findActive() {
    for (let r of points) {
        if (r.active) {
            return r;
        }
    }
    return undefined;
}

function findHover(e) {
    // important: correct mouse position:
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (let r of points) {
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.w, r.h);
        if (ctx.isPointInPath(x, y)) {
            return r;
        }
    }
    return undefined;
}

canvas.onmouseup = function (e) {

    const active = findActive();
    const hover = findHover(e);

    if (active) {
        active.active = false;
    }
    if (hover) {
        hover.active = true;
    }
    if (active === hover) {
        return;
    }

    if (active && hover) {
        ctx.beginPath();
        ctx.moveTo(active.centerX(), active.centerY());
        ctx.lineTo(hover.centerX(), hover.centerY());
        ctx.stroke();
    }

    for (let r of points) {
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.w, r.h);
        ctx.fillStyle = r.active ? "red" : "blue";
        ctx.fill();
    }
}