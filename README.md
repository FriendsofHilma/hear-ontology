# hear-ontology

**Top Ontology 2** — a perspective-aware ontology for
[HEAR](docs/hear-paper.md): Hilma Engineering Anomalous Research.

Zero runtime dependencies. Plain TypeScript. Strict mode. Every claim carries a
perspective and an epistemic status, so the framework can say what it knows,
what it merely believes, what it has experienced, and what it does not know at
all.

```ts
import { createSeedOntology, composeResponse, humilityReport } from "hear-ontology";

const { ontology, core } = createSeedOntology();

console.log(ontology.stats().entities);        // 59
console.log(humilityReport(ontology).verdict); // a defensible balance
console.log(composeResponse(ontology, "to2:CosmicBlock").perspectives);
```

---

## Why this exists

Ontologies usually flatten disagreement. They pick one reading of the world and
then treat every other reading as a data-entry problem. That is a poor fit for a
research programme that studies anomalous experience, holds its spiritual
claims as living hypotheses, and is named after a painter who believed her
paintings were diagrams of something she could not prove.

Top Ontology 2 therefore separates two axes that are normally collapsed:

| Axis | Values |
| --- | --- |
| **Perspective** | `existence`, `experience`, `belief`, `interpretation` |
| **Epistemic status** | `known`, `believed`, `experienced`, `speculated`, `amusing`, `unknown` |

A claim picks exactly one of each. Nothing forces a synthesis. The same subject
can be described four ways, and the four descriptions are allowed to disagree.

`known` means **stipulated or established within this framework** — not
metaphysical certainty. `unknown` is a first-class status, because a framework
that cannot record its ignorance will manufacture knowledge to fill the gap.

---

## Install

```bash
npm install hear-ontology
```

Requires Node 20 or later. ESM only, no runtime dependencies.

## Quick start

```ts
import { Ontology, LivingCore } from "hear-ontology";

const clock = () => "2026-11-18T00:00:00.000Z";
const ontology = new Ontology({ clock });

ontology.addEntity({
  id: "to2:Entity",
  label: "Entity",
  kind: "category",
  description: "The root of the ontology.",
});

ontology.addEntity({
  id: "to2:Relation",
  label: "Relation",
  kind: "category",
  description: "Predicates live here.",
  parents: ["to2:Entity"],
});

ontology.addEntity({
  id: "to2:expresses",
  label: "expresses",
  kind: "relation",
  description: "Gives form to a content without being identical to it.",
  parents: ["to2:Relation"],
});

ontology.addEntity({
  id: "to2:CosmicBlock",
  label: "Cosmic Block",
  kind: "category",
  description: "Nested integer tensor.",
  parents: ["to2:Entity"],
});

ontology.addClaim({
  id: "to2:claim.block",
  subjectId: "to2:CosmicBlock",
  relationId: "to2:expresses",
  objectLiteral: "a structure of nine documented levels",
  perspective: "existence",
  status: "known",
  statement: "Levels 1–6 of the Block are implemented; 7–9 are deliberately not.",
  confidence: 0.98,
  evidence: ["PAPER.md"],
});

console.log(ontology.validate()); // []
```

## The seed ontology

`createSeedOntology()` returns a deterministic ontology and living core — fixed
timestamp, no randomness, so it can be diffed:

| Item | Count |
| --- | --- |
| Entities | 59 |
| Categories | 24 |
| Relations | 13 |
| Claims | 26 |
| Open questions | 5 |
| Living-core hypotheses | 4 |
| Tests | 63 |

The seed inherits three vocabularies and keeps them labelled:

- **SUMO** — the upper skeleton: `Entity`, `Abstract`, `Physical`, `Process`,
  `Attribute`, `Relation`, `Proposition`, `Situation`, `Agent`,
  `ConsciousAgent`.
- **HEAR** — the research vocabulary: anomaly, anomalous experience,
  measurement, reproduction, null result, artefact, mind–matter experiment.
- **af Klint** — the constructive vocabulary: cosmic block, cosmic cell,
  correspondence, complementary pair, transformation.

Provenance is data (`kind: "sumo" | "hear" | "af-klint" | "derived" | "user"`),
so an af Klint metaphor is never silently presented as an upper-ontology
commitment.

## API

### `Ontology`

| Method | Purpose |
| --- | --- |
| `addEntity`, `addClaim`, `addQuestion` | Validated insertion; refuses bad input instead of repairing it |
| `getEntity`, `requireEntity`, `listEntities`, `findEntities` | Lookup |
| `childrenOf`, `ancestorsOf`, `descendantsOf` | Hierarchy |
| `claimsAbout`, `claimsByPerspective`, `claimsByStatus` | Claim queries |
| `perspectivesFor` | The four independent buckets for one subject |
| `validate` | Referential integrity, relation typing, parent cycles |
| `stats` | Counts by kind, perspective, status |
| `toJSON`, `toJSONString`, `Ontology.fromJSON` | Round-trip through a versioned document |
| `openQuestions` | What the framework has not resolved |

### Humility

| Function | Purpose |
| --- | --- |
| `humilityReport(ontology)` | Flags overconfidence and single-perspective subjects |
| `composeResponse(ontology, id)` | Four-perspective answer with hedges and withheld questions |
| `HUMILITY_TAGS` | Register and guidance for each epistemic status |

### Spiritual seeker

`assessSpiritualSeeker(profile)` applies the published rule:

- **Required (all three):** experiential curiosity, interest in a common
  source, commitment to inquiry.
- **Supporting (at least two of four):** openness to traditions, recognition of
  living knowledge, self-examination, orientation toward sharing.
- **Orientation:** `seeking`, `encountered`, `integrating`, or `sharing`.
  `seeking` alone is sufficient. Prior experience of a common core is **not**
  required.

### Living core

`LivingCore` stores hypotheses with **append-only** revisions. Changing your
mind is allowed; hiding that you changed it is not.

```ts
core.revise("to2:core.block-transformer", {
  status: "retired",
  rationale: "No domain or codomain could be specified.",
});
// The earlier statement stays in `revisions`.
```

## Design commitments

1. **No silent synthesis.** Four perspectives, four buckets, no averaging.
2. **Confidence is about the claim**, never about the person making it.
3. **Validation over repair.** Malformed input throws `OntologyValidationError`.
4. **Determinism.** The seed is reproducible; tests use an injected clock.
5. **No metaphysical smuggling.** `known` is scoped to the framework, in words.
6. **Humour is data.** `amusing` is a status; it is capped at low confidence and
   never promoted without a new claim.

## Development

```bash
npm install
npm run build      # tsc, strict, NodeNext
npm run typecheck
npm test           # 63 tests
npm run demo       # guided tour
```

## Documentation

- [`docs/top-ontology-2.md`](docs/top-ontology-2.md) — design rationale and
  schema reference.
- [`docs/hear-paper.md`](docs/hear-paper.md) — the accompanying paper, *HEAR:
  Hilma Engineering Anomalous Research*.

## Status

`0.1.0` — research software. The ontology is usable, tested, and deliberately
incomplete: Levels 7–9 of the Cosmic Block remain unspecified, the common core
remains a hypothesis, and the Level 8 complementary line remains undrawn.

## License

MIT © Friends of Hilma af Klint Foundation
