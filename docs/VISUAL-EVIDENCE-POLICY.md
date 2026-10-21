# Public gallery: visual evidence policy

## Default: identity, not a diagram

The project's title rendered in a typographic panel is the only automatic visual fallback. It asserts **identity**, not mechanism. An empty visual slot is an explicitly unresolved slot, not permission to generate an architectural-looking illustration.

Never generate or ship a flowchart from project names, tagline, marketing copy, tags, or generic task labels. In particular, connectors and arrow direction imply relations, causality, execution order or data flow; rectangles imply components or typed entities. All such implications are **claims** and require evidence. Decorative shapes must not resemble a false technical notation.

## Allowed hero classes (future admission)

**1. Captured interface:** genuine reproducible application view, rendered from a deterministic fixture, with source commit, commands/fixture, capture environment, public-safe redaction, and artifact digest. Verify the UI corresponds to a working project artifact and was not constructed just to imitate one.

**2. Formal or architectural diagram:** generated from actual machine-readable structure or a reviewed normative architectural specification. Capture node semantics, edge semantics, direction, model version, data source/ref, and any confidence or completeness bounds. Verify every visible node and relationship has a claim-level mapping into authoritative material.

**3. Measured result:** plot from reproducible benchmark/test/experimental output with units, methodology, original data/fixture and digest. Never turn nominal package tags or calendar age into quantitative effort or performance claims.

**4. Static branded art:** independent graphic design is permitted only if it makes no assertion about the software's internal structure; mark it as decorative and keep it visually distinguishable from a diagram. Project identity titles are adequate until such art is expressly approved.

## Required acceptance record

For every non-decorative visual:

- project id and named owner of source specification;
- source repository and immutable source SHA;
- source path(s) or named dataset/fixture and source-to-claim mapping;
- exact build/capture command and build environment (or independently verified manual procedure);
- image/artifact checksum, declared type and output dimensions;
- authorization for public disclosure including embedded text/data;
- review date and outcome;
- list of assertions made by shape, edge, position, labels and encoding;
- unresolved ambiguities and epistemic labels **OBSERVED / RECONSTRUCTED / INTERPRETATION / UNKNOWN**.

An INTERPRETATION may be included in an explanatory experiment but must not be silently promoted into a verified architecture diagram. A diagram with ungrounded nodes/edges fails, irrespective of its aesthetic quality or the model's confidence.

## CI invariants

- Public catalog cannot contain synthetic "concept" `steps`, `pipeline`, `node` or `arrow` hero placeholders.
- Rendering tests verify identity panels contain no drawn process sequence.
- Before introducing a future `verified_asset` hero variant, extend the schema, data, CI, provenance checks, accessibility tests, and reviewer approval path **together**.
- A media URI without source provenance and semantic verification is **not** sufficient evidence.
- Missing or inaccessible evidence results in an identity panel, never inferred topology.

## Residual: genuine demonstrations

The repo audit in `PROJECT-AUDIT.md` identifies likely candidate demonstrations. Follow repo-owned fixtures/specs rather than using the previously invented placeholder diagrams. The closest source-backed candidates include Threadscape's real viewer, Right Tool's documented registry-generated atlas, and the deterministic test/CLI suites in the other projects. Each still needs viewport legibility and a source/semantics review before use as a small card image.
