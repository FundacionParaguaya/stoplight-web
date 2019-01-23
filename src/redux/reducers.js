import {
  LOAD_FAMILIES,
  DELETE_DRAFT,
  LOGIN,
  LOAD_SURVEYS,
  LOGOUT,
  CREATE_DRAFT,
  ADD_SURVEY_PRIORITY_ACHEIVEMENT_DATA,
  ADD_SURVEY_DATA,
  SUBMIT_DRAFT,
  SUBMIT_DRAFT_COMMIT,
  SUBMIT_DRAFT_ROLLBACK,
  ADD_SURVEY_DATA_WHOLE
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
      case ADD_SURVEY_PRIORITY_ACHEIVEMENT_DATA:
      return state.map(draft => {
        // if this is the draft we are editing
        if (draft.draftId === action.id) {
          const draftCategory = draft[action.category]
          const item = draftCategory.filter(
            item => item.indicator === action.payload.indicator
          )[0]
          // If item exists update it
          if (item) {
            const index = draftCategory.indexOf(item)
            return {
              ...draft,
              [action.category]: [
                ...draftCategory.slice(0, index),
                action.payload,
                ...draftCategory.slice(index + 1)
              ]
            }
          } else {
            // If item does not exist create it
            return {
              ...draft,
              [action.category]: [...draftCategory, action.payload]
            }
          }
        } else {
          return draft
        }
      })
    case ADD_SURVEY_DATA:
      return state.map(draft => {
        if (draft.draftId === action.id) {
          const draftCategory = draft[action.category]

          if (Array.isArray(draftCategory)) {
            // if category is an Array
            const item = draftCategory.filter(
              item => item.key === Object.keys(action.payload)[0]
            )[0]

            if (item) {
              // if item exists in array update it
              const index = draftCategory.indexOf(item)
              return {
                ...draft,
                [action.category]: [
                  ...draftCategory.slice(0, index),
                  {
                    key: Object.keys(action.payload)[0],
                    value: Object.values(action.payload)[0]
                  },
                  ...draftCategory.slice(index + 1)
                ]
              }
            } else {
              // if item is not in array push it
              return {
                ...draft,
                [action.category]: [
                  ...draftCategory,
                  {
                    key: Object.keys(action.payload)[0],
                    value: Object.values(action.payload)[0]
                  }
                ]
              }
            }
          } else {
            // if category is an Object
            const payload = action.payload
            return {
              ...draft,
              [action.category]: {
                ...draftCategory,
                ...payload
              }
            }
          }
        } else return draft
      })
    case ADD_SURVEY_DATA_WHOLE:
      return state.map(draft => {
        return draft.draftId === action.id
          ? {
              ...draft,
              [action.category]: {
                ...draft[action.category],
                ...action.payload
              }
            }
          : draft
      })
    case SUBMIT_DRAFT:
      return state.map(draft =>
        draft.draftId === action.id
          ? {
              ...draft,
              status: 'Pending'
            }
          : draft
      )
    case SUBMIT_DRAFT_COMMIT:
      return state.map(draft =>
        draft.draftId === action.meta.id
          ? {
              ...draft,
              status: 'Success'
            }
          : draft
      )
    case SUBMIT_DRAFT_ROLLBACK:
      return state.map(draft =>
        draft.draftId === action.meta.id
          ? {
              ...draft,
              status: 'Error'
            }
          : draft
      )
    case DELETE_DRAFT:
      return state.filter(draft => draft.draftId !== action.id)
    default:
      return state
  }
}
