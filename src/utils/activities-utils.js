export const activityTypes = {
  SNAPSHOTS: 'SNAPSHOTS',
  BASELINE_SURVEY: 'BASELINE_SURVEY',
  FOLLOWUP_SURVEY: 'FOLLOWUP_SURVEY',
  NEW_STOPLIGHT_SOLUTION: 'NEW_STOPLIGHT_SOLUTION',
  PRIORITY: 'PRIORITY'
};

export const redirectUrlPerType = {
  SNAPSHOTS: '/family/$referenceId',
  BASELINE_SURVEY: '/family/$referenceId',
  FOLLOWUP_SURVEY: '/family/$referenceId',
  NEW_STOPLIGHT_SOLUTION: '/solution/$referenceId',
  PRIORITY: '/family/$referenceId'
};
