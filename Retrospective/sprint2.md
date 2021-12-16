TEMPLATE FOR RETROSPECTIVE (Team P06)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 4/4
- Total points committed vs done 47/47
- Nr of hours planned vs spent (as a team) 97 vs 124

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    11   |    -   |   47h30m   |   65h20m     |
| SPG-2 Enter new client |   3     |  5  |   7h15m    |   18h    |
| SPG-6 Registration |   2    |  13   |  5h   |  3h20m   |
| SPG-7 Book |   7    |  21   |   24h   |  27h20m   |
|  SPG-8 Insufficient Balance Reminder |   2   |  13   |  14h   |  10h20m   |  

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation): 
  - Estimated average: 3.91 
  - Actual average: 5.09
  - Estimated standard deviation: 2.33
  - Actual standard deviation: 3.87
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 0.78
  
## QUALITY MEASURES 

- Unit Testing: 
  - Total hours estimated: 25h
  - Total hours spent: about 27h 
  - Nr of automated unit test cases: 42 frontend + 35 backend, where 47 (18 back-end + 29 front-end) from the first sprint
  - Coverage (if available) 61.9%
- E2E testing:
  - Total hours estimated: 10h
  - Total hours spent: about 12h
- Code review 
  - Total hours estimated: 0h 
  - Total hours spent: about 9h
- Technical Debt management
  - Total hours estimated: 10h30m 
  - Total hours spent: about 7h
  - Hours estimated for remediation by SonarQube: about 8h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 
  - Hours spent on remediation: 0h 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.4%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): A A A
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - This difference of hours in estimation is caused by:
    - inexperience in some test case;
    - overestimating a task as countermesure for unexpected events;
    - The strategy to assign estimation per task failed;  

- What lessons did you learn (both positive and negative) in this sprint?
  - We should estimate less time for unexpected events.
  - We should estimate more time for planning to better organize our work.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - Major estimation for activities that are not development (testing, planning..).

- Which ones you were not able to achieve? Why?
  - A better estimation of hours to spend. The strategy to assign task and estimation per task failed.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - Different stategy to estimation and task assignement, all new tasks will be estimeted during the planning.

- One thing you are proud of as a Team!!
  - We are proud of having committed 4 stories and completed 4 with the definition of "done", and increased the coverage for testing. 
  