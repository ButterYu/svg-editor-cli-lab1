import { Drawing } from "../domain/Drawing.js";
import { EditCommand } from "./EditCommand.js";
export class UngroupCommand extends EditCommand {
  constructor(private id: string) {
    super();
  }
  execute(d: Drawing): string {
    const g = d.container(this.id),
      parent = d.parent(g);
    if (parent === d.root)
      throw new Error(`cannot ungroup top-level container: ${this.id}`);
    const index = parent.children.indexOf(g);
    parent.remove(g);
    g.children.forEach((s, i) => {
      g.remove(s);
      parent.insert(s, index + i);
    });
    return `g#${this.id} ungrouped`;
  }
}
