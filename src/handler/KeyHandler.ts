import {Library} from "../util/Library";
import {Node} from "../model/Node";
import {Segment} from "../model/Segment";
import {HoverState} from "../util/HoverState";
import {Graph} from "../model/Graph";
import {ActiveState} from "../util/ActiveState";
import {RenderUtil} from "../util/RenderUtil";
import {Mode} from "../util/Mode";

export class KeyHandler {

  private readonly hoverState: HoverState;
  private readonly graph: Graph;
  private readonly activeState: ActiveState;
  private readonly renderUtil: RenderUtil;
  private readonly nodes: Node[];
  private readonly mode: Mode;

  constructor(hoverState: HoverState, graph: Graph, activeState: ActiveState, renderUtil: RenderUtil, nodes: Node[], mode: Mode) {
    this.hoverState = hoverState;
    this.graph = graph;
    this.activeState = activeState;
    this.renderUtil = renderUtil;
    this.nodes = nodes;
    this.mode = mode;
  }

  private maybePreventDefault(e: KeyboardEvent) {
    if (e.code === Library.arrow_left ||
      e.code === Library.arrow_right ||
      e.code === Library.arrow_up ||
      e.code === Library.arrow_down) {
      e.preventDefault();
      this.mode.enterCreateMode(); // TODO enter delete mode on button down
    }
  }

  onKeyUp(e: KeyboardEvent): void {
    this.maybePreventDefault(e);
  }

  onKeyDown(e: KeyboardEvent): void {
    this.maybePreventDefault(e);
    if (e.code === Library.arrow_down) {
      this.deleteLastSegment();
      return;
    }
    const direction: number = e.code === Library.arrow_left ? 1
      : e.code === Library.arrow_right ? -1
        : e.code === Library.arrow_up ? 0
          : undefined;
    if (direction === undefined) {
      return;
    }
    let active: Node = this.activeState.activeNode();
    if (direction === 0) {
      if (this.hoverState.currentHover === undefined) {
        this.hoverState.currentHover = this.nodes[0];
      } else {
        if (active === undefined) {
          active = this.hoverState.currentHover;
          this.activeState.incActive();
          this.activeState.setActiveNode(active);
          const hover = this.graph.cycle(active, this.hoverState.currentHover, 1);
          if (hover !== undefined) {
            this.hoverState.currentHover = this.nodes[hover];
          }
        } else if (this.hoverState.currentHover !== active) {
          const t = new Segment(active, this.hoverState.currentHover);
          this.activeState.incActive();
          this.activeState.simpleFlip(t);
          this.graph.addSegment(t);
          const hover = this.graph.cycle(this.activeState.activeNode(), active, 1);
          if (hover !== undefined) {
            this.hoverState.currentHover = this.nodes[hover];
          } else {
            this.hoverState.currentHover = undefined;
          }
        }
      }
    } else {
      const hover: number = this.graph.cycle(active, this.hoverState.currentHover, direction);
      if (hover !== undefined) {
        this.hoverState.currentHover = this.nodes[hover];
      } else {
        this.hoverState.currentHover = undefined;
      }
    }
    this.renderUtil.render(this.hoverState.currentHover, this.hoverState.currentSegmentHover);
  }

  private deleteLastSegment(): void {
    const last = this.graph.lastSegment();
    if (last === undefined) {
      const active = this.activeState.activeNode();
      if (active !== undefined) {
        this.hoverState.currentHover = active;
        this.activeState.setActiveNode(undefined);
      } else if (this.hoverState.currentHover !== undefined) {
        this.hoverState.currentHover = undefined;
      }
    } else {
      this.graph.removeSegment(last.a.i, last.b.i);
      if (this.activeState.activeNode() === last.a) {
        this.activeState.setActiveNode(last.b);
        this.hoverState.currentHover = last.a;
      } else if (this.activeState.activeNode() === last.b) {
        this.activeState.setActiveNode(last.a);
        this.hoverState.currentHover = last.b;
      } else {
        this.activeState.incActive();
        this.activeState.setActiveNode(last.a);
        this.hoverState.currentHover = last.b;
      }
    }
    this.renderUtil.render(this.hoverState.currentHover, this.hoverState.currentSegmentHover);
  }
}
