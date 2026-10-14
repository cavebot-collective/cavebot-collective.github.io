# Cavebot Collective — project gallery

Responsive, filterable gallery for evidence-backed engineering projects. View `index.html` and the curated `gallery/projects.json` manifest.

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
