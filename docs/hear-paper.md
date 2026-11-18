# HEAR: Hilma Engineering Anomalous Research

## A Transdisciplinary Framework for Cosmic Tensor Inquiry

**Friends of Hilma af Klint Foundation**
*Working Paper 2 — companion to* The Cosmic Block: A Hierarchical Integer Tensor
and Its Visualisation *(2026)*

November 2026

---

### Abstract

The first Cosmic Block paper described a nine-level hierarchy of nested integer
arrays and a three-dimensional visualisation inspired by Hilma af Klint. It was
a paper about a structure. This paper is about what happens when a structure is
used: by a research programme, by a community of seekers, by a machine that has
to decide what it is allowed to say.

We describe **HEAR — Hilma Engineering Anomalous Research** — as the institutional
and epistemic frame for Cosmic Block inquiry, and we set out its central
instrument, **Top Ontology 2**, a working ontology that separates four
perspectives (existence, experience, belief, interpretation) and six epistemic
statuses (known, believed, experienced, speculated, amusing, unknown). The
ontology is implemented as a zero-dependency TypeScript package with sixty-three
tests and a deterministic seed of fifty-nine entities, twenty-six claims, and
five open questions. We argue that this apparatus is not bureaucracy but the
minimum equipment for a programme that intends to study anomalous experience
without either debunking it or enthroning it.

Three claims are defended. First, that the Cosmic Block is best understood as a
**transformer** — an object that carries content between levels and perspectives
— and that the word remains a hypothesis until a domain, a codomain, and a
preservation condition are specified. Second, that the **spiritual seeker** can
be defined without requiring prior experience of any common core, and that this
is both more honest and more useful than the alternative. Third, that
**intelligent humility** — stating each claim at exactly the confidence its
evidence supports, with humour as a calibration device — is a methodological
virtue rather than a mood, and can be audited in software.

The paper is written in the register it recommends: assertoric where the code
runs, speculative where it does not, and occasionally amused, because the
alternative is a programme that cannot see itself.

---

## 1. A second paper, and why

The first paper ended with a caveat. The reference painting was never decoded by
the build agent's image pipeline, so the default dimensions — thirteen, five,
two — were interpretive assumptions rather than measurements. The caveat was
honest, and it was also a small admission of a larger problem: the project had a
mathematical model, a visualisation, and an art-historical rationale, but no
account of how those three things were supposed to relate. They sat next to each
other like instruments in a case that nobody had learned to play.

This paper is an attempt to learn to play them. Its subject is therefore not the
Block but the **inquiry** around the Block: the programme that maintains it, the
vocabulary it uses, the people it admits, and the claims it permits itself to
make. That is a less tidy subject, and it does not reduce to a tensor.

Two documents prompted the shift. The first is the conclusion of Rachel
Villari's dissertation, which argues — as I read it — that the study of
consciousness cannot be conducted from a position outside consciousness, and
that the seeker's own transformation is part of the data rather than a
contaminant of it. The second is a long, uneven, frequently very funny dialogue
with a language model about the Princeton Engineering Anomalies Research (PEAR)
laboratory, the Suggested Upper Merged Ontology (SUMO), the figure of the
spiritual seeker, and the proposal that the Cosmic Block might function as a
transformer. That dialogue produced the phrase *intelligent humility*, the
acronym *HEAR*, and a number of errors worth preserving, one of which we discuss
in §2.2.

The result is deliberately hybrid. It contains formal definitions, because the
software needs them; art-historical argument, because the project would otherwise
be a tensor with a decorative painter attached; and a theory of error, because a
programme that studies anomalies should expect to produce a few of its own.

## 2. Lineage: from PEAR to HEAR

### 2.1 What PEAR did

From 1979 to 2007, the Princeton Engineering Anomalies Research laboratory
studied the interaction of human intention with physical randomness, principally
through random event generators (Jahn and Dunne 1987). The reported effects were
tiny — deviations of the order of a fraction of a percent — and the programme
was controversial for the usual reasons: effect sizes near the noise floor,
analyses conducted after the fact, and a theoretical interpretation that ran far
ahead of the data.

It would be easy, and wrong, to treat PEAR as a cautionary tale about credulity.
It is better treated as a cautionary tale about **architecture**. The laboratory
was designed to detect an effect and not to record the state of its own
uncertainty. It therefore accumulated results faster than it accumulated reasons
to believe them. When the controversy arrived, there was no artefact that said:
here is what we knew, here is what we believed, here is what we experienced, here
is what we only speculated, and here is what we do not know. The absence of that
artefact is, in retrospect, the most important thing about the case.

HEAR inherits PEAR's question and not its epistemology. The question is whether
mind and physical randomness are coupled at all, and if so at what scale. The
epistemology is the subject of this paper.

### 2.2 The HERE error

The dialogue that produced this paper initially named the programme **HERE**,
expanded as "Helma Anomalous Research". Both halves were wrong. The painter is
Hilma af Klint, not Helma; and the intended expansion was Hilma **Engineering**
Anomalous Research, which describes a practice — engineering — rather than a
location.

The error is worth recording for three reasons. It is a reminder that a language
model will produce a fluent acronym for a programme that does not exist, and that
fluency is not evidence. It is a reminder that a human reader caught it, which is
what readers are for. And it is a small demonstration of the paper's own thesis:
the correction is now part of the record, in the same way that a retired
hypothesis remains in the living core. We could have deleted the mistake and
presented a clean lineage. Keeping it costs one paragraph and buys the reader a
reason to trust the rest.

### 2.3 Naming as a commitment

**HEAR** is a verb before it is an acronym. That is fortunate, because the
programme's first commitment is to listening: to reports, to traditions, to
instruments, and to the possibility that one's own categories are the thing that
needs revising. The acronym then supplies the rest:

- **Hilma** — the painter whose diagrams supply the constructive vocabulary, and
  whose own practice was an inquiry conducted without institutional permission.
- **Engineering** — the insistence on building things that run, with tests, so
  that a claim can be inspected rather than admired.
- **Anomalous** — the willingness to study what does not fit, without assuming
  in advance that it is either signal or noise.
- **Research** — the refusal to conclude before the evidence does.

The name is thus a small ontology in itself: an art-historical anchor, a
methodological commitment, an object of study, and a restraint.

## 3. The Cosmic Block revisited

### 3.1 Structure in brief

The Cosmic Block is a hierarchy of nested arrays of integer cells, each cell
valued 0–9. The levels are defined as follows.

| Level | Structure | Default | Status |
| --- | --- | --- | --- |
| 1 | Line — 1D array of cells | 13 | implemented |
| 2 | Plane — 2D array of lines | 13 × 13 | implemented |
| 3 | Model space — 3D tensor | 13 × 13 × 13 | implemented, visualised |
| 4 | Collection of model spaces | 5 | implemented |
| 5 | Higher-order collection | 2 | implemented |
| 6 | Complementary pair of Level 5 | 2 × [13³ × 5] | documented pattern |
| 7 | Unspecified | — | not implemented |
| 8 | Complementary line | — | not implemented, prose only |
| 9 | Unspecified | — | not implemented |

The numbers are not arbitrary. Thirteen is prime and sits just above the ten
values a cell can hold; five is prime and matches af Klint's series of five; two
is the complementary pair that structures her dualistic compositions. But — and
this is the point of repeating the caveat — they are *interpretive* choices. A
human study of the painting could replace them, and the software would not care,
because dimensions are configurable and no rendering code assumes them.

### 3.2 What the first paper established

Three things, of unequal strength.

**Established.** The data structures exist, compile under `strict: true`, and
were verified at runtime: create, get, set, zero-check, equality, concatenation,
string rendering, for Levels 1–5. The visualisation maps cell values to an
af Klint-inspired palette and renders a point cloud at (x, y, z). This is
engineering, and it is done.

**Argued.** That a hierarchical integer tensor is a reasonable computational
analogue of af Klint's diagrammatic practice: both use small vocabularies,
repetition, and harmonic proportion to produce large structured wholes.

**Asserted without proof.** That the structure *means* something — that its
levels correspond to anything in the world, or in the person. The first paper
was careful to call this an interpretation, but care in a footnote is not the
same as care in a data model. The second paper's ontology exists to make the
distinction structural.

### 3.3 The unresolved levels as a discipline

It would have been easy to implement Level 8. A line spanning the Level 6 pair
is a drawing instruction; one could write it in an afternoon. The project does
not, and the reason is not laziness but a rule: **do not implement what you
cannot define**.

Level 8 is described in prose as "a line associated with and spanning the two
Level 6 components". That sentence contains no incidence relation. Which cells
does the line pass through? Is it a line in the tensor, or about the tensor? Does
it carry values, and if so from where? Without answers, an implementation would
be a decoration that subsequent code would treat as a commitment. The ontology
records the gap as an open question (`to2:q.level-8`), which is more useful than
a function that lies.

This is the first appearance of a pattern that recurs throughout the paper:
**abstention is a technical act**. It has to be represented somewhere, or it will
be filled in by whoever writes the next function.

## 4. The Block as transformer

### 4.1 Three senses of transformation

The dialogue proposed that the Cosmic Block functions as a **transformer**. The
word is doing at least three jobs, and they should be separated before any of
them is believed.

1. **Rendering.** The visualisation transforms a tensor into a point cloud. This
   is real, implemented, and unremarkable: a function from data to geometry.
2. **Translation between levels.** A Level 3 model space contains planes, which
   contain lines, which contain cells. Reading "up" and "down" the hierarchy is a
   transformation between representations of the same content at different
   granularity. This is also real, and it is what the collection API does.
3. **Translation between perspectives.** A structure that is *known* in one
   register — as a tensor with dimensions — might be *experienced* in another, as
   a sense of ascent; *believed* in a third, as a spiritual anatomy; and
   *interpreted* in a fourth, as a diagram of correspondences. The claim that the
   Block mediates these is the interesting one, and it is the one that is not
   established.

Senses 1 and 2 are engineering. Sense 3 is the hypothesis. The ontology marks it
as `speculated` with confidence 0.5, which is neither a dismissal nor an
endorsement.

### 4.2 A minimal formal reading

If "transformer" is to mean more than "metaphor", it needs the ordinary furniture
of a mapping. Let us say that a transformer is a triple

$$
T = (D, C, \rho)
$$

where $D$ is a domain of structured contents, $C$ a codomain of structured
contents, and $\rho$ a preservation condition: a relation on $D$ that must be
mirrored by a relation on $C$. A rendering is a transformer with $D$ = tensors,
$C$ = point sets, and $\rho$ = adjacency. A level translation is a transformer
with $D$ = Level $n$ structures, $C$ = Level $n+1$ structures, and $\rho$ =
containment.

The perspectival claim would require $D$ and $C$ to be *perspectives* rather than
data types, and $\rho$ to be something like "whatever is structurally salient in
$D$ remains salient in $C$". That is not yet a definition; it is a promissory
note. But it is a promissory note with a due date, which is more than the word
"transformer" usually gets.

### 4.3 What would make it literal

Three tasks, in order of difficulty:

1. **Specify $D$.** What exactly is a "content" that can be carried from the
   existence perspective to the experience perspective? Candidate: a set of
   relations among cells (adjacency, symmetry, repetition), abstracted from their
   values.
2. **Specify $\rho$.** Candidate: if two cells are adjacent and equal in $D$,
   then their images are presented as a pair in $C$ — which is testable against
   viewer reports, if anyone collects them systematically.
3. **Specify failure.** A transformer that cannot fail is a metaphor. The
   ontology therefore carries the question in the open list, and the living core
   carries the hypothesis at `under_review` with the note: *needs a domain, a
   codomain, and a preservation condition before it can be called a transformer
   in earnest.*

Until then, the honest formulation is: the Block *affords* transformation, and
the affordance is the object of study.

## 5. Four perspectives

The central design decision of Top Ontology 2 is that a subject may be described
from four perspectives, and that the descriptions are not merged.

| Perspective | Question | What counts as evidence |
| --- | --- | --- |
| **Existence** | What is structurally the case? | definitions, counts, implementations, measurements |
| **Experience** | What is lived or reported? | first-person accounts, transcripts, observations |
| **Belief** | What does an agent or tradition hold? | texts, correspondence, testimony |
| **Interpretation** | What does a model make of it? | theory, analogy, art, metaphor |

Why four, and not one? Because the commonest failure in this field is a category
error that looks like agreement. A practitioner says "I felt the room become
luminous." A researcher writes "the room became luminous." The second sentence
has silently promoted an experience into an existence claim, and no amount of
later hedging repairs it. Keeping the buckets separate makes the promotion
visible: the sentence belongs in `experience`, and moving it requires a new claim
with a new status and new evidence.

Why not five, or seven? Because four is the smallest set that survives contact
with actual disagreement. A fifth perspective ("the social") is real but can be
analysed as belief plus existence; a sixth ("the aesthetic") collapses into
interpretation plus experience. Four is a working partition, not a metaphysics.

The four perspectives are also, not coincidentally, four of the registers in
which af Klint's paintings ask to be read: as diagrams (existence), as
devotional objects (experience), as products of a spiritualist milieu (belief),
and as art (interpretation). The project did not choose four because af Klint
did; it chose four because the arguments about her work keep splitting along
these lines.

## 6. Six statuses and intelligent humility

### 6.1 Known is scoped

The status `known` means **stipulated or established within this framework**. It
does not mean "true". When the ontology says

> Established within this framework: the Cosmic Block is a hierarchy of nested
> arrays of integer cells valued 0–9, with levels 1–6 implemented.

it is reporting a fact about a repository, not about the universe. The scoping
phrase is not decoration; it is the whole content of the claim.

This is a weaker use of "known" than epistemology usually permits, and that is
deliberate. A research programme that cannot distinguish "our code does this"
from "the world is like this" will eventually confuse the two, and the confusion
will be invisible because both sentences will have the same grammar.

### 6.2 The humour clause

`amusing` is a first-class status. A claim may be entered as a jest, with low
confidence, and it will be rendered with the hedge "Offered in play". Examples
from the seed:

> Offered in play: a theory that explains everything, including this sentence, is
> probably a mirror with a footnote.

> Offered in play: dialogue is the only instrument that can be calibrated by
> being contradicted — which is why it is so unpopular with instruments.

This is not a gimmick. Humour is the fastest available test for over-commitment.
A claim that cannot be stated amusingly is often a claim that has fused with its
author's identity; a claim that can only be stated amusingly is often one that
has no evidence at all. The status sits between those failures and marks the
position explicitly, so that a later reader can see whether the joke was a
resting place or a hiding place.

The rule is enforced in code: `amusing` claims are capped at low confidence in
the seed, and the humility audit flags any provisional claim — including an
amusing one — that asserts confidence ≥ 0.8. You may be funny, but you may not
be certain and funny at the same time.

## 7. Top Ontology 2

### 7.1 Why SUMO

The Suggested Upper Merged Ontology is a first-order upper ontology of roughly
twenty-five thousand terms, developed under the IEEE Standard Upper Ontology
Working Group and freely available (Niles and Pease 2001). It offers what this
project lacked: a tested skeleton of very general categories — Entity, Physical,
Abstract, Process, Attribute, Relation, Proposition, Situation — with a clear
subsumption discipline.

Adopting SUMO wholesale would be a mistake. SUMO is realist in a strong sense: it
carries axioms that assert what exists, and its layer of axiomatisation is
precisely where a programme like HEAR should not follow. We therefore take the
**taxonomy** and refuse the **metaphysics**. This is not a criticism of SUMO; it
is a recognition that an upper ontology designed to support machine reasoning
across many domains has different commitments from a domain ontology designed to
keep a research programme honest about its own uncertainty.

The borrowing is recorded in data. Every entity carries a provenance:

```ts
provenance: { kind: "sumo" | "hear" | "af-klint" | "derived" | "user" }
```

An af Klint metaphor is therefore never silently presented as an upper-ontology
commitment. A reader can ask which parts of the framework are inherited, which
are constructed, and which are merely borrowed for the length of a sentence.

### 7.2 What we borrowed, and what we refused

| Borrowed | Refused |
| --- | --- |
| Entity / Abstract / Physical / Process | SUMO's existence axioms |
| Attribute, Relation, Proposition, Situation | SUMO's arithmetic and units |
| Agent and ConsciousAgent | SUMO's treatment of agency as physical |
| A named, namespaced identifier discipline | SUMO's full term inventory |
| Subsumption as the primary hierarchy | SUMO's axiom set as a reasoning engine |

Two refusals deserve comment. **Arithmetic** is refused because the Cosmic
Block's integers are not quantities; they are cell values in a domain structure,
and importing `Number` would invite exactly the wrong inferences (that a 9 is
"more" than a 1 in some measurable sense). **Agency as physical** is refused
because a tradition can be an agent in this ontology — it holds claims, and
claims are the things we are trying to track — and requiring a body would make
the model unable to represent the objects it studies.

### 7.3 The schema

The ontology has three record types and one graph invariant.

**Entity.** A namespaced identifier (`to2:SpiritualSeeker`), a label, a kind
(`category`, `individual`, `process`, `attribute`, `relation`, `proposition`,
`situation`), a description, a list of parents, an optional HEAR layer (1–5),
optional aliases, provenance, and a creation timestamp.

**Claim.** A subject, a predicate that must be an entity of kind `relation`, and
exactly one of an object reference or an object literal. Plus a perspective, a
status, a human-readable statement, a confidence in [0, 1], evidence strings, an
optional source, and a timestamp.

**Question.** An identifier, a question ending in a question mark, a status
(`open` or `resolved`), related entity identifiers, an optional current position,
and an optional rationale.

The graph invariant is that parents must exist before children and that the
parent relation must be acyclic. Both are enforced at insertion and re-checked
on deserialisation. `validate()` additionally checks that every claim's predicate
is typed as a relation, that every object exists, that confidence is in range,
and that every question's related entities resolve.

Identifiers are constrained by a regular expression,
`^[A-Za-z0-9_.-]+:[^\s]+$`. This is a small thing that prevents a large class of
errors: an unnamespaced identifier is a claim that the term is universal, and
most terms are not.

### 7.4 The seed in numbers

The seed ontology is deterministic: a fixed timestamp, no randomness, identical
JSON on every run. Two runs that differ therefore indicate a real change.

| Quantity | Value |
| --- | --- |
| Entities | 59 |
| Categories | 24 |
| Relations | 13 |
| Claims | 26 |
| Open questions | 5 |
| Living-core hypotheses | 4 |
| Tests | 63 |
| Provisional claims | 69% |

The distribution of claims is itself an argument:

| Status | Count |
| --- | --- |
| known | 8 |
| believed | 3 |
| experienced | 3 |
| speculated | 7 |
| amusing | 3 |
| unknown | 2 |

| Perspective | Count |
| --- | --- |
| existence | 9 |
| experience | 3 |
| belief | 3 |
| interpretation | 11 |

A framework in which most claims are `known` would be a framework that has
mistaken its own definitions for discoveries. A framework with no `amusing`
claims would be one that cannot see its own solemnity. The seed is calibrated to
sit between those failures, and the humility audit reports the balance rather
than congratulating the authors.

### 7.5 Implementation as argument

The package is a standalone TypeScript library with no runtime dependencies,
ESM only, compiled under `strict: true` with `noUncheckedIndexedAccess`. It
exports the `Ontology` graph, the `LivingCore`, the seeker assessment, the
humility report and response composer, the vocabulary constants, and the seed.

Three implementation choices are arguments in disguise.

1. **Validation over repair.** `addClaim` throws rather than guessing whether the
   author meant `objectId` or `objectLiteral`. Silent repair is how ontologies
   acquire beliefs nobody holds.
2. **Copies on read.** Every getter returns a deep copy, so a caller cannot
   mutate the graph by editing a returned array. The same discipline applies to
   the parent lists and evidence strings.
3. **Build before test.** `npm test` compiles first. A type error cannot hide
   behind a passing JavaScript test, which is exactly how a claim can hide behind
   a confident sentence.

The tests are not a formality. Sixty-three assertions cover creation,
hierarchy, claim typing, perspective separation, every status, question
integrity, cycle detection, round-trip stability, malformed input, seeker
qualification, append-only revision, overconfidence detection, monologue
detection, seed determinism, and root reachability. Several of them exist
because the first implementation was wrong. The `descendantsOf` traversal, for
instance, originally contained a loop over parents that did nothing; it was
found by a test that asked a simple question the code could not answer.

## 8. The spiritual seeker

### 8.1 The criteria

The ontology defines the spiritual seeker as an agent meeting three required
characteristics and at least two of four supporting ones:

| Required (all three) | Supporting (at least two of four) |
| --- | --- |
| Experiential curiosity — wants to find out, not only to be told | Openness to traditions — willing to learn from forms not one's own |
| Interest in a common source — asks whether traditions converge | Recognition of living knowledge — treats knowledge as revisable |
| Commitment to inquiry — practises, not merely reads | Self-examination — turns the instrument on itself |
| | Orientation toward sharing — expects to give as well as take |

Orientation is recorded separately: `seeking`, `encountered`, `integrating`, or
`sharing`.

### 8.2 Why prior experience is not required

The obvious definition of a spiritual seeker would require some encounter with
the thing sought: an experience of unity, a moment of insight, a contact with
the common core. That definition is excluded here, for two reasons.

**Epistemically**, it makes the category unverifiable from outside. If the
qualifying experience is ineffable, then the assessor must either take the
claimant's word for it or rely on behavioural proxies that are easy to fake. A
category that cannot be assessed is not a category; it is an honour.

**Ethically**, it turns inquiry into a membership test. If only those who have
already encountered the core may be called seekers, then the category rewards
agreement and excludes the curious. The people most likely to be excluded are
exactly the people an open inquiry needs: the sceptic who is nevertheless
fascinated, the member of a tradition that does not use the vocabulary, the
beginner who has had no experience but has the right orientation.

The implemented rule is therefore: all three required characteristics, at least
two of four supporting, and *any* orientation, including `seeking`. The
assessment function returns a rationale that says so in words:

> All 3 core characteristics are present, with 2 supporting characteristic(s).
> Orientation "seeking" is sufficient; prior experience is not required.

This is a stipulation, and it is published as code so that it can be contested.
A reader who disagrees can point at `src/seeker.ts`, change the threshold, and
watch which tests fail. That is what it means for a definition to be
arguable rather than merely asserted.

### 8.3 The constructivist objection

The strongest objection to any talk of a "common core" is constructivist: that
mystical experience is shaped, perhaps constituted, by the concepts and practices
of the tradition in which it occurs (Katz 1978). On that view there is no pure
experience to compare, only tradition-specific experiences that later observers
mistake for the same thing because they share a vocabulary.

The ontology is designed to survive this objection rather than to refute it. It
does not claim that a common content exists; it records that claim as `unknown`
with confidence 0.1, and records the reports of unity as `experienced`, and
records the perennialist reading as `believed`, and the silence-on-different-
instruments image as `amusing`. The seeker definition does not require the
common core at all — it requires an *interest* in whether there is one. A
constructivist can therefore qualify as a spiritual seeker, which seems right.

What the ontology refuses is the move from "reports are tradition-shaped" to
"therefore nothing is reported". That inference is as unjustified as its
opposite, and the four-perspective structure keeps both the reports and the
shaping visible at once.

## 9. The living core

The spiritual core of HEAR is not a doctrine. It is a set of hypotheses with
append-only revision histories.

Each hypothesis carries a statement, a status (`proposed`, `under_review`,
`supported`, `contested`, `retired`), one or more perspectives, evidence strings,
and a list of revisions. Revising a hypothesis updates its current statement and
status and *appends* a revision; it never removes one.

The seed contains four hypotheses, deliberately spread across statuses:

| Hypothesis | Status | Why |
| --- | --- | --- |
| A common source is hypothesised | proposed | Reports are widespread; the vocabulary is tradition-shaped |
| The Block is a transformer | under_review | No domain or codomain yet |
| Humility is methodological | supported | Adopted as a working commitment |
| Anomalies require independent reproduction | contested | Some experiences are unrepeatable by construction |

The fourth is the interesting one. It is contested not because anyone doubts the
general principle, but because applying it to experience is not straightforward:
if an experience is unrepeatable by construction, demanding reproduction may be
a category error rather than a standard. The ontology records that objection
instead of resolving it, because resolving it by fiat would be exactly the kind
of premature synthesis the framework exists to prevent.

Append-only revision has an institutional purpose beyond bookkeeping. A
programme that studies anomalies will change its mind, and the temptation will be
to present the change as a clarification. The revision log makes that
presentation expensive: the earlier statement is still there, with a timestamp.
The HERE error of §2.2 is preserved in this paper for the same reason. Institutions
that cannot remember their errors will repeat them with more confidence.

## 10. Five interconnected layers

HEAR organises inquiry into five layers. They are not stages, and they are not a
ladder; they are five places to stand, and each can correct the others.

| Layer | Question | Characteristic failure |
| --- | --- | --- |
| **1. Existence** | What is structurally the case? | Mistaking a definition for a discovery |
| **2. Experience** | What is lived and reported? | Mistaking a report for its cause |
| **3. Evidence** | What can be measured, reproduced, or failed to reproduce? | Mistaking a null result for nothing |
| **4. Interpretation** | What does it mean? | Mistaking a good story for a finding |
| **5. Conduct** | How is the inquiry carried out? | Mistaking manners for ethics |

The layers are interconnected in a specific way: **each layer supplies the
correction the neighbouring layer is tempted to skip**. Experience corrects
existence by reminding it that a tensor is not a feeling. Evidence corrects
experience by asking whether the report would survive a protocol. Interpretation
corrects evidence by asking what the protocol presupposed. Conduct corrects
interpretation by asking who bears the cost of the story. And existence corrects
conduct by asking whether the rules can actually be implemented — which is why
the rules in this paper are in TypeScript.

Layer 5 is the one most often omitted from research programmes, and the one most
likely to be reduced to a code of conduct PDF. In HEAR it has a technical
meaning: humility, humour, consent, attribution, and the refusal to coerce a
conclusion are *constraints on what may be entered into the ontology and how*.
The `amusing` status, the confidence cap, the overconfidence audit, and the
append-only core are all Layer 5 artefacts.

## 11. Method: poetic investigation

### 11.1 The poem and the protocol

The dialogue that prompted this paper used the phrase **poetic investigation**,
and it is worth defending against the suspicion that it means "vague". A poetic
investigation is one in which the choice of figure is treated as a hypothesis:
the metaphor is not decoration added after the finding, but a candidate
structure that the finding must either support or embarrass.

The Cosmic Block is itself such a figure. It proposes that spiritual and
mathematical order share a shape: nested, harmonic, complementary, small-
vocabulary, large-whole. The protocol that tests the figure is the ontology. If
the figure were empty, the ontology would have nothing to record; if the ontology
were empty, the figure would have nothing to constrain. The two are held together
by the requirement that every claim be typed, sourced, and dated.

### 11.2 Falsifiability without cruelty

Popper's criterion is often applied as a weapon: a claim that cannot be falsified
is dismissed (Popper 1959). That is too quick for a programme that studies
experience. Some claims are not falsifiable but are still informative — "this
practice reliably produces a sense of presence in these subjects" is testable
even if "presence is real" is not.

The ontology implements a gentler version of the criterion. Every speculative
claim carries a route to disconfirmation in its evidence or its guidance, and the
humility report flags claims whose confidence outruns their status. The framework
does not demand that every sentence be falsifiable; it demands that every
sentence declare what kind of sentence it is. That is a lower bar and a more
useful one.

### 11.3 Humour as calibration

Humour is the only register that can expose the gap between a claim and its
evidence without requiring the claimant to lose face. A joke about the common
core — "the same silence played on different instruments, which explains why
every transcription produces a different score" — states the constructivist
objection, the perennialist hope, and the gap between them in one sentence, and
it does so without asking anyone to abandon a commitment.

This is why `amusing` is a status and not a footnote. It marks a claim as
*entertained but not held*, which is precisely the attitude a research programme
should have toward most of its own best ideas.

## 12. Objections and replies

**"This is just taxonomy."** Taxonomy is the least glamorous part of any science
and the part that most often determines what can be seen. The difference here is
that the taxonomy is executable: it refuses malformed claims, detects
single-perspective subjects, and audits confidence. A taxonomy that can tell you
that you are monologuing is not just a taxonomy.

**"Four perspectives is relativism."** No: relativism would let every perspective
count equally as *knowledge*. The statuses constrain. A claim can be `unknown`;
it cannot be `true`. The framework has no truth predicate, by design, because it
is not in the business of adjudicating metaphysics. It is in the business of
making the difference between measurement and metaphor visible.

**"The seeker definition is arbitrary."** It is stipulated, which is not the
same thing. The thresholds are chosen for inclusivity, justified in §8.2, and
implemented in a file that anyone can edit. An arbitrary definition is one whose
reasons are unavailable; this one's reasons are in the tests.

**"SUMO is the wrong foundation."** Possibly. SUMO is large, realist, and not
designed for this purpose. But the alternative is to invent an upper ontology
from scratch, which is a well-known way to spend a decade rediscovering
`Entity` and `Process`. We take the skeleton, label the provenance, and refuse
the axioms. If a better skeleton appears, the seed is data and can be migrated.

**"Humour has no place in research."** Humour has a place in research; it simply
does not have authority. The `amusing` status gives it a place with a ceiling.
The alternative is not seriousness; it is unmarked seriousness, which is the
condition in which a programme cannot tell its jokes from its findings.

**"You are building a machine to police speech."** The audit flags; it does not
forbid. Nothing in the package prevents a claim from being entered. What the
package does is make the claim's standing explicit, so that a reader can weigh
it. A framework that cannot be embarrassed by its own record is not safer; it is
merely less corrigible.

## 13. Ethics and the limits of fiction

Three boundaries have been observed in this work and should be stated.

**Financial and organisational data are fictional in development.** The
membership system that will host this research uses test fixtures. The approved
price is 200 HOT for twelve months; monthly and lifetime tiers exist as inactive
drafts. No real payment, balance, or member record has been invented in the
ontology, and policy questions — refunds, transferability, jurisdictional
treatment — are documented as open rather than answered by the code.

**Experience reports require consent and minimisation.** The ontology stores
claims, not dossiers. A report may be recorded as `experienced` with a source
label; it should not carry identifying detail that the reporter did not intend to
publish. The seed contains no personal reports at all, only aggregate
descriptions, which is the correct default for a public repository.

**The ontology must not certify spiritual attainment.** The seeker assessment
answers a narrow question — does this profile meet the published criteria? — and
returns a rationale. It is not a credential, and using it as one would convert a
research instrument into a gate. The code cannot prevent that misuse, but the
documentation can refuse it in advance, which is the most a documentation can do.

## 14. Conclusion

What has been established?

That a hierarchical integer tensor can be implemented, tested, and visualised;
that its unresolved levels can be represented as open questions rather than
silently filled; that a four-perspective, six-status ontology can be built with
no runtime dependencies and a deterministic seed; that a spiritual seeker can be
defined without requiring prior experience of a common core; that a living core
can preserve its own changes of mind; and that humility can be audited in
software without being reduced to a lint rule.

What remains speculation?

That the Cosmic Block functions as a transformer in the strong sense — that it
carries content between perspectives under a preservation condition. That a
common core exists. That the PEAR effect reproduces. That humour is a reliable
calibration device rather than a pleasant side effect of intelligence.

What is unknown?

Whether the five layers are the right five. Whether four perspectives are
exhaustive. Whether the Level 8 complementary line can be defined at all. Whether
a programme can remain open to anomalous experience while maintaining the
standards that make its findings worth having. Whether anyone will read the
revision history.

The first paper ended with a caveat about a painting that had not been decoded.
This paper ends with a different kind of caveat: the ontology is a machine for
saying "I don't know" in a way that can be inspected. That is a modest
achievement. It is also, for a programme that intends to study anomalies without
either debunking them or enthroning them, close to the minimum equipment
required.

The next document should be a protocol, not a paper: a pre-registered study of
what viewers actually report when they look at the Block, with the four
perspectives as coding categories and the humility audit applied to the
conclusions. Until then, the framework's most defensible claim is the one it
makes about itself — that it is a living hypothesis, with its revisions on the
record.

---

## Appendix A: the seed ontology

**Upper skeleton (layer 1).** Entity; Abstract (Attribute, CosmicBlock,
CosmicCell, HearLayer, Perspective, Proposition, Relation, Situation); Agent
(ConsciousAgent); Physical (Instrument); Process (AnomalousExperience, Dialogue,
Measurement, Report, Reproduction, Transformer).

**Research vocabulary (layers 2–3).** Anomaly, AnomalousExperience, Report,
CommonCore, Dialogue, Measurement, Instrument, Reproduction, NullResult, Artefact,
MindMatterExperiment.

**Perspectives and statuses (layer 4).** Four perspective individuals under
`to2:Perspective`; six status individuals under `to2:EpistemicStatus`.

**Conduct (layer 5).** Five layer individuals under `to2:HearLayer`;
IntelligentHumility; LivingCore; ResearchProgramme; SpiritualSeeker.

**Relations (13).** hasPart, precedes, expresses, studies, grounds, contradicts,
supports, transforms, reports, measures, interprets, requires,
isCompatibleWith.

**Claims (26).** Nine existence, three experience, three belief, eleven
interpretation. Eight known, three believed, three experienced, seven speculated,
three amusing, two unknown.

**Open questions (5).** The common core; PEAR replication; whether the Block is
a transformer; whether humour can be a methodological constraint; what the Level
8 line is.

**Living core (4).** Common source (proposed); Block as transformer
(under_review); humility as methodological (supported); independent reproduction
(contested).

## Appendix B: reproducing the results

```bash
# Node 20 or later
cd hear-ontology
npm install
npm run build      # tsc, strict, NodeNext
npm run typecheck
npm test           # 63 tests, all passing
npm run demo       # guided tour of the seed
```

The seed is deterministic, so `node examples/demo.mjs` produces identical output
on every run except the living-core timestamps, which are drawn from the system
clock in the demo and fixed in the seed.

## Acknowledgements

To Rachel Villari, whose dissertation conclusion supplied the provocation; to
the long dialogue with a language model that supplied the acronym, the errors,
and the phrase *intelligent humility*; to the PEAR laboratory, which supplied the
question and the caution; to Hilma af Klint, who supplied the diagrams and the
permission.

## References

Bashkoff, T. (ed.) (2018). *Hilma af Klint: Paintings for the Future*. New York:
Guggenheim Museum.

Forman, R. K. C. (ed.) (1990). *The Problem of Pure Consciousness: Mysticism and
Philosophy*. New York: Oxford University Press.

James, W. (1902). *The Varieties of Religious Experience*. London: Longmans,
Green.

Jahn, R. G., and Dunne, B. J. (1987). *Margins of Reality: The Role of
Consciousness in the Physical World*. San Diego: Harcourt Brace Jovanovich.

Katz, S. T. (ed.) (1978). *Mysticism and Philosophical Analysis*. New York:
Oxford University Press.

Kuhn, T. S. (1962). *The Structure of Scientific Revolutions*. Chicago:
University of Chicago Press.

Niles, I., and Pease, A. (2001). "Towards a Standard Upper Ontology." In
*Proceedings of the 2nd International Conference on Formal Ontology in
Information Systems (FOIS 2001)*, 2–9.

Popper, K. R. (1959). *The Logic of Scientific Discovery*. London: Hutchinson.

Villari, R. (n.d.). Dissertation conclusion [manuscript]. Bibliographic details
to be completed from the author's records; quoted here by paraphrase only.

Friends of Hilma af Klint Foundation (2026). *The Cosmic Block: A Hierarchical
Integer Tensor and Its Visualisation* (`PAPER.md`).

Friends of Hilma af Klint Foundation (2026). *AGENTS.md: Cosmic Block Project
Specification*.

