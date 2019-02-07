import store from './store'
import env from './../env.js'

function selectServer(name) {
  return env[name]
}

export const LOGIN = 'LOGIN'
export const login = ( token, env) => ({
  type: LOGIN,
  token,
  env
})

export const LOGOUT = 'LOGOUT'
export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT
  })
}

// Todo - make this one action that accepts payload
export const SAVE_STEP = 'SAVE_STEP'
export const SAVE_DRAFT_ID = 'SAVE_DRAFT_ID'
export const SAVE_SURVEY_ID = 'SAVE_SURVEY_ID'
export const SAVE_SURVEY_STATUS = 'SAVE_SURVEY_STATUS'
export const saveStep = (step) => ({
  type: SAVE_STEP,
  step
})
export const saveDraftId = (draftId) => ({
  type: SAVE_DRAFT_ID,
  draftId
})
export const saveSurveyId = (surveyId) => ({
  type: SAVE_SURVEY_ID,
  surveyId
})
export const saveSurveyStatus = (status) => ({
  type: SAVE_SURVEY_STATUS,
  status
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
export const ADD_SURVEY_PRIORITY_ACHEIVEMENT_DATA =
  'ADD_SURVEY_PRIORITY_ACHEIVEMENT_DATA'
export const ADD_SURVEY_DATA = 'ADD_SURVEY_DATA'
export const ADD_SURVEY_DATA_WHOLE = 'ADD_SURVEY_DATA_WHOLE'

export const createDraft = payload => ({
  type: CREATE_DRAFT,
  payload
})

export const deleteDraft = id => ({
  type: DELETE_DRAFT,
  id
})

export const addSurveyPriorityAchievementData = (id, category, payload) => ({
  type: ADD_SURVEY_PRIORITY_ACHEIVEMENT_DATA,
  category,
  id,
  payload
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


export const SUBMIT_DRAFT_STARTED= 'SUBMIT_DRAFT_STARTED'
export const SUBMIT_DRAFT_SUCCESS= 'SUBMIT_DRAFT_SUCCESS'
export const SUBMIT_DRAFT_FAIL= 'SUBMIT_DRAFT_FAIL'

export const submitDraft = payload => (dispatch, getState) =>  {
  dispatch(submitDraftStarted())
  console.log('current state:', getState());
  const platform = selectServer(store.getState().user.env)
  fetch(`${platform.api}/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${store.getState().user.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query:
      'mutation addSnapshot($newSnapshot: NewSnapshotDTOInput) {addSnapshot(newSnapshot: $newSnapshot)  { surveyId surveyVersionId snapshotStoplightAchievements { action indicator roadmap } snapshotStoplightPriorities { reason action indicator estimatedDate } family { familyId } user { userId  username } indicatorSurveyDataList {key value} economicSurveyDataList {key value} familyDataDTO { latitude longitude accuracy familyMemberDTOList { firstName lastName socioEconomicAnswers {key value} } } } }',
      variables: { newSnapshot: payload }
    })
  })
    .then(res => {
      console.log(res.status)
      if (res.status === 401) {
        // dispatch({ type: LOGOUT })
        throw new Error('Error: Unauthorized.')
      } else if (res.status === 500) {
        throw new Error('An error occured.')
      } else if (res.status === 400){
        throw new Error('400 Bad Request')
      } else if (res.status !== 200){
        throw new Error(`An unknown error occured, status: ${res.status}`)
      } else {
        dispatch(submitDraftSuccess(res))
      }
    })
    .catch(err => dispatch(submitDraftFail(err)))
}

const submitDraftSuccess = () => ({
  type: SUBMIT_DRAFT_SUCCESS,
});

const submitDraftFail = error => ({
  type: SUBMIT_DRAFT_FAIL,
  payload: {
    error
  }
});


const submitDraftStarted =()=>({
  type: SUBMIT_DRAFT_STARTED
})
