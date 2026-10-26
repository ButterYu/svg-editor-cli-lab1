import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
test('domain has no application, infrastructure, CLI or Node imports; application has no adapters',()=>{
  for(const layer of ['domain','application'])for(const file of readdirSync(`src/${layer}`)){const text=readFileSync(`src/${layer}/${file}`,'utf8');assert.doesNotMatch(text,/from ['"](?:node:|.*(?:infrastructure|cli)\/)/,file);if(layer==='domain')assert.doesNotMatch(text,/from ['"].*application\//,file);const classes=[...text.matchAll(/export (?:abstract )?class (\w+)/g)];assert.ok(classes.length<=1,file);if(classes.length)assert.equal(file,`${classes[0][1]}.ts`);}
});
