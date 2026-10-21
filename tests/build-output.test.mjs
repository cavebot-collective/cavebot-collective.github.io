import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('both source Pages and custom Actions site use cache-safe asset URLs', () => {
  const src = readFileSync('index.html', 'utf8');
  assert.match(src, /src="\.\/assets\/gallery\.js\?v=[^"]+"/);
  assert.match(src, /href="\.\/assets\/gallery\.css\?v=[^"]+"/);
  execFileSync(process.execPath, ['scripts/build.mjs'], { stdio: 'pipe' });
  const html = readFileSync('dist/index.html', 'utf8');
  for (const path of ['assets/gallery.js', 'assets/gallery.css']) {
    const digest = createHash('sha256')
      .update(readFileSync('dist/' + path))
      .digest('hex').slice(0, 16);
    assert.ok(html.includes('./' + path + '?v=' + digest), path + ' must use its content hash');
  }
  assert.ok(existsSync('dist/gallery/projects.json'));
  assert.equal(existsSync('dist/docs/PROJECT-AUDIT.html'), false, 'internal audit is not a gallery deploy artifact');
  assert.equal(JSON.parse(readFileSync('dist/gallery/projects.json', 'utf8')).projects.length, 11);
});
