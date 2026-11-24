import {cp, readdir, rm} from 'node:fs/promises';

// Pages serves the repository root; keep the compiled entry and assets there.
await cp('dist/index.html', 'index.html');
await rm('assets', {recursive:true, force:true});
await cp('dist/assets', 'assets', {recursive:true});
console.log(`Published build with ${(await readdir('assets')).length} local assets.`);
