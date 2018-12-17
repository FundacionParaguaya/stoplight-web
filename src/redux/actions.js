import { store } from './../index'
import platform from './../env.js'

export const LOGIN = 'LOGIN'
export const login = (username, token) => ({
  type: LOGIN,
  username,
  token
})

export const LOGOUT = 'LOGOUT'
export const logout = () => ({
  type: LOGOUT
})

export const LOAD_FAMILIES = 'LOAD_FAMILIES'
export const loadFamilies = () => dispatch => {
  fetch(`${platform.api}/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${store.getState().user.token}`,
      'Content-Type': 'application/json',
      Origin: platform.api
    },
    body: JSON.stringify({
      query:
        'query { familiesNewStructure{ code familyId user { username } name country { country } organization { code }  snapshotList { surveyId createdAt } countFamilyMembers familyMemberDTOList{ firstName gender birthDate } } }'
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
  fetch(`${platform.api}/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${store.getState().user.token}`,
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
