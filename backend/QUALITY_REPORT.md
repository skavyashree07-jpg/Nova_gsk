# Deha-Chitra quality check report

**Prototype version:** 2.2.1  
**Local check date:** 2026-10-15

## Results in the build environment

- Python syntax compilation: passed.
- Dataset structure/reference validation: passed.
- Included gold examples: 6/6 passed.
- Included holdout-style examples: 10/10 passed.
- Automated tests: 33 passed (including two regression tests for repeated symptom mentions and negation).

## Improvement in this revision

The exact-phrase matcher now checks subsequent occurrences of a symptom phrase when the first occurrence is negated. Previously, wording such as "I had no acne before, but acne is present now" could miss the currently affirmed symptom because the first mention controlled matching. A regression test also verifies that consistently negated mentions remain excluded.

## What these numbers mean—and do not mean

These checks show that the current code matches the expected behavior encoded in its own small test/evaluation examples. The holdout file is a project test fixture, not an independently collected or clinically validated dataset. The results do **not** establish clinical accuracy, population-level performance, safe rule-out, or reliable translation across all dialects and spelling variants.

## Before any real-world pilot

1. Obtain clinician review of red flags, urgency levels, confounders, and all care text.
2. Obtain native-speaker review for every supported language and code-mixed phrase.
3. Run an independently curated evaluation set and report per-language concept recall, urgent-case false negatives, false positives, and confidence intervals.
4. Conduct privacy/security review, consent review, and usability testing with appropriate oversight.
5. Ensure the interface clearly states that the tool is not a diagnosis and does not replace medical care.
