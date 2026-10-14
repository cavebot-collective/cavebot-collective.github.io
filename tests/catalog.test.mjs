import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const catalog = JSON.parse(readFileSync('gallery/projects.json', 'utf8'));
const schema = JSON.parse(readFileSync('gallery/contract.schema.json', 'utf8'));
const slots = ['demo', 'specification', 'tests', 'ci'];

test('gallery contract version and complete project inventory', () => {
  assert.equal(catalog.schema_version, 2);
  assert.equal(schema.properties.schema_version.const, 2);
  assert.equal(catalog.projects.length, 11);
  assert.equal(new Set(catalog.projects.map(p => p.id)).size, catalog.projects.length);
});

test('all projects are discoverable without confusing discovery and source publication', () => {
  for (const p of catalog.projects) {
    assert.match(p.id, /^cavebot-collective\/[\w.-]+$/);
    assert.equal(p.publication, 'listed');
    assert.ok(p.title && p.summary && p.category);
    assert.ok(p.tags.length && new Set(p.tags).size === p.tags.length);
    assert.ok(['unpublished', 'publicly_available'].includes(p.source.availability));
    assert.ok(p.source.license === null || (typeof p.source.license === 'string' && p.source.license.length > 0));
    if (p.source.availability === 'unpublished') {
      assert.equal(p.url, null, 'an unpublished source cannot link to the private repository');
      assert.equal(p.source.license, null, 'private license is not offered as a public grant');
    } else {
      assert.equal(p.url, 'https://github.com/' + p.id);
    }
  }
});

test('each evidence slot is explicitly published, unpublished or unavailable', () => {
  for (const p of catalog.projects) {
    assert.deepEqual(Object.keys(p.slots).sort(), slots.slice().sort());
    for (const slot of Object.values(p.slots)) {
      if (slot === null) continue;
      if (slot.state === 'unpublished') {
        assert.deepEqual(slot, {state: 'unpublished'});
        assert.equal(p.source.availability, 'unpublished');
      } else {
        assert.ok(['source', 'published'].includes(slot.state));
        assert.match(slot.url, /^https:\/\//);
        assert.equal(p.source.availability, 'publicly_available');
      }
    }
  }
});

test('hero labels distinguish sourced media from conceptual diagrams', () => {
  for (const p of catalog.projects) {
    if (p.hero.kind === 'image') {
      assert.match(p.hero.url, /^https:\/\//);
      assert.ok(p.hero.alt && p.hero.fallback.length >= 2);
    } else {
      assert.equal(p.hero.kind, 'concept');
      assert.ok(p.hero.steps.length >= 2 && p.hero.steps.length <= 4);
    }
  }
});

test('known public sources are cataloged separately from unpublished projects', () => {
  assert.equal(catalog.projects.filter(p => p.source.availability === 'publicly_available').length, 2);
  assert.equal(catalog.projects.filter(p => p.source.availability === 'unpublished').length, 9);
});
