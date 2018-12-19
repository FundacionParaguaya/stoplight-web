import { store } from './../index'
import env from './../env.js'

function selectServer(name) {
  return env[name]
}

export const LOGIN = 'LOGIN'
export const login = (username, token, env) => ({
  type: LOGIN,
  username,
  token,
  env
})

export const LOGOUT = 'LOGOUT'
export const logout = () => ({
  type: LOGOUT
})

export const LOAD_FAMILIES = 'LOAD_FAMILIES'
export const loadFamilies = () => dispatch => {
  const platform = selectServer(store.getState().user.env)
  fetch(`${platform.api}/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${store.getState().user.token}`,
      'Content-Type': 'application/json',
      Origin: platform.api
    },
    body: JSON.stringify({
      query:
        'query { familiesNewStructure { code familyId name address user { username } country { country } organization { code name } snapshotList { surveyId createdAt economicSurveyDataList { key value } indicatorSurveyDataList { key value } snapshotStoplightAchievements { action indicator roadmap } snapshotStoplightPriorities { action estimatedDate indicator reason } } countFamilyMembers familyMemberDTOList{ birthCountry birthDate documentNumber documentType email familyId firstName firstParticipant gender id lastName memberIdentifier phoneNumber personalSurveyDataList {key, value} socioEconomicAnswers {key, value} } person {firstName lastName phoneNumber email gender birthdate countryOfBirth { country } identificationNumber identificationType} } }'
    })
  })
    .then(res => {
      if (res.status === 401) {
        dispatch({ type: LOGOUT })
        return Promise.reject('Error: Unauthorized.')
      } else {
        return res.text()
      }
    })
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
  const platform = selectServer(store.getState().user.env)
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
    .then(res => {
      if (res.status === 401) {
        dispatch({ type: LOGOUT })
        return Promise.reject('Error: Unauthorized.')
      } else {
        return res.text()
      }
    })
    .then(res => JSON.parse(res))
    .then(res =>
      dispatch({
        type: LOAD_SURVEYS,
        payload: res.data.surveysByUser['0']
      })
    )
}
