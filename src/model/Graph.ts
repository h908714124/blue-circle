import {Segment} from "./Segment";

export class Graph {

  private readonly segments: Segment[][];

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
    this.set(t.a.i, t.b.i, t);
  }

  removeSegment(i: number, j: number): void {
    this.set(i, j, undefined);
  }

  forEach(f: (x: number, y: number) => void): void {
    for (let i = 0; i < this.segments.length; i++) {
      const items = this.segments[i];
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        if (item !== undefined) {
          f.call(undefined, i, j);
        }
      }
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
