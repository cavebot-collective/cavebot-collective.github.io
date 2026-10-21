import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync('assets/gallery.js', 'utf8');
const catalog = JSON.parse(readFileSync('gallery/projects.json', 'utf8'));

class Element {
  constructor(tagName = 'div') {
    this.tagName = tagName;
    this.children = [];
    this.attributes = {};
    this.listeners = new Map();
    this.textContent = '';
    this.value = '';
    this.checked = false;
    this.hidden = false;
  }
  append(...nodes) { this.children.push(...nodes); }
  prepend(...nodes) { this.children.unshift(...nodes); }
  replaceChildren(...nodes) { this.children = [...nodes]; }
  setAttribute(key, value) { this.attributes[key] = String(value); }
  addEventListener(event, listener) { this.listeners.set(event, listener); }
  dispatch(event) { this.listeners.get(event)?.({ target: this }); }
}

async function runGallery(data) {
  const ids = ['projects', 'cards', 'count', 'empty', 'project-total', 'tags', 'query', 'sort', 'clear', 'reset'];
  const elements = new Map(ids.map(id => [id, new Element()]));
  const errors = [];
  const document = {
    getElementById(id) { return elements.get(id); },
    createElement(tagName) { return new Element(tagName); },
    createTextNode(value) { const e = new Element('#text'); e.textContent = value; return e; },
    querySelectorAll(selector) {
      assert.equal(selector, '#tags input[type="checkbox"]');
      return elements.get('tags').children.flatMap(label =>
        label.children.filter(child => child.tagName === 'input'));
    }
  };
  const fetch = async (url) => {
    assert.equal(url, './gallery/projects.json');
    return { ok: true, json: async () => data };
  };
  runInNewContext(script, { document, fetch, Intl, console: { error: (...args) => errors.push(args) } }, {
    filename: 'assets/gallery.js'
  });
  // Flush the two async fetch/json microtask steps and their render callback.
  await new Promise(resolve => setImmediate(resolve));
  return { elements, errors };
}

test('actual browser loader renders all catalog cards (schema compatibility regression)', async () => {
  const { elements, errors } = await runGallery(catalog);
  assert.deepEqual(errors, [], 'the browser must accept the deployed catalog schema');
  const cards = elements.get('cards').children;
  assert.equal(cards.length, catalog.projects.length);
  assert.equal(cards.length, 11);
  assert.equal(elements.get('count').textContent, '11 / 11');
  assert.equal(elements.get('empty').hidden, true);
  assert.equal(elements.get('cards').attributes['aria-busy'], 'false');
  // Identity panels contain only the project title; no synthetic graph structure.
  for (const card of cards) {
    const hero = card.children[0];
    assert.equal(hero.children.length, 1);
    assert.equal(hero.children[0].className, 'identity-title');
    assert.ok(hero.children[0].textContent);
    assert.equal(hero.children.some(child => ['pipeline', 'node', 'arrow'].includes(child.className)), false);
  }
  // No private source links should appear on any unpublished-source card.
  for (let index = 0; index < cards.length; index++) {
    const card = cards[index];
    const project = [...catalog.projects].sort((a,b) =>
      new Intl.Collator(undefined, { sensitivity: 'base', numeric: true }).compare(a.title,b.title))[index];
    const body = card.children[1];
    const heading = body.children.find(element => element.tagName === 'h3');
    const headingLink = heading.children[0];
    assert.equal(headingLink.tagName, project.source.availability === 'unpublished' ? 'span' : 'a');
  }
});

test('search, multi-select tags and reset work on actual rendered elements', async () => {
  const { elements, errors } = await runGallery(catalog);
  assert.deepEqual(errors, []);
  const search = elements.get('query');
  search.value = 'bitcarrier';
  search.dispatch('input');
  assert.equal(elements.get('cards').children.length, 1);
  assert.equal(elements.get('count').textContent, '1 / 11');
  elements.get('clear').dispatch('click');
  assert.equal(elements.get('cards').children.length, 11);
  const visualTag = elements.get('tags').children
    .flatMap(label => label.children)
    .find(node => node.tagName === 'input' && node.value === 'visualization');
  assert.ok(visualTag, 'visualization tag should exist');
  visualTag.checked = true;
  visualTag.dispatch('change');
  assert.equal(elements.get('cards').children.length, 2);
  elements.get('reset').dispatch('click');
  assert.equal(elements.get('cards').children.length, 11);
  assert.equal(visualTag.checked, false);
});

test('unsupported schema is rejected instead of silently rendering malformed content', async () => {
  const { elements, errors } = await runGallery({ ...catalog, schema_version: 999 });
  assert.equal(elements.get('cards').children.length, 0);
  assert.equal(elements.get('empty').hidden, false);
  assert.ok(errors.length);
});
