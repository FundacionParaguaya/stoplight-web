import {
  LOAD_FAMILIES,
  DELETE_DRAFT,
  LOGIN,
  LOAD_SURVEYS,
  LOGOUT,
  CREATE_DRAFT,
  ADD_SURVEY_DATA,
  SUBMIT_DRAFT,
  SUBMIT_DRAFT_COMMIT,
  SUBMIT_DRAFT_ROLLBACK
} from './actions'

export const user = (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        username: action.username,
        token: action.token,
        env: action.env
      }
    case LOGOUT:
      return { username: null, token: null }
    default:
      return state
  }
}

export const families = (state = [], action) => {
  switch (action.type) {
    case LOAD_FAMILIES:
      return action.payload ? action.payload : state
    default:
      return state
  }
}

export const surveys = (state = [], action) => {
  switch (action.type) {
    case LOAD_SURVEYS:
      return action.payload ? action.payload : state
    default:
      return state
  }
}

//Drafts

export const drafts = (state = [], action) => {
  switch (action.type) {
    case CREATE_DRAFT:
      return [...state, { ...action.payload, status: 'In progress' }]
    case ADD_SURVEY_DATA:
      return state.map(draft =>
        draft.draft_id === action.id
          ? {
              ...draft,
              [action.category]: {
                ...draft[action.category],
                ...action.payload
              }
            }
          : draft
      )
    case SUBMIT_DRAFT:
      return state.map(draft =>
        draft.draft_id === action.id
          ? {
              ...draft,
              status: 'Pending'
            }
          : draft
      )
    case SUBMIT_DRAFT_COMMIT:
      return state.map(draft =>
        draft.draft_id === action.meta.id
          ? {
              ...draft,
              status: 'Success'
            }
          : draft
      )
    case SUBMIT_DRAFT_ROLLBACK:
      return state.map(draft =>
        draft.draft_id === action.meta.id
          ? {
              ...draft,
              status: 'Error'
            }
          : draft
      )
    case DELETE_DRAFT:
      return state.filter(draft => draft.draft_id !== action.id)
    default:
      return state
  }
}
