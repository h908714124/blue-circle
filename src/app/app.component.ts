import {Component, OnInit} from '@angular/core';
import {Point} from '../model/Point';
import {Segment} from '../model/Segment';
import {Title} from "@angular/platform-browser";
import {RenderUtil} from "../util/RenderUtil";
import {Library} from "../util/Library";
import {OldStateChecker} from "../util/OldStateChecker";

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

    const m: number = Math.min(window.innerWidth, window.innerHeight);
    const w: number = m - 4.0;
    const h: number = m - 4.0;
    const r: number = (Math.min(w, h) - 52.0) / 2.0; // radius

    const x0: number = w / 2;
    const y0: number = h / 2;
    const points: Point[] = [];
    const segments: Segment[] = [];
    const N = 17; // how many dots to draw

    const oldState: OldStateChecker = new OldStateChecker();

    let currentHover: Point;

    for (let i = 0; i < N; i++) {
      const phi: number = 2 * i * Math.PI * (1.0 / N);
      const x: number = x0 + r * Math.cos(phi);
      const y = y0 - r * Math.sin(phi);
      points.push(new Point(i + 1, x, y));
    }

    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
    const renderUtil = new RenderUtil(points, canvas);
    canvas.width = w;
    canvas.height = h;
    renderUtil.renderHover(undefined);

    function onMouseMove(e: MouseEvent): void {
      const hover: Point = findHover(e, findActive());
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

    function findActive(): Point {
      for (let r of points) {
        if (r.active() !== 0) {
          return r;
        }
      }
      return undefined;
    }

    function findHover(e: MouseEvent, active: Point): Point {
      // important: correct mouse position:
      const rect: DOMRect = canvas.getBoundingClientRect();
      const x: number = e.clientX - rect.left;
      const y: number = e.clientY - rect.top;
      if (active === undefined || active.dist(x, y) < Library.R + 6) {
        return findHoverByDistance(x, y);
      } else {
        return findHoverByAngle(x, y, active)
      }
    }

    function findHoverByAngle(x: number, y: number, active: Point): Point {
      const angle = active.angle(x, y);
      let bestP: Point = undefined;
      let bestD: number = 100;
      for (let p of points) {
        if (active === p) {
          continue;
        }
        const d: number = Math.abs(angle - active.angle(p.x, p.y));
        if (d < bestD) {
          bestD = d;
          bestP = p;
        }
      }
      return bestP;
    }

    function findHoverByDistance(x: number, y: number): Point {
      let bestP: Point = undefined;
      let bestD: number = r / 2;
      for (let p of points) {
        const d: number = p.dist(x, y);
        if (d < bestD) {
          bestD = d;
          bestP = p;
        }
      }
      if (bestD >= r / 2) {
        return undefined;
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

      const active: Point = findActive();
      const hover: Point = findHover(e, active);

      if (!hover) {
        for (let point of points) {
          point.forceDeactivate();
        }
        currentHover = undefined;
        renderUtil.renderHover(currentHover);
        return;
      }

      if (active === hover || !active) {
        hover.incActive();
        currentHover = hover;
        renderUtil.renderHover(currentHover);
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
        }
        segments.push(t);
        oldState.push(t);
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
      onMouseMove(e);
    }
  }
}
