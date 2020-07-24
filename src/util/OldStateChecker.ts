import {Segment} from "../model/Segment";

export class OldStateChecker {

  old: Segment;
  veryOld: Segment;

  push(t: Segment): void {
    this.veryOld = this.old;
    this.old = t;
  }

  isRepetition(t: Segment): boolean {
    return t.equals(this.old) && this.old.equals(this.veryOld);
  }

  clear(): void {
    this.old = undefined;
    this.veryOld = undefined;
  }
}
