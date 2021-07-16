export const activityTypes = {
  SNAPSHOTS: 'SNAPSHOTS',
  BASELINE_SURVEY: 'BASELINE_SURVEY',
  FOLLOWUP_SURVEY: 'FOLLOWUP_SURVEY',
  NEW_STOPLIGHT_SOLUTION: 'NEW_STOPLIGHT_SOLUTION',
  NEW_STOPLIGHT_PRIORITY: 'NEW_STOPLIGHT_PRIORITY',
  NEW_INTERVENTION: 'NEW_INTERVENTION'
};

export const redirectUrlPerType = {
  SNAPSHOTS: '/family/$referenceId',
  BASELINE_SURVEY: '/family/$referenceId',
  FOLLOWUP_SURVEY: '/family/$referenceId',
  NEW_STOPLIGHT_SOLUTION: '/solution/$referenceId',
  NEW_STOPLIGHT_PRIORITY: '/family/$referenceId',
  NEW_INTERVENTION: '/family/$referenceId'
};
