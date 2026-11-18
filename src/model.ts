/**
 * Top Ontology 2 — core vocabulary.
 *
 * The ontology deliberately separates four perspectives on any subject
 * (existence, experience, belief, interpretation) and six epistemic statuses
 * (known, believed, experienced, speculated, amusing, unknown). A claim keeps
 * one perspective and one status; the same subject may be described from all
 * four perspectives without forcing a premature synthesis.
 */

export const PERSPECTIVES = [
  "existence",
  "experience",
  "belief",
  "interpretation",
] as const;

export type Perspective = (typeof PERSPECTIVES)[number];

export const EPISTEMIC_STATUSES = [
  "known",
  "believed",
  "experienced",
  "speculated",
  "amusing",
  "unknown",
] as const;

export type EpistemicStatus = (typeof EPISTEMIC_STATUSES)[number];

export const ENTITY_KINDS = [
  "category",
  "individual",
  "process",
  "attribute",
  "relation",
  "proposition",
  "situation",
] as const;

export type EntityKind = (typeof ENTITY_KINDS)[number];

/** The five interconnected HEAR layers described in the paper. */
export const ONTOLOGY_LAYERS = [1, 2, 3, 4, 5] as const;
export type OntologyLayer = (typeof ONTOLOGY_LAYERS)[number];

export const PROVENANCE_KINDS = [
  "sumo",
  "hear",
  "af-klint",
  "derived",
  "user",
] as const;

export type ProvenanceKind = (typeof PROVENANCE_KINDS)[number];

export type Provenance = {
  kind: ProvenanceKind;
  note?: string;
};

export type OntologyEntity = {
  /** Namespaced identifier, e.g. `to2:SpiritualSeeker`. */
  id: string;
  label: string;
  kind: EntityKind;
  description: string;
  /** Supertype identifiers. The root entity has an empty list. */
  parents: string[];
  layer?: OntologyLayer;
  aliases?: string[];
  provenance: Provenance;
  createdAt: string;
};

/**
 * A single statement from exactly one perspective and one epistemic status.
 *
 * `known` means "stipulated or established within this framework", not
 * metaphysical certainty. `unknown` is a first-class status: the ontology is
 * allowed to record what it does not know.
 */
export type Claim = {
  id: string;
  subjectId: string;
  /** Must refer to an entity of kind `relation`. */
  relationId: string;
  /** Exactly one of objectId / objectLiteral is present. */
  objectId?: string;
  objectLiteral?: string;
  perspective: Perspective;
  status: EpistemicStatus;
  /** Human-readable statement, independent of the triple encoding. */
  statement: string;
  /** 0..1. Confidence is about the claim, not about the subject. */
  confidence: number;
  evidence: string[];
  source?: string;
  createdAt: string;
};

export type OpenQuestion = {
  id: string;
  question: string;
  status: "open" | "resolved";
  relatedEntityIds: string[];
  /** The current tentative answer, if the project has one. */
  currentPosition?: string;
  rationale?: string;
};

export type OntologyDocument = {
  version: 1;
  createdAt: string;
  entities: OntologyEntity[];
  claims: Claim[];
  questions: OpenQuestion[];
};

export class OntologyValidationError extends Error {
  readonly path: string;

  constructor(path: string, message: string) {
    super(`${path}: ${message}`);
    this.name = "OntologyValidationError";
    this.path = path;
  }
}

const ID_PATTERN = /^[A-Za-z0-9_.-]+:[^\s]+$/;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

export function assertId(value: unknown, path: string): string {
  if (typeof value !== "string" || !ID_PATTERN.test(value)) {
    throw new OntologyValidationError(
      path,
      "expected a namespaced identifier such as to2:SpiritualSeeker",
    );
  }
  return value;
}

export function assertPerspective(
  value: unknown,
  path: string,
): Perspective {
  if (
    typeof value !== "string" ||
    !(PERSPECTIVES as readonly string[]).includes(value)
  ) {
    throw new OntologyValidationError(
      path,
      `expected one of ${PERSPECTIVES.join(", ")}`,
    );
  }
  return value as Perspective;
}

export function assertStatus(value: unknown, path: string): EpistemicStatus {
  if (
    typeof value !== "string" ||
    !(EPISTEMIC_STATUSES as readonly string[]).includes(value)
  ) {
    throw new OntologyValidationError(
      path,
      `expected one of ${EPISTEMIC_STATUSES.join(", ")}`,
    );
  }
  return value as EpistemicStatus;
}

export function assertKind(value: unknown, path: string): EntityKind {
  if (
    typeof value !== "string" ||
    !(ENTITY_KINDS as readonly string[]).includes(value)
  ) {
    throw new OntologyValidationError(
      path,
      `expected one of ${ENTITY_KINDS.join(", ")}`,
    );
  }
  return value as EntityKind;
}

export function assertLayer(
  value: unknown,
  path: string,
): OntologyLayer | undefined {
  if (value === undefined) return undefined;
  if (
    typeof value !== "number" ||
    !(ONTOLOGY_LAYERS as readonly number[]).includes(value)
  ) {
    throw new OntologyValidationError(
      path,
      `expected a layer in ${ONTOLOGY_LAYERS.join(", ")}`,
    );
  }
  return value as OntologyLayer;
}

export function assertConfidence(value: unknown, path: string): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 1
  ) {
    throw new OntologyValidationError(path, "expected a number in [0, 1]");
  }
  return value;
}

export function assertNonEmpty(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new OntologyValidationError(path, "expected a non-empty string");
  }
  return value;
}

function decodeProvenance(value: unknown, path: string): Provenance {
  if (value === undefined) return { kind: "user" };
  if (!isRecord(value)) {
    throw new OntologyValidationError(path, "expected an object");
  }
  if (
    typeof value.kind !== "string" ||
    !(PROVENANCE_KINDS as readonly string[]).includes(value.kind)
  ) {
    throw new OntologyValidationError(
      path,
      `kind must be one of ${PROVENANCE_KINDS.join(", ")}`,
    );
  }
  const note =
    value.note === undefined
      ? undefined
      : assertNonEmpty(value.note, `${path}.note`);
  return { kind: value.kind as ProvenanceKind, ...(note ? { note } : {}) };
}

function decodeEntity(value: unknown, path: string): OntologyEntity {
  if (!isRecord(value)) {
    throw new OntologyValidationError(path, "expected an object");
  }
  if (!isStringArray(value.parents)) {
    throw new OntologyValidationError(path, "parents must be a string array");
  }
  const layer = assertLayer(value.layer, `${path}.layer`);
  if (value.aliases !== undefined && !isStringArray(value.aliases)) {
    throw new OntologyValidationError(path, "aliases must be a string array");
  }
  return {
    id: assertId(value.id, `${path}.id`),
    label: assertNonEmpty(value.label, `${path}.label`),
    kind: assertKind(value.kind, `${path}.kind`),
    description: assertNonEmpty(value.description, `${path}.description`),
    parents: value.parents.map((parent, index) =>
      assertId(parent, `${path}.parents[${index}]`),
    ),
    ...(layer ? { layer } : {}),
    ...(value.aliases ? { aliases: [...value.aliases] } : {}),
    provenance: decodeProvenance(value.provenance, `${path}.provenance`),
    createdAt: assertNonEmpty(value.createdAt, `${path}.createdAt`),
  };
}

function decodeClaim(value: unknown, path: string): Claim {
  if (!isRecord(value)) {
    throw new OntologyValidationError(path, "expected an object");
  }
  if (!isStringArray(value.evidence)) {
    throw new OntologyValidationError(path, "evidence must be a string array");
  }
  const hasId = value.objectId !== undefined;
  const hasLiteral = value.objectLiteral !== undefined;
  if (hasId === hasLiteral) {
    throw new OntologyValidationError(
      path,
      "exactly one of objectId / objectLiteral is required",
    );
  }
  const source =
    value.source === undefined
      ? undefined
      : assertNonEmpty(value.source, `${path}.source`);
  return {
    id: assertId(value.id, `${path}.id`),
    subjectId: assertId(value.subjectId, `${path}.subjectId`),
    relationId: assertId(value.relationId, `${path}.relationId`),
    ...(hasId
      ? { objectId: assertId(value.objectId, `${path}.objectId`) }
      : { objectLiteral: assertNonEmpty(value.objectLiteral, `${path}.objectLiteral`) }),
    perspective: assertPerspective(value.perspective, `${path}.perspective`),
    status: assertStatus(value.status, `${path}.status`),
    statement: assertNonEmpty(value.statement, `${path}.statement`),
    confidence: assertConfidence(value.confidence, `${path}.confidence`),
    evidence: [...value.evidence],
    ...(source ? { source } : {}),
    createdAt: assertNonEmpty(value.createdAt, `${path}.createdAt`),
  };
}

function decodeQuestion(value: unknown, path: string): OpenQuestion {
  if (!isRecord(value)) {
    throw new OntologyValidationError(path, "expected an object");
  }
  if (value.status !== "open" && value.status !== "resolved") {
    throw new OntologyValidationError(
      `${path}.status`,
      'expected "open" or "resolved"',
    );
  }
  if (!isStringArray(value.relatedEntityIds)) {
    throw new OntologyValidationError(
      path,
      "relatedEntityIds must be a string array",
    );
  }
  return {
    id: assertId(value.id, `${path}.id`),
    question: assertNonEmpty(value.question, `${path}.question`),
    status: value.status,
    relatedEntityIds: value.relatedEntityIds.map((id, index) =>
      assertId(id, `${path}.relatedEntityIds[${index}]`),
    ),
    ...(value.currentPosition === undefined
      ? {}
      : {
          currentPosition: assertNonEmpty(
            value.currentPosition,
            `${path}.currentPosition`,
          ),
        }),
    ...(value.rationale === undefined
      ? {}
      : { rationale: assertNonEmpty(value.rationale, `${path}.rationale`) }),
  };
}

/** Structurally decode an exported ontology document. Throws on bad input. */
export function decodeOntologyDocument(value: unknown): OntologyDocument {
  if (!isRecord(value)) {
    throw new OntologyValidationError("$", "expected an object");
  }
  if (value.version !== 1) {
    throw new OntologyValidationError("$.version", "expected 1");
  }
  if (!Array.isArray(value.entities)) {
    throw new OntologyValidationError("$.entities", "expected an array");
  }
  if (!Array.isArray(value.claims)) {
    throw new OntologyValidationError("$.claims", "expected an array");
  }
  if (!Array.isArray(value.questions)) {
    throw new OntologyValidationError("$.questions", "expected an array");
  }
  return {
    version: 1,
    createdAt: assertNonEmpty(value.createdAt, "$.createdAt"),
    entities: value.entities.map((entry, index) =>
      decodeEntity(entry, `$.entities[${index}]`),
    ),
    claims: value.claims.map((entry, index) =>
      decodeClaim(entry, `$.claims[${index}]`),
    ),
    questions: value.questions.map((entry, index) =>
      decodeQuestion(entry, `$.questions[${index}]`),
    ),
  };
}
