# Top Ontology 2 — design notes and schema reference

This document explains why Top Ontology 2 looks the way it does. The paper
([`hear-paper.md`](hear-paper.md)) makes the argument; this file records the
engineering decisions and the schema, so that a future maintainer can tell a
deliberate constraint from an oversight.

---

## 1. Scope

Top Ontology 2 (TO2) is a **domain ontology for a research programme**, not a
foundational ontology of everything. It borrows SUMO's upper skeleton because
that skeleton is well-tested and boring in the right way, and then adds the
vocabulary HEAR actually needs.

It is deliberately *not*:

- a knowledge graph of the world;
- a metaphysics;
- a replacement for SUMO;
- a database schema for the membership system.

TO2 is a standalone package with zero runtime dependencies. The membership
system may consume it later, but the dependency points one way: app → ontology.

## 2. Two axes instead of one

Most ontologies answer "what is there?" TO2 answers four separate questions and
keeps the answers apart:

| Perspective | Question | Typical evidence |
| --- | --- | --- |
| `existence` | What is structurally the case? | definitions, counts, implementations |
| `experience` | What is lived or reported? | first-person reports, transcripts |
| `belief` | What does an agent or tradition hold? | texts, correspondence |
| `interpretation` | What does a model make of it? | theory, analogy, art |

And each claim additionally carries a status:

| Status | Meaning | Permitted register |
| --- | --- | --- |
| `known` | stipulated or established **within the framework** | assertoric |
| `believed` | held by an agent or tradition | avowal |
| `experienced` | reported in the first person | phenomenological |
| `speculated` | proposed, with a route to disconfirmation | speculative |
| `amusing` | offered in play, visibly a jest | playful |
| `unknown` | explicitly not known | apophatic |

The cross product is the design. A claim can be `interpretation` + `amusing`
(a joke about the common core) or `existence` + `unknown` (we do not know
whether the effect reproduces). Neither combination is a bug.

### Why not one "confidence" axis?

Because confidence alone cannot distinguish "I have measured this" from "I have
been told this" from "I find this beautiful". Those are different kinds of
standing, and averaging them produces the worst of all worlds: the vividness of
experience lending authority to a speculation.

## 3. The upper skeleton

```
to2:Entity
├── to2:Abstract
│   ├── to2:Attribute
│   ├── to2:CosmicBlock
│   ├── to2:CosmicCell
│   ├── to2:HearLayer
│   ├── to2:Perspective
│   ├── to2:Proposition
│   ├── to2:Relation
│   └── to2:Situation
├── to2:Agent
│   └── to2:ConsciousAgent
├── to2:Physical
│   └── to2:Instrument
└── to2:Process
    ├── to2:AnomalousExperience
    ├── to2:Dialogue
    ├── to2:Measurement
    ├── to2:Report
    ├── to2:Reproduction
    └── to2:Transformer
```

Deliberate choices:

- **`Relation` is a category, and relations are individuals under it.** This
  makes claims checkable: the predicate must be an entity whose `kind` is
  `relation`. A category cannot be used as a predicate by accident.
- **`Process` is a sibling of `Abstract` and `Physical`, not a subclass of
  either.** Processes are not "things that happen to things"; they are entities
  in their own right. This keeps `Measurement` and `Experience` comparable.
- **`Agent` is not under `Physical`.** An agent may act through a body, but the
  ontology does not require it. This matters when the agent is a tradition or a
  programme.
- **No `Number`, `Set`, or `Quantity`.** The Cosmic Block's integers are
  modelled as `CosmicCell`, a domain entity. Importing SUMO's arithmetic would
  imply commitments the project does not need.

## 4. Claims

```ts
type Claim = {
  id: string;
  subjectId: string;
  relationId: string;      // must refer to kind: "relation"
  objectId?: string;       // exactly one of objectId / objectLiteral
  objectLiteral?: string;
  perspective: Perspective;
  status: EpistemicStatus;
  statement: string;       // human-readable, independent of the triple
  confidence: number;      // [0, 1], about the claim
  evidence: string[];
  source?: string;
  createdAt: string;
};
```

The triple encoding exists for queries; the `statement` exists for humans. They
are allowed to be redundant, because a triple that reads well is rare and a
sentence that queries well is rarer.

`objectLiteral` is not a fallback for laziness. Some claims are genuinely about
a description ("reports of unity, silence, luminosity") rather than about a
named individual, and inventing an individual for every description would bloat
the graph without adding information.

## 5. The spiritual seeker

The definition is published as code so that it can be argued with:

- **Required (all 3):** `experiential_curiosity`, `interest_in_common_source`,
  `commitment_to_inquiry`.
- **Supporting (≥ 2 of 4):** `openness_to_traditions`,
  `recognition_of_living_knowledge`, `self_examination`,
  `orientation_toward_sharing`.
- **Orientation:** `seeking` | `encountered` | `integrating` | `sharing`.

The crucial rule: **orientation is recorded, never used to exclude.** A person
who is still seeking — who has had no encounter with any supposed common core —
qualifies. Requiring prior experience would make the category a reward for
agreement, and would quietly turn an open inquiry into a membership test.

Duplicates in the characteristic list do not inflate the supporting count: the
assessment converts to a set first.

## 6. The living core

The spiritual core is a **living hypothesis**, not a doctrine. Each hypothesis
has:

- a statement and a status (`proposed`, `under_review`, `supported`,
  `contested`, `retired`);
- one or more perspectives;
- evidence strings;
- an **append-only** revision list.

Revision is a first-class operation. `revise()` updates the current statement
and status but never removes the previous revision. A retired hypothesis keeps
its full history, so the archive cannot quietly rewrite its own past.

## 7. Humility as an audit

`humilityReport()` implements two checks that catch the two commonest failures:

1. **Overconfidence** — a provisional claim (`believed`, `experienced`,
   `speculated`, `amusing`, `unknown`) with confidence ≥ 0.8. Either lower the
   confidence or raise the evidence.
2. **Monologue** — a subject described from only one perspective. If most
   subjects are like this, the four-perspective apparatus is decorative.

The audit is not a score. It is a prompt: the verdict names which failure mode
is active and what would fix it.

`composeResponse()` then renders one subject as four buckets, each claim
prefixed with the hedge its status permits, plus the open questions that mention
the subject. Empty buckets are kept empty. Silence in a perspective is
information.

## 8. Serialization

`OntologyDocument` is versioned (`version: 1`). `decodeOntologyDocument`
validates structurally *and* semantically: identifiers must be namespaced
(`to2:SpiritualSeeker`), confidence must be finite and in range, exactly one
object form must be present, parents must exist, and the parent graph must be
acyclic. `fromJSON` refuses a document that fails `validate()`.

The seed uses a fixed timestamp (`2026-11-18T00:00:00.000Z`) so that two runs
produce identical JSON and a diff means a real change.

## 9. Deliberate omissions

| Omitted | Why |
| --- | --- |
| Levels 7 and 9 of the Cosmic Block | Their mathematical meaning is unspecified; see `AGENTS.md`. |
| The Level 8 complementary line | A line without a stated incidence relation is decoration. |
| A truth predicate | `status` is about standing, not truth. Adding `true` would invite the ontology to adjudicate metaphysics. |
| Automated inference | Rules would hide the perspective/status distinction behind derived facts. Queries are explicit; entailment is future work. |
| Cardinality constraints | The domain does not yet justify them, and premature constraints are hard to retract. |

## 10. Testing

63 tests across five files:

| File | Covers |
| --- | --- |
| `ontology.test.mjs` | creation, hierarchy, claim validation, perspective separation, statuses, questions, validation, round-trip, malformed input |
| `seeker.test.mjs` | criteria completeness, qualification, orientation sufficiency, duplicates, invalid input |
| `core.test.mjs` | append-only revisions, evidence deduplication, statuses, unresolved filter, round-trip |
| `humility.test.mjs` | tag coverage, overconfidence, monologue detection, provisional share, composition |
| `seed.test.mjs` | consistency, determinism, root reachability, relation typing, layers, perspective individuals, humility audit |

`npm test` builds first, so a type error cannot be hidden behind passing
JavaScript tests.

## 11. Changing the ontology

1. Add entities **before** claims that reference them; parents before children.
2. Never reuse an identifier for a different meaning — retire and add.
3. If you change a definition that a claim relies on, add a claim recording the
   change, or revise the living core. Do not edit history.
4. Run `npm test`; the seed tests will fail if the counts drift, which is the
   point.
