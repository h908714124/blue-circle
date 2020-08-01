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
      e.preventDefault();
      state.deleteMode = !state.deleteMode;
      actionButton.textContent = state.deleteMode ? 'Now deleting edges' : 'Now creating edges';
      actionButton.setAttribute('class', state.deleteMode ? 'deleteState' : 'createState');
      if (state.deleteMode) {
        state.setActiveNode(undefined);
        currentHover = undefined;
      } else {
        currentSegmentHover = undefined;
      }
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

    function maybePreventDefault(e: KeyboardEvent) {
      if (e.code === Library.arrow_left ||
        e.code === Library.arrow_right ||
        e.code === Library.arrow_up ||
        e.code === Library.arrow_down) {
        e.preventDefault();
      }
    }

    document.onkeyup = function (e: KeyboardEvent) {
      maybePreventDefault(e);
    }
    document.onkeydown = function (e: KeyboardEvent) {
      maybePreventDefault(e);
      if (e.code === Library.arrow_down) {
        const last = graph.lastSegment();
        if (last === undefined) {
          return;
        }
        graph.removeSegment(last.a.i, last.b.i);
        if (state.activeNode() === last.a) {
          state.setActiveNode(last.b);
          currentHover = last.a;
        } else if (state.activeNode() === last.b) {
          state.setActiveNode(last.a);
          currentHover = last.b;
        }
        renderUtil.render(currentHover, currentSegmentHover);
        return;
      }
      const direction: number = e.code === Library.arrow_left ? 1
        : e.code === Library.arrow_right ? -1
          : e.code === Library.arrow_up ? 0
            : undefined;
      if (direction === undefined) {
        return;
      }
      let active: Node = state.activeNode();
      if (active === undefined) {
        return;
      }
      if (direction === 0) {
        if (currentHover !== undefined) {
          const t = new Segment(active, currentHover);
          state.simpleFlip(t);
          graph.addSegment(t);
          const hover = graph.cycle(state.activeNode(), active, 1);
          if (hover !== undefined) {
            currentHover = nodes[hover];
          } else {
            currentHover = undefined;
          }
        }
      } else {
        const hover = graph.cycle(active, currentHover, direction);
        if (hover !== undefined) {
          currentHover = nodes[hover];
        } else {
          currentHover = undefined;
        }
      }
      renderUtil.render(currentHover, currentSegmentHover);
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
