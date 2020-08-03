import {Component, OnInit} from '@angular/core';
import {RenderUtil} from "../util/RenderUtil";
import {Library} from "../util/Library";
import {ActiveState} from "../util/ActiveState";
import {Graph} from "../model/Graph";
import {HoverUtil} from "../util/HoverUtil";
import {KeyHandler} from "../handler/KeyHandler";
import {HoverState} from "../util/HoverState";
import {MouseHandler} from "../handler/MouseHandler";

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

    const activeState: ActiveState = new ActiveState(nodes);

    const actionButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('action-button');
    actionButton.onclick = function (e: MouseEvent) {
      e.preventDefault();
      activeState.deleteMode = !activeState.deleteMode;
      actionButton.textContent = activeState.deleteMode ? 'Now deleting edges' : 'Now creating edges';
      actionButton.setAttribute('class', activeState.deleteMode ? 'deleteState' : 'createState');
      if (activeState.deleteMode) {
        activeState.setActiveNode(undefined);
        hoverState.currentHover = undefined;
      } else {
        hoverState.currentSegmentHover = undefined;
      }
    };

    const renderUtil: RenderUtil = new RenderUtil(canvas, imageData, activeState, graph);
    const mouseHandler = new MouseHandler(hoverState, graph, activeState, renderUtil, hoverUtil, canvas);
    const keyHandler = new KeyHandler(hoverState, graph, activeState, renderUtil, nodes);

    canvas.onmousemove = function (e: MouseEvent) {
      mouseHandler.onMouseMove(e);
    };

    canvas.onmouseout = function () {
      hoverState.currentHover = undefined;
      hoverState.currentSegmentHover = undefined;
      renderUtil.render(hoverState.currentHover, hoverState.currentSegmentHover);
    };

    document.onkeyup = function (e: KeyboardEvent) {
      keyHandler.onKeyUp(e);
    };

    document.onkeydown = function (e: KeyboardEvent) {
      keyHandler.onKeyDown(e);
    };

    canvas.onmouseup = function (e: MouseEvent) {
      mouseHandler.onMouseUp(e);
    };
  }
}
