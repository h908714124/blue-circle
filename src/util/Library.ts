import {Node} from "../model/Node";

export class Library {

  public static readonly N = 17; // how many dots to draw
  public static readonly TAU: number = 2 * Math.PI;
  public static readonly color_inactive: string = "#000000";
  public static readonly color_active: string = "red";
  public static readonly color_hover: string = "blue";
  public static readonly arrow_up: string = 'ArrowUp'
  public static readonly arrow_down: string = 'ArrowDown'
  public static readonly arrow_right: string = 'ArrowRight'
  public static readonly arrow_left: string = 'ArrowLeft'
  public static readonly r: number = 20; // node radius

  public static renderNode(r: Node, active: boolean, hover: boolean, ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(r.x(), r.y(), Library.r, 0, Library.TAU);
    ctx.fillStyle = active ? Library.color_active : hover ? Library.color_hover : Library.color_inactive;
    ctx.fill();
    ctx.font = "12px Arial";
    ctx.fillStyle = "#ffffff";
    let number = r.i < 10 ? 4 : 7;
    ctx.fillText("" + r.i, r.x() - number, r.y() + 5);
  }
}
