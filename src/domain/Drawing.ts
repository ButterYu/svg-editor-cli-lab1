import { Group } from './Group.js';
import { Shape } from './Shape.js';
export class Drawing {
  private rootNode = new Group('__root__');
  constructor(private w = 800, private h = 600) { this.resize(w,h); }
  get width(): number { return this.w; }
  get height(): number { return this.h; }
  get root(): Group { return this.rootNode; }
  resize(w: number, h: number): void { if (![w,h].every(n => Number.isFinite(n) && n > 0)) throw new Error('canvas dimensions must be positive'); this.w=w; this.h=h; }
  all(parent: Shape = this.root): Shape[] { return parent.children.flatMap(child => [child, ...this.all(child)]); }
  find(id: string): Shape { const shape = this.all().find(s => s.id === id); if (!shape) throw new Error(`no such shape: ${id}`); return shape; }
  contains(id: string): boolean { return this.all().some(s => s.id === id); }
  requireNew(id: string): void { if (this.contains(id)) throw new Error(`id already exists: ${id}`); }
  container(id: string): Group {
    if (!this.contains(id)) throw new Error(`no such container: ${id}`);
    const target = this.find(id); if (!(target instanceof Group)) throw new Error(`not a container: ${id}`); return target;
  }
  parent(shape: Shape): Group { const parent = [this.root, ...this.all()].find(s => s.children.includes(shape)); if (!(parent instanceof Group)) throw new Error('orphan shape'); return parent; }
  attach(shape: Shape, parent = this.root): void { this.requireNew(shape.id); parent.insert(shape); }
  clone(): Drawing { const result = new Drawing(this.w,this.h); result.rootNode=this.root.clone(); return result; }
}
