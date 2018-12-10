const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, username: action.username, token: action.token }
    default:
      return state
  }
}

export default reducer
