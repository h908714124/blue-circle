import {Point} from './modules/Point.js';

const w = window.innerWidth - 4;
const h = window.innerHeight - 4;
const r = Math.min(w / 2.0, h / 2.0) - 40;
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
    ctx.fillRect(point.x, point.y, 2, 2); // draw 4 pixel
}