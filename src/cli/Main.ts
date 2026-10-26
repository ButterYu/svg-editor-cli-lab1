import { createInterface } from 'node:readline';
import { Editor } from './Editor.js';
import { NodeFileStore } from '../infrastructure/NodeFileStore.js';
import { SvgCodec } from '../infrastructure/SvgCodec.js';
export class Main {
  run(): void {
    const editor=new Editor(new NodeFileStore(),new SvgCodec());
    const terminal=Boolean(process.stdin.isTTY);
    const input=createInterface({input:process.stdin,output:process.stdout,terminal});
    console.log("svg-editor 0.1 — type 'help' for commands");
    input.setPrompt('svg> ');if(terminal)input.prompt();
    input.on('line',line=>{const output=editor.execute(line);if(output)console.log(output);if(terminal)input.prompt();});
  }
}
new Main().run();
