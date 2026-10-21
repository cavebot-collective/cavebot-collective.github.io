# Federated project gallery

## Decision

The homepage consumes independent, versioned project presentation bundles. It should not compile every project from Git submodules. The first version uses a curated, version-controlled public gallery catalog at `gallery/projects.json`; a future fan-in adapter can fetch independently produced bundles without changing the card UI.

```text
project repository: tests + specification + demo + visual
    -> project-local CI
    -> immutable presentation bundle (manifest + evidence + assets)
    -> release asset + SHA-256 provenance
    -> gallery intake (explicit allowlist + pinned SHA-256 + schema validation)
    -> locked static catalog
    -> GitHub Pages deployment
```

## Why not submodules?

Submodules pin source commits, but they couple the homepage pipeline to heterogeneous checkout and build dependencies. Ephemeral runners are not the fundamental problem: content-addressed or commit-pinned inputs make reproducibility independent of workspace persistence. Cache between runs for speed, not correctness.

Prefer GitHub Releases or immutable content-addressed storage for durable bundles. Workflow artifacts expire according to organization retention and are better for CI handoffs than for permanent gallery dependencies. The fan-in stage should pin digest and upstream commit, not silently fetch the mutable latest result.

## Source repository contract

A producer may provide:
- **Identity:** stable id, title, description, topical tags and project phase.
- **Hero:** an editorial typography-only project identity panel by default. An exception may be made for an independently source-verified, non-relational observation tile such as Right Tool's registry inventory (pinned upstream commit, producer manifest, source Git blob and verified cardinalities). Real screenshots/diagrams must pass the [visual evidence policy](VISUAL-EVIDENCE-POLICY.md) before admission. No invented conceptual topology, flow, stages, or architectural relationships.
- **Demo:** hosted static demo, deterministic recorded demonstration, or a clearly labeled link to demo source.
- **Specification:** normative document URL, version and commit.
- **Tests:** suite entrypoint plus validated machine-readable test result or coverage, with test run URL and observed timestamp. Presence of test files does not imply passing tests.
- **CI:** workflow definition *separately from* most recent execution result.
- **Residuals:** missing slot, reason, verification policy, and suggested next step.
- **Provenance:** repository, source commit, workflow run identity, build inputs and artifact SHA-256.

The catalog schema in `gallery/contract.schema.json` is a **publication projection**, not the full producer format. Missing slots are explicit nulls. A source link has state `source`, not `published`. Repository-owned artifacts and plans remain authoritative; the gallery must never promote its cached projection to authoritative project state.

## Publication and trust boundary

Project discoverability and source access are independent. All 11 project identities and approved short descriptions are publicly discoverable. Private repositories are explicitly labeled **Source unpublished**; public repositories are labeled **Source publicly available**. The build never includes unpublished source URLs or credentials. Project-owned demos, images, and evidence are published only if they are separately safe to expose. License identifiers appear only when a public repository license is verified; lack of a verified license must not be described as open-source licensing.

Avoid directly embedding untrusted HTML in the main Pages origin; prefer a sandboxed or isolated demo origin. Validate types and sanitize untrusted SVG at artifact intake. Do not place tokens or write privileges in the browser.

A private source repository can still produce a publicly visible Pages site, depending on org plan and policy. Verify Pages visibility before merging.

## Repository inventory baseline (October 13, 2026)

Cavebot Collective has 12 accessible repositories: 11 candidate project repositories and one initially empty Pages repository. All 11 projects are represented in the public gallery: two have publicly available source, nine have unpublished source. Their detailed artifacts remain access-controlled. This is an inventory, *not* a claim that individual project builds are green.

## Planned federated integration

1. Adopt a producer manifest `gallery/gallery.v1.json` in individual repositories, with local schema checks and tests.
2. Upload a versioned tar/zip bundle to GitHub Releases, include manifest, asset checksums, build commit and workflow run metadata.
3. Maintain a gallery-side allowlist and immutable lockfile of project-id → release asset SHA-256 and source commit.
4. Fetch only allowlisted assets on gallery builds, verifying checksum, schema, MIME, size, and sanitization rules. Cache pinned bundles by digest.
5. Generate a static approved public catalog and an auditable residuals report.
6. Trigger gallery rebuild by pull request (or approved dispatch) when an upstream project publishes a new bundle; never auto-publish unreviewed private data.
7. Add screenshot snapshots, broken-link detection, keyboard/mobile tests, and a CI status adapter with temporal provenance.

## Operator instructions

Run `npm test && npm run build` with Node.js 22. Inspect `dist/`, which contains only approved site assets. Configure GitHub Pages to deploy through **GitHub Actions** under Settings → Pages. The workflow verifies on pull requests and deploys on main after review, subject to Pages organization policy.

Do not conflate the site branch with the deployment: a feature branch with a passing test suite is not evidence that Pages is enabled or reachable.

## Visual publication guarantee

Identity panels are not evidence or visualization. No source-independent diagram may be synthesized solely to fill visual space. Promoting a visual to the public gallery requires stable links to the source material, explicit semantic assertions and independent review as described in [VISUAL-EVIDENCE-POLICY.md](VISUAL-EVIDENCE-POLICY.md). This gate is separate from repository discoverability or publication of text.

## Executable provenance gate (first implementation)

The source repository `cavebot-collective/right-tool` owns the exporter `scripts/export_gallery.mjs` and `gallery/preview.v1.json`; CI there checks byte-for-byte regeneration from `registry/registry.json`. The site locks the upstream source commit in the Right Tool hero and runs `scripts/verify_upstream_preview.mjs` as a cross-repository publication gate. This fetches **only the pinned public commit**, checks the exported preview and source blob, and derives all four values independently.

This is a first vertical slice of the project-owned artifact contract, not general support for arbitrary external media. Other project heroes remain identity-only until a comparable producer/acceptance chain exists.
