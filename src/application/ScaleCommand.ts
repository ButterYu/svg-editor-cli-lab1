import { Drawing } from '../domain/Drawing.js';
import { EditCommand } from './EditCommand.js';
export class ScaleCommand extends EditCommand {
  constructor(private id: string, private factor: number) { super(); }
  execute(d: Drawing): string { const s=d.find(this.id); s.scale(this.factor); return `${s.tag}#${s.id} scaled by ${this.factor}`; }
}
