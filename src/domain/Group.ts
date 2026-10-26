import { Shape } from './Shape.js';
export class Group extends Shape {
  private nodes: Shape[] = [];
  get tag(): string { return 'g'; }
  protected get geometry(): readonly string[] { return []; }
  protected get horizontal(): readonly string[] { return []; }
  protected get vertical(): readonly string[] { return []; }
  override get children(): readonly Shape[] { return [...this.nodes]; }
  insert(shape: Shape, index = this.nodes.length): void { this.nodes.splice(index, 0, shape); }
  remove(shape: Shape): void { const i = this.nodes.indexOf(shape); if (i < 0) throw new Error('shape is not a child'); this.nodes.splice(i,1); }
  clone(): Group { const result = new Group(this.id); this.copyInto(result); for (const child of this.nodes) result.insert(child.clone()); return result; }
}
