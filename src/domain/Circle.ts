import { Shape } from "./Shape.js";
export class Circle extends Shape {
  get tag(): string {
    return "circle";
  }
  protected get geometry(): readonly string[] {
    return ["cx", "cy", "r"];
  }
  protected get horizontal(): readonly string[] {
    return ["cx"];
  }
  protected get vertical(): readonly string[] {
    return ["cy"];
  }

  clone(): Shape {
    return this.copyInto(new Circle(this.id));
  }
}
