// Indicators Tyepes
const INDICATORS_TYPES = ['pie', 'bar'];
const [PIE, BAR] = INDICATORS_TYPES;

// Dashboard
export const SET_STATE = 'SET_STATE';
export const SET_LOADING = 'SET_LOADING';
export const BEGIN_LOADING = 'BEGIN_LOADING';
export const ACTIVITY_FEED = 'ACTIVITY_FEED';
export const OVERVIEW = 'OVERVIEW';
export const INDICATORS = 'INDICATORS';
export const DIMENSIONS = 'DIMENSIONS';
export const ECONOMICS = 'ECONOMICS';
export const CHART = 'CHART';

export const LOADING = [OVERVIEW, ECONOMICS, CHART, DIMENSIONS];

export default INDICATORS_TYPES;
export { PIE, BAR };
