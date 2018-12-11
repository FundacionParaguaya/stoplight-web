export const login = (username, token) => ({
  type: 'LOGIN',
  username,
  token
})

export const logout = () => ({
  type: 'LOGOUT'
})
