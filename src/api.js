import axios from 'axios';
import store from './redux';
import { PhoneNumberUtil } from 'google-libphonenumber';
import CallingCodes from './screens/lifemap/CallingCodes';

// Send correct encoding in all POST requests
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.headers.post['Stoplight-Client-Id'] = 'stoplight-web';

// list of environment urls
export const url = {
  platform: 'https://platform.backend.povertystoplight.org',
  demo: 'https://demo.backend.povertystoplight.org',
  testing: 'https://testing.backend.povertystoplight.org',
  development: 'http://localhost:8080'
};

axios.interceptors.response.use(
  response => response,
  error => {
    const status = error.response ? error.response.status : null;
    const { user = {} } = store.getState();
    if (status === 401) {
      window.location.replace(
        `https://${user.env}.povertystoplight.org/login.html`
      );
    }
    return Promise.reject(error);
  }
);

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
    method: 'get',
    url: `${url[user.env]}/api/v1/surveys/info`,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
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
      query: `query { surveyById(surveyId:${surveyId}) { title id createdAt description minimumPriorities privacyPolicy { title  text } termsConditions{ title text }  surveyConfig { documentType {text value otherOption } gender { text value otherOption } stoplightOptional signSupport pictureSupport surveyLocation { country latitude longitude} }  surveyEconomicQuestions { questionText codeName answerType topic required forFamilyMember options {text value otherOption conditions{codeName, type, values, operator, valueType, showIfNoData}}, conditions{codeName, type, value, operator}, conditionGroups{groupOperator, joinNextGroup, conditions{codeName, type, value, operator}} } surveyStoplightQuestions { questionText definition codeName dimension id stoplightColors { url value description } required } } }`
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
        'query { feed { activityId, activityKey, activityParams, activityType, username, createdAt, familyId, familyName } }'
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

const formatPhone = (code, phone, surveyLocation) => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  if (phone && phone.length > 0) {
    let international = '';
    if (code) {
      international = '+' + code + ' ' + phone;
    } else {
      console.log(
        'Phone code is null, set default value for country: ',
        surveyLocation.country
      );
      code = CallingCodes.find(e => e.code === surveyLocation.country).value;
      international = '+' + code + ' ' + phone;
    }
    let phoneNumber = phoneUtil.parse(international, code);
    console.log('Saving number as: ' + phoneNumber.getNationalNumber());
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

  snapshot.pictures.forEach(async pic => {
    const picture = await dataURItoBlob(pic.base64.content);
    formData.append('pictures', picture);
  });

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

export const getOrganizationsPaginated = (user, page, filter) => {
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

export const deleteOrganization = (user, organizationId) => {
  return axios({
    method: 'delete',
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
  facilitators
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query families($facilitators: [Long], $organizations: [Long], $name: String, $page: Int, $sortBy: String, $sortDirection: String) ' +
        '{ families(facilitators:$facilitators, organizations: $organizations, name:$name, page:$page, sortBy:$sortBy, sortDirection:$sortDirection ){content {familyId name code birthDate documentTypeText  documentNumber countFamilyMembers} totalPages totalElements }}',
      variables: {
        facilitators,
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
        'query familyById($id: Long) { familyById(id: $id) {user{userId username} familyId name code numberOfSnapshots allowRetake organization { name } country{country} ' +
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

export const sendLifemapPdfv2 = (snapshotId, user, lang) => {
  return axios({
    method: 'post',
    url: `${url[user.env]}/api/v1/reports/lifemap/email`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    params: {
      snapshotId: snapshotId
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
