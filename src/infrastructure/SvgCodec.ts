import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { Drawing } from '../domain/Drawing.js';
import { Shape } from '../domain/Shape.js';
import { Group } from '../domain/Group.js';
import { ShapeFactory } from '../domain/ShapeFactory.js';
import { DrawingCodec } from '../application/DrawingCodec.js';
export class SvgCodec implements DrawingCodec {
  encode(d: Drawing): string {
    const xml=new DOMImplementation().createDocument('http://www.w3.org/2000/svg','svg',null), root=xml.documentElement!;
    root.setAttribute('width',String(d.width));root.setAttribute('height',String(d.height));root.setAttribute('viewBox',`0 0 ${d.width} ${d.height}`);
    const append=(shape: Shape,parent: typeof root): void=>{ const element=xml.createElementNS('http://www.w3.org/2000/svg',shape.tag);element.setAttribute('id',shape.id);for (const [k,v] of shape.attributes) if(k!=='text') element.setAttribute(k,v); if(shape.text) element.appendChild(xml.createTextNode(shape.text));for(const child of shape.children) append(child,element);parent.appendChild(element); };
    for(const child of d.root.children) append(child,root);
    return '<?xml version="1.0" encoding="UTF-8"?>\n'+new XMLSerializer().serializeToString(xml)+'\n';
  }
  decode(content: string): {drawing: Drawing;warnings: string[]} {
    if (/<!DOCTYPE|<!ENTITY/i.test(content)) throw new Error('DTD and entities are not supported');
    const errors: string[]=[];
    const xml=new DOMParser({onError: (_level,message)=>{errors.push(message);}}).parseFromString(content,'image/svg+xml');
    if(errors.length || !xml.documentElement || xml.documentElement.localName!=='svg') throw new Error('invalid SVG document');
    const root=xml.documentElement;
    if(root.namespaceURI && root.namespaceURI!=='http://www.w3.org/2000/svg') throw new Error('invalid SVG namespace');
    const dimensions=(root.getAttribute('viewBox')??'').trim().split(/[\s,]+/).map(Number);
    const d=new Drawing(Number(root.getAttribute('width') || dimensions[2] || 800),Number(root.getAttribute('height') || dimensions[3] || 600));
    const ids=new Set<string>(),warnings: string[]=[];
    const elements=Array.from(root.getElementsByTagName('*'));
    for(const e of [root,...elements]) { const id=e.getAttribute('id'); if(id) {if(ids.has(id)) throw new Error(`id already exists: ${id}`);ids.add(id);} }
    const parse=(element: typeof root,parent: Group): void=>{
      let id=element.getAttribute('id');const tag=element.localName ?? element.tagName;
      if(!id) { let n=1;while(ids.has(`${tag}${n}`)) n++;id=`${tag}${n}`;ids.add(id);warnings.push(`warning: assigned id ${id} to unnamed <${tag}>`); }
      const shape=new ShapeFactory().empty(tag,id);
      for(const attr of Array.from(element.attributes)) {
        if(['id','xmlns','data-kind'].includes(attr.name)) continue;
        shape.set(attr.name,attr.value);
      }
      if(shape instanceof Group) { for(const child of Array.from(element.childNodes)) if(child.nodeType===1) parse(child as typeof root,shape); }
      else { if(Array.from(element.childNodes).some(c=>c.nodeType===1)) throw new Error('nested elements require a group'); shape.importText(element.textContent??''); }
      parent.insert(shape);
    };
    for(const child of Array.from(root.childNodes)) if(child.nodeType===1) parse(child as typeof root,d.root);
    return {drawing:d,warnings};
  }
}
