import {Component, OnInit} from '@angular/core';
import {Node} from '../model/Node';
import {Segment} from '../model/Segment';
import {RenderUtil} from "../util/RenderUtil";
import {Library} from "../util/Library";
import {State} from "../util/State";
import {Graph} from "../model/Graph";
import {HoverUtil} from "../util/HoverUtil";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {

    const graph: Graph = new Graph(Library.N);

    let currentHover: Node;
    let currentSegmentHover: Segment;

    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');

    const hoverUtil: HoverUtil = new HoverUtil(canvas);
    const nodes = hoverUtil.initNodes();
    const imageData: ImageData = hoverUtil.renderNodes();

    const state: State = new State(nodes);

    const actionButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('action-button');
    actionButton.onclick = function (e: MouseEvent) {
      state.deleteMode = !state.deleteMode;
      actionButton.textContent = state.deleteMode ? 'Now deleting edges' : 'Now creating edges';
      actionButton.setAttribute('class', state.deleteMode ? 'deleteState' : 'createState');
      if (state.deleteMode) {
        state.setActiveNode(undefined);
        currentHover = undefined;
      } else {
        currentSegmentHover = undefined;
      }
      e.preventDefault();
    };

    const renderUtil: RenderUtil = new RenderUtil(canvas, imageData, state, graph);

    function onMouseMove(e: MouseEvent): void {
      if (state.deleteMode) {
        const rect: DOMRect = canvas.getBoundingClientRect();
        const x: number = e.clientX - rect.left;
        const y: number = e.clientY - rect.top;
        if (currentSegmentHover !== undefined && currentSegmentHover.isNear(x, y)) {
          return;
        }
        const hover: Segment = graph.findHover(x, y);
        if (hover === currentSegmentHover) {
          return;
        }
        currentSegmentHover = hover;
      } else {
        const hover: Node = hoverUtil.findHover(e, state.activeNode());
        if (hover === currentHover) {
          return;
        }
        currentHover = hover;
      }
      renderUtil.render(currentHover, currentSegmentHover);
    }

    canvas.onmousemove = onMouseMove;
    canvas.onmouseout = function () {
      currentHover = undefined;
      currentSegmentHover = undefined;
      renderUtil.render(currentHover, currentSegmentHover);
    };

    canvas.onkeyup = function (e: KeyboardEvent) {

    }

    canvas.onmouseup = function (e: MouseEvent) {

      if (state.deleteMode) {
        if (currentSegmentHover !== undefined) {
          graph.removeSegment(currentSegmentHover.a.i, currentSegmentHover.b.i);
          renderUtil.render(undefined, undefined);
        }
        return;
      }

      const active: Node = state.activeNode();
      const hover: Node = hoverUtil.findHover(e, active);

      if (!hover || active === hover) {
        return;
      }

      if (!active) {
        state.incActive();
        state.setActiveNode(hover);
      } else {
        if (graph.hasSegment(active.i, hover.i)) {
          return;
        }
        const t = new Segment(active, hover);
        state.simpleFlip(t);
        graph.addSegment(t);
      }

      currentHover = hoverUtil.findHover(e, state.activeNode());
      renderUtil.render(currentHover, currentSegmentHover);
    }
  }
}
