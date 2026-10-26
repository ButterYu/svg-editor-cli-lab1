import { Drawing } from "../domain/Drawing.js";
import { EditCommand } from "./EditCommand.js";
export class MoveCommand extends EditCommand {
  constructor(
    private id: string,
    private dx: number,
    private dy: number,
  ) {
    super();
  }
  execute(d: Drawing): string {
    const s = d.find(this.id);
    s.move(this.dx, this.dy);
    return `${s.summary()} moved by (${this.dx},${this.dy})`;
  }
}
