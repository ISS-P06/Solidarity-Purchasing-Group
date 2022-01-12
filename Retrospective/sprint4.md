TEMPLATE FOR RETROSPECTIVE (Team P06)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 5 / 5
- Total points committed vs done: 49 / 49
- Nr of hours planned vs spent (as a team): 111h 40m / 115h 55m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   | 12      | -      | 67h 30m    | 65h 10m      |
| SPG-13 | 2       | 5      | 4h 30m     | 5h 45m       |
| SPG-40 | 4       | 13     | 13h 10m    | 10h          |
| SPG-41 | 3       | 13     | 11h        | 13h 10m      |
| SPG-42 | 1       | 5      | 5h         | 8h           |
| SPG-43 | 3       | 13     | 10h 30m    | 13h 50m      |
   
> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation):
  - Average:
    - Estimated: (111h 40m) / (25 tasks) = 4.466
    - Actual: (115h 55m) / (25 tasks) = 4.636
  - Standard deviation:
    - Estimated: 3.475
    - Actual: 3.556
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table = 0.963

## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 13h 30m
  - Total hours spent: 14h
  - Nr of automated unit test cases:  139 (73 front-end + 66 back-end)
  - Coverage (if available): 68.6 %
- E2E testing:
  - Total hours estimated: 4h 15m
  - Total hours spent: 4h 45m
- Code review 
  - Total hours estimated: 17h
  - Total hours spent: 17h 10m
- Technical Debt management:
  - Total hours estimated: 14h
  - Total hours spent: 6h 55m
  - Hours estimated for remediation by SonarQube: 6h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: -
  - Hours spent on remediation: 2h 20m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.1%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): A A A

## ASSESSMENT

- What caused your errors in estimation (if any)?
  - We overstimated a bit the time to manage the technical debt. We thought the code smells highlighted by Sonar Cloud would took a lot of time to be fixed. In reality we fixed the code smells in few hours so we spent the remaining hours removing code smells in the new code we were writing.

- What lessons did you learn (both positive and negative) in this sprint?
  - We learned that introducing a bit of technical debt is not so bad as long as we take some time to treat it properly.

- Which improvement goals set in the previous retrospective were you able to achieve?
  - This time we were able to properly estimate the time for the general tasks.
  - This time we were able to correctly refine the story points of our committed stories before starting to work on them.

- Which ones you were not able to achieve? Why?
  - We were able to achieve all the improvement goals set in the previous retrospective. 

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

- One thing you are proud of as a Team!!
  - We are proud of how much our planning skills have improved!
  - Our team velocity increased: this sprint we completed more work in less time. We are very proud of that.