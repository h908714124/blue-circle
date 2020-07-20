class Point {

  i: number;
  x: number;
  y: number;
  w: number = 20;
  h: number = 20;
  active: boolean = false;
  centerX: number;
  centerY: number;

  constructor(i, x, y) {
    this.i = i;
    this.x = x;
    this.y = y;
    this.centerX = x + this.w / 2;
    this.centerY = y + this.h / 2;
  }

  dist(x: number, y: number): number {
    return Math.sqrt((x - this.centerX) * (x - this.centerX) + (y - this.centerY) * (y - this.centerY))
  }
}

export {Point};
