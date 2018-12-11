export const user = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, username: action.username, token: action.token }
    case 'LOGOUT':
      return { ...state, username: null, token: null }
    default:
      return state
  }
}
