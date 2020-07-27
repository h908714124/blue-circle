import {Node} from "../model/Node";
import {Library} from "./Library";
import {State} from "./State";
import {Graph} from "../model/Graph";

export class RenderUtil {

  readonly points: Node[];
  readonly canvas: HTMLCanvasElement;
  readonly imageData: ImageData;
  private readonly state: State;

  constructor(points: Node[], canvas: HTMLCanvasElement, imageData: ImageData, state: State) {
    this.points = points;
    this.canvas = canvas;
    this.imageData = imageData;
    this.state = state;
  }

  render(segments: Graph, hover: Node): void {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    const s = document.getElementById('segments');

    ctx.putImageData(this.imageData, 0, 0);

    s.innerHTML = "";

    segments.forEach(((x, y) => {
      ctx.beginPath();
      ctx.strokeStyle = '#faebd7';
      ctx.lineWidth = 1.5;
      let a = this.points[x];
      let b = this.points[y];
      const x0 = a.x();
      const y0 = a.y();
      const x1 = b.x();
      const y1 = b.y();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      const div: HTMLElement = document.createElement("tr");
      div.innerHTML = "<td>" + a.i + "</td><td>" + b.i + "</td>";
      s.appendChild(div);
    }));
    this.renderHover(hover);
  }

  private renderHover(hover: Node): void {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    const active: Node = this.state.activeNode();
    if (active !== undefined) {
      Library.renderNode(active, this.state.activeLevel(), false, ctx);
    }
    Library.renderNode(hover, active === hover ? this.state.activeLevel() : 0, true, ctx);
    if (active === undefined) {
      return;
    }
    if (active !== hover) {
      ctx.strokeStyle = '#fdfd54';
      ctx.lineWidth = 1.5;
      const x0 = active.x();
      const y0 = active.y();
      const x1 = hover.x();
      const y1 = hover.y();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
  }
}
