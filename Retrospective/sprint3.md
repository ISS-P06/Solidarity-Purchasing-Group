# TEMPLATE FOR RETROSPECTIVE (Team p06)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done: 4/4
- Total points committed vs done: 45/45
- Nr of hours planned vs spent (as a team): 120h/121h40m

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
| ------ | ------- | ------ | ---------- | ------------ |
| _#0_   | 13      | -      | 85h        | 80h55m       |
| SPG-9  | 5       | 21     | 21h        | 23h35m       |
| SPG-10 | 1       | 8      | 4h         | 40m          |
| SPG-11 | 2       | 8      | 4h         | 4h50m        |
| SPG-12 | 2       | 8      | 6h         | 11h40m       |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation):
  - Average:
    - Estimated: 120h/23 tasks = 5.21
    - Actual: 121h40m/23 tasks = 5.29
  - Standard deviation:
    - Estimated: 4.22
    - Actual: 3.85
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table = 0.986

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: <!-- 20% * [each(task_with_new_code)=65h] --> 13h
  - Total hours spent: 13h
  - Nr of automated unit test cases: 108 (54 back-end + 54 front-end)
  - Coverage (if available): 68.5%
- E2E testing:
  - Total hours estimated: <!-- 5% * each(task_with_new_code) --> 3h15m
  - Total hours spent: 5
- Code review
  - Total hours estimated: 12h40m <!-- 11h General + 10m * num_tasks_story -->
  - Total hours spent: 13h15m
- Technical Debt management:
  - Total hours estimated: 7h
  - Total hours spent: 7h30m
  - Hours estimated for remediation by SonarQube: 7h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues
  - Hours spent on remediation: 3h30m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") 1.4%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): A A A

## ASSESSMENT

- What caused your errors in estimation (if any)?

  - One story was overestimated and it needed a remodulation of effort and estimated time.

- What lessons did you learn (both positive and negative) in this sprint?

  - We need to be able to understand during planning when a story must be estimated again
  - We spent much less time on resolve git conflicts during merges following github best practise

- Which improvement goals set in the previous retrospective were you able to achieve?

  - We changed strategy of time estimation, all new tasks are estimated by all team during the plannig meating

- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - Major estimation for activities that are not development.
  - Refining estimation of story points for old estimated stories not committed yet.

- One thing you are proud of as a Team!!
  - We are proud of having **compleated** all committed stories and improved our github time spent for management with its "Squash" feature.
  - We merged developement branches when a task was compleated and not all tasks at the end of the story or sprint.
  - We managed to integrate Docker in the project, both for development and testing
