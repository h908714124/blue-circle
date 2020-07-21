import {Point} from "./Point";

export class Segment {

  a: Point;
  b: Point;

  constructor(a: Point, b: Point) {
    if (a.i > b.i) {
      this.a = b;
      this.b = a;
    } else {
      this.a = a;
      this.b = b;
    }
  }
}
