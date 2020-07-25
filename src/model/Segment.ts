import {Node} from "./Node";

export class Segment {

  a: Node;
  b: Node;

  constructor(a: Node, b: Node) {
    if (a.i > b.i) {
      this.a = b;
      this.b = a;
    } else {
      this.a = a;
      this.b = b;
    }
  }

  flipYellow(): void {
    const active: Node = this.a.active() !== 0 ? this.a : this.b;
    const inactive: Node = active === this.a ? this.b : this.a;
    if (active.active() === 2) {
      active.setActive(0);
      inactive.setActive(2);
      return;
    }
    active.setActive(2);
    inactive.setActive(0);
  }

  simpleFlip(): void {
    const active: Node = this.a.active() !== 0 ? this.a : this.b;
    if (active.active() === 2) {
      return;
    }
    const inactive: Node = active === this.a ? this.b : this.a;
    inactive.setActive(active.active());
    active.setActive(0);
    return;
  }

  equals(s: Segment): boolean {
    if (!s) {
      return false;
    }
    return s.a === this.a && s.b === this.b;
  }
}
