import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const out = 'dist';
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'assets'), { recursive: true });
mkdirSync(join(out, 'gallery'), { recursive: true });
for (const path of ['index.html', 'assets/gallery.css', 'assets/gallery.js', 'gallery/projects.json']) {
  copyFileSync(path, join(out, path));
}
// Pages/CDN/browser caches must not continue serving an old JS loader after
// the catalog schema changes. Content-address asset URLs on every build.
let html = readFileSync(join(out, 'index.html'), 'utf8');
for (const path of ['assets/gallery.js', 'assets/gallery.css']) {
  const digest = createHash('sha256').update(readFileSync(join(out, path))).digest('hex').slice(0, 16);
  const href = './' + path;
  if (!html.includes(href + '"')) throw new Error('Missing asset reference: ' + href);
  html = html.replace(href + '"', href + '?v=' + digest + '"');
}
writeFileSync(join(out, 'index.html'), html);
writeFileSync(join(out, '.nojekyll'), '');
console.log('Built version-pinned gallery assets in dist/');
