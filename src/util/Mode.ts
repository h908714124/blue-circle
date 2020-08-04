import {AppComponent} from "../app/app.component";
import {ActiveState} from "./ActiveState";
import {HoverState} from "./HoverState";

export class Mode {

  private readonly component: AppComponent;
  private readonly activeState: ActiveState;
  private readonly hoverState: HoverState;
  private deleteMode: boolean = false;

  constructor(component: AppComponent, activeState: ActiveState, hoverState: HoverState) {
    this.component = component;
    this.activeState = activeState;
    this.hoverState = hoverState;
  }

  enterDeleteMode(): void {
    if (this.deleteMode) {
      return;
    }
    this.deleteMode = true;
    this.component.currentAction = 'deleting';
    this.component.currentActionClass = 'deleteState';
    this.activeState.setActiveNode(undefined);
    this.hoverState.currentHover = undefined;
  }

  enterCreateMode(): void {
    if (!this.deleteMode) {
      return;
    }
    this.deleteMode = false;
    this.component.currentAction = 'creating';
    this.component.currentActionClass = 'createState';
    this.hoverState.currentSegmentHover = undefined;
  }

  toggle(): void {
    if (this.deleteMode) {
      this.enterCreateMode();
    } else {
      this.enterDeleteMode();
    }
  }

  isDeleteMode(): boolean {
    return this.deleteMode;
  }
}
