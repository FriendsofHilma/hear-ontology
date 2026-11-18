import assert from "node:assert/strict";
import test from "node:test";

import {
  EPISTEMIC_STATUSES,
  HUMILITY_TAGS,
  Ontology,
  PERSPECTIVES,
  composeResponse,
  humilityReport,
} from "../dist/index.js";

const AT = "2026-01-01T00:00:00.000Z";

function fixture() {
  const ontology = new Ontology({ clock: () => AT });
  ontology.addEntity({
    id: "to2:Entity",
    label: "Entity",
    kind: "category",
    description: "root",
  });
  ontology.addEntity({
    id: "to2:Relation",
    label: "Relation",
    kind: "category",
    description: "predicates",
    parents: ["to2:Entity"],
  });
  ontology.addEntity({
    id: "to2:expresses",
    label: "expresses",
    kind: "relation",
    description: "gives form",
    parents: ["to2:Relation"],
  });
  ontology.addEntity({
    id: "to2:Subject",
    label: "Subject",
    kind: "individual",
    description: "test subject",
    parents: ["to2:Entity"],
  });
  return ontology;
}

function addClaim(ontology, id, perspective, status, confidence, statement) {
  return ontology.addClaim({
    id,
    subjectId: "to2:Subject",
    relationId: "to2:expresses",
    objectLiteral: "something",
    perspective,
    status,
    statement,
    confidence,
  });
}

test("every epistemic status has a distinct register and a guidance sentence", () => {
  assert.equal(EPISTEMIC_STATUSES.length, 6);
  for (const status of EPISTEMIC_STATUSES) {
    const tag = HUMILITY_TAGS[status];
    assert.ok(tag, status);
    assert.equal(tag.status, status);
    assert.ok(tag.hedge.length > 0);
    assert.ok(tag.guidance.length > 20);
  }
  const registers = new Set(EPISTEMIC_STATUSES.map((s) => HUMILITY_TAGS[s].register));
  assert.equal(registers.size, 6);
});

test("an empty ontology is reported as silent", () => {
  const report = humilityReport(fixture());
  assert.equal(report.totalClaims, 0);
  assert.equal(report.provisionalShare, 0);
  assert.match(report.verdict, /silent/);
});

test("overconfidence is flagged when a provisional claim is stated firmly", () => {
  const ontology = fixture();
  addClaim(ontology, "to2:c.loud", "belief", "speculated", 0.95, "Loud speculation.");
  addClaim(ontology, "to2:c.quiet", "belief", "speculated", 0.4, "Quiet speculation.");
  const report = humilityReport(ontology);
  assert.equal(report.overconfident.length, 1);
  assert.equal(report.overconfident[0].claim.id, "to2:c.loud");
  assert.match(report.verdict, /more confidence/);
});

test("a firmly known claim is not flagged", () => {
  const ontology = fixture();
  addClaim(ontology, "to2:c.known", "existence", "known", 1, "A stipulation.");
  const report = humilityReport(ontology);
  assert.deepEqual(report.overconfident, []);
});

test("a single-perspective subject is reported as lonely", () => {
  const ontology = fixture();
  addClaim(ontology, "to2:c.one", "existence", "known", 0.9, "Only structural.");
  const report = humilityReport(ontology);
  assert.equal(report.lonelyPerspectives.length, 1);
  assert.match(report.lonelyPerspectives[0].reason, /only from the existence perspective/);
});

test("four perspectives on one subject produce no lonely flags", () => {
  const ontology = fixture();
  const statuses = {
    existence: "known",
    experience: "experienced",
    belief: "believed",
    interpretation: "speculated",
  };
  for (const perspective of PERSPECTIVES) {
    addClaim(
      ontology,
      `to2:c.${perspective}`,
      perspective,
      statuses[perspective],
      0.5,
      `Claim from ${perspective}.`,
    );
  }
  const report = humilityReport(ontology);
  assert.deepEqual(report.lonelyPerspectives, []);
  assert.equal(report.byPerspective.existence, 1);
  assert.equal(report.byPerspective.interpretation, 1);
  assert.match(report.verdict, /defensible balance/);
});

test("provisional share is the fraction of non-known claims", () => {
  const ontology = fixture();
  addClaim(ontology, "to2:c.1", "existence", "known", 0.9, "Known.");
  addClaim(ontology, "to2:c.2", "interpretation", "speculated", 0.5, "Speculated.");
  addClaim(ontology, "to2:c.3", "experience", "experienced", 0.5, "Experienced.");
  addClaim(ontology, "to2:c.4", "belief", "believed", 0.5, "Believed.");
  assert.equal(humilityReport(ontology).provisionalShare, 0.75);
});

test("an all-known ontology is challenged", () => {
  const ontology = fixture();
  for (let subject = 0; subject < 2; subject += 1) {
    ontology.addEntity({
      id: `to2:Subject${subject}`,
      label: `Subject ${subject}`,
      kind: "individual",
      description: "test subject",
      parents: ["to2:Entity"],
    });
    for (const perspective of PERSPECTIVES) {
      ontology.addClaim({
        id: `to2:c.${subject}.${perspective}`,
        subjectId: `to2:Subject${subject}`,
        relationId: "to2:expresses",
        objectLiteral: "something",
        perspective,
        status: "known",
        statement: `Known ${perspective}.`,
        confidence: 0.9,
      });
    }
  }
  assert.match(humilityReport(ontology).verdict, /mistaken for discovery/);
});

test("composeResponse keeps all four buckets and hedges each claim", () => {
  const ontology = fixture();
  addClaim(ontology, "to2:c.e", "existence", "known", 0.9, "It is defined.");
  addClaim(ontology, "to2:c.x", "experience", "experienced", 0.5, "It is felt.");
  addClaim(ontology, "to2:c.b", "belief", "believed", 0.5, "It is held.");
  addClaim(ontology, "to2:c.i", "interpretation", "speculated", 0.5, "It may mean.");

  const response = composeResponse(ontology, "to2:Subject");
  assert.deepEqual(Object.keys(response.perspectives).sort(), [...PERSPECTIVES].sort());
  assert.match(response.perspectives.existence[0], /^Established within this framework:/);
  assert.match(response.perspectives.experience[0], /^Reported as experience:/);
  assert.match(response.perspectives.belief[0], /^Held as a matter of belief:/);
  assert.match(response.perspectives.interpretation[0], /^Offered as speculation:/);
  assert.equal(response.tag.register, "speculative");
});

test("composeResponse names what it withholds", () => {
  const ontology = fixture();
  addClaim(ontology, "to2:c.e", "existence", "known", 0.9, "It is defined.");
  ontology.addQuestion({
    id: "to2:q.one",
    question: "What is it for?",
    relatedEntityIds: ["to2:Subject"],
  });
  const response = composeResponse(ontology, "to2:Subject");
  assert.deepEqual(response.withheld, ["What is it for?"]);
});

test("composeResponse on an empty perspective says so by omission", () => {
  const ontology = fixture();
  addClaim(ontology, "to2:c.e", "existence", "unknown", 0.1, "Nothing is known.");
  const response = composeResponse(ontology, "to2:Subject");
  assert.deepEqual(response.perspectives.experience, []);
  assert.deepEqual(response.perspectives.belief, []);
  assert.match(response.perspectives.existence[0], /^Not known:/);
});

test("composeResponse on an unknown subject throws", () => {
  assert.throws(() => composeResponse(fixture(), "to2:Nowhere"), /unknown entity/);
});
