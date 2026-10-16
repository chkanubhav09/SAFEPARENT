# SAFEPARENT
Private development MVP for the Amazon Build, Ship, Shape hackathon, Alexa+ simulated-experience route.

## Run
Requires Python 3. From this directory:

    python3 -m http.server 8080 --bind 127.0.0.1

Open http://127.0.0.1:8080. No API keys, account, AWS or paid runtime. Assets and code are local. The page does not send messages or open pasted links.

## What is real
Message-pattern evidence, local URL hostname parsing, saved cases/checklist notes, a user-supplied trusted-contact name, callback practice script, and a five-tool evidence/state/contact planner with four conversational views. Persistent data lives in localStorage in the browser profile; the delete-all button clears it, and per-case deletion removes an individual case and the event trace. Common labelled secret values are masked before storage, but masking is incomplete. This is a deterministic local workflow engine, NOT a trained scam model, LLM or live Alexa+ connection. No calls, reports, blocks, transfers or external calendar updates are performed.

## Limits
No verdict proves safety or scam identity. Bare domains, attachments, hidden links and obfuscated text may be missed. No reputation checks, link fetching or redirect inspection. A checklist tick is only a user note. Local storage is readable by others using this browser profile. Do not enter real passwords/codes. Private browser mode/storage errors may prevent persistence. This MVP needs more usability/edge-case review before submission.

## Test
Node 18+:

    npm test

Browser test dependency is development-only, fetched from npm; it does not require a paid service. See tests/browser.mjs.

## New hackathon work
This code was written for SAFEPARENT on 10 October 2026. It shares only the problem space with earlier experiments; no code was reused. The contribution is a family response workflow with stateful tools and evidence cards. No public repository, deployment, license grant, video upload or submission is authorized by this private bundle. Official source: https://amazonappdev2026.devpost.com/rules

## Redacted export and recovery
Preview and download a deliberately minimal JSON summary. It omits message text/excerpts, hostnames, contact names, IDs and trace; timestamps, cue labels and checklist notes remain. Download is local and is not sharing. Review before sharing yourself.
Corrupt/unsupported saved data is preserved until you explicitly discard it. During recovery, new cases are temporary. If storage is blocked/full, notes may not survive reload. Common labelled code masking is incomplete.

## Conversation scope
Multi-intent questions can consult more than one local tool. Ambiguous "done" asks for clarification, never marks a step. Safety questions never certify a sender. This is deterministic text routing, not language-model inference or autonomous orchestration. No live Alexa+ connection.

## Review
Run `node tests/browser.mjs` and `node tests/review.mjs` after `npm install` for development browser checks. The latter includes an automated axe scan, export/download, keyboard and recovery tests. Automated scans do not establish complete accessibility compliance or substitute for screen-reader/user testing.

Judges: see JUDGES.md for the 5-minute walkthrough. Accessibility review: ACCESSIBILITY_REVIEW.md. Development friction log: FRICTION_LOG.md.

## License

MIT - see LICENSE. Released as an open-source project during the hackathon window (Open Source mini challenge).
