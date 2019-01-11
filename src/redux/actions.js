import store from './store'
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
export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT
  })
}

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
        'query { surveysByUser { title id minimumPriorities privacyPolicy { title  text } termsConditions{ title text }  surveyConfig { documentType {text value} gender { text value} surveyLocation { country latitude longitude} }  surveyEconomicQuestions { questionText codeName answerType topic required forFamilyMember options {text value} } surveyStoplightQuestions { questionText codeName dimension id stoplightColors { url value description } required } } }'
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
        payload: res.data.surveysByUser
      })
    )
}

// Drafts

export const CREATE_DRAFT = 'CREATE_DRAFT'
export const DELETE_DRAFT = 'DELETE_DRAFT'
export const ADD_SURVEY_DATA = 'ADD_SURVEY_DATA'
export const SUBMIT_DRAFT = 'SUBMIT_DRAFT'
export const SUBMIT_DRAFT_COMMIT = 'SUBMIT_DRAFT_COMMIT'
export const SUBMIT_DRAFT_ROLLBACK = 'SUBMIT_DRAFT_ROLLBACK'
export const ADD_SURVEY_DATA_WHOLE = 'ADD_SURVEY_DATA_WHOLE'

export const createDraft = payload => ({
  type: CREATE_DRAFT,
  payload
})

export const deleteDraft = id => ({
  type: DELETE_DRAFT,
  id
})

export const addSurveyData = (id, category, payload) => ({
  type: ADD_SURVEY_DATA,
  category,
  id,
  payload
})

export const addSurveyDataWhole = (id, category, payload) => ({
  type: ADD_SURVEY_DATA_WHOLE,
  id,
  category,
  payload
})

export const submitDraft = (env, token, id, payload) => ({
  type: SUBMIT_DRAFT,
  env,
  token,
  payload,
  id,
  meta: {
    offline: {
      effect: {
        url: `${env}/api/v1/snapshots`,
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { Authorization: `Bearer ${token}` }
      },
      commit: {
        type: SUBMIT_DRAFT_COMMIT,
        meta: {
          id
        }
      },
      rollback: {
        type: SUBMIT_DRAFT_ROLLBACK,
        meta: {
          id
        }
      }
    }
  }
})
