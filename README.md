# Cavebot Collective — project gallery

Responsive, filterable gallery for evidence-backed engineering projects. Identity tiles replace non-evidenced schematic placeholders. View `index.html` and the curated `gallery/projects.json` manifest.

## Develop

Requires Node.js 22. No runtime framework or installed packages.

```sh
npm test
npm run build
```

The build emits `dist/` with public project overviews for all 11 projects, without private repository URLs or unpublished source artifacts.

## Rules

- Source repositories remain authoritative for their specs, tests and state.
- All 11 projects are discoverable. Public source and unpublished source are labeled separately.
- A source path is **not** proof of a passing test or a working live demo.
- Unpublished source links and internal audit details are excluded from `dist/`.
- The future fan-in intake pins project presentation bundles by content digest and source commit; Git submodules are not necessary.

See [architecture](docs/ARCHITECTURE.md) and [11-project source audit](docs/PROJECT-AUDIT.md).

## Publish

GitHub Actions verifies pull requests and deploys on push to `main` after Pages is configured to use GitHub Actions. Repo and Pages visibility are separate decisions.

See [visual evidence policy](docs/VISUAL-EVIDENCE-POLICY.md) before supplying screenshots or semantic diagrams. No visual relationship may be invented to fill an empty slot.

## First evidence-backed visual

Right Tool's public registry exposes a generated and checked `gallery/preview.v1.json` with four unambiguous inventory measures. The site displays those counts as a statistics tile, not an architecture diagram. CI independently checks the snapshot against a pinned source commit. All other projects remain identity-only pending equivalent source-backed evidence.
