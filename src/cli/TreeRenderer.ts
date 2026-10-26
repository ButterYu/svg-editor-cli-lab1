import { Drawing } from "../domain/Drawing.js";
import { Shape } from "../domain/Shape.js";
export class TreeRenderer {
  render(d: Drawing, id?: string): string {
    const lines: string[] = [];
    const children = (shape: Shape, prefix: string): void => {
      shape.children.forEach((child, i) => {
        const last = i === shape.children.length - 1;
        lines.push(`${prefix}${last ? "└── " : "├── "}${child.summary()}`);
        children(child, prefix + (last ? "    " : "│   "));
      });
    };
    if (id) {
      const shape = d.find(id);
      lines.push(shape.summary());
      children(shape, "");
    } else {
      lines.push(`svg (${d.width}x${d.height})`);
      children(d.root, "");
    }
    return lines.join("\n");
  }
  show(d: Drawing, id: string): string {
    const s = d.find(id),
      parent = d.parent(s);
    return `${s.tag}#${s.id}  parent=${parent === d.root ? "svg" : `g#${parent.id}`}\n${[...s.attributes].map(([k, v]) => `  ${k}=${JSON.stringify(v)}`).join("\n")}`;
  }
}
