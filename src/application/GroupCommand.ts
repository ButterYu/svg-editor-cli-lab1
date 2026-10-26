import { Drawing } from '../domain/Drawing.js';
import { Group } from '../domain/Group.js';
import { EditCommand } from './EditCommand.js';
export class GroupCommand extends EditCommand {
  constructor(private id: string, private ids: string[]) { super(); }
  execute(d: Drawing): string {
    d.requireNew(this.id); if (!this.ids.length || new Set(this.ids).size!==this.ids.length) throw new Error('group requires distinct shapes');
    const requested=this.ids.map(id=>d.find(id));
    for (const s of requested) if (requested.some(other=>other!==s && d.all(s).includes(other))) throw new Error(`cannot group a container into its own descendant: ${s.id}`);
    const ordered=d.all().filter(s=>requested.includes(s)), group=new Group(this.id);
    const first=ordered[0]!, parent=d.parent(first), position=parent.children.indexOf(first);
    for (const s of ordered) { d.parent(s).remove(s); group.insert(s); }
    parent.insert(group,position); return `g#${this.id} created with ${ordered.length} children`;
  }
}
