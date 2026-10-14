import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const out = 'dist';
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'assets'), { recursive: true });
mkdirSync(join(out, 'gallery'), { recursive: true });
for (const path of ['index.html','assets/gallery.css','assets/gallery.js','gallery/projects.json']) {
  copyFileSync(path, join(out,path));
}
writeFileSync(join(out,'.nojekyll'), '');
console.log('Built approved gallery assets in dist/');
