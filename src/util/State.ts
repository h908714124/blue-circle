import {Node} from '../model/Node';
import {Segment} from "../model/Segment";

export class State {

  private _activeNode: number;
  private _activeLevel: number = 0;
  private readonly nodes: Node[];

  constructor(nodes: Node[]) {
    this.nodes = nodes;
  }

  activeLevel(): number {
    return this._activeLevel;
  }

  setActiveNode(activeNode: Node): void {
    if (activeNode === undefined) {
      this._activeNode = undefined;
      this._activeLevel = 0;
    }
    if (this._activeLevel === 0) {
      this._activeNode = undefined;
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

  findLevel(node: Node): number {
    if (this._activeNode !== node.i) {
      return 0;
    }
    return this._activeLevel;
  }

  flipYellow(s: Segment): void {
    const active: Node = this.findLevel(s.a) !== 0 ? s.a : s.b;
    const inactive: Node = active === s.a ? s.b : s.a;
    let level = this.findLevel(active);
    if (level === 0) {
      return;
    }
    if (level === 2) {
      this._activeNode = inactive.i;
      return;
    }
    this._activeLevel = 2;
  }

  simpleFlip(s: Segment): void {
    const active: Node = this.findLevel(s.a) !== 0 ? s.a : s.b;
    if (this.findLevel(active) !== 1) {
      return;
    }
    const inactive: Node = active === s.a ? s.b : s.a;
    this._activeNode = inactive.i;
  }

  incActive(): void {
    this._activeLevel += 1;
    this._activeLevel = this._activeLevel % 3;
    if (this._activeLevel === 0) {
      this._activeNode = undefined;
    }
  }

  maybeDeactivate(): void {
    if (this._activeLevel === 1) {
      this._activeLevel = 0;
      this._activeNode = undefined;
    }
  }
}
