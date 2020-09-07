import axios from 'axios';
import store from './redux';
import { PhoneNumberUtil } from 'google-libphonenumber';
import CallingCodes from './screens/lifemap/CallingCodes';

// Send correct encoding in all POST requests
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.headers.post['Stoplight-Client-Id'] = 'stoplight-web';

// list of api's urls per enviroment
export const url = {
  platform: 'https://platform.backend.povertystoplight.org',
  demo: 'https://demo.backend.povertystoplight.org',
  testing: 'https://testing.backend.povertystoplight.org',
  development: 'https://testing.backend.povertystoplight.org'
};

// list of enviroments urls
export const enviroments = {
  platform: 'https://platform.povertystoplight.org',
  demo: 'https://demo.povertystoplight.org',
  testing: 'https://testing.povertystoplight.org',
  development: 'http://localhost:3000'
};

axios.interceptors.response.use(
  response => response,
  error => {
    const status = error.response ? error.response.status : null;
    const { user = {} } = store.getState();
    if (status === 401 && !!user && !!user.env) {
      window.location.replace(`${enviroments[user.env]}/login`);
    }
    return Promise.reject(error);
  }
);

const clientid = 'barClientIdPassword';
const clientsecret = 'secret';
const normalizeLang = lang => (lang === 'en' ? 'en_US' : 'es_PY');

export const sendMail = (document, mail, user, lang) => {
  const formData = new FormData();
  formData.set('file', document);

  // For some reason, the backend only accepts some specific locales. Let's normalize it
  const normalizedLang = normalizeLang(lang);

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

export const sendLifemapPdf = (document, familyId, user) => {
  const formData = new FormData();
  formData.set('file', document);

  return axios({
    method: 'post',
    url: `${url[user.env]}/api/lifemap/save?familyId=${familyId}`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'multipart/form-data'
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

// get a list of surveys available to the authorized used
export const getSurveysByUser = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query { surveysInfoWithOrgs { id, title, applications { id }, organizations { id } } }'
    })
  });

export const surveysByUserPaginated = (user, page) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query surveysByUserPaginated($page: Int, $sortBy: String, $sortDirection: String) { surveysByUserPaginated(page:$page, sortBy:$sortBy, sortDirection:$sortDirection ){content {id,title, indicatorsCount, createdAt, organizations{id,name}, applications{id,name}} totalPages totalElements }}',
      variables: {
        page: page,
        sortBy: '',
        sortDirection: ''
      }
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
      query: `query { surveyById(surveyId:${surveyId}) { title id createdAt description minimumPriorities privacyPolicy { title  text } termsConditions{ title text }  surveyConfig { documentType {text value otherOption } gender { text value otherOption } stoplightOptional signSupport pictureSupport surveyLocation { country latitude longitude} }  surveyEconomicQuestions { questionText codeName answerType topic topicAudio required forFamilyMember options {text value otherOption conditions{codeName, type, values, operator, valueType, showIfNoData}}, conditions{codeName, type, value, operator}, conditionGroups{groupOperator, joinNextGroup, conditions{codeName, type, value, operator}} } surveyStoplightQuestions { questionText definition codeName dimension id questionAudio stoplightColors { url value description } required } } }`
    })
  });

export const getIndicatorsBySurveyId = (user, surveyId) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query: `query { surveyById(surveyId:${surveyId}) { surveyStoplightQuestions { id codeName shortName } } }`
    })
  });

export const getOverviewBlock = (
  user,
  hub,
  fromDate,
  toDate,
  organizations,
  surveys,
  lang
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query:
        'query blockOverview($hub: Long, $organizations: [Long], $surveys: [Long], $toDate: Long, $fromDate: Long) { blockOverview(hub: $hub, organizations: $organizations,surveys: $surveys, toDate: $toDate, fromDate: $fromDate) { stoplightOverview{ greens yellows reds skipped } priorities achievements } }',
      variables: {
        hub,
        organizations,
        surveys,
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
  organizations,
  surveys,
  lang
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query:
        'query economicOverview($hub: Long, $organizations: [Long],$surveys: [Long], $toDate: Long, $fromDate: Long) { economicOverview(hub: $hub, organizations: $organizations, surveys: $surveys,toDate: $toDate, fromDate: $fromDate){familiesCount peopleCount familiesWithStoplightCount} }',
      variables: {
        hub,
        organizations,
        surveys,
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
  organizations,
  surveys,
  lang
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query:
        'query operationsOverview($hub: Long, $organizations: [Long],$surveys: [Long], $toTime: Long, $fromTime: Long) { operationsOverview(hub: $hub, organizations: $organizations,surveys: $surveys, toTime: $toTime, fromTime: $fromTime) { surveysByMonth } }',
      variables: {
        hub,
        organizations,
        surveys,
        toTime: toDate,
        fromTime: fromDate
      }
    })
  });

export const getFamilies = (user, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query:
        'query { feed { activityId, activityKey, activityParams, activityType, username, createdAt, familyId, familyName, stoplightClient } }'
    })
  });

export const getDimensionIndicators = (
  user,
  hub,
  organizations = [],
  surveys = [],
  fromDate,
  toDate,
  lang
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query: `query { dimensionIndicators(hub: ${hub} organizations: ${JSON.stringify(
        organizations
      )} 
      surveys: ${JSON.stringify(surveys)} 
      ${fromDate ? `fromDate: ${fromDate}` : ''} ${
        toDate ? `toDate: ${toDate}` : ''
      }) {dimension, priorities, achievements,
          stoplights{count, color, dimension}, indicators{name, dimension, achievements, priorities,
           stoplights{count, color, dimension, indicator}} } }`
    })
  });

export const getFamilyImages = (familyId, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query: `query picturesSignaturesByFamily($family: Long!) { picturesSignaturesByFamily (family: $family) {  category url } }`,
      variables: {
        family: familyId
      }
    })
  });

export const getFamilyNotes = (familyId, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query: `query { notesByFamily (familyId: ${familyId}) { familyId, note, noteDate, noteUser } }`
    })
  });

export const saveFamilyNote = (familyId, familyNote, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query: `mutation saveFamilyNote($familyNote: FamilyNoteDtoInput) {saveFamilyNote(familyNote: $familyNote) { note } }`,
      variables: {
        familyNote: {
          note: familyNote,
          familyId: familyId
        }
      }
    })
  });

export const deleteSnapshot = (user, snapshot) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },

    data: JSON.stringify({
      query: `mutation deleteSnapshot($snapshot: Long!) { deleteSnapshot (snapshot: $snapshot) {successful infos} }`,
      variables: {
        snapshot: snapshot
      }
    })
  });

const formatPhone = (code, phone, surveyLocation) => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  if (phone && phone.length > 0) {
    let international = '';
    if (code) {
      international = '+' + code + ' ' + phone;
    } else {
      code = CallingCodes.find(e => e.code === surveyLocation.country).value;
      international = '+' + code + ' ' + phone;
    }
    let phoneNumber = phoneUtil.parse(international, code);
    phone = phoneNumber.getNationalNumber();
  }
  return phone;
};
// submit a new snapshot/lifemap/draft
export const submitDraft = (user, snapshot, surveyLocation) => {
  const sanitizedSnapshot = { ...snapshot };
  delete sanitizedSnapshot.lifemapNavHistory;
  delete sanitizedSnapshot.previousIndicatorSurveyDataList;
  delete sanitizedSnapshot.previousIndicatorPriorities;
  delete sanitizedSnapshot.previousIndicatorAchivements;
  delete sanitizedSnapshot.isRetake;
  delete sanitizedSnapshot.snapshotId;
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
    member.phoneNumber = formatPhone(
      member.phoneCode,
      member.phoneNumber,
      surveyLocation
    );
    socioEconomicAnswers = socioEconomicAnswers.filter(validEconomicIndicator);
    // eslint-disable-next-line no-param-reassign
    member.socioEconomicAnswers = socioEconomicAnswers;
    // eslint-disable-next-line no-param-reassign
    delete member.countFamilyMembers;
  });

  return axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation addSnapshot($newSnapshot: NewSnapshotDTOInput) {addSnapshot(newSnapshot: $newSnapshot)  { surveyId surveyVersionId snapshotId snapshotStoplightAchievements { action indicator roadmap } snapshotStoplightPriorities { reason action indicator estimatedDate } family { familyId } user { userId  username } indicatorSurveyDataList {key value} economicSurveyDataList {key value} familyDataDTO { latitude longitude accuracy familyMemberDTOList { firstName lastName socioEconomicAnswers {key value} } } } }',
      variables: { newSnapshot: { ...sanitizedSnapshot } }
    })
  });
};

export const submitPictures = (user, snapshot) => {
  var formData = new FormData();

  const dataURItoBlob = dataURI =>
    new Promise((resolve, reject) => {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });

      resolve(blob);
    });

  const signProcess = async base64Sign => {
    const sign = await dataURItoBlob(base64Sign);
    formData.append('sign', sign);
  };

  snapshot.pictures.forEach(async pic => {
    const picture = await dataURItoBlob(pic.base64.content);
    formData.append('pictures', picture);
  });

  !!snapshot.sign && signProcess(snapshot.sign);

  return axios({
    method: 'post',
    url: `${url[user.env]}/api/v1/snapshots/files/pictures/upload`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  });
};

export const getToken = (formData, env) =>
  axios({
    method: 'post',
    url: `${url[env]}/oauth/token`,
    headers: {
      Authorization: `Basic ${btoa(`${clientid}:${clientsecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: formData
  });

export const resetPasswordService = (formData, env) =>
  axios({
    method: 'post',
    url: `${url[env]}/password/resetPassword`,
    data: formData
  });

export const changePassword = (formData, env) =>
  axios({
    method: 'post',
    url: `${url[env]}/password/changePassword`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: formData
  });

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
      query: `query { organizations (hub:${hub}) {id, name} }`
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

export const getOrganizationsPaginated = (user, page, filter, hubId) => {
  if (hubId) {
    return getOrganizationsPaginatedByHub(user, page, filter, hubId);
  } else {
    return getOrganizationsPaginatedByUser(user, page, filter);
  }
};

export const getOrganizationsPaginatedByUser = (user, page, filter) => {
  let queryString = `page=${page}`;

  if (filter) queryString = `filter=${filter}&${queryString}`;
  return axios({
    method: 'get',
    url: `${url[user.env]}/api/v1/organizations/?${queryString}`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });
};

export const getOrganizationsPaginatedByHub = (user, page, filter, hubId) => {
  let queryString = `page=${page}`;
  queryString += `&applicationId=${hubId}`;

  if (filter) queryString = `filter=${filter}&${queryString}`;
  return axios({
    method: 'get',
    url: `${url[user.env]}/api/v1/organizations/application?${queryString}`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });
};

export const deleteOrganization = (user, organizationId) => {
  return axios({
    method: 'delete',
    url: `${url[user.env]}/api/v1/organizations/${organizationId}`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });
};

export const getOrganization = (user, organizationId) => {
  return axios({
    method: 'get',
    url: `${url[user.env]}/api/v1/organizations/${organizationId}`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });
};

export const getHubs = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query: 'query { hubsByUser {id, name, description, logoUrl } }'
    })
  });

export const getHubsPaginated = (user, page, filter) => {
  let queryString = `page=${page}`;
  if (filter) queryString = `filter=${filter}&${queryString}`;
  return axios({
    method: 'get',
    url: `${url[user.env]}/api/v1/applications?${queryString}`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });
};

export const addOrUpdateHub = (user, hub) => {
  if (!hub.id) {
    return axios({
      method: 'post',
      url: `${url[user.env]}/api/v1/applications`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: hub
    });
  } else {
    return axios({
      method: 'put',
      url: `${url[user.env]}/api/v1/applications/${hub.id}`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: hub
    });
  }
};

export const deleteHub = (user, hubId) =>
  axios({
    method: 'delete',
    url: `${url[user.env]}/api/v1/applications/${hubId}`,
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
        'query { getSnapshotDraft{ snapshotDraftDate draftId lifemapNavHistory { url state } surveyId surveyVersionId snapshotStoplightAchievements { action indicator roadmap } snapshotStoplightPriorities { reason action indicator estimatedDate } indicatorSurveyDataList {key value} economicSurveyDataList {key value multipleValue other} familyDataDTO { countFamilyMembers latitude longitude country familyMemberDTOList { firstParticipant firstName lastName birthCountry gender customGender birthDate documentType customDocumentType documentNumber email phoneCode phoneNumber socioEconomicAnswers {key value other multipleValue} } } } }'
    })
  });

// Saves a draft
export const saveDraft = (user, draft) => {
  const sanitizedDraft = { ...draft };
  delete sanitizedDraft.previousIndicatorSurveyDataList;
  delete sanitizedDraft.previousIndicatorPriorities;
  delete sanitizedDraft.previousIndicatorAchivements;
  delete sanitizedDraft.isRetake;
  delete sanitizedDraft.snapshotId;
  return axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation addSnapshotDraft($newSnapshot: NewSnapshotDTOInput) {addSnapshotDraft(newSnapshot: $newSnapshot)} ',
      variables: { newSnapshot: sanitizedDraft }
    })
  });
};

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

export const getFamiliesList = (
  user,
  page,
  sortBy,
  sortDirection,
  name,
  organizations,
  facilitators,
  hub
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query families($facilitators: [Long], $hub: Long, $organizations: [Long], $name: String, $page: Int, $sortBy: String, $sortDirection: String) ' +
        '{ families(facilitators:$facilitators, hub: $hub, organizations: $organizations, name:$name, page:$page, sortBy:$sortBy, sortDirection:$sortDirection ){content {familyId name code birthDate documentTypeText  documentNumber countFamilyMembers} totalPages totalElements }}',
      variables: {
        facilitators,
        hub,
        organizations,
        name,
        page,
        sortBy,
        sortDirection
      }
    })
  });
export const getMentors = (user, organizations) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query getMentorsByOrganizations($organizations: [Long]) {getMentorsByOrganizations(organizations: $organizations) { userId username email}}',
      variables: {
        organizations
      }
    })
  });

export const deleteFamily = (user, familyId) =>
  axios({
    method: 'delete',
    url: `${url[user.env]}/api/v1/families/user/${familyId}`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });

export const getFamily = (familyId, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query familyById($id: Long) { familyById(id: $id) {user{userId username} familyId name code numberOfSnapshots allowRetake organization { id, name } country{country} ' +
        'familyMemberDTOList{firstParticipant email phoneNumber phoneCode} ' +
        'snapshotIndicators{ createdAt  stoplightSkipped surveyId indicatorSurveyDataList{value shortName dimension key snapshotStoplightId} priorities{key} achievements{key} countRedIndicators countYellowIndicators countGreenIndicators countSkippedIndicators countIndicatorsAchievements countIndicatorsPriorities indicatorsPriorities{indicator}} }}',
      variables: {
        id: familyId
      }
    })
  });

export const assignFacilitator = (familyId, mentorId, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation updateMentor($familyId: Long, $mentorId: Long) ' +
        '{  updateMentor(familyId: $familyId, mentorId: $mentorId) {    familyId    name    user { userId username role    }  }}',
      variables: {
        familyId,
        mentorId
      }
    })
  });

export const getPrioritiesAchievementByFamily = (user, familyId) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query prioritiesAchievementsByFamily($familyId: Long!) { prioritiesAchievementsByFamily (familyId: $familyId) { priorities {updatedAt, color, indicator, reviewDate, reason, action, months, snapshotStoplightId} achievements {indicator action roadmap} } }',
      variables: {
        familyId: familyId
      }
    })
  });

export const getPrioritiesAchievementsBySnapshot = (user, snapshotId) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query prioritiesAchievementsBySnapshot($snapshotId: Long!) { prioritiesAchievementsBySnapshot (snapshotId: $snapshotId) { priorities {updatedAt, color, indicator, reviewDate, reason, action, months, snapshotStoplightId} achievements {indicator action roadmap} } }',
      variables: {
        snapshotId: snapshotId
      }
    })
  });

export const getPrioritiesByFamily = (user, familyId) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query prioritiesByFamily($familyId: Long!) { prioritiesByFamily (familyId: $familyId) {updatedAt, color, indicator, reviewDate, reason, action, months, snapshotStoplightId} }',
      variables: {
        familyId: familyId
      }
    })
  });

export const getPrioritiesBySnapshotId = (user, snapshotId) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query prioritiesBySnapshot($snapshotId: Long!) { prioritiesBySnapshot (snapshotId: $snapshotId) {updatedAt, color, indicator, reviewDate, reason, action, months, snapshotStoplightId} }',
      variables: {
        snapshotId: snapshotId
      }
    })
  });

export const addPriority = (
  user,
  reason,
  action,
  months,
  snapshotStoplightId
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation addPriority($newPriority : PriorityDtoInput) {addPriority(newPriority: $newPriority)  {  indicator, reviewDate, reason, action, indicator, months, snapshotStoplightId } }',
      variables: {
        newPriority: {
          reason: reason,
          action: action,
          months: months,
          snapshotStoplightId: snapshotStoplightId
        }
      }
    })
  });

export const getLastSnapshot = (familyId, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query getLastSnapshot($familyId: Long!) { getLastSnapshot (familyId: $familyId) {  previousIndicatorSurveyDataList {key value} snapshotStoplightPriorities{ indicator} snapshotStoplightAchievements{ indicator} family { countFamilyMembers  familyMemberDTOList { firstParticipant firstName  lastName birthCountry  gender customGender birthDate documentType customDocumentType documentNumber email phoneCode phoneNumber socioEconomicAnswers {key value other multipleValue} } } } }',
      variables: {
        familyId: familyId
      }
    })
  });

export const getSnapshotsByFamily = (familyId, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query getSnapshotsByFamily($familyId: Long!) { familySnapshotsOverview (familyId: $familyId) { snapshots { snapshotId snapshotDate stoplightSkipped surveyUser  stoplight {codeName value shortName lifemapName priority achievement } priorities {indicator} achievements {indicator} } } }',
      variables: {
        familyId: familyId
      }
    })
  });

export const sendLifemapPdfv2 = (snapshotId, user, lang, email) => {
  return axios({
    method: 'post',
    url: `${url[user.env]}/api/v1/reports/lifemap/email`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    params: {
      snapshotId: snapshotId,
      email: email
    }
  });
};

export const downloadPdf = (snapshotId, user, lang) => {
  return axios({
    method: 'post',
    url: `${url[user.env]}/api/v1/reports/lifemap/pdf`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    params: {
      snapshotId: snapshotId
    },
    responseType: 'arraybuffer'
  });
};

export const sendWhatsappMessage = (snapshotId, user) => {
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation lifemapWhatsappNotification($notificationParameters: NotificationParametersInput) { lifemapWhatsappNotification(notificationParameters: $notificationParameters){status} }',
      variables: {
        notificationParameters: {
          snapshotId: snapshotId
        }
      }
    })
  });
};

export const assignOrganizations = (
  user,
  organizations,
  applications,
  surveyId
) =>
  axios({
    method: 'put',
    url: `${url[user.env]}/api/v1/surveys/${surveyId}`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: {
      applications,
      organizations
    }
  });

export const addOrUpdateOrg = (user, org) => {
  if (!org.id) {
    return axios({
      method: 'post',
      url: `${url[user.env]}/api/v1/organizations`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: org
    });
  } else {
    return axios({
      method: 'put',
      url: `${url[user.env]}/api/v1/organizations/${org.id}`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: org
    });
  }
};

export const getUserById = (user, userId) => {
  return axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query retrieveUser ($userId: Long) { retrieveUser (userId: $userId) {id, username, name, email, organizationName, hubName, role, active  } }',
      variables: {
        userId
      }
    })
  });
};

export const getUsersPaginated = (
  user,
  page,
  filter,
  organizations,
  hubs,
  sortBy,
  sortDirection
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query searchUsers($page: Int, $filter: String, $organizations: [Long], $hubs: [Long],  $sortBy: String, $sortDirection: String) { searchUsers (page: $page, filter: $filter, organizations: $organizations, hubs: $hubs, sortBy:$sortBy, sortDirection:$sortDirection) {content { id, username, name, email, role, hubName, organizationName, active}, totalElements } }',
      variables: {
        page,
        filter,
        organizations,
        hubs,
        sortBy,
        sortDirection
      }
    })
  });

export const addOrUpdateUser = (user, values) => {
  if (!values.id) {
    return axios({
      method: 'post',
      url: `${url[user.env]}/graphql`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: JSON.stringify({
        query: `mutation createUser($user: UserModelInput) {createUser(user: $user){username} }`,
        variables: {
          user: values
        }
      })
    });
  } else {
    return axios({
      method: 'post',
      url: `${url[user.env]}/graphql`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: JSON.stringify({
        query: `mutation updateUser($user: UserModelInput) {updateUser(user: $user){username} }`,
        variables: {
          user: {
            id: values.id,
            name: values.name,
            email: values.email,
            active: values.active
          }
        }
      })
    });
  }
};

export const deleteUser = (user, userId) =>
  axios({
    method: 'delete',
    url: `${url[user.env]}/api/v1/users/${userId}`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });

export const checkUserName = (user, username) =>
  axios({
    method: 'get',
    url: `${url[user.env]}/api/v1/users/check-username?username=${username}`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });

export const searchRecords = (user, filters) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query searchSnapshots( $surveyDefinition: Long!, $hubs: [Long], $orgs: [Long], $fromDate: Long, $toDate: Long, $followupSurveys: Boolean, $surveyUsers: [Long], $stoplightFilters: [StoplightFilterInput],  $page: Int  $sortBy: String, $sortDirection: String) { searchSnapshots ( surveyDefinition: $surveyDefinition, hubs: $hubs, orgs: $orgs, fromDate: $fromDate, toDate: $toDate, followupSurveys: $followupSurveys, surveyUsers: $surveyUsers, stoplightFilters: $stoplightFilters, page: $page, sortBy: $sortBy, sortDirection: $sortDirection) { page totalElements totalPages additionalData content {family familyName familyCode surveyDate surveyNumber }  } }',
      variables: {
        surveyDefinition: filters.survey.value,
        hubs: filters.hubs,
        orgs: filters.orgs,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        followupSurveys: filters.includeRetake,
        surveyUsers: filters.surveyUsers,
        stoplightFilters: filters.stoplightFilters,
        page: filters.page,
        sortBy: filters.sortBy,
        sortDirection: filters.orderDirection
      }
    })
  });

const normalizeLanguages = lang => {
  const languages = {
    en: 'en_US',
    es: 'es_PY',
    pt: 'pt_BR'
  };
  return languages[lang] || languages['en'];
};

export const downloadReports = (user, filters, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/api/v1/reports/snapshots/report`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(lang)
    },
    data: JSON.stringify({
      surveyDefinition: filters.survey.value,
      hubs: filters.hubs,
      orgs: filters.orgs,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      followupSurveys: filters.includeRetake,
      surveyUsers: filters.surveyUsers,
      stoplightFilters: filters.stoplightFilters,
      page: filters.page,
      sortBy: filters.sortBy,
      sortDirection: filters.orderDirection
    }),
    responseType: 'arraybuffer'
  });

export const downloadSemaforito = (user, filters, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/api/v1/reports/snapshots/chatbot`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(lang)
    },
    data: JSON.stringify({
      surveyDefinition: filters.survey.value,
      hubs: filters.hubs,
      orgs: filters.orgs,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      followupSurveys: filters.includeRetake,
      surveyUsers: filters.surveyUsers,
      stoplightFilters: filters.stoplightFilters,
      page: filters.page,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection
    }),
    responseType: 'arraybuffer'
  });

export const getSnapshots = (user, filters) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query familiesSnapshot( $surveyDefinition: Long!, $hubs: [Long], $orgs: [Long], $surveyUsers: [Long], $locationAvailable: Boolean) { familiesSnapshot ( surveyDefinition: $surveyDefinition, hubs: $hubs, orgs: $orgs, surveyUsers: $surveyUsers,  locationAvailable: $locationAvailable) { page totalElements additionalData content {id familyName familyCode latitude longitude snapshotDate stoplight {codeName value} } } }',
      variables: {
        surveyDefinition: filters.survey.value,
        hubs: filters.hubs,
        orgs: filters.orgs,
        surveyUsers: filters.surveyUsers,
        locationAvailable: true
      }
    })
  });

// get a list of dimensions available to the authorized used
export const getDimensionsByUser = (user, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query: 'query { getDimensions { name, surveyDimensionId } }'
    })
  });

// get a list of indicators available to the authorized used
export const getIndicatorsByUser = (user, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query: 'query { getIndicators { codeName, name, surveyIndicatorId } }'
    })
  });

// submit resources
export const submitResources = (user, resources) => {
  const formData = new FormData();
  resources.forEach(resource => {
    formData.append('resources', resource);
  });

  return axios({
    method: 'post',
    url: `${url[user.env]}/api/v1/solutions/resources/store`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  });
};

export const saveOrUpdateSolution = (user, values) => {
  if (!values.id) {
    return axios({
      method: 'post',
      url: `${url[user.env]}/graphql`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: JSON.stringify({
        query: `mutation createSolution($solution: StoplightSolutionModelInput) {createSolution(solution: $solution){title} }`,
        variables: {
          solution: {
            codeName: values.codeName,
            title: values.title,
            description: values.subtitle,
            country: values.country.value,
            contentText: values.plainContent,
            contentRich: values.contentRich,
            dimension: values.dimension.label,
            stoplightDimension: values.dimension.value,
            indicatorsCodeNames: values.indicatorsCodeNames,
            indicatorsNames: values.indicatorNames,
            showAuthor: values.showOrg,
            organization: values.organization,
            hub: values.hub,
            resources: values.resources,
            contactInfo: values.contact,
            lang: normalizeLanguages(values.language),
            type: values.type
          }
        }
      })
    });
  } else {
    return axios({
      method: 'post',
      url: `${url[user.env]}/graphql`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: JSON.stringify({
        query: `mutation updateSolution($solution: StoplightSolutionModelInput) {updateSolution(solution: $solution){title version resources{id url}}}`,
        variables: {
          solution: {
            id: values.id,
            codeName: values.codeName,
            title: values.title,
            description: values.subtitle,
            country: values.country.value,
            contentText: values.plainContent,
            contentRich: values.contentRich,
            dimension: values.dimension.label,
            stoplightDimension: values.dimension.value,
            indicatorsCodeNames: values.indicatorsCodeNames,
            indicatorsNames: values.indicatorNames,
            showAuthor: values.showOrg,
            organization: values.organization,
            hub: values.hub,
            resources: values.resources,
            contactInfo: values.contact,
            lang: normalizeLanguages(values.language),
            type: values.type
          }
        }
      })
    });
  }
};

export const updateSolutionView = (user, id) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation updateSolutionViews($solution: StoplightSolutionModelInput) {updateSolutionViews(solution: $solution){title views}}',
      variables: {
        solution: {
          id: id
        }
      }
    })
  });

export const getSolutions = (user, values) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query solutions($page: Int, $country: String, $name: String, $lang: String, $dimension: String, $indicators: [String],  $organizations: [Long], $hub: Long, $user: String, $sortBy: String, $sortDirection: String) { solutions (page: $page, country: $country, name: $name, lang: $lang, dimension: $dimension, indicators:$indicators ,organizations: $organizations, hub: $hub, user: $user, sortBy:$sortBy, sortDirection:$sortDirection) {content { id, title, country, indicatorsNames , description, dimension, views }  totalElements totalPages } }',
      variables: {
        page: values.page,
        country: values.country,
        lang: normalizeLanguages(values.lang),
        name: values.filter,
        dimension: values.dimension,
        indicators: values.indicators,
        organizations: [],
        hub: null,
        user: ''
      }
    })
  });

// get solutions types
export const getSolutionTypes = (user, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(lang)
    },
    data: JSON.stringify({
      query: 'query solutionTypes { solutionTypes { code description} }'
    })
  });

// get solutions types
export const getSolutionById = (user, id) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query getSolutionById($id: Long!){ getSolutionById(id: $id){id, title, description, contentRich, contentText, country, showAuthor, organization, organizationName, hub, hubName, dimension,stoplightDimension,lang, indicatorsNames, indicatorsCodeNames, contactInfo, type, resources{url type title description, id}, createdBy} }',
      variables: {
        id: id
      }
    })
  });

//  delete solution
export const deleteSolutionById = (user, id) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation deleteSolution($solution: StoplightSolutionModelInput) {deleteSolution(solution: $solution){successful} }',
      variables: {
        solution: {
          id: id
        }
      }
    })
  });
