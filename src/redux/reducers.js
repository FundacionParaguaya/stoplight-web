import { LOAD_FAMILIES, LOGIN, LOAD_SURVEYS } from './actions'

export const user = (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, username: action.username, token: action.token }
    case 'LOGOUT':
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
