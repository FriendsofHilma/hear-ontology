import {
  OntologyValidationError,
  assertId,
  assertNonEmpty,
  assertPerspective,
  isRecord,
  isStringArray,
  type Perspective,
} from "./model.js";

/**
 * The spiritual core is not a fixed doctrine. It is represented as a set of
 * living hypotheses whose revisions are append-only, so earlier positions
 * remain visible after a change of mind.
 */

export const CORE_STATUSES = [
  "proposed",
  "under_review",
  "supported",
  "contested",
  "retired",
] as const;

export type CoreStatus = (typeof CORE_STATUSES)[number];

export type CoreRevision = {
  at: string;
  statement: string;
  status: CoreStatus;
  rationale: string;
};

export type CoreHypothesis = {
  id: string;
  label: string;
  statement: string;
  status: CoreStatus;
  perspectives: Perspective[];
  evidence: string[];
  revisions: CoreRevision[];
  createdAt: string;
  updatedAt: string;
};

export type NewCoreHypothesis = {
  id: string;
  label: string;
  statement: string;
  status?: CoreStatus;
  perspectives: Perspective[];
  evidence?: string[];
  rationale?: string;
};

export type CoreRevisionInput = {
  statement?: string;
  status?: CoreStatus;
  rationale: string;
  evidence?: string[];
};

export type LivingCoreDocument = {
  version: 1;
  hypotheses: CoreHypothesis[];
};

export type LivingCoreOptions = {
  clock?: () => string;
};

function assertCoreStatus(value: unknown, path: string): CoreStatus {
  if (
    typeof value !== "string" ||
    !(CORE_STATUSES as readonly string[]).includes(value)
  ) {
    throw new OntologyValidationError(
      path,
      `expected one of ${CORE_STATUSES.join(", ")}`,
    );
  }
  return value as CoreStatus;
}

function cloneHypothesis(hypothesis: CoreHypothesis): CoreHypothesis {
  return {
    ...hypothesis,
    perspectives: [...hypothesis.perspectives],
    evidence: [...hypothesis.evidence],
    revisions: hypothesis.revisions.map((revision) => ({ ...revision })),
  };
}

export class LivingCore {
  private readonly hypotheses = new Map<string, CoreHypothesis>();
  private readonly clock: () => string;

  constructor(options: LivingCoreOptions = {}) {
    this.clock = options.clock ?? (() => new Date().toISOString());
  }

  addHypothesis(input: NewCoreHypothesis): CoreHypothesis {
    const id = assertId(input.id, "hypothesis.id");
    if (this.hypotheses.has(id)) {
      throw new OntologyValidationError(
        "hypothesis.id",
        `duplicate hypothesis "${id}"`,
      );
    }
    if (!Array.isArray(input.perspectives) || input.perspectives.length === 0) {
      throw new OntologyValidationError(
        "hypothesis.perspectives",
        "at least one perspective is required",
      );
    }
    const perspectives = input.perspectives.map((perspective, index) =>
      assertPerspective(perspective, `hypothesis.perspectives[${index}]`),
    );
    const status = input.status
      ? assertCoreStatus(input.status, "hypothesis.status")
      : "proposed";
    const at = this.clock();
    const statement = assertNonEmpty(input.statement, "hypothesis.statement");
    const rationale = input.rationale
      ? assertNonEmpty(input.rationale, "hypothesis.rationale")
      : "Initial statement of the hypothesis.";
    const hypothesis: CoreHypothesis = {
      id,
      label: assertNonEmpty(input.label, "hypothesis.label"),
      statement,
      status,
      perspectives,
      evidence: [...(input.evidence ?? [])],
      revisions: [{ at, statement, status, rationale }],
      createdAt: at,
      updatedAt: at,
    };
    this.hypotheses.set(id, hypothesis);
    return cloneHypothesis(hypothesis);
  }

  /**
   * Revise a hypothesis. The mutation is recorded as a new revision; the old
   * statement and status remain in the history.
   */
  revise(id: string, input: CoreRevisionInput): CoreHypothesis {
    const existing = this.hypotheses.get(id);
    if (!existing) {
      throw new OntologyValidationError(
        "hypothesis",
        `unknown hypothesis "${id}"`,
      );
    }
    const rationale = assertNonEmpty(input.rationale, "revision.rationale");
    const statement = input.statement
      ? assertNonEmpty(input.statement, "revision.statement")
      : existing.statement;
    const status = input.status
      ? assertCoreStatus(input.status, "revision.status")
      : existing.status;
    const at = this.clock();

    existing.statement = statement;
    existing.status = status;
    existing.updatedAt = at;
    for (const evidence of input.evidence ?? []) {
      if (!existing.evidence.includes(evidence)) {
        existing.evidence.push(evidence);
      }
    }
    existing.revisions.push({ at, statement, status, rationale });
    return cloneHypothesis(existing);
  }

  get(id: string): CoreHypothesis | undefined {
    const hypothesis = this.hypotheses.get(id);
    return hypothesis ? cloneHypothesis(hypothesis) : undefined;
  }

  list(): CoreHypothesis[] {
    return [...this.hypotheses.values()]
      .map(cloneHypothesis)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  /** Hypotheses not yet settled and not retired. */
  unresolved(): CoreHypothesis[] {
    return this.list().filter(
      (hypothesis) =>
        hypothesis.status === "proposed" ||
        hypothesis.status === "under_review" ||
        hypothesis.status === "contested",
    );
  }

  toJSON(): LivingCoreDocument {
    return { version: 1, hypotheses: this.list() };
  }

  toJSONString(pretty = true): string {
    return JSON.stringify(this.toJSON(), null, pretty ? 2 : 0);
  }

  static fromJSON(value: unknown): LivingCore {
    if (!isRecord(value) || value.version !== 1) {
      throw new OntologyValidationError("$", "expected a version 1 document");
    }
    if (!Array.isArray(value.hypotheses)) {
      throw new OntologyValidationError("$.hypotheses", "expected an array");
    }
    const core = new LivingCore();
    for (const [index, entry] of value.hypotheses.entries()) {
      const path = `$.hypotheses[${index}]`;
      if (!isRecord(entry)) {
        throw new OntologyValidationError(path, "expected an object");
      }
      if (!isStringArray(entry.perspectives)) {
        throw new OntologyValidationError(
          `${path}.perspectives`,
          "expected a string array",
        );
      }
      if (!isStringArray(entry.evidence)) {
        throw new OntologyValidationError(
          `${path}.evidence`,
          "expected a string array",
        );
      }
      if (!Array.isArray(entry.revisions)) {
        throw new OntologyValidationError(
          `${path}.revisions`,
          "expected an array",
        );
      }
      const perspectives = entry.perspectives.map((perspective, pIndex) =>
        assertPerspective(perspective, `${path}.perspectives[${pIndex}]`),
      );
      const revisions: CoreRevision[] = entry.revisions.map(
        (revision, rIndex) => {
          const revisionPath = `${path}.revisions[${rIndex}]`;
          if (!isRecord(revision)) {
            throw new OntologyValidationError(
              revisionPath,
              "expected an object",
            );
          }
          return {
            at: assertNonEmpty(revision.at, `${revisionPath}.at`),
            statement: assertNonEmpty(
              revision.statement,
              `${revisionPath}.statement`,
            ),
            status: assertCoreStatus(
              revision.status,
              `${revisionPath}.status`,
            ),
            rationale: assertNonEmpty(
              revision.rationale,
              `${revisionPath}.rationale`,
            ),
          };
        },
      );
      const hypothesis: CoreHypothesis = {
        id: assertId(entry.id, `${path}.id`),
        label: assertNonEmpty(entry.label, `${path}.label`),
        statement: assertNonEmpty(entry.statement, `${path}.statement`),
        status: assertCoreStatus(entry.status, `${path}.status`),
        perspectives,
        evidence: [...entry.evidence],
        revisions,
        createdAt: assertNonEmpty(entry.createdAt, `${path}.createdAt`),
        updatedAt: assertNonEmpty(entry.updatedAt, `${path}.updatedAt`),
      };
      if (core.hypotheses.has(hypothesis.id)) {
        throw new OntologyValidationError(
          `${path}.id`,
          `duplicate hypothesis "${hypothesis.id}"`,
        );
      }
      core.hypotheses.set(hypothesis.id, hypothesis);
    }
    return core;
  }
}
