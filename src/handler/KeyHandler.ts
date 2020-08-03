import {Library} from "../util/Library";
import {Node} from "../model/Node";
import {Segment} from "../model/Segment";
import {HoverState} from "../util/HoverState";
import {Graph} from "../model/Graph";
import {State} from "../util/State";
import {RenderUtil} from "../util/RenderUtil";

export class KeyHandler {

  private readonly hoverState: HoverState;
  private readonly graph: Graph;
  private readonly state: State;
  private readonly renderUtil: RenderUtil;
  private readonly nodes: Node[];

  constructor(hoverState: HoverState, graph: Graph, state: State, renderUtil: RenderUtil, nodes: Node[]) {
    this.hoverState = hoverState;
    this.graph = graph;
    this.state = state;
    this.renderUtil = renderUtil;
    this.nodes = nodes;
  }

  private maybePreventDefault(e: KeyboardEvent) {
    if (e.code === Library.arrow_left ||
      e.code === Library.arrow_right ||
      e.code === Library.arrow_up ||
      e.code === Library.arrow_down) {
      e.preventDefault();
    }
  }

  onkeyup(e: KeyboardEvent): void {
    this.maybePreventDefault(e);
  }

  onkeydown(e: KeyboardEvent): void {
    this.maybePreventDefault(e);
    if (e.code === Library.arrow_down) {
      const last = this.graph.lastSegment();
      if (last === undefined) {
        const active = this.state.activeNode();
        if (active !== undefined) {
          this.hoverState.currentHover = active;
          this.state.setActiveNode(undefined);
        } else if (this.hoverState.currentHover !== undefined) {
          this.hoverState.currentHover = undefined;
        }
      } else {
        this.graph.removeSegment(last.a.i, last.b.i);
        if (this.state.activeNode() === last.a) {
          this.state.setActiveNode(last.b);
          this.hoverState.currentHover = last.a;
        } else if (this.state.activeNode() === last.b) {
          this.state.setActiveNode(last.a);
          this.hoverState.currentHover = last.b;
        }
      }
      this.renderUtil.render(this.hoverState.currentHover, this.hoverState.currentSegmentHover);
      return;
    }
    const direction: number = e.code === Library.arrow_left ? 1
      : e.code === Library.arrow_right ? -1
        : e.code === Library.arrow_up ? 0
          : undefined;
    if (direction === undefined) {
      return;
    }
    let active: Node = this.state.activeNode();
    if (direction === 0) {
      if (this.hoverState.currentHover === undefined) {
        this.hoverState.currentHover = this.nodes[0];
      } else {
        if (active === undefined) {
          active = this.hoverState.currentHover;
          this.state.incActive();
          this.state.setActiveNode(active);
          const hover = this.graph.cycle(active, this.hoverState.currentHover, 1);
          if (hover !== undefined) {
            this.hoverState.currentHover = this.nodes[hover];
          }
        } else if (this.hoverState.currentHover !== active) {
          const t = new Segment(active, this.hoverState.currentHover);
          this.state.simpleFlip(t);
          this.graph.addSegment(t);
          const hover = this.graph.cycle(this.state.activeNode(), active, 1);
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
}
