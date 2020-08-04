import {Node} from "../model/Node";
import {Segment} from "../model/Segment";
import {HoverState} from "../util/HoverState";
import {Graph} from "../model/Graph";
import {ActiveState} from "../util/ActiveState";
import {RenderUtil} from "../util/RenderUtil";
import {HoverUtil} from "../util/HoverUtil";
import {Mode} from "../util/Mode";

export class MouseHandler {

  private readonly hoverState: HoverState;
  private readonly graph: Graph;
  private readonly activeState: ActiveState;
  private readonly renderUtil: RenderUtil;
  private readonly hoverUtil: HoverUtil;
  private readonly canvas: HTMLCanvasElement;
  private readonly mode: Mode;

  constructor(hoverState: HoverState, graph: Graph, activeState: ActiveState, renderUtil: RenderUtil, hoverUtil: HoverUtil, canvas: HTMLCanvasElement, mode: Mode) {
    this.hoverState = hoverState;
    this.graph = graph;
    this.activeState = activeState;
    this.renderUtil = renderUtil;
    this.hoverUtil = hoverUtil;
    this.canvas = canvas;
    this.mode = mode;
  }

  onMouseMove(e: MouseEvent): void {
    if (this.mode.isDeleteMode()) {
      const rect: DOMRect = this.canvas.getBoundingClientRect();
      const x: number = e.clientX - rect.left;
      const y: number = e.clientY - rect.top;
      if (this.hoverState.currentSegmentHover !== undefined && this.hoverState.currentSegmentHover.isNear(x, y)) {
        return;
      }
      const hover: Segment = this.graph.findHover(x, y);
      if (hover === this.hoverState.currentSegmentHover) {
        return;
      }
      this.hoverState.currentSegmentHover = hover;
    } else {
      const hover: Node = this.hoverUtil.findHover(e, this.activeState.activeNode());
      if (hover === this.hoverState.currentHover) {
        return;
      }
      this.hoverState.currentHover = hover;
    }
    this.renderUtil.render(this.hoverState.currentHover, this.hoverState.currentSegmentHover);
  }

  onMouseUp(e: MouseEvent): void {

    if (this.mode.isDeleteMode()) {
      if (this.hoverState.currentSegmentHover !== undefined) {
        this.graph.removeSegment(this.hoverState.currentSegmentHover.a.i, this.hoverState.currentSegmentHover.b.i);
        this.renderUtil.render(undefined, undefined);
      }
      return;
    }

    const active: Node = this.activeState.activeNode();
    const hover: Node = this.hoverUtil.findHover(e, active);

    if (!hover || active === hover) {
      return;
    }

    if (!active || this.graph.hasSegment(active.i, hover.i)) {
      this.activeState.incActive();
      this.activeState.setActiveNode(hover);
    } else {
      const t = new Segment(active, hover);
      this.activeState.simpleFlip(t);
      this.graph.addSegment(t);
    }

    this.hoverState.currentHover = this.hoverUtil.findHover(e, this.activeState.activeNode());
    this.renderUtil.render(this.hoverState.currentHover, this.hoverState.currentSegmentHover);
  }
}
