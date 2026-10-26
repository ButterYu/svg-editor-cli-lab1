import { Shape } from "./Shape.js";
export class Rect extends Shape {
  get tag(): string {
    return "rect";
  }
  protected get geometry(): readonly string[] {
    return ["x", "y", "width", "height"];
  }
  protected get horizontal(): readonly string[] {
    return ["x"];
  }
  protected get vertical(): readonly string[] {
    return ["y"];
  }

  clone(): Shape {
    return this.copyInto(new Rect(this.id));
  }
}
