import {Point} from './modules/Point.js';

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const r = Math.min(canvas.width / 2.0, canvas.height / 2.0) - 40;
const x0 = canvas.width / 2;
const y0 = canvas.height / 2;
const points = [];
for (let i = 0; i < 43; i++) {
    const phi = 2 * i * Math.PI * (1.0 / 43);
    const x = x0 + r * Math.cos(phi);
    const y = y0 + r * Math.sin(phi);
    points.push(new Point(x, y));
}

for (let point of points) {
    ctx.fillRect(point.x, point.y, 2, 2); // draw 4 pixel
}