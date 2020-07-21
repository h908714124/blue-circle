export class Point {

  i: number;
  x: number;
  y: number;
  w: number = 20;
  h: number = 20;
  #active: number = 0;
  centerX: number;
  centerY: number;

  constructor(i, x, y) {
    this.i = i;
    this.x = x;
    this.y = y;
    this.centerX = x + this.w / 2;
    this.centerY = y + this.h / 2;
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
    return Math.sqrt((x - this.centerX) * (x - this.centerX) + (y - this.centerY) * (y - this.centerY))
  }
}

