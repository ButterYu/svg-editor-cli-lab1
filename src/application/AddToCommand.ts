import { Drawing } from '../domain/Drawing.js';
import { EditCommand } from './EditCommand.js';
export class AddToCommand extends EditCommand {
  constructor(private gid: string, private id: string) { super(); }
  execute(d: Drawing): string { const g=d.container(this.gid), s=d.find(this.id); if (g===s || d.all(s).includes(g)) throw new Error(`cannot group a container into its own descendant: ${s.id}`); d.parent(s).remove(s);g.insert(s);return `${s.tag}#${s.id} moved into g#${g.id}`; }
}
