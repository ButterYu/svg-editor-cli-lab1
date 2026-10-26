import { Drawing } from '../domain/Drawing.js';
import { DrawingCodec } from '../application/DrawingCodec.js';
import { FileStore } from '../application/FileStore.js';
import { History } from '../application/History.js';
import { EditCommand } from '../application/EditCommand.js';
import { CreateCommand } from '../application/CreateCommand.js';
import { DeleteCommand } from '../application/DeleteCommand.js';
import { MoveCommand } from '../application/MoveCommand.js';
import { ScaleCommand } from '../application/ScaleCommand.js';
import { SetCommand } from '../application/SetCommand.js';
import { GroupCommand } from '../application/GroupCommand.js';
import { UngroupCommand } from '../application/UngroupCommand.js';
import { AddToCommand } from '../application/AddToCommand.js';
import { OrderCommand } from '../application/OrderCommand.js';
import { Tokenizer } from './Tokenizer.js';
import { TreeRenderer } from './TreeRenderer.js';
export class Editor {
  private drawing?: Drawing;
  private path?: string;
  private history=new History();
  private readonly routes: Map<string,(args: string[])=>string>;
  constructor(private files: FileStore,private codec: DrawingCodec) {
    this.routes=new Map([
      ['init', a=>{if(![0,2].includes(a.length)) throw new Error('usage: init [w h]'); const d=new Drawing(a.length?this.number(a[0]!):800,a.length?this.number(a[1]!):600);this.drawing=d;this.path=undefined;this.history.barrier();return `canvas ${d.width}x${d.height} created`;}],
      ['read',a=>{this.arity(a,1);const result=this.codec.decode(this.files.read(a[0]!));this.drawing=result.drawing;this.path=a[0];this.history.barrier();return [...result.warnings,`read ${a[0]} (${result.drawing.all().length} elements)`].join('\n');}],
      ['save',a=>{if(a.length>1) throw new Error('usage: save [file.svg]');const d=this.document(),path=a[0]??this.path;if(!path) throw new Error('no file path. use save <file.svg>');this.files.write(path,this.codec.encode(d));this.path=path;this.history.barrier();return `saved to ${path} (${d.all().length} elements)`;}],
      ['canvas',a=>{const d=this.document();if(!a.length)return `canvas ${d.width}x${d.height}`;this.arity(a,2);const candidate=d.clone();candidate.resize(this.number(a[0]!),this.number(a[1]!));this.drawing=candidate;this.history.barrier();return `canvas ${candidate.width}x${candidate.height}`;}],
      ['create',a=>{if(a.length<2)throw new Error('usage: create <type> <id> [params] [in <containerId>]');const params=a.slice(2);let parent: string|undefined;if(params.length>=2&&params[params.length-2]==='in'){parent=params.pop();params.pop();}return this.edit(new CreateCommand(a[0]!,a[1]!,params,parent));}],
      ['delete',a=>{this.arity(a,1);return this.edit(new DeleteCommand(a[0]!));}],
      ['move',a=>{this.arity(a,3);return this.edit(new MoveCommand(a[0]!,this.number(a[1]!),this.number(a[2]!)));}],
      ['scale',a=>{this.arity(a,2);return this.edit(new ScaleCommand(a[0]!,this.number(a[1]!)));}],
      ['set',a=>{this.arity(a,3);return this.edit(new SetCommand(a[0]!,a[1]!,a[2]!));}],
      ['group',a=>{if(a.length<2)throw new Error('usage: group <newGid> <id1> [id2 ...]');return this.edit(new GroupCommand(a[0]!,a.slice(1)));}],
      ['ungroup',a=>{this.arity(a,1);return this.edit(new UngroupCommand(a[0]!));}],
      ['addto',a=>{this.arity(a,2);return this.edit(new AddToCommand(a[0]!,a[1]!));}],
      ['front',a=>{this.arity(a,1);return this.edit(new OrderCommand(a[0]!,true));}],
      ['back',a=>{this.arity(a,1);return this.edit(new OrderCommand(a[0]!,false));}],
      ['tree',a=>{if(a.length>1)throw new Error('usage: tree [id]');return new TreeRenderer().render(this.document(),a[0]);}],
      ['show',a=>{this.arity(a,1);return new TreeRenderer().show(this.document(),a[0]!);}],
      ['undo',a=>{this.arity(a,0);this.document();this.drawing=this.history.undo();return 'undo completed';}],
      ['redo',a=>{this.arity(a,0);this.document();this.drawing=this.history.redo();return 'redo completed';}],
      ['help',a=>{this.arity(a,0);return 'init [w h]\nread <file.svg>\nsave [file.svg]\ncanvas [w h]\ncreate <type> <id> [params] [in <containerId>]\n  rect: x y width height [fill]\n  circle: cx cy r [fill]\n  ellipse: cx cy rx ry [fill]\n  line: x1 y1 x2 y2 [stroke]\n  text: x y "content"\n  g: (no params)\ndelete <id>\nmove <id> <dx> <dy>\nscale <id> <factor>\nset <id> <attr> <value>\ngroup <newGid> <id1> [id2 ...]\nungroup <gid>\naddto <gid> <id>\nfront <id>\nback <id>\ntree [id]\nshow <id>\nundo\nredo\nhelp';}],
    ]);
  }
  execute(line: string): string {
    try {const tokens=new Tokenizer().parse(line);if(!tokens.length)return '';const name=tokens.shift()!,handler=this.routes.get(name);if(!handler)throw new Error(`unknown command: ${name}`);if(!this.drawing&&!['init','read','help'].includes(name))this.document();return handler(tokens);}
    catch(error) {return `error: ${(error instanceof Error?error.message:String(error)).replace(/[\r\n]+/g,' ')}`;}
  }
  private document(): Drawing {if(!this.drawing)throw new Error("no document. use 'init' or 'read' first");return this.drawing;}
  private edit(command: EditCommand): string {const result=this.history.execute(command,this.document());this.drawing=result.drawing;return result.message;}
  private arity(a: string[],n: number): void {if(a.length!==n)throw new Error(`expected ${n} arguments`);}
  private number(value: string): number {if(!value.trim()||!Number.isFinite(Number(value)))throw new Error(`invalid number: ${value}`);return Number(value);}
}
