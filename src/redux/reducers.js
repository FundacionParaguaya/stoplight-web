import { combineReducers } from 'redux'

import {
  UPDATE_USER,
  UPDATE_SURVEY,
  UPDATE_DRAFT,
  SET_HYDRATED
} from './actions'

// User
export const user = (state = null, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return action.payload

    default:
      return state
  }
}

// Current surcey
export const currentSurvey = (state = null, action) => {
  switch (action.type) {
    case UPDATE_SURVEY:
      return action.payload

    default:
      return state
  }
}

// Current draft
export const currentDraft = (state = null, action) => {
  switch (action.type) {
    case UPDATE_DRAFT:
      return action.payload

    default:
      return state
  }
}

// Store Hydration, false by default, not persistent, marks when store is ready
export const hydration = (state = false, action) => {
  switch (action.type) {
    case SET_HYDRATED:
      return true
    default:
      return state
  }
}

export default combineReducers({
  user,
  currentDraft,
  hydration,
  currentSurvey
})
