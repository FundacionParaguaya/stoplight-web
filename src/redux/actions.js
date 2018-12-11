export const login = (username, token) => ({
  type: 'LOGIN',
  username,
  token
})

export const LOAD_FAMILIES = 'LOAD_FAMILIES'
export const loadFamilies = () => dispatch => {
  fetch(`https://testing.backend.povertystoplight.org/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer 1c30dcd6-90fe-4a78-b822-7aea8bb047d3`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query:  'query { familiesNewStructure{ name accuracy snapshotList{ createdAt } } }' 
    })
  })
    .then(res => res.text())
    .then(res => JSON.parse(res))
    .then(res =>
      dispatch({
        type: LOAD_FAMILIES,
        payload: res
      })
    );
};