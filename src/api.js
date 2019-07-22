import axios from 'axios';

// Send correct encoding in all POST requests
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

// list of environment urls
export const url = {
  platform: 'https://platform.backend.povertystoplight.org',
  demo: 'https://demo.backend.povertystoplight.org',
  testing: 'https://testing.backend.povertystoplight.org',
  development: 'http://localhost:8080'
};

export const logout = user =>
  axios({
    method: 'get',
    url: `${url[user.env]}/oauth/revoke-token`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });

export const getFamiliesOverviewInfo = user =>
  axios({
    method: 'get',
    url: `${url[user.env]}/api/v1/applications/dashboard`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });

// get a list of surveys available to the authorized used
export const getSurveys = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query { surveysByUser { title id createdAt description minimumPriorities privacyPolicy { title  text } termsConditions{ title text }  surveyConfig { documentType {text value otherOption } gender { text value otherOption } surveyLocation { country latitude longitude} }  surveyEconomicQuestions { questionText codeName answerType topic required forFamilyMember options {text value conditions{codeName, type, values, operator, valueType, showIfNoData}}, conditions{codeName, type, value, operator}, conditionGroups{groupOperator, joinNextGroup, conditions{codeName, type, value, operator}} } surveyStoplightQuestions { questionText definition codeName dimension id stoplightColors { url value description } required } } }'
    })
  });

export const getOverviewBlock = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query { blockOverview(organizations: [1]) { stoplightOverview{ greens yellows reds skipped } priorities achievements } }'
    })
  });

export const getEconomicOverview = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query { economicOverview(organizations: [1]) { familiesCount peopleCount } }'
    })
  });

export const getFamilies = user =>
  axios({
    method: 'get',
    url: `${url[user.env]}/api/v1/families`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });

export const getDimensionIndicators = (user, organizations = []) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      query: `query { dimensionIndicators(organizations: ${JSON.stringify(
        organizations
      )}) {dimension, priorities, achievements,
          stoplights{count, color, dimension}, indicators{name, dimension, achievements, priorities,
           stoplights{count, color, dimension, indicator}} } }`
    })
  });

// submit a new snapshot/lifemap/draft
export const submitDraft = (user, snapshot) => {
  const sanitizedSnapshot = { ...snapshot };
  delete sanitizedSnapshot.lifemapNavHistory;
  let { economicSurveyDataList } = snapshot;
  const validEconomicIndicator = ec =>
    (ec.value !== null && ec.value !== undefined && ec.value !== '') ||
    (!!ec.multipleValue && ec.multipleValue.length > 0);
  economicSurveyDataList = economicSurveyDataList.filter(
    validEconomicIndicator
  );
  sanitizedSnapshot.economicSurveyDataList = economicSurveyDataList;
  sanitizedSnapshot.familyData.familyMembersList.forEach(member => {
    let { socioEconomicAnswers = [] } = member;
    socioEconomicAnswers = socioEconomicAnswers.filter(validEconomicIndicator);
    // eslint-disable-next-line no-param-reassign
    member.socioEconomicAnswers = socioEconomicAnswers;
  });
  return axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation addSnapshot($newSnapshot: NewSnapshotDTOInput) {addSnapshot(newSnapshot: $newSnapshot)  { surveyId surveyVersionId snapshotStoplightAchievements { action indicator roadmap } snapshotStoplightPriorities { reason action indicator estimatedDate } family { familyId } user { userId  username } indicatorSurveyDataList {key value} economicSurveyDataList {key value} familyDataDTO { latitude longitude accuracy familyMemberDTOList { firstName lastName socioEconomicAnswers {key value} } } } }',
      variables: { newSnapshot: sanitizedSnapshot }
    })
  });
};

export const checkSessionToken = (token, env) =>
  axios({
    method: 'get',
    url: `${url[env]}/api/v1/users/validate`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

export const getOrganizations = user =>
  axios({
    method: 'get',
    url: `${url[user.env]}/api/v1/organizations?page=1`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });

// get the user's draft list
export const getDrafts = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query { getSnapshotDraft{ draftId surveyId surveyVersionId snapshotStoplightAchievements { action indicator roadmap } snapshotStoplightPriorities { reason action indicator estimatedDate } indicatorSurveyDataList {key value} economicSurveyDataList {key value} familyDataDTO { countFamilyMembers latitude longitude country familyMemberDTOList { firstParticipant firstName lastName birthCountry gender birthDate documentType documentNumber email phoneNumber socioEconomicAnswers {key value other multipleValue} } } } }'
    })
  });

// Saves a draft
export const saveDraft = (user, draft) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation addSnapshotDraft($newSnapshot: NewSnapshotDTOInput) {addSnapshotDraft(newSnapshot: $newSnapshot)} ',
      variables: { newSnapshot: draft }
    })
  });
