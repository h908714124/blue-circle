import {Point} from "./Point";

export class Node {

  readonly i: number;
  readonly #p: Point;

  constructor(i: number, x: number, y: number) {
    this.i = i;
    this.#p = new Point(x, y);
  }

  dist(x: number, y: number): number {
    return this.#p.dist(x, y);
  }

  x(): number {
    return this.#p.x;
  }

  y(): number {
    return this.#p.y;
  }

  point(): Point {
    return this.#p;
  }
}

