import {Point} from "../model/Point";
import {Segment} from "../model/Segment";
import {Library} from "./Library";

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

  render(segments: Segment[]): void {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
    const s = document.getElementById("segments");

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    s.innerHTML = "";

    for (let segment of segments) {
      ctx.beginPath();
      ctx.strokeStyle = '#faebd7';
      ctx.lineWidth = 1.5;
      ctx.moveTo(segment.a.x, segment.a.y);
      ctx.lineTo(segment.b.x, segment.b.y);
      ctx.stroke();
      const div: HTMLElement = document.createElement("tr");
      div.innerHTML = "<td>" + segment.a.i + "</td><td>" + segment.b.i + "</td>";
      s.appendChild(div);
    }
    this.renderHover(undefined);
  }

  renderHover(hover: Point): void {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
    for (let r of this.points) {
      ctx.beginPath();
      ctx.arc(r.x, r.y, Library.R, 0, tau);
      ctx.fillStyle = r.active() === 2 ? color_active2 : r.active() === 1 ? color_active : r === hover ? color_hover : color_inactive;
      ctx.fill();
      ctx.font = "12px Arial";
      ctx.fillStyle = r.active() === 2 ? "#000000" : "#ffffff";
      let number = r.i < 10 ? 4 : 7;
      ctx.fillText("" + r.i, r.x - number, r.y + 5);
    }
  }
}
