import { Drawing } from '../domain/Drawing.js';
export interface DrawingCodec { encode(drawing: Drawing): string; decode(content: string): {drawing: Drawing; warnings: string[]}; }
