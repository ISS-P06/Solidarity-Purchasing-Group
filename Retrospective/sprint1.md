TEMPLATE FOR RETROSPECTIVE (Team p06)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 4 - 5
- Total points committed vs done:  39 - 31
- Nr of hours planned vs spent (as a team): 105h vs 127h

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    11   |    -   |    62h     |       76h    |
| 1      |    2    |  8     |    5h      |     5h30m    |
| 2      |    2    |  5     |    8h      |     11h      |
| 3      |    3    |  13    |    9h      |    10h10m    |
| 4      |    4    |  8     |    13h     |    13h20m    |
| 5      |    4    |  5     |    8h      |    11h       |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation):
  - Average:
    - Estimated: 105h/26 tasks=4.03
    - Actual: 127/26 tasks = 4.884
  - Standard deviation: 
    - Estimated: 6.480
    - Actual: 6.983
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table = 0.826

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 25h
  - Total hours spent: 12h20m
  - Nr of automated unit test cases: 47 (18 back-end + 29 front-end)
  - Coverage (if available): 55.7 %
- E2E testing:
  - Total hours estimated: 10h
  - Total hours spent: 7h
- Code review 
  - Total hours estimated: 0h
  - Total hours spent: 2h
- Technical Debt management:
  - Total hours estimated: 5h
  - Total hours spent: 7h20m
  - Hours estimated for remediation by SonarQube: 4h 42min
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 
  - Hours spent on remediation: 5h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") 1.4%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): A A A
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - We have understimated a little bit the effort behind the horizontal tasks, as we can clearly see on the detaailed statistics table
- What lessons did you learn (both positive and negative) in this sprint?
  - We need to estimate better the hours needed for testing and coding review instead of focus
  ing just on the development
  - We tracked better our tasks in YouTrack and this helped a lot to be aware about the time spent during the sprint
- Which improvement goals set in the previous retrospective were you able to achieve? 
  We were able to:
    - Commit to less stories and tasks but do our best to estimate and complete them properly
    - To keep GitHub repository and YouTrack board updated
- Which ones you were not able to achieve? Why?
  We weren't able to strongly improve the team communication but we were still able to improve a little bit the communication
- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - Major estimation for activities that are not development.


- One thing you are proud of as a Team!!
  - We are proud of having committed 5 stories and completed 4 with the definition of "done".