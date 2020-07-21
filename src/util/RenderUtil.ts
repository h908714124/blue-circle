import {Point} from "../model/Point";

const color_inactive: string = "#000000";
const color_active2: string = "yellow";
const color_active: string = "red";
const color_hover: string = "blue";

const tau = 2 * Math.PI;

export class RenderUtil {

  points: Point[];
  canvas: HTMLCanvasElement;

  constructor(points: Point[], canvas: HTMLCanvasElement) {
    this.points = points;
    this.canvas = canvas;
  }

  renderHover(hover: Point): void {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
    for (let r of this.points) {
      ctx.beginPath();
      ctx.arc(r.centerX, r.centerY, r.w, 0, tau);
      ctx.fillStyle = r.active() === 2 ? color_active2 : r.active() === 1 ? color_active : r === hover ? color_hover : color_inactive;
      ctx.fill();
      ctx.font = "12px Arial";
      ctx.fillStyle = r.active() === 2 ? "#000000" : "#ffffff";
      ctx.fillText("" + r.i, r.x + 4, r.y + 14);
    }
  }
}
