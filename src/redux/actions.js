// User
export const UPDATE_USER = 'UPDATE_USER';

export const updateUser = payload => ({
  type: UPDATE_USER,
  payload
});

// Current Survey
export const UPDATE_SURVEY = 'UPDATE_SURVEY';

export const updateSurvey = payload => ({
  type: UPDATE_SURVEY,
  payload
});

// Current Draft
export const UPDATE_DRAFT = 'UPDATE_DRAFT';

export const updateDraft = payload => ({
  type: UPDATE_DRAFT,
  payload
});

// Store Hydration
export const SET_HYDRATED = 'SET_HYDRATED';

export const setHydrated = () => ({
  type: SET_HYDRATED
});

export const UPDATE_SNAPSHOTS = 'UPDATE_SNAPSHOTS';
export const updateSnapshots = payload => ({
  type: UPDATE_SNAPSHOTS,
  payload
});

export const UPSERT_SNAPSHOT = 'UPSERT_SNAPSHOT';
export const upsertSnapshot = payload => ({
  type: UPSERT_SNAPSHOT,
  payload
});
