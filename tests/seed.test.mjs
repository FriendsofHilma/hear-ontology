import assert from "node:assert/strict";
import test from "node:test";

import {
  Ontology,
  PERSPECTIVES,
  SEED_AT,
  SEED_CLAIM_COUNT,
  SEED_ENTITY_COUNT,
  SEED_QUESTION_COUNT,
  createSeedOntology,
  humilityReport,
} from "../dist/index.js";

test("the seed is internally consistent", () => {
  const { ontology } = createSeedOntology();
  assert.deepEqual(ontology.validate(), []);
  assert.equal(ontology.stats().entities, SEED_ENTITY_COUNT);
  assert.equal(ontology.stats().claims, SEED_CLAIM_COUNT);
  assert.equal(ontology.stats().questions, SEED_QUESTION_COUNT);
});

test("the seed is deterministic", () => {
  const first = createSeedOntology().ontology.toJSONString();
  const second = createSeedOntology().ontology.toJSONString();
  assert.equal(first, second);
  assert.match(first, new RegExp(SEED_AT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("the SUMO-inspired upper skeleton is rooted and acyclic", () => {
  const { ontology } = createSeedOntology();
  const root = ontology.requireEntity("to2:Entity");
  assert.deepEqual(root.parents, []);
  assert.equal(root.kind, "category");

  const descendants = new Set(ontology.descendantsOf("to2:Entity"));
  for (const id of [
    "to2:Abstract",
    "to2:Process",
    "to2:Relation",
    "to2:ConsciousAgent",
    "to2:CosmicBlock",
    "to2:SpiritualSeeker",
  ]) {
    assert.ok(descendants.has(id), id);
  }

  // Every non-root entity reaches the root.
  for (const entity of ontology.listEntities()) {
    if (entity.id === "to2:Entity") continue;
    assert.ok(
      ontology.ancestorsOf(entity.id).includes("to2:Entity"),
      `${entity.id} does not reach the root`,
    );
  }
});

test("relations form a proper category", () => {
  const { ontology } = createSeedOntology();
  const relations = ontology.findEntities({ kind: "relation" });
  assert.ok(relations.length >= 10);
  for (const relation of relations) {
    assert.ok(relation.parents.includes("to2:Relation"), relation.id);
  }
});

test("all four perspectives and all five layers are represented", () => {
  const { ontology } = createSeedOntology();
  for (const perspective of PERSPECTIVES) {
    assert.ok(ontology.stats().byPerspective[perspective] > 0, perspective);
  }
  const layerIndividuals = ["to2:LayerExistence", "to2:LayerExperience", "to2:LayerEvidence", "to2:LayerInterpretation", "to2:LayerConduct"];
  for (const id of layerIndividuals) {
    assert.equal(ontology.requireEntity(id).parents[0], "to2:HearLayer");
  }
  for (const layer of [1, 2, 3, 4, 5]) {
    assert.ok(ontology.findEntities({ layer }).length > 0, `layer ${layer}`);
  }
});

test("the four perspective individuals are distinct", () => {
  const { ontology } = createSeedOntology();
  const ids = ontology
    .childrenOf("to2:Perspective")
    .map((entity) => entity.id);
  assert.deepEqual(ids.sort(), [
    "to2:PerspectiveBelief",
    "to2:PerspectiveExistence",
    "to2:PerspectiveExperience",
    "to2:PerspectiveInterpretation",
  ]);
});

test("the six epistemic statuses are individuals under the status category", () => {
  const { ontology } = createSeedOntology();
  const ids = ontology
    .childrenOf("to2:EpistemicStatus")
    .map((entity) => entity.id)
    .sort();
  assert.deepEqual(ids, [
    "to2:StatusAmusing",
    "to2:StatusBelieved",
    "to2:StatusExperienced",
    "to2:StatusKnown",
    "to2:StatusSpeculated",
    "to2:StatusUnknown",
  ]);
});

test("the Cosmic Block is described from all four perspectives", () => {
  const { ontology } = createSeedOntology();
  const view = ontology.perspectivesFor("to2:CosmicBlock");
  for (const perspective of PERSPECTIVES) {
    assert.ok(view[perspective].length >= 1, perspective);
  }
  assert.equal(view.existence[0].status, "known");
  assert.equal(view.experience[0].status, "experienced");
  assert.equal(view.belief[0].status, "believed");
  assert.ok(
    view.interpretation.some(
      (claim) => claim.id === "to2:claim.block.transformer" && claim.status === "speculated",
    ),
  );
});

test("ignorance is recorded as a first-class status", () => {
  const { ontology } = createSeedOntology();
  const unknown = ontology.claimsByStatus("unknown");
  assert.ok(unknown.length >= 2);
  for (const claim of unknown) {
    assert.ok(claim.confidence <= 0.2, claim.id);
  }
  assert.ok(unknown.some((claim) => claim.id === "to2:claim.core.unknown"));
});

test("humour survives at low confidence", () => {
  const { ontology } = createSeedOntology();
  const amusing = ontology.claimsByStatus("amusing");
  assert.ok(amusing.length >= 3);
  for (const claim of amusing) {
    assert.ok(claim.confidence <= 0.5, claim.id);
  }
});

test("the seed passes its own humility audit", () => {
  const { ontology } = createSeedOntology();
  const report = humilityReport(ontology);
  assert.deepEqual(report.overconfident, []);
  assert.ok(report.provisionalShare >= 0.4);
  assert.equal(report.openQuestions, SEED_QUESTION_COUNT);
});

test("open questions name what the programme does not know", () => {
  const { ontology } = createSeedOntology();
  const questions = ontology.openQuestions();
  assert.ok(questions.every((question) => question.question.endsWith("?")));
  const ids = questions.map((question) => question.id);
  assert.ok(ids.includes("to2:q.common-core"));
  assert.ok(ids.includes("to2:q.level-8"));
});

test("the living core starts with four hypotheses in four different statuses", () => {
  const { core } = createSeedOntology();
  const hypotheses = core.list();
  assert.equal(hypotheses.length, 4);
  assert.deepEqual(
    hypotheses.map((hypothesis) => hypothesis.status),
    ["under_review", "proposed", "supported", "contested"],
  );
  assert.equal(core.unresolved().length, 3);
});

test("seed JSON round-trips through the decoder", () => {
  const { ontology, core } = createSeedOntology();
  const restored = Ontology.fromJSON(JSON.parse(ontology.toJSONString()));
  assert.equal(restored.toJSONString(), ontology.toJSONString());
  assert.equal(core.toJSONString().length > 0, true);
});
