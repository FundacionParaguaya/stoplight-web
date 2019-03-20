import axios from 'axios'

export const url = {
  production: 'https://platform.backend.povertystoplight.org',
  demo: 'https://demo.backend.povertystoplight.org',
  testing: 'https://testing.backend.povertystoplight.org',
  development: 'http://localhost:8080'
}

export const getSurveys = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      query:
        'query { surveysByUser { title id minimumPriorities privacyPolicy { title  text } termsConditions{ title text }  surveyConfig { documentType {text value} gender { text value} surveyLocation { country latitude longitude} }  surveyEconomicQuestions { questionText codeName answerType topic required forFamilyMember options {text value} } surveyStoplightQuestions { questionText codeName dimension id stoplightColors { url value description } required } } }'
    })
  })
