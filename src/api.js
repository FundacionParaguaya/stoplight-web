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

export const sendMail = (document, mail, user, lang) => {
  const formData = new FormData();
  formData.set('file', document);

  // For some reason, the backend only accepts some specific locales. Let's normalize it
  let normalizedLang = 'es_PY';
  if (lang === 'en') {
    normalizedLang = 'en_US';
  }

  return axios({
    method: 'post',
    url: `${url[user.env]}/api/lifemap/send?familyEmail=${mail}`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'multipart/form-data',
      'X-locale': normalizedLang
    },
    data: formData
  });
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

export const getSurveysDefinition = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query { surveysDefinitionByUser {id,title,description,indicatorsCount, createdAt} }'
    })
  });
export const getSurveyById = (user, surveyId) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },

    data: JSON.stringify({
      query: `query { surveyById(surveyId:${surveyId}) { title id createdAt description minimumPriorities privacyPolicy { title  text } termsConditions{ title text }  surveyConfig { documentType {text value otherOption } gender { text value otherOption } surveyLocation { country latitude longitude} }  surveyEconomicQuestions { questionText codeName answerType topic required forFamilyMember options {text value otherOption conditions{codeName, type, values, operator, valueType, showIfNoData}}, conditions{codeName, type, value, operator}, conditionGroups{groupOperator, joinNextGroup, conditions{codeName, type, value, operator}} } surveyStoplightQuestions { questionText definition codeName dimension id stoplightColors { url value description } required } } }`
    })
  });

export const getOverviewBlock = (user, hub, fromDate, toDate, organizations) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query blockOverview($hub: Long, $organizations: [Long], $toDate: Long, $fromDate: Long) { blockOverview(hub: $hub, organizations: $organizations, toDate: $toDate, fromDate: $fromDate) { stoplightOverview{ greens yellows reds skipped } priorities achievements } }',
      variables: {
        hub,
        organizations,
        fromDate,
        toDate
      }
    })
  });

export const getEconomicOverview = (
  user,
  hub,
  fromDate,
  toDate,
  organizations
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query economicOverview($hub: Long, $organizations: [Long], $toDate: Long, $fromDate: Long) { economicOverview(hub: $hub, organizations: $organizations, toDate: $toDate, fromDate: $fromDate){familiesCount peopleCount} }',
      variables: {
        hub,
        organizations,
        fromDate,
        toDate
      }
    })
  });

export const getOperationsOverview = (
  user,
  hub,
  fromDate,
  toDate,
  organizations
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query operationsOverview($hub: Long, $organizations: [Long], $toTime: Long, $fromTime: Long) { operationsOverview(hub: $hub, organizations: $organizations, toTime: $toTime, fromTime: $fromTime) { surveysByMonth } }',
      variables: {
        hub,
        organizations,
        toTime: toDate,
        fromTime: fromDate
      }
    })
  });

export const getFamilies = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      query:
        'query { feed { activityId, activityKey, activityParams, activityType, username, createdAt, familyId, familyName } }'
    })
  });

export const getDimensionIndicators = (
  user,
  hub,
  organizations = [],
  fromDate,
  toDate
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      query: `query { dimensionIndicators(hub: ${hub} organizations: ${JSON.stringify(
        organizations
      )} ${fromDate ? `fromDate: ${fromDate}` : ''} ${
        toDate ? `toDate: ${toDate}` : ''
      }) {dimension, priorities, achievements,
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

export const getOrganizationsByHub = (user, hub) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },

    data: JSON.stringify({
      query: `query { organizations (hub:${hub}) {id, name,code} }`
    })
  });

export const getOrganizations = user =>
  axios({
    method: 'get',
    url: `${url[user.env]}/api/v1/organizations/list`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });

export const getHubs = user =>
  axios({
    method: 'get',
    url: `${url[user.env]}/api/v1/applications?page=1`,
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
        'query { getSnapshotDraft{ snapshotDraftDate draftId lifemapNavHistory { url state } surveyId surveyVersionId snapshotStoplightAchievements { action indicator roadmap } snapshotStoplightPriorities { reason action indicator estimatedDate } indicatorSurveyDataList {key value} economicSurveyDataList {key value multipleValue other} familyDataDTO { countFamilyMembers latitude longitude country familyMemberDTOList { firstParticipant firstName lastName birthCountry gender customGender birthDate documentType customDocumentType documentNumber email phoneNumber socioEconomicAnswers {key value other multipleValue} } } } }'
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

export const deleteDraft = (user, draftId) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation deleteDraft($draftId: String) {deleteDraft(draftId: $draftId)} ',
      variables: { draftId }
    })
  });
