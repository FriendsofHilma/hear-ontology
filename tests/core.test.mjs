import assert from "node:assert/strict";
import test from "node:test";

import { CORE_STATUSES, LivingCore, OntologyValidationError } from "../dist/index.js";

function sequenceClock(start = 1) {
  let tick = start;
  return () => `2026-01-01T00:00:${String(tick++).padStart(2, "0")}.000Z`;
}

test("a new hypothesis starts with one revision", () => {
  const core = new LivingCore({ clock: sequenceClock() });
  const hypothesis = core.addHypothesis({
    id: "to2:core.one",
    label: "One",
    statement: "The core is a living hypothesis.",
    perspectives: ["experience", "interpretation"],
  });
  assert.equal(hypothesis.status, "proposed");
  assert.equal(hypothesis.revisions.length, 1);
  assert.equal(hypothesis.createdAt, hypothesis.updatedAt);
  assert.equal(hypothesis.evidence.length, 0);
});

test("revisions are append-only: earlier positions stay legible", () => {
  const core = new LivingCore({ clock: sequenceClock() });
  core.addHypothesis({
    id: "to2:core.one",
    label: "One",
    statement: "First position.",
    perspectives: ["interpretation"],
  });
  core.revise("to2:core.one", {
    statement: "Second position.",
    status: "under_review",
    rationale: "New evidence arrived.",
    evidence: ["report A"],
  });
  core.revise("to2:core.one", {
    status: "retired",
    rationale: "The evidence did not replicate.",
    evidence: ["report B"],
  });

  const hypothesis = core.get("to2:core.one");
  assert.equal(hypothesis.status, "retired");
  assert.equal(hypothesis.statement, "Second position.");
  assert.equal(hypothesis.revisions.length, 3);
  assert.equal(hypothesis.revisions[0].statement, "First position.");
  assert.equal(hypothesis.revisions[0].status, "proposed");
  assert.equal(hypothesis.revisions[1].statement, "Second position.");
  assert.equal(hypothesis.revisions[2].status, "retired");
  assert.deepEqual(hypothesis.evidence, ["report A", "report B"]);
  assert.notEqual(hypothesis.createdAt, hypothesis.updatedAt);
});

test("evidence is deduplicated on revision", () => {
  const core = new LivingCore({ clock: sequenceClock() });
  core.addHypothesis({
    id: "to2:core.ev",
    label: "Evidence",
    statement: "Statement.",
    perspectives: ["existence"],
    evidence: ["paper"],
  });
  core.revise("to2:core.ev", {
    rationale: "Same paper again.",
    evidence: ["paper", "other paper"],
  });
  assert.deepEqual(core.get("to2:core.ev").evidence, ["paper", "other paper"]);
});

test("revision status must be a core status", () => {
  const core = new LivingCore({ clock: sequenceClock() });
  core.addHypothesis({
    id: "to2:core.one",
    label: "One",
    statement: "Statement.",
    perspectives: ["existence"],
  });
  assert.throws(
    () =>
      core.revise("to2:core.one", {
        status: "proven",
        rationale: "Nope.",
      }),
    OntologyValidationError,
  );
});

test("revising an unknown hypothesis fails", () => {
  const core = new LivingCore({ clock: sequenceClock() });
  assert.throws(
    () => core.revise("to2:core.missing", { rationale: "Nope." }),
    /unknown hypothesis/,
  );
});

test("hypotheses require at least one perspective", () => {
  const core = new LivingCore({ clock: sequenceClock() });
  assert.throws(
    () =>
      core.addHypothesis({
        id: "to2:core.none",
        label: "None",
        statement: "Nothing.",
        perspectives: [],
      }),
    /at least one perspective/,
  );
});

test("unresolved excludes supported and retired hypotheses", () => {
  const core = new LivingCore({ clock: sequenceClock() });
  const statuses = ["proposed", "under_review", "supported", "contested", "retired"];
  for (const [index, status] of statuses.entries()) {
    core.addHypothesis({
      id: `to2:core.${index}`,
      label: status,
      statement: `Statement ${status}.`,
      status,
      perspectives: ["interpretation"],
    });
  }
  const unresolved = core.unresolved().map((hypothesis) => hypothesis.status);
  assert.deepEqual(unresolved, ["proposed", "under_review", "contested"]);
});

test("every core status is accepted", () => {
  const core = new LivingCore({ clock: sequenceClock() });
  for (const [index, status] of CORE_STATUSES.entries()) {
    const hypothesis = core.addHypothesis({
      id: `to2:core.status.${index}`,
      label: status,
      statement: `Statement ${status}.`,
      status,
      perspectives: ["belief"],
    });
    assert.equal(hypothesis.status, status);
  }
});

test("JSON round-trip preserves revisions", () => {
  const core = new LivingCore({ clock: sequenceClock() });
  core.addHypothesis({
    id: "to2:core.rt",
    label: "Round trip",
    statement: "First.",
    perspectives: ["experience"],
  });
  core.revise("to2:core.rt", {
    statement: "Second.",
    status: "supported",
    rationale: "Reason.",
    evidence: ["e1"],
  });

  const restored = LivingCore.fromJSON(JSON.parse(core.toJSONString()));
  assert.equal(restored.toJSONString(), core.toJSONString());
  assert.equal(restored.get("to2:core.rt").revisions.length, 2);
});

test("fromJSON rejects malformed documents", () => {
  assert.throws(() => LivingCore.fromJSON({}), /version 1/);
  assert.throws(
    () => LivingCore.fromJSON({ version: 1, hypotheses: [{}] }),
    /perspectives/,
  );
});
