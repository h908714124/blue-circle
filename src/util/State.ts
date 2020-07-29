import {Node} from '../model/Node';
import {Segment} from "../model/Segment";

export class State {

  deleteMode: boolean = false;
  private _activeNode: number;
  private _activeLevel: boolean = false;
  private readonly nodes: Node[];

  constructor(nodes: Node[]) {
    this.nodes = nodes;
  }

  activeLevel(): boolean {
    return this._activeLevel;
  }

  setActiveNode(activeNode: Node): void {
    if (activeNode === undefined) {
      this._activeNode = undefined;
      this._activeLevel = false;
      return;
    }
    if (!this._activeLevel) {
      return;
    }
    this._activeNode = activeNode.i;
  }

  activeNode(): Node {
    if (this._activeNode === undefined) {
      return undefined;
    }
    return this.nodes[this._activeNode];
  }

  findLevel(node: Node): boolean {
    if (this._activeNode !== node.i) {
      return false;
    }
    return this._activeLevel;
  }

  simpleFlip(s: Segment): void {
    const active: Node = this.findLevel(s.a) ? s.a : s.b;
    if (!this.findLevel(active)) {
      return;
    }
    const inactive: Node = active === s.a ? s.b : s.a;
    this._activeNode = inactive.i;
  }

  incActive(): void {
    this._activeLevel = true;
  }
}
