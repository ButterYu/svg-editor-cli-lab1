import { Drawing } from '../domain/Drawing.js';
import { EditCommand } from './EditCommand.js';
export class DeleteCommand extends EditCommand {
  constructor(private id: string) { super(); }
  execute(d: Drawing): string { const s=d.find(this.id); d.parent(s).remove(s); return `${s.tag}#${s.id} deleted`; }
}
