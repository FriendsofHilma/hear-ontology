import assert from "node:assert/strict";
import test from "node:test";

import {
  Ontology,
  OntologyValidationError,
  PERSPECTIVES,
  EPISTEMIC_STATUSES,
} from "../dist/index.js";

const AT = "2026-01-01T00:00:00.000Z";
const clock = () => AT;

function base() {
  const ontology = new Ontology({ clock });
  ontology.addEntity({
    id: "to2:Entity",
    label: "Entity",
    kind: "category",
    description: "root",
  });
  ontology.addEntity({
    id: "to2:Agent",
    label: "Agent",
    kind: "category",
    description: "acts",
    parents: ["to2:Entity"],
  });
  ontology.addEntity({
    id: "to2:Seeker",
    label: "Seeker",
    kind: "category",
    description: "inquires",
    parents: ["to2:Agent"],
  });
  ontology.addEntity({
    id: "to2:Relation",
    label: "Relation",
    kind: "category",
    description: "predicates",
    parents: ["to2:Entity"],
  });
  ontology.addEntity({
    id: "to2:studies",
    label: "studies",
    kind: "relation",
    description: "takes as object",
    parents: ["to2:Relation"],
  });
  ontology.addEntity({
    id: "to2:Anomaly",
    label: "Anomaly",
    kind: "category",
    description: "deviation",
    parents: ["to2:Entity"],
  });
  return ontology;
}

test("entity creation records all fields and clones on read", () => {
  const ontology = base();
  const seeker = ontology.requireEntity("to2:Seeker");
  assert.equal(seeker.kind, "category");
  assert.deepEqual(seeker.parents, ["to2:Agent"]);
  assert.equal(seeker.createdAt, AT);

  seeker.parents.push("to2:Anomaly");
  assert.deepEqual(ontology.requireEntity("to2:Seeker").parents, ["to2:Agent"]);
});

test("parents must already exist", () => {
  const ontology = new Ontology({ clock });
  assert.throws(
    () =>
      ontology.addEntity({
        id: "to2:Orphan",
        label: "Orphan",
        kind: "category",
        description: "no parent",
        parents: ["to2:Missing"],
      }),
    OntologyValidationError,
  );
});

test("duplicate ids are refused", () => {
  const ontology = base();
  assert.throws(
    () =>
      ontology.addEntity({
        id: "to2:Seeker",
        label: "Again",
        kind: "category",
        description: "again",
      }),
    /duplicate entity/,
  );
});

test("ids must be namespaced", () => {
  const ontology = new Ontology({ clock });
  assert.throws(
    () =>
      ontology.addEntity({
        id: "NoNamespace",
        label: "Bad",
        kind: "category",
        description: "bad",
      }),
    /namespaced identifier/,
  );
  assert.throws(
    () =>
      ontology.addEntity({
        id: "to2:Has Space",
        label: "Bad",
        kind: "category",
        description: "bad",
      }),
    /namespaced identifier/,
  );
});

test("hierarchy queries: children, ancestors, descendants", () => {
  const ontology = base();
  assert.deepEqual(
    ontology.childrenOf("to2:Agent").map((entity) => entity.id),
    ["to2:Seeker"],
  );
  assert.deepEqual(ontology.ancestorsOf("to2:Seeker"), [
    "to2:Agent",
    "to2:Entity",
  ]);
  assert.deepEqual(ontology.descendantsOf("to2:Entity").sort(), [
    "to2:Agent",
    "to2:Anomaly",
    "to2:Relation",
    "to2:Seeker",
    "to2:studies",
  ]);
});

test("claims require a relation entity as predicate", () => {
  const ontology = base();
  assert.throws(
    () =>
      ontology.addClaim({
        id: "to2:claim.bad",
        subjectId: "to2:Seeker",
        relationId: "to2:Agent",
        objectId: "to2:Anomaly",
        perspective: "existence",
        status: "known",
        statement: "bad predicate",
        confidence: 0.5,
      }),
    /is a category, not a relation/,
  );
});

test("claims require exactly one object", () => {
  const ontology = base();
  const common = {
    id: "to2:claim.x",
    subjectId: "to2:Seeker",
    relationId: "to2:studies",
    perspective: "existence",
    status: "known",
    statement: "x",
    confidence: 0.5,
  };
  assert.throws(
    () => ontology.addClaim({ ...common }),
    /exactly one of objectId/,
  );
  assert.throws(
    () =>
      ontology.addClaim({
        ...common,
        objectId: "to2:Anomaly",
        objectLiteral: "text",
      }),
    /exactly one of objectId/,
  );
  assert.throws(
    () => ontology.addClaim({ ...common, objectId: "to2:Nowhere" }),
    /unknown object/,
  );
  assert.throws(
    () => ontology.addClaim({ ...common, objectLiteral: "   " }),
    /non-empty string/,
  );
});

test("confidence is bounded to [0, 1]", () => {
  const ontology = base();
  for (const confidence of [-0.1, 1.1, Number.NaN]) {
    assert.throws(
      () =>
        ontology.addClaim({
          id: `to2:claim.${String(confidence)}`,
          subjectId: "to2:Seeker",
          relationId: "to2:studies",
          objectLiteral: "x",
          perspective: "existence",
          status: "known",
          statement: "x",
          confidence,
        }),
      /number in \[0, 1\]/,
    );
  }
});

test("perspective separation: every bucket is independent", () => {
  const ontology = base();
  const statements = {
    existence: "The seeker exists as a defined category.",
    experience: "Seekers report transformation.",
    belief: "The founder believes seekers share a source.",
    interpretation: "The seeker may be prior to tradition.",
  };
  for (const [perspective, statement] of Object.entries(statements)) {
    ontology.addClaim({
      id: `to2:claim.seeker.${perspective}`,
      subjectId: "to2:Seeker",
      relationId: "to2:studies",
      objectLiteral: "inquiry",
      perspective,
      status:
        perspective === "existence"
          ? "known"
          : perspective === "experience"
            ? "experienced"
            : perspective === "belief"
              ? "believed"
              : "speculated",
      statement,
      confidence: 0.5,
    });
  }
  const view = ontology.perspectivesFor("to2:Seeker");
  assert.deepEqual(Object.keys(view), [...PERSPECTIVES]);
  for (const perspective of PERSPECTIVES) {
    assert.equal(view[perspective].length, 1);
    assert.equal(view[perspective][0].statement, statements[perspective]);
  }
  // The buckets are copies, not live arrays.
  view.existence.length = 0;
  assert.equal(ontology.perspectivesFor("to2:Seeker").existence.length, 1);
});

test("every epistemic status is accepted", () => {
  const ontology = base();
  for (const status of EPISTEMIC_STATUSES) {
    const claim = ontology.addClaim({
      id: `to2:claim.status.${status}`,
      subjectId: "to2:Seeker",
      relationId: "to2:studies",
      objectLiteral: "inquiry",
      perspective: "interpretation",
      status,
      statement: `status ${status}`,
      confidence: 0.5,
    });
    assert.equal(claim.status, status);
  }
  const counts = ontology.stats().byStatus;
  for (const status of EPISTEMIC_STATUSES) {
    assert.equal(counts[status], 1);
  }
});

test("claimsAbout matches subject or object", () => {
  const ontology = base();
  ontology.addClaim({
    id: "to2:claim.about",
    subjectId: "to2:Seeker",
    relationId: "to2:studies",
    objectId: "to2:Anomaly",
    perspective: "existence",
    status: "known",
    statement: "Seekers study anomalies.",
    confidence: 0.7,
  });
  assert.equal(ontology.claimsAbout("to2:Seeker").length, 1);
  assert.equal(ontology.claimsAbout("to2:Anomaly").length, 1);
});

test("questions must reference known entities and start open", () => {
  const ontology = base();
  const question = ontology.addQuestion({
    id: "to2:q.one",
    question: "Does the seeker precede the tradition?",
    relatedEntityIds: ["to2:Seeker"],
  });
  assert.equal(question.status, "open");
  assert.equal(ontology.openQuestions().length, 1);
  assert.throws(
    () =>
      ontology.addQuestion({
        id: "to2:q.bad",
        question: "Bad reference?",
        relatedEntityIds: ["to2:Nowhere"],
      }),
    /unknown entity/,
  );
});

test("validate reports a clean graph as clean", () => {
  const ontology = base();
  assert.deepEqual(ontology.validate(), []);
});

test("findEntities filters by kind, layer and text", () => {
  const ontology = base();
  ontology.addEntity({
    id: "to2:Layer",
    label: "Conduct layer",
    kind: "individual",
    description: "how inquiry is carried out",
    parents: ["to2:Entity"],
    layer: 5,
  });
  assert.deepEqual(
    ontology.findEntities({ kind: "relation" }).map((entity) => entity.id),
    ["to2:studies"],
  );
  assert.deepEqual(
    ontology.findEntities({ layer: 5 }).map((entity) => entity.id),
    ["to2:Layer"],
  );
  assert.deepEqual(
    ontology.findEntities({ text: "CONDUCT" }).map((entity) => entity.id),
    ["to2:Layer"],
  );
});

test("JSON round-trip preserves the document exactly", () => {
  const ontology = base();
  ontology.addClaim({
    id: "to2:claim.rt",
    subjectId: "to2:Seeker",
    relationId: "to2:studies",
    objectLiteral: "inquiry",
    perspective: "interpretation",
    status: "speculated",
    statement: "Round trip.",
    confidence: 0.42,
    evidence: ["test"],
    source: "tests",
  });
  ontology.addQuestion({
    id: "to2:q.rt",
    question: "Round trip?",
    relatedEntityIds: ["to2:Seeker"],
  });

  const document = ontology.toJSON();
  const restored = Ontology.fromJSON(document);
  assert.equal(restored.toJSONString(), ontology.toJSONString());
  assert.equal(restored.stats().claims, 1);
  assert.equal(restored.stats().byStatus.speculated, 1);
});

test("fromJSON rejects a document with a parent cycle", () => {
  const document = {
    version: 1,
    createdAt: AT,
    entities: [
      {
        id: "to2:A",
        label: "A",
        kind: "category",
        description: "a",
        parents: ["to2:B"],
        provenance: { kind: "user" },
        createdAt: AT,
      },
      {
        id: "to2:B",
        label: "B",
        kind: "category",
        description: "b",
        parents: ["to2:A"],
        provenance: { kind: "user" },
        createdAt: AT,
      },
    ],
    claims: [],
    questions: [],
  };
  assert.throws(() => Ontology.fromJSON(document), /cycle/);
});

test("fromJSON rejects malformed documents", () => {
  assert.throws(() => Ontology.fromJSON(null), /expected an object/);
  assert.throws(() => Ontology.fromJSON({ version: 2 }), /expected 1/);
  assert.throws(
    () =>
      Ontology.fromJSON({
        version: 1,
        createdAt: AT,
        entities: "no",
        claims: [],
        questions: [],
      }),
    /expected an array/,
  );
});

test("stats counts entities, relations, and perspectives", () => {
  const ontology = base();
  ontology.addClaim({
    id: "to2:claim.s",
    subjectId: "to2:Seeker",
    relationId: "to2:studies",
    objectLiteral: "x",
    perspective: "belief",
    status: "believed",
    statement: "x",
    confidence: 0.5,
  });
  const stats = ontology.stats();
  assert.equal(stats.entities, 6);
  assert.equal(stats.relations, 1);
  assert.equal(stats.claims, 1);
  assert.equal(stats.byPerspective.belief, 1);
  assert.equal(stats.byPerspective.existence, 0);
});
