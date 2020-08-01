import {Segment} from "./Segment";
import {Node} from "./Node";

export class Graph {

  private readonly N: number; // number of nodes in the graph
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
    this.N = N;
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
      if (t.isNear(x, y)) {
        return t;
      }
    }
    return undefined;
  }

  cycle(active: Node, hover: Node, direction: number): number {
    const definedHover: number = hover == undefined ? 0 : hover.i;
    for (let j = 0; j < this.N; j++) {
      const k: number = (this.N + (direction * j) + definedHover) % this.N;
      const exists: boolean = this.hasSegment(active.i, k);
      if (!exists && (hover === undefined || k !== hover.i)) {
        return k;
      }
    }
    return undefined;
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
