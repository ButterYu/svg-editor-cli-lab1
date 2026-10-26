import { Shape } from "./Shape.js";
export class Text extends Shape {
  override importText(content: string): void {
    this.set("text", content);
  }
  get tag(): string {
    return "text";
  }
  protected get geometry(): readonly string[] {
    return ["x", "y"];
  }
  protected get horizontal(): readonly string[] {
    return ["x"];
  }
  protected get vertical(): readonly string[] {
    return ["y"];
  }
  protected override get acceptsText(): boolean {
    return true;
  }
  clone(): Shape {
    return this.copyInto(new Text(this.id));
  }
}
