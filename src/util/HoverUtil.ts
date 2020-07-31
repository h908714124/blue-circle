import {Node} from "../model/Node";
import {Library} from "./Library";
import {Point} from "../model/Point";

export class HoverUtil {

  private readonly canvas: HTMLCanvasElement;
  private readonly nodes: Node[] = [];
  readonly center: Point;
  private readonly r: number; // radius
  private readonly ctx: CanvasRenderingContext2D;
  private imageData: ImageData;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.width = Math.min(window.innerWidth, window.innerHeight) - 4;
    this.canvas.height = Math.min(window.innerWidth, window.innerHeight) - 4;
    this.ctx = this.canvas.getContext('2d');
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    this.r = (Math.min(canvas.width, canvas.height) - 52.0) / 2.0;
  }

  initNodes(): Node[] {
    for (let i = 0; i < Library.N; i++) {
      const phi: number = 2 * i * Math.PI * (1.0 / Library.N);
      const x: number = this.center.x + this.r * Math.cos(phi);
      const y: number = this.center.y - this.r * Math.sin(phi);
      this.nodes.push(new Node(i, x, y));
    }
    return this.nodes;
  }

  renderNodes(): ImageData {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    for (let r of this.nodes) {
      Library.renderNode(r, false, false, ctx);
    }
    this.imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    return this.imageData;
  }


  findHover(e: MouseEvent, active: Node): Node {
    // important: correct mouse position:
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const x: number = e.clientX - rect.left;
    const y: number = e.clientY - rect.top;
    if (active === undefined) {
      if (this.center.dist(x, y) < Library.R) {
        return undefined;
      }
      return this.findHoverByDist(x, y);
    }
    if (active.dist(x, y) < Library.R) {
      return active;
    }
    return this.findHoverByAngle(x, y, active.point())
  }

  findHoverByAngle(x: number, y: number, active: Point): Node {
    const angle = active.angle(x, y);
    let bestP: Node = undefined;
    let bestD: number = 100;
    for (let node of this.nodes) {
      if (active === node.point()) {
        continue;
      }
      const d: number = Math.abs(angle - active.angle(node.x(), node.y()));
      if (d < bestD) {
        bestD = d;
        bestP = node;
      }
    }
    return bestP;
  }

  findHoverByDist(x: number, y: number): Node {
    let bestP: Node = undefined;
    let bestD: number = 1000;
    for (let node of this.nodes) {
      const d: number = node.dist(x, y);
      if (d < bestD) {
        bestD = d;
        bestP = node;
      }
    }
    return bestP;
  }
}
