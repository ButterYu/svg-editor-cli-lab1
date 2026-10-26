import { Drawing } from "../domain/Drawing.js";
import { ShapeFactory } from "../domain/ShapeFactory.js";
import { EditCommand } from "./EditCommand.js";
export class CreateCommand extends EditCommand {
  constructor(
    private type: string,
    private id: string,
    private params: string[],
    private parentId?: string,
  ) {
    super();
  }
  execute(d: Drawing): string {
    d.requireNew(this.id);
    const parent = this.parentId ? d.container(this.parentId) : d.root;
    const shape = new ShapeFactory().create(this.type, this.id, this.params);
    d.attach(shape, parent);
    return `${shape.tag}#${shape.id} created${this.parentId ? ` in g#${this.parentId}` : ""}`;
  }
}
