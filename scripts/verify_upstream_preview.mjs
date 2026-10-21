#!/usr/bin/env node
// Verify the Gallery's one source-derived visual against an immutable public
// upstream project commit. No mutable 'main' refs or unpublished code.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const catalog = JSON.parse(readFileSync('gallery/projects.json', 'utf8'));
const candidates = catalog.projects.filter(p => p.hero.kind === 'registry_inventory');
assert.equal(candidates.length, 1, 'Exactly one source-derived visual admitted in v1');
const p = candidates[0], hero = p.hero, proof = hero.evidence;
assert.equal(p.source.availability, 'publicly_available');
assert.equal(proof.project_id, p.id);
assert.match(proof.source_commit, /^[a-f0-9]{40}$/);
assert.equal(proof.producer_path, 'gallery/preview.v1.json');
assert.equal(proof.source_path, 'registry/registry.json');

const base = 'https://raw.githubusercontent.com/' + proof.project_id + '/' + proof.source_commit + '/';
async function sourceBytes(path) {
  if (!/^[a-z0-9][a-z0-9/._-]+$/i.test(path) || path.includes('..')) throw Error('Unsafe source path');
  const url = base + path;
  for(let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(url, {signal: AbortSignal.timeout(20000), headers: {'User-Agent':'cavebot-gallery-evidence-check'}});
      if (!r.ok) throw Error('HTTP ' + r.status + ' for ' + url);
      return Buffer.from(await r.arrayBuffer());
    } catch(e) { if(attempt === 1) throw e; }
  }
}

const [manifestBytes, registryBytes] = await Promise.all([
  sourceBytes(proof.producer_path), sourceBytes(proof.source_path)
]);
const manifest = JSON.parse(manifestBytes);
const registry = JSON.parse(registryBytes);
const blobSha = createHash('sha1')
  .update(Buffer.from('blob ' + registryBytes.length + '\0'))
  .update(registryBytes).digest('hex');
assert.equal(blobSha, proof.source_git_blob_sha);
assert.equal(manifest.schema_version, 1);
assert.equal(manifest.project_id, p.id);
assert.equal(manifest.evidence.status, 'observed');
assert.equal(manifest.evidence.source_path, proof.source_path);
assert.equal(manifest.evidence.source_git_blob_sha, blobSha);
assert.equal(manifest.evidence.derived_by, proof.derived_by);
assert.equal(manifest.visual.kind, hero.kind);
assert.equal(manifest.visual.title, hero.title);
assert.equal(manifest.visual.description, hero.description);
assert.deepEqual(manifest.visual.metrics, hero.metrics);
const counts = {
 systems: registry.systems.length,
 triggers: registry.triggers.length,
 recommendations: registry.recommendations.length,
 families: new Set(registry.triggers.map(t => t.family)).size
};
assert.deepEqual(Object.fromEntries(hero.metrics.map(m => [m.id, m.value])), counts);
const systemIds = new Set(registry.systems.map(x=>x.id));
const triggerIds = new Set(registry.triggers.map(x=>x.id));
assert.ok(registry.recommendations.every(r => systemIds.has(r.system_id) && triggerIds.has(r.trigger_id)));
assert.equal(new Set(hero.metrics.map(m=>m.id)).size,hero.metrics.length);
console.log('PASS: site hero exactly matches immutable Right Tool producer + source data: ' + proof.source_commit);
