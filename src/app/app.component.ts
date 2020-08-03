import {Component, OnInit} from '@angular/core';
import {Node} from '../model/Node';
import {Segment} from '../model/Segment';
import {RenderUtil} from "../util/RenderUtil";
import {Library} from "../util/Library";
import {State} from "../util/State";
import {Graph} from "../model/Graph";
import {HoverUtil} from "../util/HoverUtil";
import {KeyHandler} from "../handler/KeyHandler";
import {HoverState} from "../util/HoverState";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {

    const graph: Graph = new Graph(Library.N);

    const hoverState = new HoverState();

    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');

    const hoverUtil: HoverUtil = new HoverUtil(canvas);
    const nodes = hoverUtil.initNodes();
    const imageData: ImageData = hoverUtil.renderNodes();

    const state: State = new State(nodes);

    const actionButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('action-button');
    actionButton.onclick = function (e: MouseEvent) {
      e.preventDefault();
      state.deleteMode = !state.deleteMode;
      actionButton.textContent = state.deleteMode ? 'Now deleting edges' : 'Now creating edges';
      actionButton.setAttribute('class', state.deleteMode ? 'deleteState' : 'createState');
      if (state.deleteMode) {
        state.setActiveNode(undefined);
        hoverState.currentHover = undefined;
      } else {
        hoverState.currentSegmentHover = undefined;
      }
    };

    const renderUtil: RenderUtil = new RenderUtil(canvas, imageData, state, graph);

    function onMouseMove(e: MouseEvent): void {
      if (state.deleteMode) {
        const rect: DOMRect = canvas.getBoundingClientRect();
        const x: number = e.clientX - rect.left;
        const y: number = e.clientY - rect.top;
        if (hoverState.currentSegmentHover !== undefined && hoverState.currentSegmentHover.isNear(x, y)) {
          return;
        }
        const hover: Segment = graph.findHover(x, y);
        if (hover === hoverState.currentSegmentHover) {
          return;
        }
        hoverState.currentSegmentHover = hover;
      } else {
        const hover: Node = hoverUtil.findHover(e, state.activeNode());
        if (hover === hoverState.currentHover) {
          return;
        }
        hoverState.currentHover = hover;
      }
      renderUtil.render(hoverState.currentHover, hoverState.currentSegmentHover);
    }

    canvas.onmousemove = onMouseMove;
    canvas.onmouseout = function () {
      hoverState.currentHover = undefined;
      hoverState.currentSegmentHover = undefined;
      renderUtil.render(hoverState.currentHover, hoverState.currentSegmentHover);
    };
    const keyHandler = new KeyHandler(hoverState, graph, state, renderUtil, nodes);

    document.onkeyup = function (e: KeyboardEvent) {
      keyHandler.onkeyup(e);
    };

    document.onkeydown = function (e: KeyboardEvent) {
      keyHandler.onkeydown(e);
    };

    canvas.onmouseup = function (e: MouseEvent) {

      if (state.deleteMode) {
        if (hoverState.currentSegmentHover !== undefined) {
          graph.removeSegment(hoverState.currentSegmentHover.a.i, hoverState.currentSegmentHover.b.i);
          renderUtil.render(undefined, undefined);
        }
        return;
      }

      const active: Node = state.activeNode();
      const hover: Node = hoverUtil.findHover(e, active);

      if (!hover || active === hover) {
        return;
      }

      if (!active || graph.hasSegment(active.i, hover.i)) {
        state.incActive();
        state.setActiveNode(hover);
      } else {
        const t = new Segment(active, hover);
        state.simpleFlip(t);
        graph.addSegment(t);
      }

      hoverState.currentHover = hoverUtil.findHover(e, state.activeNode());
      renderUtil.render(hoverState.currentHover, hoverState.currentSegmentHover);
    }
  }
}
