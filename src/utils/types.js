// Indicators Tyepes
const INDICATORS_TYPES = ['pie', 'bar'];
const [PIE, BAR] = INDICATORS_TYPES;

// Dashboard types
export const ACTIVITY_FEED = 'ACTIVITY_FEED';
export const OVERVIEW = 'OVERVIEW';
export const INDICATORS = 'INDICATORS';
export const DIMENSIONS = 'DIMENSIONS';
export const ECONOMICS = 'ECONOMICS';
export const CHART = 'CHART';
export const START_LOADING = 'START_LOADING';

export const LOADING = {
  OVERVIEW,
  ECONOMICS,
  ACTIVITY_FEED,
  CHART,
  DIMENSIONS
};

export default INDICATORS_TYPES;
export { PIE, BAR };
