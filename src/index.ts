/**
 * hear-ontology — Top Ontology 2.
 *
 * A perspective-aware ontology for HEAR (Hilma Engineering Anomalous Research).
 * Zero runtime dependencies; everything is plain data and functions.
 */

export {
  EPISTEMIC_STATUSES,
  ENTITY_KINDS,
  ONTOLOGY_LAYERS,
  PERSPECTIVES,
  PROVENANCE_KINDS,
  OntologyValidationError,
  assertConfidence,
  assertId,
  assertKind,
  assertLayer,
  assertNonEmpty,
  assertPerspective,
  assertStatus,
  decodeOntologyDocument,
  isRecord,
  isStringArray,
} from "./model.js";

export type {
  Claim,
  EntityKind,
  EpistemicStatus,
  OntologyDocument,
  OntologyEntity,
  OntologyLayer,
  OpenQuestion,
  Perspective,
  Provenance,
  ProvenanceKind,
} from "./model.js";

export { Ontology } from "./ontology.js";
export type {
  NewClaim,
  NewEntity,
  NewQuestion,
  OntologyOptions,
  OntologyStats,
} from "./ontology.js";

export {
  HUMILITY_TAGS,
  composeResponse,
  humilityReport,
} from "./humility.js";
export type {
  ComposedResponse,
  FlaggedClaim,
  HumilityReport,
  HumilityTag,
  Register,
} from "./humility.js";

export {
  CORE_STATUSES,
  LivingCore,
} from "./core.js";
export type {
  CoreHypothesis,
  CoreRevision,
  CoreRevisionInput,
  CoreStatus,
  LivingCoreDocument,
  LivingCoreOptions,
  NewCoreHypothesis,
} from "./core.js";

export {
  MIN_SUPPORTING_CHARACTERISTICS,
  REQUIRED_CHARACTERISTICS,
  SEEKER_CHARACTERISTICS,
  SEEKER_ORIENTATIONS,
  SUPPORTING_CHARACTERISTICS,
  assessSpiritualSeeker,
} from "./seeker.js";
export type {
  SeekerAssessment,
  SeekerCharacteristic,
  SeekerOrientation,
  SeekerProfile,
} from "./seeker.js";

export {
  SEED_AT,
  SEED_CLAIM_COUNT,
  SEED_ENTITY_COUNT,
  SEED_QUESTION_COUNT,
  createSeedOntology,
} from "./seed.js";
export type { SeedOptions, SeedResult } from "./seed.js";
