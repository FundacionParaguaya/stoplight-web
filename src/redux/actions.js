const baseUrl = 'https://testing.backend.povertystoplight.org'
const accessToken = ''
export const LOGIN = 'LOGIN'
export const login = (username, token) => ({
  type: LOGIN,
  username,
  token
})

export const logout = () => ({
  type: 'LOGOUT'
})

export const LOAD_FAMILIES = 'LOAD_FAMILIES'
export const loadFamilies = () => dispatch => {
  fetch(`${baseUrl}/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Origin: baseUrl
    },
    body: JSON.stringify({
      query:
        'query { familiesNewStructure{ code user { username } name country { country } organization { code }  snapshotList { surveyId createdAt } countFamilyMembers familyMemberDTOList{ firstName gender birthDate } } }'
    })
  })
    .then(res => res.text())
    .then(res => JSON.parse(res))
    .then(res =>
      dispatch({
        type: LOAD_FAMILIES,
        payload: res.data
      })
    )
}

export const LOAD_SURVEYS = 'LOAD_SURVEYS'
export const loadSurveys = () => dispatch => {
  fetch(`https://testing.backend.povertystoplight.org/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer 1c30dcd6-90fe-4a78-b822-7aea8bb047d3`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query:
        'query { surveysByUser{id surveyEconomicQuestions{ options {text value} answerType codeName createdAt description questionText }} }'
    })
  })
    .then(res => res.text())
    .then(res => JSON.parse(res))
    .then(res =>
      dispatch({
        type: LOAD_SURVEYS,
        payload: res.data.surveysByUser['0']
      })
    )
}
