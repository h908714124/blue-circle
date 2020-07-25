import {Component, OnInit} from '@angular/core';
import {Node} from '../model/Node';
import {Segment} from '../model/Segment';
import {Title} from "@angular/platform-browser";
import {RenderUtil} from "../util/RenderUtil";
import {Library} from "../util/Library";
import {OldStateChecker} from "../util/OldStateChecker";
import {Point} from "../model/Point";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(titleService: Title) {
    titleService.setTitle('Blue Circle');
  }

  ngOnInit(): void {

    const m: number = Math.min(window.innerWidth, window.innerHeight) - 4;
    const r: number = (m - 52.0) / 2.0; // radius

    const center: Point = new Point(m / 2, m / 2);
    const nodes: Node[] = [];
    const segments: Segment[] = [];
    const N = 17; // how many dots to draw

    const oldState: OldStateChecker = new OldStateChecker();

    let currentHover: Node;

    for (let i = 0; i < N; i++) {
      const phi: number = 2 * i * Math.PI * (1.0 / N);
      const x: number = center.x + r * Math.cos(phi);
      const y: number = center.y - r * Math.sin(phi);
      nodes.push(new Node(i + 1, x, y));
    }

    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
    const renderUtil = new RenderUtil(nodes, canvas);
    canvas.width = m;
    canvas.height = m;
    renderUtil.renderHover(undefined);

    function onMouseMove(e: MouseEvent): void {
      const hover: Node = findHover(e, findActive());
      if (hover === currentHover) {
        return;
      }
      currentHover = hover;
      renderUtil.renderHover(currentHover);
    }

    canvas.onmousemove = onMouseMove;
    canvas.onmouseout = function () {
      currentHover = undefined;
      renderUtil.renderHover(currentHover);
    };

    function findActive(): Node {
      for (let r of nodes) {
        if (r.active() !== 0) {
          return r;
        }
      }
      return undefined;
    }

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

    function findSegment(a, b): number {
      for (let i = 0; i < segments.length; i++) {
        let segment: Segment = segments[i];
        if ((segment.a === a && segment.b === b) || (segment.a === b && segment.b === a)) {
          return i;
        }
      }
      return undefined;
    }

    canvas.onmouseup = function (e: MouseEvent) {

      const active: Node = findActive();
      const hover: Node = findHover(e, active);

      if (!hover) {
        for (let point of nodes) {
          point.forceDeactivate();
        }
        currentHover = undefined;
        renderUtil.renderHover(currentHover);
        return;
      }

      if (active === hover || !active) {
        hover.incActive();
        if (hover.active() !== 0) {
          const rect: DOMRect = canvas.getBoundingClientRect();
          const x: number = e.clientX - rect.left;
          const y: number = e.clientY - rect.top;
          currentHover = findHoverByAngle(x, y, hover.point());
          renderUtil.renderHover(currentHover);
        }
        currentHover = undefined;
        onMouseMove(e);
        return;
      }

      const i: number = findSegment(active, hover);
      if (i !== undefined) {
        oldState.push(segments[i]);
        segments.splice(i, 1);
      } else {
        const t = new Segment(active, hover);
        if (oldState.isRepetition(t)) {
          t.flip();
          oldState.clear();
        } else {
          oldState.push(t);
        }
        segments.push(t);
      }
      segments.sort((s, t) => {
        const da = s.a.i - t.a.i;
        if (da !== 0) {
          return da;
        }
        return s.b.i - t.b.i;
      });
      active.maybeDeactivate();
      renderUtil.render(segments);
      currentHover = undefined;
      onMouseMove(e);
    }
  }
}
