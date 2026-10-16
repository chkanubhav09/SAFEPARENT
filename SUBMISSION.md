# SAFEPARENT - Devpost submission copy (draft for review, nothing submitted)

## Tagline
A family scam-safety assistant that remembers - a simulated Alexa+ experience.

## Track
Alexa+ (simulated experience route: a web app built with a preferred agentic
tool; source included; no claim of live Alexa+ integration).

## Inspiration
Scam messages are built to panic people who are least prepared to pause:
"your account will be suspended, share the OTP now." One-shot scam detectors
answer once and forget. A real assistant should do what a calm family member
does - slow the moment down, show why the message smells wrong, and remember
where you left off when the fear comes back tomorrow.

## What it does
SAFEPARENT is a stateful safety assistant for a parent facing a suspicious
message:
- Paste the message. Local cue analysis shows each red flag with the exact
  excerpt and an honest meaning ("Urgency can be a scam cue, but is not
  proof"). The true hostname is parsed out of any link - including
  credential-before-host tricks and xn-- encoded lookalikes - and is never
  opened.
- A three-step plan (pause, verify, block) persists per case across
  sessions, with a visible "How this plan was chosen" card listing the local
  tools and sources behind it.
- A trusted-contact flow rehearses an independent callback script without
  dialing anyone or copying any number from the scam message.
- A case assistant answers questions ("Did I already block this sender?",
  "What is the link hostname?") from saved local state through four visible
  tools - and refuses requests to enable external actions like paying,
  calling or reporting.
- The flow is built to de-escalate, not just detect: when a message shows
  multiple panic cues, a short breathing beat ("Pause. Breathe in slowly...
  the message can wait 30 seconds") appears before the evidence, a progress
  stepper (Pause - See evidence - Take a safe step) keeps the user oriented,
  the assistant answers in a familiar chat-style exchange, cue cards carry
  at-a-glance icons, completing all three steps is acknowledged, and
  always-visible "Never uploads / Never calls / Never pays / Never reports"
  chips keep the safety promise in view.
- Privacy is the product: common OTP/PIN/password values are masked before
  anything is saved, exports strip the message, hostname and contact names,
  damaged storage is recovered without silent overwrites, and per-case or
  full deletion actually deletes.

## How it works
A transparent local workflow engine (no LLM, no network calls, no paid API,
no AWS): deterministic cue matching, strict URL hostname parsing, a local
case notebook in localStorage, and a five-tool planner (message_evidence,
hostname_evidence, check_case_state, trusted_contact_lookup,
checklist_planner) whose every run is recorded in a visible tool trace.
27 engine tests plus end-to-end browser and axe accessibility suites
(WCAG 2 A/AA + 2.1 AA clean across six app states) run with `npm test` and
the scripts in tests/.

## Why this fits Alexa+
The interaction model is the Alexa+ promise applied to a vulnerable moment:
an ambient assistant that remembers context and does things, not a one-shot
Q&A. SAFEPARENT's state machine (cases, contacts, checklist, tool trace)
maps directly onto a self-hosted MCP server: each local tool is an MCP tool
waiting to be exposed, and the simulation keeps that upgrade path explicit
instead of faking an integration.

## Product feedback (tools, APIs, SDKs used)
We took the simulated-experience route, so we did not call a live Alexa+
API; feedback is on the track materials themselves.
- What worked: the simulation exemption let us build and test the full
  assistant loop offline within the rules; the MCP spec link gave a concrete
  target shape for the tool design (our tool trace mirrors MCP-style
  tool/result pairs).
- What needs work: the Alexa+ track page mixes the MCP server and Agent
  Skill paths; a single minimal "simulated experience" example repo (even a
  static page calling one local tool) would anchor what judges expect from
  this route.
- Onboarding: eligibility, deadline and deliverables were findable; the
  private-repo collaborator step is easy to miss - worth surfacing at
  submission time, not only in rules.
- Would we build with it again: yes - the MCP path is the natural v2 for
  this project.

## Built during the hackathon window
Everything. SAFEPARENT was designed and implemented from scratch on 10-16
Oct 2026 for this hackathon. It shares only the problem-space inspiration
(scam safety) with an unrelated earlier project; no classifier code, UI or
copy was reused.

## Friction log entries (for the judging bonus)
1. Task: clarify what the Alexa+ simulated route requires in the repo.
   Expected: one canonical example. Actual: requirements are split across
   the overview, rules and FAQ text. Severity: medium. Workaround:
   cross-read all three and keep the simulation source + labels explicit.
   Suggestion: publish a minimal reference simulation.
2. Task: plan private-repo reviewer access. Expected: add collaborators at
   submission. Actual: page notes invitations expire after 7 days, so early
   setup silently lapses. Severity: low. Workaround: add reviewers at
   submission time only. Suggestion: remind on the submission form itself.
3. Task: keep a deterministic assistant honest. Expected: users understand
   "simulation". Actual: early drafts read like a live AI product. Severity:
   high (trust). Workaround: persistent banner, honest labels on every
   answer, capability limits beside every result. Suggestion: publish
   labeling guidelines for simulated entries.
4. Task: verify accessibility without a device lab. Expected: quick
   automated pass. Actual: automated scans miss focus loss after re-renders;
   found only by scripted keyboard tracing. Severity: medium. Workaround:
   tab-order and focus-retention tests in tests/review.mjs. Suggestion:
   recommend focus-management checks in hackathon accessibility guidance.

## Feature requests (optional)
- A reference "simulated Alexa+ experience" starter (critical for first-time
  track entrants).
- A submission-time checklist that restates repo sharing + video
  requirements (important).
- A sandboxed MCP conformance checker for self-hosted servers (nice-to-have).

## Repo & video (gated on owner's final go)
- Repo: PUBLIC https://github.com/chkanubhav09/SAFEPARENT (name chosen, not
  yet created) with the MIT LICENSE at the repo root so GitHub auto-detects
  it in the About section (a stated public-repo requirement). Full source +
  JUDGES.md walkthrough included. Owner decided public on 16 Oct.
- Video: SAFEPARENT-demo-v04.mp4, 1 min 38 s, English captions, no third-
  party assets - to be uploaded as a public YouTube link only after the
  owner approves.

## Open Source mini challenge fields (DECIDED: entering)
- Contribution URL: https://github.com/chkanubhav09/SAFEPARENT (new repo,
  created during the hackathon window)
- Project repository URL: same
- GitHub username: chkanubhav09
- Description (what / how / why):
  What: SAFEPARENT, released as a new MIT-licensed open-source project
  alongside the Alexa+ track entry - a family scam-safety assistant that
  keeps state across sessions.
  How: a dependency-free browser app; deterministic local cue and hostname
  evidence, a five-tool planner with a visible trace, privacy-first storage
  with masking and redacted export, plus a full test suite (27 engine tests,
  end-to-end browser suite, axe accessibility suite) anyone can run with
  npm test.
  Why: scam-safety tooling for older adults is usually closed and
  cloud-based; an auditable, offline, openly-licensed version lets families
  and developers verify exactly what the assistant does with a vulnerable
  person's messages - and lets others extend it toward a real MCP server.
- Note: a project can win at most one track prize and one mini challenge
  prize; the Open Source entry runs alongside the Alexa+ track entry.
