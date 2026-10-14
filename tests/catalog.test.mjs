import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const catalog = JSON.parse(readFileSync('gallery/projects.json','utf8'));
const schema = JSON.parse(readFileSync('gallery/contract.schema.json','utf8'));
const slots = ['demo','specification','tests','ci'];
test('contract schema and version are present', () => {
  assert.equal(catalog.schema_version,1);
  assert.equal(schema.properties.schema_version.const,1);
  assert.ok(catalog.projects.length);
});
test('explicitly approved public repositories only; no duplicates', () => {
  const ids = new Set();
  for (const p of catalog.projects) {
    assert.equal(p.visibility,'public');
    assert.equal(p.publication,'approved');
    assert.match(p.id,/^cavebot-collective\/[\w.-]+$/);
    assert.equal(p.url,'https://github.com/' + p.id);
    assert.ok(!ids.has(p.id)); ids.add(p.id);
    assert.ok(p.title && p.summary && p.category);
    assert.ok(Array.isArray(p.tags) && p.tags.length);
    assert.equal(new Set(p.tags).size,p.tags.length);
  }
});
test('required slots are explicit and evidence links are valid', () => {
  for (const p of catalog.projects) {
    assert.deepEqual(Object.keys(p.slots).sort(),slots.slice().sort());
    for (const slot of Object.values(p.slots)) {
      if (slot === null) continue;
      assert.ok(['source','published'].includes(slot.state));
      assert.match(slot.url,/^https:\/\//);
    }
  }
});
test('hero provenance separates project imagery and conceptual diagrams', () => {
  for (const p of catalog.projects) {
    if(p.hero.kind === 'image') {
      assert.match(p.hero.url,/^https:\/\//);
      assert.ok(p.hero.alt && p.hero.fallback.length >= 2);
    } else {
      assert.equal(p.hero.kind,'concept');
      assert.ok(p.hero.steps.length >= 2 && p.hero.steps.length <= 4);
    }
  }
});
test('the published catalog excludes unpublished private records', () => {
  const all = JSON.stringify(catalog);
  assert.doesNotMatch(all,/"visibility"\s*:\s*"private"/);
  assert.doesNotMatch(all,/"publication"\s*:\s*"pending"/);
});
