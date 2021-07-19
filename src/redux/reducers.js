import { combineReducers } from 'redux';

import {
  UPDATE_USER,
  UPDATE_SURVEY,
  UPDATE_BUILDER_NAV_HISTORY,
  UPDATE_DRAFT,
  SET_HYDRATED,
  UPDATE_SNAPSHOTS,
  UPSERT_SNAPSHOT,
  UPDATE_NAV_HISTORY,
  UPDATE_PHONE_CODE,
  UPDATE_BIRTH_COUNTRY
} from './actions';

// User
export const user = (state = null, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return action.payload;

    default:
      return state;
  }
};

// Current survey
export const currentSurvey = (state = null, action) => {
  switch (action.type) {
    case UPDATE_SURVEY:
      return action.payload;
    case UPDATE_BUILDER_NAV_HISTORY:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

// Current draft
export const currentDraft = (state = null, action) => {
  switch (action.type) {
    case UPDATE_DRAFT:
      return action.payload;
    case UPDATE_NAV_HISTORY:
      return {
        ...state,
        ...action.payload
      };
    case UPDATE_PHONE_CODE:
      const indexPrimaryParticipant = state.familyData.familyMembersList.findIndex(
        e => e.firstParticipant === true
      );
      return {
        ...state,
        familyData: {
          ...state.familyData,
          familyMembersList: [
            ...state.familyData.familyMembersList.slice(
              0,
              indexPrimaryParticipant
            ),
            {
              ...state.familyData.familyMembersList[indexPrimaryParticipant],
              phoneCode: action.payload.phoneCode
            },
            ...state.familyData.familyMembersList.slice(
              indexPrimaryParticipant + 1
            )
          ]
        }
      };
    case UPDATE_BIRTH_COUNTRY:
      const index = state.familyData.familyMembersList.findIndex(
        e => e.firstParticipant === true
      );

      return {
        ...state,
        familyData: {
          ...state.familyData,
          familyMembersList: [
            ...state.familyData.familyMembersList.slice(0, index),
            {
              ...state.familyData.familyMembersList[index],
              birthCountry: action.payload.birthCountry
            },
            ...state.familyData.familyMembersList.slice(index + 1)
          ]
        }
      };

    default:
      return state;
  }
};

export const SNAPSHOTS_STATUS = {
  DRAFT: 'DRAFT',
  COMPLETED: 'COMPLETED'
};

// Snapshots stored
export const snapshots = (state = [], action) => {
  const getSnapshotsWithUpdatedElement = (snapshotsList, snapshot) => {
    const index = snapshotsList.findIndex(s => s.draftId === snapshot.draftId);
    if (index >= 0) {
      return [
        snapshot,
        ...snapshotsList.slice(0, index),
        ...snapshotsList.slice(index + 1, snapshotsList.length)
      ];
    }
    return [snapshot, ...snapshotsList];
  };
  switch (action.type) {
    case UPDATE_SNAPSHOTS:
      return action.payload;
    case UPSERT_SNAPSHOT:
      // A snapshot is basically the same object that comes from a draft, but with
      // two added keys: status and currentScreen.
      // currentScreen key indicates where the user left the snapshot
      return getSnapshotsWithUpdatedElement(state, action.payload);

    default:
      return state;
  }
};

// Store Hydration, false by default, not persistent, marks when store is ready
export const hydration = (state = false, action) => {
  switch (action.type) {
    case SET_HYDRATED:
      return true;
    default:
      return state;
  }
};

export default combineReducers({
  user,
  currentDraft,
  hydration,
  currentSurvey,
  snapshots
});
