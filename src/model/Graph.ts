import {Segment} from "./Segment";
import {Point} from "./Point";

export class Graph {

  private readonly segments: Segment[][];
  private readonly segmentList: Segment[] = []; // same content, for faster iteration

  constructor(N: number) {
    this.segments = [];
    for (let i = 0; i < N; i++) {
      let items: Segment[] = [];
      for (let j = 0; j < N - 1; j++) {
        items.push(undefined);
      }
      this.segments.push(items);
    }
  }

  addSegment(t: Segment): void {
    if (!this.hasSegment(t.a.i, t.b.i)) {
      this.segmentList.push(t);
    }
    this.set(t.a.i, t.b.i, t);
  }

  removeSegment(i: number, j: number): void {
    const existing = this.getSegment(i, j);
    if (existing !== undefined) {
      const index = this.segmentList.findIndex(s => s === existing);
      this.segmentList.splice(index, 1);
    }
    this.set(i, j, undefined);
  }

  forEach(f: (t: Segment) => void): void {
    for (let t of this.segmentList) {
      f.call(undefined, t);
    }
  }

  hasSegment(i: number, j: number): boolean {
    return this.getSegment(i, j) !== undefined;
  }

  getSegment(i: number, j: number): Segment {
    if (i === j) {
      return undefined;
    }
    if (i < j) {
      return this.segments[j][i];
    }
    return this.segments[i][j];
  }

  findHover(x: number, y: number): Segment {
    for (let t of this.segmentList) {
      let side0 = this.side(t.a0, t.b0, x, y);
      let side1 = this.side(t.a1, t.b1, x, y);
      if (side0 < 0 && side1 > 0 || side0 > 0 && side1 < 0) {
        return t;
      }
    }
    return undefined;
  }

  private side(a: Point, b: Point, x: number, y: number) {
    return (b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x);
  }

  private set(i: number, j: number, data: Segment): void {
    if (i === j) {
      return;
    }
    if (i < j) {
      this.segments[j][i] = data;
    } else {
      this.segments[i][j] = data;
    }
  }
}
