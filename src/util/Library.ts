import {Node} from "../model/Node";

export class Library {

  public static readonly TAU: number = 2 * Math.PI;
  public static readonly color_inactive: string = "#000000";
  public static readonly color_active: string = "red";
  public static readonly color_hover: string = "blue";

  public static readonly R = 20; // node radius

  public static renderNode(r: Node, active: boolean, hover: boolean, ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(r.x(), r.y(), Library.R, 0, Library.TAU);
    ctx.fillStyle = active ? Library.color_active : hover ? Library.color_hover : Library.color_inactive;
    ctx.fill();
    ctx.font = "12px Arial";
    ctx.fillStyle = "#ffffff";
    let number = r.i < 10 ? 4 : 7;
    ctx.fillText("" + r.i, r.x() - number, r.y() + 5);
  }
}
