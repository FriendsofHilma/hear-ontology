/**
 * A short tour of Top Ontology 2.
 *
 * Run with: npm run demo
 */

import {
  LivingCore,
  Ontology,
  assessSpiritualSeeker,
  composeResponse,
  createSeedOntology,
  humilityReport,
} from "../dist/index.js";

const line = (title) => {
  console.log("");
  console.log(title);
  console.log("─".repeat(title.length));
};

const { ontology, core } = createSeedOntology();
const stats = ontology.stats();

line("1. The graph");
console.log(`entities: ${stats.entities}`);
console.log(`categories: ${stats.categories}`);
console.log(`relations: ${stats.relations}`);
console.log(`claims: ${stats.claims}`);
console.log(`questions: ${stats.questions} (all open: ${stats.openQuestions})`);
console.log(`validation issues: ${ontology.validate().length}`);

line("2. The upper skeleton (two levels deep)");
for (const entity of ontology.childrenOf("to2:Entity")) {
  console.log(`${entity.id.padEnd(26)} ${entity.label}`);
  for (const child of ontology.childrenOf(entity.id)) {
    console.log(`  └─ ${child.id.padEnd(30)} ${child.label}`);
  }
}

line("3. The Cosmic Block, described four ways");
const response = composeResponse(ontology, "to2:CosmicBlock");
for (const [perspective, statements] of Object.entries(response.perspectives)) {
  console.log(`${perspective}:`);
  for (const statement of statements) console.log(`  • ${statement}`);
}
console.log("withheld:");
for (const question of response.withheld) console.log(`  ? ${question}`);

line("4. The humility audit");
const report = humilityReport(ontology);
console.log(`provisional content: ${(report.provisionalShare * 100).toFixed(0)}%`);
console.log(
  `claims by status: ${Object.entries(report.byStatus)
    .map(([status, count]) => `${status}=${count}`)
    .join(" ")}`,
);
console.log(`overconfident claims: ${report.overconfident.length}`);
console.log(`verdict: ${report.verdict}`);

line("5. Who counts as a spiritual seeker?");
const profile = {
  id: "to2:seeker.example",
  label: "A person who has read too much and understood too little",
  orientation: "seeking",
  characteristics: [
    "experiential_curiosity",
    "interest_in_common_source",
    "commitment_to_inquiry",
    "self_examination",
    "recognition_of_living_knowledge",
  ],
};
const assessment = assessSpiritualSeeker(profile);
console.log(`qualifies: ${assessment.qualifies}`);
console.log(assessment.rationale);

line("6. A living core, with a change of mind on the record");
const living = new LivingCore({ clock: () => new Date().toISOString() });
living.addHypothesis({
  id: "to2:core.demo",
  label: "The Block is a transformer",
  statement: "The Block maps content between perspectives.",
  perspectives: ["existence", "interpretation"],
  rationale: "Initial proposal.",
});
living.revise("to2:core.demo", {
  status: "under_review",
  statement:
    "The Block maps content between perspectives, but only the level structure is formal enough to call a mapping.",
  rationale: "Reviewer asked for a domain and a codomain.",
  evidence: ["review comment"],
});
const hypothesis = living.get("to2:core.demo");
console.log(`current status: ${hypothesis.status}`);
console.log(`revisions kept: ${hypothesis.revisions.length}`);
for (const revision of hypothesis.revisions) {
  console.log(`  [${revision.status}] ${revision.statement}`);
}

line("7. Round trip");
const restored = Ontology.fromJSON(JSON.parse(ontology.toJSONString()));
console.log(
  `serialise → parse → serialise is stable: ${
    restored.toJSONString() === ontology.toJSONString()
  }`,
);
console.log(
  `living core hypotheses: ${core
    .list()
    .map((entry) => entry.status)
    .join(", ")}`,
);
