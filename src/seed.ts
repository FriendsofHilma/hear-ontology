import { LivingCore } from "./core.js";
import { Ontology, type NewClaim, type NewEntity } from "./ontology.js";
import type { Claim, EpistemicStatus, Perspective } from "./model.js";

/**
 * The seed ontology.
 *
 * Three inheritances meet here:
 *  - SUMO supplies the upper skeleton (Entity, Process, Attribute, Relation…).
 *  - HEAR supplies the research vocabulary (anomaly, reproduction, null result).
 *  - af Klint supplies the constructive vocabulary (tensor, correspondence,
 *    complementary pair) — held as interpretation, not as fact.
 *
 * Every timestamp is fixed so the seed is byte-reproducible.
 */

export const SEED_AT = "2026-11-18T00:00:00.000Z";

const TO2 = { kind: "hear" as const, note: "Top Ontology 2 seed" };
const SUMO = { kind: "sumo" as const, note: "Inspired by the Suggested Upper Merged Ontology" };
const KLINT = { kind: "af-klint" as const, note: "Constructive vocabulary from the paintings" };
const DERIVED = { kind: "derived" as const, note: "Introduced by the HEAR framework" };

type EntitySeed = Omit<NewEntity, "createdAt" | "provenance"> & {
  provenance?: NewEntity["provenance"];
};

const ENTITIES: EntitySeed[] = [
  // ---- Layer 1: the upper skeleton -------------------------------------
  {
    id: "to2:Entity",
    label: "Entity",
    kind: "category",
    description:
      "The root of the ontology. Everything the framework can speak about is an entity. This is a stipulation, not a discovery.",
    layer: 1,
    provenance: SUMO,
  },
  {
    id: "to2:Abstract",
    label: "Abstract",
    kind: "category",
    description:
      "Entities that have no spatial location: numbers, propositions, relations, structures.",
    parents: ["to2:Entity"],
    layer: 1,
    provenance: SUMO,
  },
  {
    id: "to2:Physical",
    label: "Physical",
    kind: "category",
    description: "Entities with spatial extent, including instruments and bodies.",
    parents: ["to2:Entity"],
    layer: 1,
    provenance: SUMO,
  },
  {
    id: "to2:Process",
    label: "Process",
    kind: "category",
    description:
      "Entities that unfold in time: experiments, experiences, measurements, dialogues.",
    parents: ["to2:Entity"],
    layer: 1,
    provenance: SUMO,
  },
  {
    id: "to2:Attribute",
    label: "Attribute",
    kind: "category",
    description: "Properties that entities may bear, such as humility or reproducibility.",
    parents: ["to2:Abstract"],
    layer: 1,
    provenance: SUMO,
  },
  {
    id: "to2:Relation",
    label: "Relation",
    kind: "category",
    description:
      "The category of relations. Claims may only use an entity of kind 'relation' as their predicate.",
    parents: ["to2:Abstract"],
    layer: 1,
    provenance: SUMO,
  },
  {
    id: "to2:Proposition",
    label: "Proposition",
    kind: "category",
    description: "A truth-bearing content that can be asserted, doubted, or revised.",
    parents: ["to2:Abstract"],
    layer: 1,
    provenance: SUMO,
  },
  {
    id: "to2:Situation",
    label: "Situation",
    kind: "category",
    description:
      "A bounded state of affairs: an experimental run, a null result, a controversy.",
    parents: ["to2:Abstract"],
    layer: 1,
    provenance: SUMO,
  },
  {
    id: "to2:Agent",
    label: "Agent",
    kind: "category",
    description: "Something that can act, report, or inquire.",
    parents: ["to2:Entity"],
    layer: 1,
    provenance: SUMO,
  },
  {
    id: "to2:ConsciousAgent",
    label: "Conscious agent",
    kind: "category",
    description:
      "An agent capable of experience and report. The ontology records reports without adjudicating their causes.",
    parents: ["to2:Agent"],
    layer: 1,
    provenance: SUMO,
  },

  // ---- Layer 2: experience and anomaly ---------------------------------
  {
    id: "to2:Anomaly",
    label: "Anomaly",
    kind: "category",
    description:
      "A reported deviation from an expected distribution that has not been explained by an established mechanism.",
    parents: ["to2:Situation"],
    layer: 2,
    provenance: DERIVED,
  },
  {
    id: "to2:AnomalousExperience",
    label: "Anomalous experience",
    kind: "category",
    description:
      "A first-person experience that the experiencer regards as exceeding ordinary explanation. Recorded as experience, never as proof of its cause.",
    parents: ["to2:Anomaly", "to2:Process"],
    layer: 2,
    provenance: DERIVED,
  },
  {
    id: "to2:Report",
    label: "Report",
    kind: "category",
    description:
      "A linguistic act by which an agent conveys an experience, a belief, or a measurement.",
    parents: ["to2:Process"],
    layer: 2,
    provenance: DERIVED,
  },
  {
    id: "to2:CommonCore",
    label: "Common core",
    kind: "category",
    description:
      "The hypothesised shared ground of contemplative traditions. A living hypothesis, not an established entity.",
    parents: ["to2:Proposition"],
    layer: 2,
    provenance: KLINT,
  },
  {
    id: "to2:Dialogue",
    label: "Dialogue",
    kind: "process",
    description:
      "A process in which two or more agents exchange claims and may revise them. Treated as an instrument.",
    parents: ["to2:Process"],
    layer: 2,
    provenance: DERIVED,
  },

  // ---- Layer 3: evidence ------------------------------------------------
  {
    id: "to2:Measurement",
    label: "Measurement",
    kind: "category",
    description: "A process that assigns values to an observable according to a procedure.",
    parents: ["to2:Process"],
    layer: 3,
    provenance: SUMO,
  },
  {
    id: "to2:Instrument",
    label: "Instrument",
    kind: "category",
    description:
      "A physical device used in measurement, including random event generators and the software in this repository.",
    parents: ["to2:Physical"],
    layer: 3,
    provenance: DERIVED,
  },
  {
    id: "to2:Reproduction",
    label: "Reproduction",
    kind: "process",
    description:
      "The process of obtaining an independent result of the same kind under stated conditions.",
    parents: ["to2:Process"],
    layer: 3,
    provenance: DERIVED,
  },
  {
    id: "to2:NullResult",
    label: "Null result",
    kind: "category",
    description:
      "A result in which no effect of the stated size was detected. A null result is a result and carries evidential weight.",
    parents: ["to2:Situation"],
    layer: 3,
    provenance: DERIVED,
  },
  {
    id: "to2:Artefact",
    label: "Artefact",
    kind: "category",
    description:
      "An apparent effect produced by the procedure, the analysis, or the selection of data rather than by the hypothesised cause.",
    parents: ["to2:Situation"],
    layer: 3,
    provenance: DERIVED,
  },
  {
    id: "to2:MindMatterExperiment",
    label: "Mind–matter experiment",
    kind: "process",
    description:
      "An experiment testing whether intention covaries with the output of a physical random process. The PEAR programme is the canonical example.",
    parents: ["to2:Measurement"],
    layer: 3,
    provenance: DERIVED,
  },

  // ---- Layer 4: interpretation -----------------------------------------
  {
    id: "to2:Perspective",
    label: "Perspective",
    kind: "category",
    description:
      "One of four irreducible ways of describing a subject: existence, experience, belief, interpretation.",
    parents: ["to2:Abstract"],
    layer: 4,
    provenance: TO2,
  },
  {
    id: "to2:PerspectiveExistence",
    label: "Perspective: existence",
    kind: "individual",
    description:
      "What is the case, structurally: definitions, counts, dimensions, implemented levels.",
    parents: ["to2:Perspective"],
    layer: 4,
    provenance: TO2,
  },
  {
    id: "to2:PerspectiveExperience",
    label: "Perspective: experience",
    kind: "individual",
    description: "What is lived or reported in the first person.",
    parents: ["to2:Perspective"],
    layer: 4,
    provenance: TO2,
  },
  {
    id: "to2:PerspectiveBelief",
    label: "Perspective: belief",
    kind: "individual",
    description: "What an agent or tradition holds, independent of its truth.",
    parents: ["to2:Perspective"],
    layer: 4,
    provenance: TO2,
  },
  {
    id: "to2:PerspectiveInterpretation",
    label: "Perspective: interpretation",
    kind: "individual",
    description:
      "What a model, myth, or theory makes of the other three. Explicitly constructive.",
    parents: ["to2:Perspective"],
    layer: 4,
    provenance: TO2,
  },
  {
    id: "to2:EpistemicStatus",
    label: "Epistemic status",
    kind: "category",
    description:
      "The standing of a claim: known, believed, experienced, speculated, amusing, unknown.",
    parents: ["to2:Attribute"],
    layer: 4,
    provenance: TO2,
  },
  {
    id: "to2:StatusKnown",
    label: "Status: known",
    kind: "individual",
    description:
      "Stipulated or established within the framework. Not a claim of metaphysical certainty.",
    parents: ["to2:EpistemicStatus"],
    layer: 4,
    provenance: TO2,
  },
  {
    id: "to2:StatusBelieved",
    label: "Status: believed",
    kind: "individual",
    description: "Held by an agent or tradition. Evidence about the believer.",
    parents: ["to2:EpistemicStatus"],
    layer: 4,
    provenance: TO2,
  },
  {
    id: "to2:StatusExperienced",
    label: "Status: experienced",
    kind: "individual",
    description: "Reported in the first person. Evidence about the report.",
    parents: ["to2:EpistemicStatus"],
    layer: 4,
    provenance: TO2,
  },
  {
    id: "to2:StatusSpeculated",
    label: "Status: speculated",
    kind: "individual",
    description: "Proposed as a possibility, with a stated route to disconfirmation.",
    parents: ["to2:EpistemicStatus"],
    layer: 4,
    provenance: TO2,
  },
  {
    id: "to2:StatusAmusing",
    label: "Status: amusing",
    kind: "individual",
    description:
      "Offered in play. Entertained without commitment; kept visibly a jest.",
    parents: ["to2:EpistemicStatus"],
    layer: 4,
    provenance: TO2,
  },
  {
    id: "to2:StatusUnknown",
    label: "Status: unknown",
    kind: "individual",
    description:
      "Explicitly not known. A first-class status, so that ignorance can be recorded rather than concealed.",
    parents: ["to2:EpistemicStatus"],
    layer: 4,
    provenance: TO2,
  },

  // ---- Layer 5: conduct -------------------------------------------------
  {
    id: "to2:HearLayer",
    label: "HEAR layer",
    kind: "category",
    description:
      "One of five interconnected layers of inquiry: existence, experience, evidence, interpretation, conduct.",
    parents: ["to2:Abstract"],
    layer: 5,
    provenance: TO2,
  },
  {
    id: "to2:LayerExistence",
    label: "Layer 1: existence",
    kind: "individual",
    description: "What the framework commits to structurally.",
    parents: ["to2:HearLayer"],
    layer: 1,
    provenance: TO2,
  },
  {
    id: "to2:LayerExperience",
    label: "Layer 2: experience",
    kind: "individual",
    description: "What is reported, and by whom, under what conditions.",
    parents: ["to2:HearLayer"],
    layer: 2,
    provenance: TO2,
  },
  {
    id: "to2:LayerEvidence",
    label: "Layer 3: evidence",
    kind: "individual",
    description: "What can be measured, reproduced, or failed to reproduce.",
    parents: ["to2:HearLayer"],
    layer: 3,
    provenance: TO2,
  },
  {
    id: "to2:LayerInterpretation",
    label: "Layer 4: interpretation",
    kind: "individual",
    description: "What the other layers are taken to mean.",
    parents: ["to2:HearLayer"],
    layer: 4,
    provenance: TO2,
  },
  {
    id: "to2:LayerConduct",
    label: "Layer 5: conduct",
    kind: "individual",
    description:
      "How inquiry is carried out: humility, humour, consent, attribution, and the refusal to coerce a conclusion.",
    parents: ["to2:HearLayer"],
    layer: 5,
    provenance: TO2,
  },
  {
    id: "to2:IntelligentHumility",
    label: "Intelligent humility",
    kind: "individual",
    description:
      "The discipline of stating a claim at exactly the confidence its evidence supports — neither more nor less.",
    parents: ["to2:Attribute"],
    layer: 5,
    provenance: TO2,
  },
  {
    id: "to2:CosmicBlock",
    label: "Cosmic Block",
    kind: "category",
    description:
      "A hierarchical structure of nested integer cells (values 0–9), documented to nine levels with levels 1–6 implemented. Treated here as a transformer between perspectives.",
    parents: ["to2:Abstract"],
    layer: 1,
    aliases: ["the Block"],
    provenance: KLINT,
  },
  {
    id: "to2:CosmicCell",
    label: "Cosmic cell",
    kind: "category",
    description: "An integer in the range 0–9 at a position in a Cosmic Block.",
    parents: ["to2:Abstract"],
    layer: 1,
    provenance: TO2,
  },
  {
    id: "to2:Transformer",
    label: "Transformer",
    kind: "process",
    description:
      "A process that maps a structure from one perspective or level to another without claiming that the mapping is the thing mapped.",
    parents: ["to2:Process"],
    layer: 4,
    provenance: DERIVED,
  },
  {
    id: "to2:SpiritualSeeker",
    label: "Spiritual seeker",
    kind: "category",
    description:
      "An agent meeting three required and at least two of four supporting characteristics, in any orientation including 'seeking'. Prior experience of a common core is not required.",
    parents: ["to2:ConsciousAgent"],
    layer: 2,
    provenance: TO2,
  },
  {
    id: "to2:LivingCore",
    label: "Living core",
    kind: "individual",
    description:
      "A set of hypotheses about the spiritual core, each with an append-only revision history.",
    parents: ["to2:Proposition"],
    layer: 5,
    provenance: TO2,
  },
  {
    id: "to2:ResearchProgramme",
    label: "Research programme",
    kind: "individual",
    description:
      "HEAR — Hilma Engineering Anomalous Research — the programme that maintains this ontology.",
    parents: ["to2:Situation"],
    layer: 5,
    provenance: TO2,
  },

  // ---- Relations ---------------------------------------------------------
  {
    id: "to2:hasPart",
    label: "has part",
    kind: "relation",
    description: "Mereological containment.",
    parents: ["to2:Relation"],
    provenance: SUMO,
  },
  {
    id: "to2:precedes",
    label: "precedes",
    kind: "relation",
    description: "Temporal or procedural ordering.",
    parents: ["to2:Relation"],
    provenance: SUMO,
  },
  {
    id: "to2:expresses",
    label: "expresses",
    kind: "relation",
    description:
      "A structure or act gives form to a content without being identical to it.",
    parents: ["to2:Relation"],
    provenance: KLINT,
  },
  {
    id: "to2:studies",
    label: "studies",
    kind: "relation",
    description: "A programme or agent takes an entity as an object of inquiry.",
    parents: ["to2:Relation"],
    provenance: DERIVED,
  },
  {
    id: "to2:grounds",
    label: "grounds",
    kind: "relation",
    description: "One proposition supplies the basis for another.",
    parents: ["to2:Relation"],
    provenance: DERIVED,
  },
  {
    id: "to2:contradicts",
    label: "contradicts",
    kind: "relation",
    description: "Two claims cannot both be held at full strength.",
    parents: ["to2:Relation"],
    provenance: DERIVED,
  },
  {
    id: "to2:supports",
    label: "supports",
    kind: "relation",
    description: "Evidence raises the credibility of a hypothesis without proving it.",
    parents: ["to2:Relation"],
    provenance: DERIVED,
  },
  {
    id: "to2:transforms",
    label: "transforms",
    kind: "relation",
    description: "A process changes the presentation of a structure while preserving something of it.",
    parents: ["to2:Relation"],
    provenance: KLINT,
  },
  {
    id: "to2:reports",
    label: "reports",
    kind: "relation",
    description: "An agent conveys an experience or observation.",
    parents: ["to2:Relation"],
    provenance: DERIVED,
  },
  {
    id: "to2:measures",
    label: "measures",
    kind: "relation",
    description: "An instrument or procedure assigns values to an observable.",
    parents: ["to2:Relation"],
    provenance: DERIVED,
  },
  {
    id: "to2:interprets",
    label: "interprets",
    kind: "relation",
    description: "An interpretation is applied to a subject.",
    parents: ["to2:Relation"],
    provenance: DERIVED,
  },
  {
    id: "to2:requires",
    label: "requires",
    kind: "relation",
    description: "One entity is a necessary condition for another.",
    parents: ["to2:Relation"],
    provenance: DERIVED,
  },
  {
    id: "to2:isCompatibleWith",
    label: "is compatible with",
    kind: "relation",
    description:
      "Two claims can be held together, though neither entails the other.",
    parents: ["to2:Relation"],
    provenance: DERIVED,
  },
];

type ClaimSeed = {
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
  id: string;
};

const CLAIMS: ClaimSeed[] = [
  // Cosmic Block — all four perspectives.
  {
    id: "to2:claim.block.structure",
    subjectId: "to2:CosmicBlock",
    relationId: "to2:hasPart",
    objectId: "to2:CosmicCell",
    perspective: "existence",
    status: "known",
    statement:
      "The Cosmic Block is a hierarchy of nested arrays of integer cells valued 0–9, with levels 1–6 implemented and levels 7–9 deliberately unspecified.",
    confidence: 0.98,
    evidence: ["src/structures at commit of the Cosmic Block paper"],
    source: "PAPER.md",
  },
  {
    id: "to2:claim.block.experience",
    subjectId: "to2:CosmicBlock",
    relationId: "to2:expresses",
    objectLiteral: "a sensed harmonic order reported by viewers of the visualisation",
    perspective: "experience",
    status: "experienced",
    statement:
      "Viewers of the three-dimensional visualisation report a sense of harmonic order and, in several accounts, of vertical ascent.",
    confidence: 0.55,
    evidence: ["unstructured viewer comments", "no systematic protocol"],
    source: "informal gallery conversations",
  },
  {
    id: "to2:claim.block.belief",
    subjectId: "to2:CosmicBlock",
    relationId: "to2:expresses",
    objectLiteral: "a spiritual anatomy of the human being",
    perspective: "belief",
    status: "believed",
    statement:
      "Some members hold that the Block encodes a spiritual anatomy, in the tradition of af Klint's diagrammatic works.",
    confidence: 0.6,
    evidence: ["member correspondence"],
    source: "Friends of Hilma correspondence",
  },
  {
    id: "to2:claim.block.transformer",
    subjectId: "to2:CosmicBlock",
    relationId: "to2:transforms",
    objectId: "to2:PerspectiveInterpretation",
    perspective: "interpretation",
    status: "speculated",
    statement:
      "The Block may function as a transformer: a structure that carries a content from one perspective to another without identifying itself with either.",
    confidence: 0.5,
    evidence: ["structural analogy with levels of description"],
    source: "HEAR working paper 2",
  },

  // Spiritual seeker.
  {
    id: "to2:claim.seeker.definition",
    subjectId: "to2:SpiritualSeeker",
    relationId: "to2:requires",
    objectLiteral:
      "experiential curiosity, interest in a common source, commitment to inquiry, plus two of four supporting characteristics",
    perspective: "existence",
    status: "known",
    statement:
      "A spiritual seeker is defined by three required characteristics and at least two of four supporting ones; orientation 'seeking' is sufficient.",
    confidence: 0.95,
    evidence: ["src/seeker.ts"],
    source: "Top Ontology 2",
  },
  {
    id: "to2:claim.seeker.experience",
    subjectId: "to2:SpiritualSeeker",
    relationId: "to2:reports",
    objectLiteral: "inquiry itself as transformative",
    perspective: "experience",
    status: "experienced",
    statement:
      "Self-described seekers report that the practice of inquiry, not its conclusions, is what changes them.",
    confidence: 0.6,
    evidence: ["dialogue transcripts"],
  },
  {
    id: "to2:claim.seeker.interpretation",
    subjectId: "to2:SpiritualSeeker",
    relationId: "to2:isCompatibleWith",
    objectId: "to2:CommonCore",
    perspective: "interpretation",
    status: "speculated",
    statement:
      "The seeker category may be prior to any particular tradition, which would make it a better unit of analysis than 'adherent'.",
    confidence: 0.45,
  },

  // Common core — the central unknown.
  {
    id: "to2:claim.core.unknown",
    subjectId: "to2:CommonCore",
    relationId: "to2:isCompatibleWith",
    objectLiteral: "the set of contemplative traditions",
    perspective: "existence",
    status: "unknown",
    statement:
      "Whether a common experiential core exists across contemplative traditions is not established, and may not be statable in a tradition-neutral vocabulary.",
    confidence: 0.1,
    evidence: ["perennialist and constructivist literatures disagree"],
    source: "HEAR literature review",
  },
  {
    id: "to2:claim.core.experience",
    subjectId: "to2:CommonCore",
    relationId: "to2:reports",
    objectLiteral: "reports of unity, silence, and luminosity across traditions",
    perspective: "experience",
    status: "experienced",
    statement:
      "Contemplatives across traditions report experiences of unity, silence, and luminosity, though the reports are shaped by the vocabulary available to them.",
    confidence: 0.7,
    evidence: ["comparative mystical literature"],
  },
  {
    id: "to2:claim.core.belief",
    subjectId: "to2:CommonCore",
    relationId: "to2:grounds",
    objectLiteral: "the claim that traditions are partial descriptions of one source",
    perspective: "belief",
    status: "believed",
    statement:
      "Several traditions hold that their own formulations are partial descriptions of a single source.",
    confidence: 0.7,
    evidence: ["primary textual sources"],
  },
  {
    id: "to2:claim.core.amusing",
    subjectId: "to2:CommonCore",
    relationId: "to2:expresses",
    objectLiteral: "the same silence played on different instruments",
    perspective: "interpretation",
    status: "amusing",
    statement:
      "The common core is the same silence played on different instruments — which explains why every attempt to transcribe it produces a different score.",
    confidence: 0.35,
  },

  // Anomaly and artefact.
  {
    id: "to2:claim.anomaly.definition",
    subjectId: "to2:Anomaly",
    relationId: "to2:requires",
    objectLiteral: "a stated expected distribution",
    perspective: "existence",
    status: "known",
    statement:
      "An anomaly is only meaningful relative to a stated expected distribution; without the expectation, the word names nothing.",
    confidence: 0.9,
    evidence: ["statistical practice"],
  },
  {
    id: "to2:claim.anomaly.artefact",
    subjectId: "to2:Anomaly",
    relationId: "to2:contradicts",
    objectId: "to2:Artefact",
    perspective: "interpretation",
    status: "speculated",
    statement:
      "A large share of reported anomalies are artefacts of selection, and the base rate of artefact should be stated before any anomaly is published.",
    confidence: 0.7,
    evidence: ["publication bias literature"],
  },

  // Mind–matter experiments.
  {
    id: "to2:claim.pear.history",
    subjectId: "to2:MindMatterExperiment",
    relationId: "to2:measures",
    objectLiteral: "deviations in random event generator output",
    perspective: "existence",
    status: "known",
    statement:
      "The PEAR programme at Princeton reported small deviations in random event generator output correlated with operator intention over roughly two decades.",
    confidence: 0.85,
    evidence: ["PEAR published reports", "Jahn and Dunne"],
    source: "PEAR archives",
  },
  {
    id: "to2:claim.pear.replication",
    subjectId: "to2:MindMatterExperiment",
    relationId: "to2:requires",
    objectLiteral: "independent reproduction at the same effect size",
    perspective: "existence",
    status: "unknown",
    statement:
      "Whether the PEAR effect reproduces independently at the reported effect size remains unknown to this programme; we have not run the experiment.",
    confidence: 0.15,
    evidence: ["no in-house replication"],
  },
  {
    id: "to2:claim.pear.interpretation",
    subjectId: "to2:MindMatterExperiment",
    relationId: "to2:supports",
    objectId: "to2:PerspectiveInterpretation",
    perspective: "interpretation",
    status: "speculated",
    statement:
      "If the effect is real, it implies a weak coupling between intention and physical randomness — weak enough to be invisible in ordinary life, which is itself a testable prediction.",
    confidence: 0.4,
  },

  // Humility and conduct.
  {
    id: "to2:claim.humility.definition",
    subjectId: "to2:IntelligentHumility",
    relationId: "to2:requires",
    objectLiteral: "a stated epistemic status for every claim",
    perspective: "interpretation",
    status: "known",
    statement:
      "Intelligent humility is the discipline of stating each claim at exactly the confidence its evidence supports; it is a methodological virtue, not a mood.",
    confidence: 0.9,
    evidence: ["src/humility.ts"],
  },
  {
    id: "to2:claim.humility.joke",
    subjectId: "to2:IntelligentHumility",
    relationId: "to2:isCompatibleWith",
    objectLiteral: "a sense of humour about human folly",
    perspective: "interpretation",
    status: "amusing",
    statement:
      "A theory that explains everything, including this sentence, is probably a mirror with a footnote.",
    confidence: 0.3,
  },
  {
    id: "to2:claim.humility.belief",
    subjectId: "to2:IntelligentHumility",
    relationId: "to2:grounds",
    objectId: "to2:LayerConduct",
    perspective: "belief",
    status: "believed",
    statement:
      "The founding group holds that humility without humour curdles into piety, and humour without humility into contempt.",
    confidence: 0.75,
    evidence: ["founding correspondence"],
  },

  // Living core.
  {
    id: "to2:claim.core.living",
    subjectId: "to2:LivingCore",
    relationId: "to2:hasPart",
    objectLiteral: "append-only revisions",
    perspective: "existence",
    status: "known",
    statement:
      "The living core stores hypotheses with append-only revisions, so that a change of mind leaves the earlier position legible.",
    confidence: 0.95,
    evidence: ["src/core.ts"],
  },
  {
    id: "to2:claim.core.retire",
    subjectId: "to2:LivingCore",
    relationId: "to2:requires",
    objectLiteral: "a visible retirement record",
    perspective: "interpretation",
    status: "speculated",
    statement:
      "Retiring a hypothesis should be as visible as proposing one; otherwise the archive quietly rewrites its own past.",
    confidence: 0.65,
  },

  // Null results.
  {
    id: "to2:claim.null.definition",
    subjectId: "to2:NullResult",
    relationId: "to2:precedes",
    objectId: "to2:Reproduction",
    perspective: "existence",
    status: "known",
    statement:
      "A null result is a result: it bounds the effect size and therefore constrains every later reproduction.",
    confidence: 0.9,
    evidence: ["standard statistical practice"],
  },

  // Dialogue.
  {
    id: "to2:claim.dialogue.instrument",
    subjectId: "to2:Dialogue",
    relationId: "to2:transforms",
    objectId: "to2:PerspectiveExperience",
    perspective: "interpretation",
    status: "amusing",
    statement:
      "Dialogue is the only instrument that can be calibrated by being contradicted — which is why it is so unpopular with instruments.",
    confidence: 0.4,
  },

  // The programme.
  {
    id: "to2:claim.hear.layers",
    subjectId: "to2:ResearchProgramme",
    relationId: "to2:hasPart",
    objectId: "to2:HearLayer",
    perspective: "existence",
    status: "known",
    statement:
      "HEAR — Hilma Engineering Anomalous Research — organises inquiry into five interconnected layers: existence, experience, evidence, interpretation, and conduct.",
    confidence: 0.95,
    evidence: ["HEAR working paper 2"],
  },
  {
    id: "to2:claim.hear.studies",
    subjectId: "to2:ResearchProgramme",
    relationId: "to2:studies",
    objectId: "to2:AnomalousExperience",
    perspective: "interpretation",
    status: "speculated",
    statement:
      "A programme that studies anomalous experience should expect to have its own categories destabilised by what it studies.",
    confidence: 0.55,
  },
  {
    id: "to2:claim.transformer.definition",
    subjectId: "to2:Transformer",
    relationId: "to2:transforms",
    objectId: "to2:CosmicBlock",
    perspective: "interpretation",
    status: "speculated",
    statement:
      "Transformation, in this framework, is a change of perspective rather than a change of substance; the transformer is a licensed way of saying 'and also'.",
    confidence: 0.45,
  },
];

const QUESTIONS: {
  id: string;
  question: string;
  relatedEntityIds: string[];
  currentPosition?: string;
  rationale?: string;
}[] = [
  {
    id: "to2:q.common-core",
    question:
      "Does a common experiential core exist across contemplative traditions, or is the apparent commonality an artefact of translation?",
    relatedEntityIds: ["to2:CommonCore", "to2:SpiritualSeeker"],
    currentPosition:
      "Treated as a living hypothesis: the reports are real, their common object is not established.",
    rationale:
      "The perennialist and constructivist positions are both compatible with the available reports.",
  },
  {
    id: "to2:q.pear-replication",
    question:
      "Does the PEAR mind–matter effect reproduce independently at the reported effect size?",
    relatedEntityIds: ["to2:MindMatterExperiment", "to2:Reproduction", "to2:NullResult"],
    currentPosition: "Unknown to this programme.",
    rationale:
      "No replication has been attempted here, and the published record is contested.",
  },
  {
    id: "to2:q.block-transformer",
    question:
      "Does the Cosmic Block function as a transformer, or is 'transformer' only a metaphor for a diagram?",
    relatedEntityIds: ["to2:CosmicBlock", "to2:Transformer"],
    currentPosition:
      "Speculative. A transformer would need a stated domain, codomain, and preservation condition.",
    rationale:
      "The paper uses the word in a loose sense; the ontology flags it as speculation.",
  },
  {
    id: "to2:q.humour",
    question:
      "Can humour be a methodological constraint rather than a decoration?",
    relatedEntityIds: ["to2:IntelligentHumility", "to2:Dialogue"],
    currentPosition:
      "Proposed: a claim that cannot be stated amusingly may be over-committed.",
    rationale:
      "Humour exposes the gap between a claim and its evidence faster than critique does.",
  },
  {
    id: "to2:q.level-8",
    question:
      "What is the Level 8 complementary line that spans the Level 6 pair, and what would make it more than a drawing?",
    relatedEntityIds: ["to2:CosmicBlock"],
    currentPosition:
      "Unimplemented by design. A line without a stated incidence relation is decoration.",
    rationale: "AGENTS.md defers Levels 7–9 until their mathematical meaning is fixed.",
  },
];

export type SeedOptions = {
  /** Override the fixed seed timestamp. */
  at?: string;
};

export type SeedResult = {
  ontology: Ontology;
  core: LivingCore;
};

/** Build a fresh copy of the seed ontology and living core. */
export function createSeedOntology(options: SeedOptions = {}): SeedResult {
  const at = options.at ?? SEED_AT;
  const ontology = new Ontology({ clock: () => at });

  for (const entity of ENTITIES) {
    ontology.addEntity({
      ...entity,
      provenance: entity.provenance ?? TO2,
      createdAt: at,
    });
  }

  for (const claim of CLAIMS) {
    const input: NewClaim = { ...claim, createdAt: at };
    ontology.addClaim(input);
  }

  for (const question of QUESTIONS) {
    ontology.addQuestion({ ...question });
  }

  const core = new LivingCore({ clock: () => at });
  core.addHypothesis({
    id: "to2:core.common-source",
    label: "A common source is hypothesised",
    statement:
      "Contemplative traditions may be partial descriptions of a single source, but the hypothesis is not currently testable in a tradition-neutral vocabulary.",
    status: "proposed",
    perspectives: ["experience", "belief", "interpretation"],
    evidence: ["comparative reports of unity, silence, luminosity"],
    rationale:
      "Retained because the reports are widespread; not promoted because the vocabulary of the reports is tradition-shaped.",
  });
  core.addHypothesis({
    id: "to2:core.block-transformer",
    label: "The Block is a transformer",
    statement:
      "The Cosmic Block maps a content between perspectives while preserving structural relations.",
    status: "under_review",
    perspectives: ["existence", "interpretation"],
    evidence: ["level structure", "visualisation practice"],
    rationale:
      "Needs a domain, a codomain, and a preservation condition before it can be called a transformer in earnest.",
  });
  core.addHypothesis({
    id: "to2:core.humility",
    label: "Humility is methodological",
    statement:
      "Stating epistemic status explicitly improves the quality of inquiry more than any single technique does.",
    status: "supported",
    perspectives: ["interpretation", "belief"],
    evidence: ["the four-perspective split reduces premature synthesis"],
    rationale: "Adopted as a working commitment of the programme.",
  });
  core.addHypothesis({
    id: "to2:core.replication",
    label: "Anomalies require independent reproduction",
    statement:
      "No anomalous effect should be treated as established without independent reproduction at a stated effect size.",
    status: "contested",
    perspectives: ["existence", "interpretation"],
    evidence: ["replication crisis literature", "PEAR controversy"],
    rationale:
      "Contested in practice because some experiences are unrepeatable by construction — which is a real objection, not a rhetorical one.",
  });

  return { ontology, core };
}

export const SEED_ENTITY_COUNT = ENTITIES.length;
export const SEED_CLAIM_COUNT = CLAIMS.length;
export const SEED_QUESTION_COUNT = QUESTIONS.length;

export type { Claim };
