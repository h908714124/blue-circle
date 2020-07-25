export class Point {

  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  dist(x: number, y: number): number {
    return Math.sqrt((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y))
  }

  angle(x: number, y: number): number {
    return Math.atan2(this.y - y, this.x - x);
  }
}

