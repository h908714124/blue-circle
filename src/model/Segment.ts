import {Node} from "./Node";
import {Point} from "./Point";

const lineHoverWidth = 10;

export class Segment {

  readonly a: Node;
  readonly b: Node;

  readonly a0: Point;
  readonly a1: Point;
  readonly b0: Point;
  readonly b1: Point;

  constructor(a: Node, b: Node) {
    if (a.i > b.i) {
      this.a = b;
      this.b = a;
    } else {
      this.a = a;
      this.b = b;
    }
    let v = this.a.point().subtract(this.b.point()).orthogonal(lineHoverWidth);
    this.a0 = this.a.point().add(v);
    this.b0 = this.b.point().add(v);
    this.a1 = this.a.point().subtract(v);
    this.b1 = this.b.point().subtract(v);
  }

  isNear(x: number, y: number): boolean {
    let side0 = this.side(this.a0, this.b0, x, y);
    let side1 = this.side(this.a1, this.b1, x, y);
    return side0 < 0 && side1 > 0 || side0 > 0 && side1 < 0;
  }

  private side(a: Point, b: Point, x: number, y: number) {
    return (b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x);
  }
}
