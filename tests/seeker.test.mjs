import assert from "node:assert/strict";
import test from "node:test";

import {
  MIN_SUPPORTING_CHARACTERISTICS,
  REQUIRED_CHARACTERISTICS,
  SEEKER_CHARACTERISTICS,
  SEEKER_ORIENTATIONS,
  SUPPORTING_CHARACTERISTICS,
  OntologyValidationError,
  assessSpiritualSeeker,
} from "../dist/index.js";

const required = [...REQUIRED_CHARACTERISTICS];

test("criteria are disjoint and complete", () => {
  const all = [...REQUIRED_CHARACTERISTICS, ...SUPPORTING_CHARACTERISTICS];
  assert.equal(required.length, 3);
  assert.equal(SUPPORTING_CHARACTERISTICS.length, 4);
  assert.equal(new Set(all).size, all.length);
  assert.equal(all.length + 0, SEEKER_CHARACTERISTICS.length);
  assert.equal(MIN_SUPPORTING_CHARACTERISTICS, 2);
});

test("all required plus two supporting qualifies", () => {
  const assessment = assessSpiritualSeeker({
    id: "to2:seeker.one",
    label: "Seeker one",
    orientation: "seeking",
    characteristics: [...required, "self_examination", "openness_to_traditions"],
  });
  assert.equal(assessment.qualifies, true);
  assert.equal(assessment.supportingCount, 2);
  assert.deepEqual(assessment.missingRequired, []);
  assert.match(assessment.rationale, /prior experience is not required/);
});

test("orientation 'seeking' alone is sufficient — no prior encounter needed", () => {
  for (const orientation of SEEKER_ORIENTATIONS) {
    const assessment = assessSpiritualSeeker({
      id: "to2:seeker.orientation",
      label: "Orientation check",
      orientation,
      characteristics: [
        ...required,
        "recognition_of_living_knowledge",
        "orientation_toward_sharing",
      ],
    });
    assert.equal(assessment.qualifies, true, orientation);
    assert.equal(assessment.orientation, orientation);
  }
});

test("a missing required characteristic disqualifies", () => {
  for (const missing of required) {
    const characteristics = [
      ...required.filter((value) => value !== missing),
      ...SUPPORTING_CHARACTERISTICS,
    ];
    const assessment = assessSpiritualSeeker({
      id: "to2:seeker.missing",
      label: "Missing one",
      orientation: "integrating",
      characteristics,
    });
    assert.equal(assessment.qualifies, false, missing);
    assert.deepEqual(assessment.missingRequired, [missing]);
  }
});

test("only one supporting characteristic disqualifies", () => {
  const assessment = assessSpiritualSeeker({
    id: "to2:seeker.thin",
    label: "Thin profile",
    orientation: "encountered",
    characteristics: [...required, "self_examination"],
  });
  assert.equal(assessment.qualifies, false);
  assert.equal(assessment.supportingCount, 1);
  assert.match(assessment.rationale, /at least 2 supporting/);
});

test("no supporting characteristics disqualifies", () => {
  const assessment = assessSpiritualSeeker({
    id: "to2:seeker.bare",
    label: "Bare profile",
    orientation: "seeking",
    characteristics: [...required],
  });
  assert.equal(assessment.qualifies, false);
  assert.equal(assessment.supportingCount, 0);
});

test("unknown characteristics are rejected, not ignored", () => {
  assert.throws(
    () =>
      assessSpiritualSeeker({
        id: "to2:seeker.bad",
        label: "Bad profile",
        orientation: "seeking",
        characteristics: [...required, "astral_projection"],
      }),
    /unknown characteristic/,
  );
});

test("unknown orientations are rejected", () => {
  assert.throws(
    () =>
      assessSpiritualSeeker({
        id: "to2:seeker.bad",
        label: "Bad profile",
        orientation: "enlightened",
        characteristics: [...required, ...SUPPORTING_CHARACTERISTICS],
      }),
    OntologyValidationError,
  );
});

test("duplicates do not inflate the supporting count", () => {
  const assessment = assessSpiritualSeeker({
    id: "to2:seeker.dup",
    label: "Duplicate profile",
    orientation: "seeking",
    characteristics: [...required, "self_examination", "self_examination"],
  });
  assert.equal(assessment.qualifies, false);
  assert.equal(assessment.supportingCount, 1);
});
