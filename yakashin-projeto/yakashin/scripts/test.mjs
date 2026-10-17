import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
await mkdir('.sites-runtime/tests',{recursive:true});
await build({stdin:{contents:["export * from './app/lib/types.ts';","export * from './app/lib/story.ts';","export * from './app/lib/chapter3.ts';","export * from './app/lib/narration.ts';","export * from './app/lib/music.ts';"].join('\n'),resolveDir:process.cwd(),loader:'ts'},bundle:true,format:'esm',platform:'node',target:'es2022',outfile:'.sites-runtime/tests/bundle.mjs'});
const r=spawnSync(process.execPath,['--test','tests/engines.test.mjs'],{stdio:'inherit'});process.exitCode=r.status??1;
