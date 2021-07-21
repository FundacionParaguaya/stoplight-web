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

export const UPDATE_BUILDER_NAV_HISTORY = 'UPDATE_BUILDER_NAV_HISTORY';

export const updateBuilderNavHistory = payload => ({
  type: UPDATE_BUILDER_NAV_HISTORY,
  payload
});

// Current Draft
export const UPDATE_DRAFT = 'UPDATE_DRAFT';

export const updateDraft = payload => ({
  type: UPDATE_DRAFT,
  payload
});

export const UPDATE_PHONE_CODE = 'UPDATE_PHONE_CODE';

export const updatePhoneCode = payload => ({
  type: UPDATE_PHONE_CODE,
  payload
});

export const UPDATE_BIRTH_COUNTRY = 'UPDATE_BIRTH_COUNTRY';

export const updateBirthCountry = payload => ({
  type: UPDATE_BIRTH_COUNTRY,
  payload
});
// Current Draft
export const UPDATE_NAV_HISTORY = 'UPDATE_NAV_HISTORY';

export const updateNavHistory = payload => ({
  type: UPDATE_NAV_HISTORY,
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
