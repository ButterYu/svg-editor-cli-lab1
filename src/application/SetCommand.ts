import { Drawing } from '../domain/Drawing.js';
import { EditCommand } from './EditCommand.js';
export class SetCommand extends EditCommand {
  constructor(private id: string, private attr: string, private value: string) { super(); }
  execute(d: Drawing): string { const s=d.find(this.id); s.set(this.attr,this.value); return `${s.tag}#${s.id} updated: ${this.attr}=${JSON.stringify(this.value)}`; }
}
