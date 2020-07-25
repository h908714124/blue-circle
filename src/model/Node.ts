import {Point} from "./Point";

export class Node {

  readonly i: number;
  readonly #p: Point;
  #active: number = 0;

  constructor(i: number, x: number, y: number) {
    this.i = i;
    this.#p = new Point(x, y);
  }

  active(): number {
    return this.#active;
  }

  incActive(): void {
    this.#active += 1;
    this.#active = this.#active % 3;
  }

  maybeDeactivate(): void {
    if (this.#active === 1) {
      this.#active = 0;
    }
  }

  setActive(active: number): void {
    this.#active = active;
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

