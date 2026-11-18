import {
  EPISTEMIC_STATUSES,
  type Claim,
  type EpistemicStatus,
  type Perspective,
} from "./model.js";
import type { Ontology } from "./ontology.js";

/**
 * Intelligent humility, expressed as data rather than as a slogan.
 *
 * Every epistemic status has a linguistic register: the way a claim of that
 * status is allowed to be spoken. `known` may be stated flatly *within the
 * framework*. `speculated` may not. `amusing` must stay visibly playful.
 * `unknown` is not a failure of the speaker; it is a licence to ask.
 */

export type Register =
  | "assertoric"
  | "avowal"
  | "phenomenological"
  | "speculative"
  | "playful"
  | "apophatic";

export type HumilityTag = {
  status: EpistemicStatus;
  register: Register;
  /** Prefix used when rendering the claim in a report. */
  hedge: string;
  /** Short instruction for a human or model composing a response. */
  guidance: string;
};

export const HUMILITY_TAGS: Readonly<Record<EpistemicStatus, HumilityTag>> = {
  known: {
    status: "known",
    register: "assertoric",
    hedge: "Established within this framework:",
    guidance:
      "State plainly, but name the framework. Do not let a stipulation drift into a claim about the world.",
  },
  believed: {
    status: "believed",
    register: "avowal",
    hedge: "Held as a matter of belief:",
    guidance:
      "Attribute the belief to someone. Beliefs are evidence about believers, not about the world.",
  },
  experienced: {
    status: "experienced",
    register: "phenomenological",
    hedge: "Reported as experience:",
    guidance:
      "Preserve the first person. Do not upgrade a report into a description of its cause.",
  },
  speculated: {
    status: "speculated",
    register: "speculative",
    hedge: "Offered as speculation:",
    guidance:
      "Mark the move as a proposal. Say what would count as disconfirming it.",
  },
  amusing: {
    status: "amusing",
    register: "playful",
    hedge: "Offered in play:",
    guidance:
      "Keep the joke visible. A jest that forgets it is a jest becomes a doctrine.",
  },
  unknown: {
    status: "unknown",
    register: "apophatic",
    hedge: "Not known:",
    guidance:
      "Name the question rather than answering it. Ignorance is a finding worth recording.",
  },
};

/** Statuses whose claims may not be asserted with high confidence. */
const PROVISIONAL: ReadonlySet<EpistemicStatus> = new Set<EpistemicStatus>([
  "believed",
  "experienced",
  "speculated",
  "amusing",
  "unknown",
]);

export type FlaggedClaim = {
  claim: Claim;
  reason: string;
};

export type HumilityReport = {
  totalClaims: number;
  byStatus: Record<EpistemicStatus, number>;
  byPerspective: Record<Perspective, number>;
  /** Share of claims that are not `known`, in [0, 1]. */
  provisionalShare: number;
  /** Claims whose confidence outruns their status. */
  overconfident: FlaggedClaim[];
  /** Claims whose perspective is unrepresented elsewhere for the same subject. */
  lonelyPerspectives: FlaggedClaim[];
  openQuestions: number;
  verdict: string;
};

function emptyStatusCounts(): Record<EpistemicStatus, number> {
  const counts = {} as Record<EpistemicStatus, number>;
  for (const status of EPISTEMIC_STATUSES) counts[status] = 0;
  return counts;
}

function emptyPerspectiveCounts(): Record<Perspective, number> {
  return { existence: 0, experience: 0, belief: 0, interpretation: 0 };
}

/**
 * Audit an ontology for the two failure modes intelligent humility is meant to
 * catch: confidence that outruns evidence, and a single perspective silently
 * standing in for all four.
 */
export function humilityReport(ontology: Ontology): HumilityReport {
  const claims = ontology.listClaims();
  const byStatus = emptyStatusCounts();
  const byPerspective = emptyPerspectiveCounts();
  const overconfident: FlaggedClaim[] = [];
  const lonelyPerspectives: FlaggedClaim[] = [];

  for (const claim of claims) {
    byStatus[claim.status] += 1;
    byPerspective[claim.perspective] += 1;
    if (PROVISIONAL.has(claim.status) && claim.confidence >= 0.8) {
      overconfident.push({
        claim,
        reason: `confidence ${claim.confidence.toFixed(2)} on a "${claim.status}" claim`,
      });
    }
  }

  for (const claim of claims) {
    const siblings = ontology
      .claimsAbout(claim.subjectId)
      .filter((other) => other.perspective !== claim.perspective);
    if (siblings.length === 0) {
      lonelyPerspectives.push({
        claim,
        reason: `"${claim.subjectId}" is described only from the ${claim.perspective} perspective`,
      });
    }
  }

  const provisional = claims.filter((claim) => PROVISIONAL.has(claim.status)).length;
  const provisionalShare = claims.length === 0 ? 0 : provisional / claims.length;
  const openQuestions = ontology.openQuestions().length;

  let verdict: string;
  if (claims.length === 0) {
    verdict = "No claims yet. The ontology is silent, which is honest but unhelpful.";
  } else if (overconfident.length > 0) {
    verdict =
      `${overconfident.length} claim(s) assert more confidence than their status permits. ` +
      "Lower the confidence or raise the evidence.";
  } else if (lonelyPerspectives.length > claims.length / 2) {
    verdict =
      "Most subjects are described from a single perspective. The framework is being used " +
      "as a monologue rather than as a four-perspective instrument.";
  } else if (provisionalShare < 0.2) {
    verdict =
      "Almost everything is marked as known. Check whether stipulation is being mistaken for discovery.";
  } else {
    verdict =
      `The ontology holds ${claims.length} claims, ${openQuestions} open question(s), ` +
      `and ${(provisionalShare * 100).toFixed(0)}% provisional content. That is a defensible balance.`;
  }

  return {
    totalClaims: claims.length,
    byStatus,
    byPerspective,
    provisionalShare,
    overconfident,
    lonelyPerspectives,
    openQuestions,
    verdict,
  };
}

export type ComposedResponse = {
  perspectives: Partial<Record<Perspective, string[]>>;
  /** Questions the ontology refuses to answer. */
  withheld: string[];
  tag: HumilityTag;
};

/**
 * Render claims about one subject as a four-perspective answer.
 *
 * The composer never merges the buckets. If a perspective is empty it says so,
 * because silence in one perspective is information about the inquiry.
 */
export function composeResponse(
  ontology: Ontology,
  subjectId: string,
): ComposedResponse {
  const buckets = ontology.perspectivesFor(subjectId);
  const perspectives: Partial<Record<Perspective, string[]>> = {};
  for (const perspective of Object.keys(buckets) as Perspective[]) {
    const claims = buckets[perspective];
    perspectives[perspective] = claims.map((claim) => {
      const tag = HUMILITY_TAGS[claim.status];
      return `${tag.hedge} ${claim.statement} (confidence ${claim.confidence.toFixed(2)})`;
    });
  }
  const withheld = ontology
    .openQuestions()
    .filter((question) => question.relatedEntityIds.includes(subjectId))
    .map((question) => question.question);
  const primary =
    buckets.interpretation[0] ??
    buckets.existence[0] ??
    buckets.experience[0] ??
    buckets.belief[0];
  const tag = primary ? HUMILITY_TAGS[primary.status] : HUMILITY_TAGS.unknown;
  return { perspectives, withheld, tag };
}
