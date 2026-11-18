# AI Working Journal - Chubb QA Assessment

## AI-assisted work

- Reviewed the assessment requirements and application architecture.
- Used AI assistance to prioritise security, claim lifecycle and integration risks.
- Used AI assistance to review test execution logs and identify the Mockito
  Byte Buddy initialization problem.
- Reviewed the Keycloak role configuration and admin endpoint restrictions.

## Challenges and overrides

- Challenged the assumption that an HTTP 200 response alone proved
  authorization was correct.
- Identified that a claimant-role token receiving HTTP 200 on an admin
  endpoint requires investigation.
- Rejected running Java annotations and method bodies directly in PowerShell;
  these belong in Java source files.
- Identified the mismatch between the project's Java 21 requirement
  and the local Java 25 environment.

## Human review

All generated tests and findings must be reviewed against actual application
behaviour before submission.

Update this journal with final test results and any code changes.
