# SAFEPARENT usability & screen-reader review (16 Oct 2026, v0.4)

Scope: automated axe-core scan (WCAG 2 A/AA + 2.1 AA) across six application
states, a scripted keyboard tab-order walk, a Playwright ARIA-tree read of the
evidence flow, and manual code review of focus and live-region behavior.
This is not a certified audit and has not been tested with a real screen-reader
user.

## States scanned with axe (zero violations in all)

1. Initial empty state
2. Case loaded (evidence + plan + assistant visible)
3. Assistant answer shown
4. Export dialog open (modal)
5. Practice script visible
6. Damaged-storage recovery state

## Findings and fixes

1. Focus loss on checklist toggle (was: focus dropped to <body> after every
   re-render). Fixed: the toggled checkbox is re-focused after render; each
   checkbox carries data-step for stable targeting.
2. Focus loss on trusted-contact select. Fixed: the select is re-focused
   after its change re-renders.
3. No announcement when "Check locally" reveals the evidence, plan and
   assistant sections. Fixed: focus moves to the "2. Look at the evidence"
   heading (tabindex="-1"), so screen-reader and keyboard users land on the
   new content instead of staying on the button.
4. Practice script appeared silently. Fixed: focus moves to the revealed
   script (tabindex="-1").
5. Message textarea was overwritten on every render, destroying unsent edits
   (e.g. asking the assistant a question wiped a draft). Fixed: render() no
   longer touches the textarea; the value is set only on load, case switch,
   deletion and erase. The post-inspection scrub that replaces typed secrets
   with the masked stored text is preserved.
6. Export preview <pre> had no accessible name. Fixed: aria-label describing
   the redacted JSON preview.

## Verified invariants after the fixes

- 27/27 engine tests, full browser suite, keyboard/Escape/dialog suite all pass.
- axe re-run on all six states: zero violations.
- ARIA snapshot of the evidence section reads in a sensible order: summary
  heading, honest capability limit, labelled cues with excerpts and meanings,
  hostname with caveats.
- Keyboard tab order traced end-to-end: skip link first, then a logical
  top-to-bottom order with no traps; the export dialog traps focus while
  modal and returns it on close.
- Post-inspection masking still removes typed secrets from the visible
  textarea (browser suite assertion).

## Known limits

- Focus restoration after re-render is per-control; a full live-region
  strategy would be the next step with real assistive-technology testing.
- Case buttons announce date plus message excerpt; that content is the user's
  own pasted text.
- No testing with actual NVDA/JAWS/VoiceOver users yet.

## v0.7 additions (16 October)

- Progress stepper is an ordered list with aria-current="step" on the active item; completed items are styled, not announced as current.
- Breathing beat is a non-modal role="status" card: it never traps focus or blocks interaction (backdrop is pointer-transparent), auto-dismisses after ~5.5s, has a Skip button that moves focus to the evidence heading, and is not shown at all under prefers-reduced-motion: reduce. The pulsing circle is aria-hidden and its animation is disabled under reduced motion.
- Assistant exchange keeps its aria-live="polite" answer region; the user-question bubble is plain text and hidden for blank questions.
- Completion note is plain text inside the already-rendered workflow section; checkbox change handlers restore focus to the toggled box (existing v0.4 behavior).
- axe (WCAG 2 A/AA + 2.1 AA) re-run across the same six states after these changes: zero violations.
