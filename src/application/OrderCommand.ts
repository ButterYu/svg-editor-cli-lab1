import { Drawing } from '../domain/Drawing.js';
import { EditCommand } from './EditCommand.js';
export class OrderCommand extends EditCommand {
  constructor(private id: string, private front: boolean) { super(); }
  execute(d: Drawing): string { const s=d.find(this.id),parent=d.parent(s);parent.remove(s);parent.insert(s,this.front ? parent.children.length : 0);return `${s.tag}#${s.id} moved to ${this.front?'front':'back'}`; }
}
