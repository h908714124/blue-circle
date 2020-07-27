import {Node} from "../model/Node";
import {Segment} from "../model/Segment";
import {Library} from "./Library";
import {State} from "./State";

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

  render(segments: Segment[], hover: Node): void {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
    const s = document.getElementById("segments");

    ctx.putImageData(this.imageData, 0, 0);

    s.innerHTML = "";

    for (let segment of segments) {
      ctx.beginPath();
      ctx.strokeStyle = '#faebd7';
      ctx.lineWidth = 1.5;
      const x0 = segment.a.x();
      const y0 = segment.a.y();
      const x1 = segment.b.x();
      const y1 = segment.b.y();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      const div: HTMLElement = document.createElement("tr");
      div.innerHTML = "<td>" + segment.a.i + "</td><td>" + segment.b.i + "</td>";
      s.appendChild(div);
    }
    this.renderHover(hover);
  }

  private renderHover(hover: Node): void {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    const active = this.state.activeNode();
    if (active !== undefined) {
      Library.renderNode(active, this.state.activeLevel(), false, ctx);
    }
    Library.renderNode(hover, 0, true, ctx);
  }
}
