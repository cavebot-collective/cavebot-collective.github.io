# Cavebot Collective project inventory and gallery slot audit

Observed on 2026-10-13 via default-branch Git trees and README documents. This is a *source presence audit*, not a test execution audit. `candidate` means suggested gallery representation, not an already available hosted asset. Detailed private source paths and internal audit evidence in this document are for planning only. Project names and approved descriptions are public in the gallery; source and confidential artifacts are not.

| Project | Visibility | Best hero/demo target | Normative spec candidate | Test evidence candidate | Workflow candidate | Residual |
| --- | --- | --- | --- | --- | --- | --- |
| [RegistryState](https://github.com/cavebot-collective/registry-state) | private | Content-addressed acquisition pipeline + deterministic `registrystate integrity` CLI transcript | README.md | `tests/RegistryState.Tests.Unit`, `tests/RegistryState.Tests.Integration` | `registry-state-index-ci.yml` | capture demo, pass-state evidence, publication approval |
| [PieceCore](https://github.com/cavebot-collective/piece-core) | private | Concept/architecture diagram after migration | README.md (migration placeholder only) | none observed | none observed | source implementation and baseline contract absent |
| [KnotTied](https://github.com/cavebot-collective/knot-tied) | private | DSU / union-find tree visualization; variant & complexity examples | `docs/ARCHITECTURE.md`, `docs/WORKPLAN.md` | `tests/KnotTied.Tests/UnionFindTests.cs` | `knottied-ci.yml`, `knottied-perf.yml` | reproducible visual or snapshot + publication approval |
| [BitCarrier](https://github.com/cavebot-collective/bit-carrier) | private | Bit packing / partial-octet canonicalization diagram + conformance vectors | `docs/bitcarrier-protocol.md` | `js/test`, `python/tests`, `tests/BitOrientedCrypto.Tests` | `bitstrings-bit-oriented-crypto.yml` | highlight parity + partial-tail invariants, digest provenance |
| [CallbackLoop](https://github.com/cavebot-collective/callback-loop) | private | Single-owner scheduling and ingress diagram with trace | README.md, ROADMAP.md | `tests/CallbackLoop.Runtime.Tests` | `callback-loop-runtime.yml` | reproducible schedule trace and screenshots |
| [Threadscape](https://github.com/cavebot-collective/threadscape) | private | **Actual UI snapshot** from `viewer/index.html` | README.md | `tests/Threadscape.*Probe` | `ci.yml`, `recorder-benchmark.yml` | deterministic fixture and screenshot pipeline |
| [ConchSet](https://github.com/cavebot-collective/conch-set) | private | Concurrent set / happens-before architecture or benchmark chart | README.md | `tests/ConchSet.Tests` | `ci.yml`, `benchmarks.yml` | representative real test and benchmark result |
| [pdfinspect](https://github.com/cavebot-collective/pdfinspect) | private | Inspector behavior chain and precedence/reconciliation flow; CLI sample | `docs/ARCHITECTURE.md` | Go and Docling adapter tests; `adapters/docling/tests` | `ci.yml`, `docling-live.yml`, `grobid-live.yml` | evidence-backed chain diagram, test reporting, representative fixture |
| [Right Tool](https://github.com/cavebot-collective/right-tool) | public | **Existing** `docs/capability-topology.svg`; `docs/atlas.html` source | PROJECT.md | `tests/test_cli.py` | `evidence-audit.yml`, `registry.yml` | host/snapshot visual atlas; test execution evidence |
| [Nunchuck Skills](https://github.com/cavebot-collective/nunchuck-bow-hunting-computer-hacking) | public | Taxonomy/tag-hypergraph visualization from acquisition output; **concept placeholder** initially | `docs/SOURCES.md`, `sources.yaml` | `tests/test_stackoverflow_taxonomy.py`, `tests/test_stackoverflow_hypergraph.py` | `datasets.yml` | verified source coverage dashboard, actual visual |
| [ndq](https://github.com/cavebot-collective/ndq) | private | Derivation→enqueue→discharge relation diagram + `ndq why` transcript | SPEC.md, PROJECT_REQUIREMENTS.json | `tests/` + `tools/gate.py` | `ndqueue-poc-ci.yml` | executable deterministic semantic trace and gate report |

## Slot readiness tiers

1. **Observed** — paths/README/workflows/test source were actually inspected; no successful execution claimed.
2. **Reconstructed** — a practical demo or architecture *candidate* inferred from documented purpose.
3. **Interpreted** — editorial category, tags and compelling visual form.
4. **Unknown** — status, run health, artifact availability, production suitability until verifiable evidence is obtained.

## Best first downstream producers

1. **Right Tool:** already has an SVG and static HTML atlas. Bundle these and link tests/spec by source SHA. Lowest presentation friction.
2. **Threadscape:** existing browser viewer offers direct screenshot value; build synthetic trace fixture to keep screenshots deterministic and privacy-safe.
3. **ndq:** the requirements/test mapping and CLI gate make an unusually strong evidence-rich card.
4. **KnotTied / BitCarrier:** deterministic educational diagrams and conformance runs are good candidates for generated display assets.
5. **pdfinspect:** show an inspector chain with evidence precedence, then add extracted-fixture examples.

## Cross-repo adapter contract (proposed)

Each participating repo should own a manifest and CI producer specifying `hero`, `demo`, `specification`, `tests`, `ci` and `provenance` output slots. Each slot has `state`, `kind`, `source_ref`, `digest`, `uri`, `verification`, and `residual`; absence must never be silently interpreted as zero or success. The gallery reads only an allowlisted and checksum-locked subset. Real statuses require workflow-run identities and timestamps.

**All 11 project identities and high-level overviews are publicly listed.** Nine repositories retain unpublished source. Project-specific evidence and source links are not made public solely by listing a project.
