import { Drawing } from "../domain/Drawing.js";
import { EditCommand } from "./EditCommand.js";
export class History {
  private past: { before: Drawing; after: Drawing; message: string }[] = [];
  private future: { before: Drawing; after: Drawing; message: string }[] = [];
  private blocked = true;
  barrier(): void {
    this.past = [];
    this.future = [];
    this.blocked = true;
  }
  execute(
    command: EditCommand,
    current: Drawing,
  ): { drawing: Drawing; message: string } {
    const candidate = current.clone();
    const message = command.execute(candidate);
    this.past.push({
      before: current.clone(),
      after: candidate.clone(),
      message,
    });
    this.future = [];
    this.blocked = false;
    return { drawing: candidate, message };
  }
  undo(): Drawing {
    this.check();
    const entry = this.past.pop();
    if (!entry) throw new Error("nothing to undo");
    this.future.push(entry);
    return entry.before.clone();
  }
  redo(): Drawing {
    this.check();
    const entry = this.future.pop();
    if (!entry) throw new Error("nothing to redo");
    this.past.push(entry);
    return entry.after.clone();
  }
  private check(): void {
    if (this.blocked) throw new Error("undo not allowed after io command");
  }
}
