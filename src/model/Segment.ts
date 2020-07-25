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

  flip(): void {
    const active: Node = this.a.active() !== 0 ? this.a : this.b;
    const inactive: Node = active === this.a ? this.b : this.a;
    if (active.active() === 2) {
      active.forceDeactivate();
      inactive.fullActivate();
      return;
    }
    active.fullActivate();
    inactive.forceDeactivate();
  }

  equals(s: Segment): boolean {
    if (!s) {
      return false;
    }
    return s.a === this.a && s.b === this.b;
  }
}
