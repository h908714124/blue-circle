import {Component, OnInit} from '@angular/core';
import {Node} from '../model/Node';
import {Segment} from '../model/Segment';
import {RenderUtil} from "../util/RenderUtil";
import {Library} from "../util/Library";
import {OldStateChecker} from "../util/OldStateChecker";
import {Point} from "../model/Point";
import {State} from "../util/State";
import {Graph} from "../model/Graph";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {

    const m: number = Math.min(window.innerWidth, window.innerHeight) - 4;
    const r: number = (m - 52.0) / 2.0; // radius

    const center: Point = new Point(m / 2, m / 2);
    const nodes: Node[] = [];
    const N = 17; // how many dots to draw
    const graph: Graph = new Graph(N);

    const oldState: OldStateChecker = new OldStateChecker();

    let currentHover: Node;

    for (let i = 0; i < N; i++) {
      const phi: number = 2 * i * Math.PI * (1.0 / N);
      const x: number = center.x + r * Math.cos(phi);
      const y: number = center.y - r * Math.sin(phi);
      nodes.push(new Node(i, x, y));
    }

    const state: State = new State(nodes);

    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
    const actionButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('action-button');
    actionButton.onclick = function (e: MouseEvent) {
      state.deleteMode = !state.deleteMode;
      actionButton.textContent = state.deleteMode ? 'Now deleting edges' : 'Now creating edges';
      actionButton.setAttribute('class', state.deleteMode ? 'deleteState' : 'createState');
      e.preventDefault();
    };
    canvas.width = m;
    canvas.height = m;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    for (let r of nodes) {
      Library.renderNode(r, 0, false, ctx);
    }

    const imageData: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const renderUtil = new RenderUtil(canvas, imageData, state, graph);

    function onMouseMove(e: MouseEvent): void {
      const hover: Node = findHover(e, state.activeNode());
      if (hover === currentHover) {
        return;
      }
      currentHover = hover;
      renderUtil.render(graph, currentHover);
    }

    canvas.onmousemove = onMouseMove;
    canvas.onmouseout = function () {
      currentHover = undefined;
      renderUtil.render(graph, currentHover);
    };

    function findHover(e: MouseEvent, active: Node): Node {
      // important: correct mouse position:
      const rect: DOMRect = canvas.getBoundingClientRect();
      const x: number = e.clientX - rect.left;
      const y: number = e.clientY - rect.top;
      if (active === undefined) {
        if (center.dist(x, y) < Library.R + 6) {
          return undefined;
        }
        return findHoverByAngle(x, y, center);
      }
      if (active.dist(x, y) < Library.R + 6) {
        return active;
      }
      return findHoverByAngle(x, y, active.point())
    }

    function findHoverByAngle(x: number, y: number, active: Point): Node {
      const angle = active.angle(x, y);
      let bestP: Node = undefined;
      let bestD: number = 100;
      for (let node of nodes) {
        if (active === node.point()) {
          continue;
        }
        const d: number = Math.abs(angle - active.angle(node.x(), node.y()));
        if (d < bestD) {
          bestD = d;
          bestP = node;
        }
      }
      return bestP;
    }

    canvas.onmouseup = function (e: MouseEvent) {

      const active: Node = state.activeNode();
      const hover: Node = findHover(e, active);

      if (!hover) {
        state.setActiveNode(undefined);
        currentHover = undefined;
        renderUtil.render(graph, currentHover);
        return;
      }

      if (active === hover || !active) {
        state.incActive();
        state.setActiveNode(hover);
        if (state.activeLevel() !== 0) {
          const rect: DOMRect = canvas.getBoundingClientRect();
          const x: number = e.clientX - rect.left;
          const y: number = e.clientY - rect.top;
          currentHover = findHoverByAngle(x, y, hover.point());
          renderUtil.render(graph, currentHover);
        }
        currentHover = undefined;
        onMouseMove(e);
        return;
      }

      const existingSegment: Segment = graph.getSegment(active.i, hover.i);
      if (state.deleteMode) {
        if (existingSegment !== undefined) {
          oldState.push(existingSegment);
          graph.removeSegment(active.i, hover.i);
          state.maybeDeactivate();
        }
      } else {
        if (existingSegment === undefined) {
          const t = new Segment(active, hover);
          if (oldState.isRepetition(t)) {
            state.flipYellow(t);
            oldState.clear();
          } else {
            state.simpleFlip(t);
            oldState.push(t);
          }
          graph.addSegment(t);
        }
      }
      currentHover = undefined;
      onMouseMove(e);
    }
  }
}
