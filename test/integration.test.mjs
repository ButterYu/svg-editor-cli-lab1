import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { NodeFileStore } from '../dist/infrastructure/NodeFileStore.js';
import { SvgCodec } from '../dist/infrastructure/SvgCodec.js';
test('real file adapter writes/reads Unicode and maps IO errors',()=>{
  const directory=mkdtempSync(join(tmpdir(),'svg-cli-'));try{const store=new NodeFileStore(),path=join(directory,'中文.svg');store.write(path,'<svg>你好</svg>');assert.equal(store.read(path),'<svg>你好</svg>');assert.throws(()=>store.read(join(directory,'missing')),/cannot read file:/);assert.throws(()=>store.write(join(directory,'missing','x'),'x'),/cannot write file:/);}finally{rmSync(directory,{recursive:true,force:true});}
});
test('real CLI replays assignment flowchart through stdin and produces readable SVG',()=>{
  const directory=mkdtempSync(join(tmpdir(),'svg-replay-'));try{const script=readFileSync('examples/flowchart.txt','utf8').replace('examples/flowchart.svg','diagram.svg');const run=spawnSync(process.execPath,[resolve('dist/cli/Main.js')],{cwd:directory,input:script,encoding:'utf8'});assert.equal(run.status,0,run.stderr);assert.doesNotMatch(run.stdout,/error:/);assert.match(run.stdout,/g#flowchart/);const svg=readFileSync(join(directory,'diagram.svg'),'utf8');const d=new SvgCodec().decode(svg).drawing;assert.equal(d.all().length,9);assert.equal(d.find('process-label').text,'处理数据 v2');assert.equal(d.find('process').attributes.get('y'),'100');}finally{rmSync(directory,{recursive:true,force:true});}
});
