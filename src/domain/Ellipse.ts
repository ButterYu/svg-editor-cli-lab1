import { Shape } from "./Shape.js";
export class Ellipse extends Shape {
  get tag(): string {
    return "ellipse";
  }
  protected get geometry(): readonly string[] {
    return ["cx", "cy", "rx", "ry"];
  }
  protected get horizontal(): readonly string[] {
    return ["cx"];
  }
  protected get vertical(): readonly string[] {
    return ["cy"];
  }

  clone(): Shape {
    return this.copyInto(new Ellipse(this.id));
  }
}
