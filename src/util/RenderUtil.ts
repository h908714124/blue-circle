import {Node} from "../model/Node";
import {Library} from "./Library";
import {State} from "./State";
import {Graph} from "../model/Graph";
import {Segment} from "../model/Segment";

export class RenderUtil {

  private readonly canvas: HTMLCanvasElement;
  private readonly imageData: ImageData;
  private readonly state: State;
  private readonly graph: Graph;

  private readonly colorRed = '#fa2f38';
  private readonly colorWhite = '#faebd7';
  private readonly colorYellow = '#fdfd54';

  constructor(canvas: HTMLCanvasElement, imageData: ImageData, state: State, graph: Graph) {
    this.canvas = canvas;
    this.imageData = imageData;
    this.state = state;
    this.graph = graph;
  }


  render(hover: Node, segmentHover: Segment): void {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    const s = document.getElementById('segments');

    ctx.putImageData(this.imageData, 0, 0);

    s.innerHTML = "";

    this.graph.forEach((t => {
      ctx.beginPath();
      ctx.strokeStyle = t === segmentHover ? this.colorRed : this.colorWhite;
      ctx.lineWidth = 1.5;
      let a = t.a;
      let b = t.b;
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
    if (segmentHover === undefined) {
      this.renderHover(hover);
    }
  }

  private renderHover(hover: Node): void {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    const active: Node = this.state.activeNode();
    if (active !== undefined) {
      Library.renderNode(active, this.state.activeLevel(), false, ctx);
    }
    if (hover !== undefined) {
      Library.renderNode(hover, active === hover ? this.state.activeLevel() : 0, true, ctx);
    }
    if (active === undefined) {
      return;
    }
    if (active !== hover && hover !== undefined) {
      if (!this.state.deleteMode && !this.graph.hasSegment(active.i, hover.i) ||
        this.state.deleteMode && this.graph.hasSegment(active.i, hover.i)) {
        ctx.strokeStyle = this.state.deleteMode ? this.colorRed : this.colorYellow;
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
}
