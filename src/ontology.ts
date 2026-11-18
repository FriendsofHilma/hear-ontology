import {
  EPISTEMIC_STATUSES,
  OntologyValidationError,
  PERSPECTIVES,
  assertConfidence,
  assertId,
  assertKind,
  assertLayer,
  assertNonEmpty,
  assertPerspective,
  assertStatus,
  decodeOntologyDocument,
  type Claim,
  type EntityKind,
  type EpistemicStatus,
  type OntologyDocument,
  type OntologyEntity,
  type OntologyLayer,
  type OpenQuestion,
  type Perspective,
  type Provenance,
} from "./model.js";

export type NewEntity = {
  id: string;
  label: string;
  kind: EntityKind;
  description: string;
  parents?: string[];
  layer?: OntologyLayer;
  aliases?: string[];
  provenance?: Provenance;
  createdAt?: string;
};

export type NewClaim = {
  id: string;
  subjectId: string;
  relationId: string;
  objectId?: string;
  objectLiteral?: string;
  perspective: Perspective;
  status: EpistemicStatus;
  statement: string;
  confidence: number;
  evidence?: string[];
  source?: string;
  createdAt?: string;
};

export type NewQuestion = {
  id: string;
  question: string;
  status?: "open" | "resolved";
  relatedEntityIds?: string[];
  currentPosition?: string;
  rationale?: string;
};

export type OntologyStats = {
  entities: number;
  categories: number;
  relations: number;
  claims: number;
  questions: number;
  openQuestions: number;
  byPerspective: Record<Perspective, number>;
  byStatus: Record<EpistemicStatus, number>;
};

export type OntologyOptions = {
  /** Injectable clock for deterministic tests. */
  clock?: () => string;
};

function cloneEntity(entity: OntologyEntity): OntologyEntity {
  return {
    ...entity,
    parents: [...entity.parents],
    ...(entity.aliases ? { aliases: [...entity.aliases] } : {}),
    provenance: { ...entity.provenance },
  };
}

function cloneClaim(claim: Claim): Claim {
  return { ...claim, evidence: [...claim.evidence] };
}

function cloneQuestion(question: OpenQuestion): OpenQuestion {
  return { ...question, relatedEntityIds: [...question.relatedEntityIds] };
}

/**
 * The ontology is an in-memory graph with explicit, perspective-tagged claims.
 * It refuses malformed input instead of silently repairing it.
 */
export class Ontology {
  private readonly entities = new Map<string, OntologyEntity>();
  private readonly claims = new Map<string, Claim>();
  private readonly questions = new Map<string, OpenQuestion>();
  private readonly clock: () => string;
  private readonly createdAt: string;

  constructor(options: OntologyOptions = {}) {
    this.clock = options.clock ?? (() => new Date().toISOString());
    this.createdAt = this.clock();
  }

  addEntity(input: NewEntity): OntologyEntity {
    const id = assertId(input.id, "entity.id");
    if (this.entities.has(id)) {
      throw new OntologyValidationError("entity.id", `duplicate entity "${id}"`);
    }
    const parents = input.parents ?? [];
    for (const [index, parent] of parents.entries()) {
      assertId(parent, `entity.parents[${index}]`);
      if (!this.entities.has(parent)) {
        throw new OntologyValidationError(
          `entity.parents[${index}]`,
          `unknown parent "${parent}" — parents must be added first`,
        );
      }
    }
    const layer = assertLayer(input.layer, "entity.layer");
    const entity: OntologyEntity = {
      id,
      label: assertNonEmpty(input.label, "entity.label"),
      kind: assertKind(input.kind, "entity.kind"),
      description: assertNonEmpty(input.description, "entity.description"),
      parents: [...parents],
      ...(layer ? { layer } : {}),
      ...(input.aliases ? { aliases: [...input.aliases] } : {}),
      provenance: input.provenance ?? { kind: "user" },
      createdAt: input.createdAt ?? this.clock(),
    };
    this.entities.set(id, entity);
    return cloneEntity(entity);
  }

  addClaim(input: NewClaim): Claim {
    const id = assertId(input.id, "claim.id");
    if (this.claims.has(id)) {
      throw new OntologyValidationError("claim.id", `duplicate claim "${id}"`);
    }
    const subject = this.entities.get(
      assertId(input.subjectId, "claim.subjectId"),
    );
    if (!subject) {
      throw new OntologyValidationError(
        "claim.subjectId",
        `unknown subject "${input.subjectId}"`,
      );
    }
    const relationId = assertId(input.relationId, "claim.relationId");
    const relation = this.entities.get(relationId);
    if (!relation) {
      throw new OntologyValidationError(
        "claim.relationId",
        `unknown relation "${relationId}"`,
      );
    }
    if (relation.kind !== "relation") {
      throw new OntologyValidationError(
        "claim.relationId",
        `"${relationId}" is a ${relation.kind}, not a relation`,
      );
    }
    const hasObject = input.objectId !== undefined;
    const hasLiteral = input.objectLiteral !== undefined;
    if (hasObject === hasLiteral) {
      throw new OntologyValidationError(
        "claim.object",
        "exactly one of objectId / objectLiteral is required",
      );
    }
    if (hasObject) {
      const objectId = assertId(input.objectId, "claim.objectId");
      if (!this.entities.has(objectId)) {
        throw new OntologyValidationError(
          "claim.objectId",
          `unknown object "${objectId}"`,
        );
      }
    } else {
      assertNonEmpty(input.objectLiteral, "claim.objectLiteral");
    }

    const claim: Claim = {
      id,
      subjectId: input.subjectId,
      relationId,
      ...(hasObject
        ? { objectId: input.objectId }
        : { objectLiteral: input.objectLiteral }),
      perspective: assertPerspective(input.perspective, "claim.perspective"),
      status: assertStatus(input.status, "claim.status"),
      statement: assertNonEmpty(input.statement, "claim.statement"),
      confidence: assertConfidence(input.confidence, "claim.confidence"),
      evidence: [...(input.evidence ?? [])],
      ...(input.source ? { source: assertNonEmpty(input.source, "claim.source") } : {}),
      createdAt: input.createdAt ?? this.clock(),
    };
    this.claims.set(id, claim);
    return cloneClaim(claim);
  }

  addQuestion(input: NewQuestion): OpenQuestion {
    const id = assertId(input.id, "question.id");
    if (this.questions.has(id)) {
      throw new OntologyValidationError("question.id", `duplicate question "${id}"`);
    }
    const related = input.relatedEntityIds ?? [];
    for (const [index, entityId] of related.entries()) {
      assertId(entityId, `question.relatedEntityIds[${index}]`);
      if (!this.entities.has(entityId)) {
        throw new OntologyValidationError(
          `question.relatedEntityIds[${index}]`,
          `unknown entity "${entityId}"`,
        );
      }
    }
    const question: OpenQuestion = {
      id,
      question: assertNonEmpty(input.question, "question.question"),
      status: input.status ?? "open",
      relatedEntityIds: [...related],
      ...(input.currentPosition
        ? {
            currentPosition: assertNonEmpty(
              input.currentPosition,
              "question.currentPosition",
            ),
          }
        : {}),
      ...(input.rationale
        ? { rationale: assertNonEmpty(input.rationale, "question.rationale") }
        : {}),
    };
    this.questions.set(id, question);
    return cloneQuestion(question);
  }

  getEntity(id: string): OntologyEntity | undefined {
    const entity = this.entities.get(id);
    return entity ? cloneEntity(entity) : undefined;
  }

  requireEntity(id: string): OntologyEntity {
    const entity = this.getEntity(id);
    if (!entity) {
      throw new OntologyValidationError("entity", `unknown entity "${id}"`);
    }
    return entity;
  }

  listEntities(): OntologyEntity[] {
    return [...this.entities.values()]
      .map(cloneEntity)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  findEntities(query: {
    kind?: EntityKind;
    layer?: OntologyLayer;
    text?: string;
  }): OntologyEntity[] {
    const needle = query.text?.toLowerCase();
    return this.listEntities().filter((entity) => {
      if (query.kind && entity.kind !== query.kind) return false;
      if (query.layer && entity.layer !== query.layer) return false;
      if (!needle) return true;
      return (
        entity.id.toLowerCase().includes(needle) ||
        entity.label.toLowerCase().includes(needle) ||
        entity.description.toLowerCase().includes(needle)
      );
    });
  }

  childrenOf(id: string): OntologyEntity[] {
    this.requireEntity(id);
    return this.listEntities().filter((entity) => entity.parents.includes(id));
  }

  /** All supertypes of an entity, nearest first (breadth-first). */
  ancestorsOf(id: string): string[] {
    this.requireEntity(id);
    const seen = new Set<string>();
    const queue = [...(this.entities.get(id)?.parents ?? [])];
    while (queue.length > 0) {
      const next = queue.shift();
      if (!next || seen.has(next)) continue;
      seen.add(next);
      queue.push(...(this.entities.get(next)?.parents ?? []));
    }
    return [...seen];
  }

  /** All subtypes of an entity, breadth-first. */
  descendantsOf(id: string): string[] {
    this.requireEntity(id);
    const seen = new Set<string>();
    const queue = [id];
    while (queue.length > 0) {
      const next = queue.shift();
      if (!next) continue;
      for (const entity of this.entities.values()) {
        if (entity.parents.includes(next) && !seen.has(entity.id)) {
          seen.add(entity.id);
          queue.push(entity.id);
        }
      }
    }
    return [...seen];
  }

  listClaims(): Claim[] {
    return [...this.claims.values()]
      .map(cloneClaim)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  getClaim(id: string): Claim | undefined {
    const claim = this.claims.get(id);
    return claim ? cloneClaim(claim) : undefined;
  }

  claimsAbout(entityId: string): Claim[] {
    this.requireEntity(entityId);
    return this.listClaims().filter(
      (claim) =>
        claim.subjectId === entityId || claim.objectId === entityId,
    );
  }

  claimsByPerspective(perspective: Perspective): Claim[] {
    return this.listClaims().filter(
      (claim) => claim.perspective === perspective,
    );
  }

  claimsByStatus(status: EpistemicStatus): Claim[] {
    return this.listClaims().filter((claim) => claim.status === status);
  }

  /**
   * The four-perspective view of one subject. Every bucket is independent; no
   * bucket is treated as more fundamental than the others.
   */
  perspectivesFor(entityId: string): Record<Perspective, Claim[]> {
    this.requireEntity(entityId);
    const result: Record<Perspective, Claim[]> = {
      existence: [],
      experience: [],
      belief: [],
      interpretation: [],
    };
    for (const claim of this.claimsAbout(entityId)) {
      result[claim.perspective].push(claim);
    }
    return result;
  }

  listQuestions(): OpenQuestion[] {
    return [...this.questions.values()]
      .map(cloneQuestion)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  openQuestions(): OpenQuestion[] {
    return this.listQuestions().filter((question) => question.status === "open");
  }

  /** Check graph and referential integrity. Returns human-readable issues. */
  validate(): string[] {
    const issues: string[] = [];
    for (const entity of this.entities.values()) {
      if (entity.parents.includes(entity.id)) {
        issues.push(`${entity.id}: entity is its own parent`);
      }
      for (const parent of entity.parents) {
        if (!this.entities.has(parent)) {
          issues.push(`${entity.id}: unknown parent ${parent}`);
        }
      }
    }
    for (const claim of this.claims.values()) {
      if (!this.entities.has(claim.subjectId)) {
        issues.push(`${claim.id}: unknown subject ${claim.subjectId}`);
      }
      const relation = this.entities.get(claim.relationId);
      if (!relation) {
        issues.push(`${claim.id}: unknown relation ${claim.relationId}`);
      } else if (relation.kind !== "relation") {
        issues.push(`${claim.id}: ${claim.relationId} is not a relation`);
      }
      if (claim.objectId && !this.entities.has(claim.objectId)) {
        issues.push(`${claim.id}: unknown object ${claim.objectId}`);
      }
      if (claim.confidence < 0 || claim.confidence > 1) {
        issues.push(`${claim.id}: confidence outside [0, 1]`);
      }
    }
    for (const question of this.questions.values()) {
      for (const entityId of question.relatedEntityIds) {
        if (!this.entities.has(entityId)) {
          issues.push(`${question.id}: unknown related entity ${entityId}`);
        }
      }
    }
    // Cycle detection over the parent graph.
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const visit = (id: string): void => {
      if (visited.has(id)) return;
      if (visiting.has(id)) {
        issues.push(`${id}: cycle in parent graph`);
        return;
      }
      visiting.add(id);
      for (const parent of this.entities.get(id)?.parents ?? []) {
        visit(parent);
      }
      visiting.delete(id);
      visited.add(id);
    };
    for (const id of this.entities.keys()) visit(id);
    return issues;
  }

  stats(): OntologyStats {
    const byPerspective: Record<Perspective, number> = {
      existence: 0,
      experience: 0,
      belief: 0,
      interpretation: 0,
    };
    const byStatus: Record<EpistemicStatus, number> = {
      known: 0,
      believed: 0,
      experienced: 0,
      speculated: 0,
      amusing: 0,
      unknown: 0,
    };
    for (const claim of this.claims.values()) {
      byPerspective[claim.perspective] += 1;
      byStatus[claim.status] += 1;
    }
    return {
      entities: this.entities.size,
      categories: [...this.entities.values()].filter(
        (entity) => entity.kind === "category",
      ).length,
      relations: [...this.entities.values()].filter(
        (entity) => entity.kind === "relation",
      ).length,
      claims: this.claims.size,
      questions: this.questions.size,
      openQuestions: [...this.questions.values()].filter(
        (question) => question.status === "open",
      ).length,
      byPerspective,
      byStatus,
    };
  }

  toJSON(): OntologyDocument {
    return {
      version: 1,
      createdAt: this.createdAt,
      entities: this.listEntities(),
      claims: this.listClaims(),
      questions: this.listQuestions(),
    };
  }

  toJSONString(pretty = true): string {
    return JSON.stringify(this.toJSON(), null, pretty ? 2 : 0);
  }

  static fromJSON(value: unknown): Ontology {
    const document = decodeOntologyDocument(value);
    const ontology = new Ontology({ clock: () => document.createdAt });
    for (const entity of document.entities) {
      ontology.entities.set(entity.id, cloneEntity(entity));
    }
    for (const claim of document.claims) {
      ontology.claims.set(claim.id, cloneClaim(claim));
    }
    for (const question of document.questions) {
      ontology.questions.set(question.id, cloneQuestion(question));
    }
    const issues = ontology.validate();
    if (issues.length > 0) {
      throw new OntologyValidationError("$", issues.join("; "));
    }
    return ontology;
  }
}
