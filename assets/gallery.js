/* Source-of-truth: gallery/projects.json. Never scrape private repositories from the browser. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const state = { projects: [], selected: new Set(), query: "", sort: "title" };
  const slotNames = { demo: "Demo", specification: "Spec", tests: "Tests", ci: "CI" };
  const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const link = (url, text, className) => {
    const a = make("a", className, text);
    a.href = url;
    return a;
  };
  function matches(project) {
    const corpus = [project.title, project.summary, project.category, ...project.tags].join(" ").toLocaleLowerCase();
    const words = state.query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return words.every((word) => corpus.includes(word)) &&
      (!state.selected.size || [...state.selected].some((tag) => project.tags.includes(tag)));
  }
  const availableCount = (p) => Object.values(p.slots).filter((s) => s && s.url).length;
  function hero(p) {
    if (p.hero.kind === "registry_inventory") {
      const box = make("div", "hero hero-registry");
      box.setAttribute("aria-label", "Observed registry inventory for " + p.title);
      const panel = make("div", "registry-panel");
      panel.append(make("div", "registry-heading", p.hero.title));
      const metrics = make("dl", "registry-metrics");
      for (const metric of p.hero.metrics) {
        const measure = make("div", "registry-measure");
        // A description list is label (dt) followed by value (dd), even
        // when CSS chooses to display the number first.
        measure.append(make("dt", "registry-name", metric.label));
        measure.append(make("dd", "registry-value", String(metric.value)));
        metrics.append(measure);
      }
      panel.append(metrics);
      const provenance = make("div", "registry-provenance");
      provenance.append(make("span", "", "OBSERVED · REGISTRY ENTRIES"));
      const source = p.hero.evidence;
      provenance.append(link(
        "https://github.com/" + source.project_id + "/blob/" +
          source.source_commit + "/" + source.source_path,
        "View source ↗", "registry-source"
      ));
      panel.append(provenance);
      box.append(panel);
      return box;
    }
    if (p.hero.kind !== "identity") throw Error("Unsupported hero kind");
    // Editorial identity tile: never infer edges or stages from prose.
    const box = make("div", "hero hero-identity");
    box.setAttribute("aria-label", "Project: " + p.title);
    box.append(make("div", "identity-title", p.title));
    return box;
  }
  function card(p) {
    const article = make("article", "card");
    article.append(hero(p));
    const body = make("div", "card-body");
    body.append(make("div", "category", p.category));
    const h = make("h3");
    h.append(p.source.availability === "publicly_available" ? link(p.url, p.title) : make("span", "", p.title));
    body.append(h);
    const publication = make("div", "publication");
    publication.append(make("span", p.source.availability === "publicly_available" ? "source-open" : "source-unpublished",
      p.source.availability === "publicly_available" ? "Source publicly available" : "Source unpublished"));
    if (p.source.license) publication.append(make("span", "source-license", "License: " + p.source.license));
    body.append(publication);
    body.append(make("p", "summary", p.summary));
    const labels = make("div", "labels");
    p.tags.forEach((t) => labels.append(make("span", "", t)));
    body.append(labels);
    const evidence = make("div", "evidence");
    evidence.setAttribute("aria-label", "Project evidence");
    Object.entries(slotNames).forEach(([key, title]) => {
      const slot = p.slots[key];
      if (slot && slot.url) {
        const l = link(slot.url, title + (slot.state === "source" ? " ↗" : " ↗"), "slot");
        l.title = slot.state === "source" ? "Repository source, not a hosted demo" : "View evidence source; link does not assert that checks pass";
        evidence.append(l);
      } else {
        const unpublished = slot && slot.state === "unpublished";
        const el = make("span", "slot missing", title + (unpublished ? " · unpublished" : " —"));
        el.title = unpublished ? "Evidence exists in an unpublished repository; no public link" : "Not supplied or not verified";
        evidence.append(el);
      }
    });
    body.append(evidence); article.append(body); return article;
  }
  function render() {
    const filtered = state.projects.filter(matches);
    filtered.sort((a, b) => {
      if (state.sort === "evidence") return availableCount(b) - availableCount(a) || collator.compare(a.title, b.title);
      if (state.sort === "category") return collator.compare(a.category, b.category) || collator.compare(a.title, b.title);
      return collator.compare(a.title, b.title);
    });
    const root = $("cards"); root.replaceChildren(...filtered.map(card));
    root.setAttribute("aria-busy", "false");
    $("count").textContent = filtered.length + " / " + state.projects.length;
    $("empty").hidden = filtered.length !== 0;
    $("clear").hidden = !state.selected.size && !state.query;
  }
  function clear() {
    state.selected.clear(); state.query = ""; $("query").value = "";
    document.querySelectorAll('#tags input[type="checkbox"]').forEach((input) => { input.checked = false; });
    render();
  }
  function setup(projects) {
    state.projects = projects;
    const counts = new Map();
    projects.forEach((p) => p.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
    const tags = $("tags");
    [...counts].sort(([a], [b]) => collator.compare(a, b)).forEach(([tag, count]) => {
      const wrapper = make("label", "tag");
      const input = make("input"); input.type = "checkbox"; input.value = tag; input.setAttribute("aria-label", tag);
      input.addEventListener("change", () => { input.checked ? state.selected.add(tag) : state.selected.delete(tag); render(); });
      wrapper.append(input, document.createTextNode(tag), make("small", "", String(count)));
      tags.append(wrapper);
    });
    $("query").addEventListener("input", (e) => { state.query = e.target.value.trim(); render(); });
    $("sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
    $("clear").addEventListener("click", clear);
    $("reset").addEventListener("click", clear);
    $("project-total").textContent = projects.length + " project" + (projects.length === 1 ? "" : "s") + " in gallery";
    render();
  }
  fetch("./gallery/projects.json", { cache: "no-store" })
    .then((response) => { if (!response.ok) throw Error("Catalog HTTP " + response.status); return response.json(); })
    .then((catalog) => {
      if (catalog.schema_version !== 4 || !Array.isArray(catalog.projects)) throw Error("Invalid gallery catalog");
      if (catalog.projects.some((p) =>
        p.publication !== "listed" ||
        !p.source || !["unpublished", "publicly_available"].includes(p.source.availability) ||
        (p.source.availability === "unpublished" && (p.url || Object.values(p.slots).some((slot) => slot && slot.url))) ||
        (p.source.availability === "publicly_available" && !p.url)
      )) throw Error("Invalid source publication boundary");
      setup(catalog.projects);
    })
    .catch((e) => {
      $("cards").setAttribute("aria-busy", "false");
      $("empty").hidden = false;
      $("empty").textContent = "Gallery data unavailable. Browse repositories at github.com/cavebot-collective.";
      console.error("Gallery catalog error:", e);
    });
})();
