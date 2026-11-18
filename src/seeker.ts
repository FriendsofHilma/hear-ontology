import { OntologyValidationError, assertId, assertNonEmpty } from "./model.js";

/**
 * The spiritual seeker is a foundational concept of Top Ontology 2.
 *
 * Deliberately, prior experience of the common core is NOT required. The
 * category is defined by orientation and practice, not by an unverifiable
 * achievement. "Seeking" is a complete orientation.
 */

export const SEEKER_CHARACTERISTICS = [
  "experiential_curiosity",
  "openness_to_traditions",
  "interest_in_common_source",
  "commitment_to_inquiry",
  "recognition_of_living_knowledge",
  "self_examination",
  "orientation_toward_sharing",
] as const;

export type SeekerCharacteristic = (typeof SEEKER_CHARACTERISTICS)[number];

export const SEEKER_ORIENTATIONS = [
  "seeking",
  "encountered",
  "integrating",
  "sharing",
] as const;

export type SeekerOrientation = (typeof SEEKER_ORIENTATIONS)[number];

/** Present in every qualifying profile. */
export const REQUIRED_CHARACTERISTICS = [
  "experiential_curiosity",
  "interest_in_common_source",
  "commitment_to_inquiry",
] as const satisfies readonly SeekerCharacteristic[];

/** At least two of these must also be present. */
export const SUPPORTING_CHARACTERISTICS = [
  "openness_to_traditions",
  "recognition_of_living_knowledge",
  "self_examination",
  "orientation_toward_sharing",
] as const satisfies readonly SeekerCharacteristic[];

export const MIN_SUPPORTING_CHARACTERISTICS = 2;

export type SeekerProfile = {
  id: string;
  label: string;
  orientation: SeekerOrientation;
  characteristics: SeekerCharacteristic[];
  note?: string;
};

export type SeekerAssessment = {
  qualifies: boolean;
  orientation: SeekerOrientation;
  missingCharacteristics: SeekerCharacteristic[];
  missingRequired: SeekerCharacteristic[];
  supportingCount: number;
  rationale: string;
};

function isCharacteristic(value: string): value is SeekerCharacteristic {
  return (SEEKER_CHARACTERISTICS as readonly string[]).includes(value);
}

function isOrientation(value: string): value is SeekerOrientation {
  return (SEEKER_ORIENTATIONS as readonly string[]).includes(value);
}

/**
 * Assess a profile against the published criteria.
 *
 * A profile qualifies when all three core characteristics and at least two of
 * the four supporting characteristics are present. Orientation is recorded but
 * never used to exclude: someone who is still seeking can be a spiritual
 * seeker.
 */
export function assessSpiritualSeeker(profile: SeekerProfile): SeekerAssessment {
  assertId(profile.id, "seeker.id");
  assertNonEmpty(profile.label, "seeker.label");
  if (!isOrientation(profile.orientation)) {
    throw new OntologyValidationError(
      "seeker.orientation",
      `expected one of ${SEEKER_ORIENTATIONS.join(", ")}`,
    );
  }
  if (!Array.isArray(profile.characteristics)) {
    throw new OntologyValidationError(
      "seeker.characteristics",
      "expected an array",
    );
  }
  for (const [index, characteristic] of profile.characteristics.entries()) {
    if (!isCharacteristic(characteristic)) {
      throw new OntologyValidationError(
        `seeker.characteristics[${index}]`,
        `unknown characteristic "${characteristic}"`,
      );
    }
  }

  const present = new Set(profile.characteristics);
  const missingRequired = REQUIRED_CHARACTERISTICS.filter(
    (characteristic) => !present.has(characteristic),
  );
  const supportingCount = SUPPORTING_CHARACTERISTICS.filter((characteristic) =>
    present.has(characteristic),
  ).length;
  const missingCharacteristics = SEEKER_CHARACTERISTICS.filter(
    (characteristic) => !present.has(characteristic),
  );
  const qualifies =
    missingRequired.length === 0 &&
    supportingCount >= MIN_SUPPORTING_CHARACTERISTICS;

  let rationale: string;
  if (qualifies) {
    rationale =
      `All ${REQUIRED_CHARACTERISTICS.length} core characteristics are present, ` +
      `with ${supportingCount} supporting characteristic(s). ` +
      `Orientation "${profile.orientation}" is sufficient; prior experience is not required.`;
  } else {
    const reasons: string[] = [];
    if (missingRequired.length > 0) {
      reasons.push(`missing required: ${missingRequired.join(", ")}`);
    }
    if (supportingCount < MIN_SUPPORTING_CHARACTERISTICS) {
      reasons.push(
        `needs at least ${MIN_SUPPORTING_CHARACTERISTICS} supporting characteristics (has ${supportingCount})`,
      );
    }
    rationale = `Does not yet qualify — ${reasons.join("; ")}.`;
  }

  return {
    qualifies,
    orientation: profile.orientation,
    missingCharacteristics,
    missingRequired,
    supportingCount,
    rationale,
  };
}
