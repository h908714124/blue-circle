import {Component, OnInit} from '@angular/core';
import {Node} from '../model/Node';
import {Segment} from '../model/Segment';
import {RenderUtil} from "../util/RenderUtil";
import {Library} from "../util/Library";
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

    let currentHover: Node;
    let currentSegmentHover: Segment;

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
      if (state.deleteMode) {
        state.setActiveNode(undefined);
        currentHover = undefined;
      } else {
        currentSegmentHover = undefined;
      }
      e.preventDefault();
    };
    canvas.width = m;
    canvas.height = m;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    for (let r of nodes) {
      Library.renderNode(r, false, false, ctx);
    }

    const imageData: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const renderUtil = new RenderUtil(canvas, imageData, state, graph);

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
        const hover: Node = findHover(e, state.activeNode());
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

    function findHover(e: MouseEvent, active: Node): Node {
      // important: correct mouse position:
      const rect: DOMRect = canvas.getBoundingClientRect();
      const x: number = e.clientX - rect.left;
      const y: number = e.clientY - rect.top;
      if (active === undefined) {
        if (center.dist(x, y) < Library.R) {
          return undefined;
        }
        return findHoverByDist(x, y);
      }
      if (active.dist(x, y) < Library.R) {
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

    function findHoverByDist(x: number, y: number): Node {
      let bestP: Node = undefined;
      let bestD: number = 1000;
      for (let node of nodes) {
        const d: number = node.dist(x, y);
        if (d < bestD) {
          bestD = d;
          bestP = node;
        }
      }
      return bestP;
    }

    canvas.onmouseup = function (e: MouseEvent) {

      if (state.deleteMode) {
        const rect: DOMRect = canvas.getBoundingClientRect();
        const x: number = e.clientX - rect.left;
        const y: number = e.clientY - rect.top;
        const hover: Segment = graph.findHover(x, y);
        if (hover !== undefined) {
          graph.removeSegment(hover.a.i, hover.b.i);
          renderUtil.render(undefined, undefined);
        }
        currentSegmentHover = hover;
        return;
      }

      const active: Node = state.activeNode();
      const hover: Node = findHover(e, active);

      if (!hover) {
        state.setActiveNode(undefined);
        currentHover = undefined;
        renderUtil.render(currentHover, currentSegmentHover);
        return;
      }

      if (!active) {
        state.incActive();
        state.setActiveNode(hover);
        currentHover = undefined;
        renderUtil.render(currentHover, currentSegmentHover);
        return;
      }

      if (active === hover) {
        state.setActiveNode(undefined);
        const rect: DOMRect = canvas.getBoundingClientRect();
        const x: number = e.clientX - rect.left;
        const y: number = e.clientY - rect.top;
        currentHover = findHoverByAngle(x, y, center);
        renderUtil.render(currentHover, currentSegmentHover);
        return;
      }

      if (graph.hasSegment(active.i, hover.i)) {
        return;
      }

      const t = new Segment(active, hover);
      state.simpleFlip(t);
      graph.addSegment(t);
      currentHover = undefined;
      renderUtil.render(currentHover, currentSegmentHover);
    }
  }
}
