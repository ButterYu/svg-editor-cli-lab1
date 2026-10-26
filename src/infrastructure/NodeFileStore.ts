import { readFileSync, writeFileSync, renameSync, unlinkSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { FileStore } from '../application/FileStore.js';
export class NodeFileStore implements FileStore {
  read(path: string): string { try { return readFileSync(path,'utf8'); } catch { throw new Error(`cannot read file: ${path}`); } }
  write(path: string, content: string): void { const temporary=`${path}.${randomUUID()}.tmp`;try { writeFileSync(temporary,content,'utf8');renameSync(temporary,path); } catch { try {unlinkSync(temporary);} catch {} throw new Error(`cannot write file: ${path}`); } }
}
