export class Graph {

  private readonly segments: number[][];

  constructor(N: number) {
    this.segments = [];
    for (let i = 0; i < N; i++) {
      let items = [];
      for (let j = 0; j < N - 1; j++) {
        items.push(0);
      }
      this.segments.push(items);
    }
  }

  addSegment(i: number, j: number): void {
    this.set(i, j, 1);
  }

  removeSegment(i: number, j: number): void {
    this.set(i, j, 0);
  }

  forEach(f: (x: number, y: number) => void): void {
    for (let i = 0; i < this.segments.length; i++) {
      const items = this.segments[i];
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        if (item !== 0) {
          f.call(undefined, i, j);
        }
      }
    }
  }

  hasSegment(i: number, j: number): boolean {
    if (i === j) {
      return false;
    }
    if (i < j) {
      return this.segments[j][i] !== 0;
    }
    return this.segments[i][j] !== 0;
  }

  private set(i: number, j: number, data: number): void {
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
