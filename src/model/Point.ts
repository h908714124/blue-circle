export class Point {

  i: number;
  x: number;
  y: number;
  #active: number = 0;

  constructor(i, x, y) {
    this.i = i;
    this.x = x;
    this.y = y;
  }

  active() {
    return this.#active;
  }

  incActive() {
    this.#active += 1;
    this.#active = this.#active % 3;
  }

  maybeDeactivate() {
    if (this.#active === 1) {
      this.#active = 0;
    }
  }

  forceDeactivate() {
    this.#active = 0;
  }

  dist(x: number, y: number): number {
    return Math.sqrt((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y))
  }

  angle(x: number, y: number): number {
    return Math.atan2(this.y - y, this.x - x);
  }
}

