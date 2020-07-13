import {Point} from './modules/Point.js';
import {Segment} from './modules/Segment.js';

const color_inactive = "#000000";
const color_active = "red";
const color_hover = "blue";

const w = window.innerWidth - 4.0;
const h = window.innerHeight - 4.0;
const r = (Math.min(w, h) - 40.0) / 2.0;

const x0 = w / 2;
const y0 = h / 2;
const points = [];
const segments = [];
const N = 17; // how many dots to draw

for (let i = 0; i < N; i++) {
    const phi = 2 * i * Math.PI * (1.0 / N);
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
canvas.onmousemove = function (e) {
    const hover = findHover(e);

    for (let r of points) {
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.w, r.h);
        ctx.fillStyle = r === hover ? color_hover : r.active ? color_active : color_inactive;
        ctx.fill();
    }
};

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
    let bestP = undefined;
    let bestD = 35000;
    for (let p of points) {
        const d = (x - p.x - p.w / 2.0) * (x - p.x - p.w / 2.0) + (y - p.y - p.h / 2.0) * (y - p.y - p.h / 2.0);
        if (d < bestD) {
            bestD = d;
            bestP = p;
        }
    }
    return bestP;
}

function findSegment(a, b) {
    for (let i = 0; i < segments.length; i++) {
        let segment = segments[i];
        if ((segment.a === a && segment.b === b) || (segment.a === b && segment.b === a)) {
            return i;
        }
    }
    return undefined;
}

canvas.onmouseup = function (e) {

    const active = findActive();
    const hover = findHover(e);

    if (hover) {
        hover.active = true;
    }
    if (active) {
        active.active = false;
    }
    if (active === hover) {
        return;
    }

    if (active && hover) {
        const i = findSegment(active, hover);
        if (i !== undefined) {
            segments.splice(i, 1);
        } else {
            segments.push(new Segment(active, hover));
        }
        hover.active = false;
    }

    render();
}

function render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let segment of segments) {
        ctx.beginPath();
        ctx.moveTo(segment.a.centerX(), segment.a.centerY());
        ctx.lineTo(segment.b.centerX(), segment.b.centerY());
        ctx.stroke();
    }

    for (let r of points) {
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.w, r.h);
        ctx.fillStyle = r.active ? color_active : color_inactive;
        ctx.fill();
    }
}
