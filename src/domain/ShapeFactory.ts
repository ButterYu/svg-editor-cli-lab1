import { Shape } from "./Shape.js";
import { Rect } from "./Rect.js";
import { Circle } from "./Circle.js";
import { Ellipse } from "./Ellipse.js";
import { Line } from "./Line.js";
import { Text } from "./Text.js";
import { Group } from "./Group.js";
export class ShapeFactory {
  private readonly types = new Map<
    string,
    { make: (id: string) => Shape; params: string[]; optional?: string }
  >([
    [
      "rect",
      {
        make: (id) => new Rect(id),
        params: ["x", "y", "width", "height"],
        optional: "fill",
      },
    ],
    [
      "circle",
      {
        make: (id) => new Circle(id),
        params: ["cx", "cy", "r"],
        optional: "fill",
      },
    ],
    [
      "ellipse",
      {
        make: (id) => new Ellipse(id),
        params: ["cx", "cy", "rx", "ry"],
        optional: "fill",
      },
    ],
    [
      "line",
      {
        make: (id) => new Line(id),
        params: ["x1", "y1", "x2", "y2"],
        optional: "stroke",
      },
    ],
    ["text", { make: (id) => new Text(id), params: ["x", "y", "text"] }],
    ["g", { make: (id) => new Group(id), params: [] }],
  ]);
  empty(type: string, id: string): Shape {
    const spec = this.types.get(type);
    if (!spec)
      throw new Error(`unknown shape type: ${type} (is the plugin loaded?)`);
    return spec.make(id);
  }
  create(type: string, id: string, args: string[]): Shape {
    const shape = this.empty(type, id),
      spec = this.types.get(type)!;
    if (
      args.length < spec.params.length ||
      args.length > spec.params.length + (spec.optional ? 1 : 0)
    )
      throw new Error(`invalid arguments for ${type}`);
    spec.params.forEach((key, i) => shape.set(key, args[i]!));
    if (spec.optional && args[spec.params.length] !== undefined)
      shape.set(spec.optional, args[spec.params.length]!);
    return shape;
  }
}
