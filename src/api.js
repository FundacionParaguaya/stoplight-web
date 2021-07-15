import axios from 'axios';
import { PhoneNumberUtil } from 'google-libphonenumber';
import store from './redux';
import CallingCodes from './screens/lifemap/CallingCodes';
import imageCompression from 'browser-image-compression';
const CancelToken = axios.CancelToken;
let source = CancelToken.source();
let filterSource = CancelToken.source();

// Send correct encoding in all POST requests
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.headers.post['Stoplight-Client-Id'] = 'stoplight-web';

// list of api's urls per enviroment
export const url = {
  platform: 'https://platform.backend.povertystoplight.org',
  demo: 'https://demo.backend.povertystoplight.org',
  testing: 'https://testing.backend.povertystoplight.org',
  development: 'http://localhost:8080'
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

const normalizeLanguages = lang => {
  const languages = {
    en: 'en_US',
    es: 'es_PY',
    pt: 'pt_BR',
    ht: 'ht_HT'
  };
  return languages[lang] || languages['en'];
};

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

export const deleteSurvey = (user, surveyDefinitionId) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation deleteSurveyDefinition($surveyDefinition: Long ) {deleteSurveyDefinition(surveyDefinition: $surveyDefinition){successful}}',
      variables: {
        surveyDefinition: surveyDefinitionId
      }
    })
  });

// get a list of surveys available to the authorized used
export const getSurveysByUser = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    cancelToken: filterSource.token,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query { surveysInfoWithOrgs { id, title, applications { id }, organizations { id } } }'
    })
  });

export const surveysByUserPaginated = (user, filter, page) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query surveysByUserPaginated($filter: String, $page: Int, $sortBy: String, $sortDirection: String) { surveysByUserPaginated(filter:$filter, page:$page, sortBy:$sortBy, sortDirection:$sortDirection ){content {id,title, indicatorsCount, createdAt, organizations{id,name}, applications{id,name}} totalPages totalElements }}',
      variables: {
        filter: filter,
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
      query: `query { surveyById(surveyId:${surveyId}) { title id createdAt description minimumPriorities privacyPolicy { title  text } termsConditions{ title text }  surveyConfig { documentType {text value otherOption } gender { text value otherOption } stoplightOptional signSupport pictureSupport surveyLocation { country latitude longitude} }  surveyEconomicQuestions { questionText codeName answerType shortName topic topicAudio required forFamilyMember orderNumber options {text value otherOption conditions{codeName, type, values, operator, valueType, showIfNoData}}, conditions{codeName, type, value, operator}, conditionGroups{groupOperator, joinNextGroup, conditions{codeName, type, value, operator}} } surveyStoplightQuestions { questionText definition shortName description codeName dimension id surveyStoplightDimension{id} questionAudio stoplightColors { url value description } required } } }`
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

export const getTotalFamilies = (
  user,
  hub,
  organizations,
  surveys,
  projects,
  fromTime,
  toTime,
  lang
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    cancelToken: source.token,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query:
        'query totalFamilies($hub: Long, $organizations: [Long], $surveys: [Long], $projects: [Long], $toTime: Long, $fromTime: Long) { totalFamilies(hub: $hub, organizations: $organizations, surveys: $surveys, projects: $projects, toTime: $toTime, fromTime: $fromTime){familiesCount peopleCount peopleWithStoplightCount familiesWithStoplightCount  snapshotsCount followupsCount snaspshotsWithoutStoplight} }',
      variables: {
        hub,
        organizations,
        surveys,
        projects,
        fromTime,
        toTime
      }
    })
  });

export const getOverviewBlock = (
  user,
  hub,
  fromDate,
  toDate,
  organizations,
  surveys,
  projects,
  snapshotNumber,
  lang
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    cancelToken: source.token,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query:
        'query blockOverview($hub: Long, $organizations: [Long], $surveys: [Long], $projects: [Long], $snapshotNumber: Long, $toDate: Long, $fromDate: Long) { blockOverview(hub: $hub, organizations: $organizations,surveys: $surveys, projects: $projects, snapshotNumber:$snapshotNumber, toDate: $toDate, fromDate: $fromDate) { stoplightOverview{ greens yellows reds skipped } priorities achievements } }',
      variables: {
        hub,
        organizations,
        surveys,
        projects,
        snapshotNumber,
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
  projects,
  snapshotNumber,
  lang
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    cancelToken: source.token,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query:
        'query economicOverview($hub: Long, $organizations: [Long], $surveys: [Long], $projects: [Long], $snapshotNumber: Long, $toDate: Long, $fromDate: Long) { economicOverview(hub: $hub, organizations: $organizations, surveys: $surveys, projects: $projects, snapshotNumber:$snapshotNumber, toDate: $toDate, fromDate: $fromDate){ familiesCount peopleCount familiesWithStoplightCount peopleByCountries {country people }  snapshotsCount followupsCount membersAverage genders {male female others} } }',
      variables: {
        hub,
        organizations,
        surveys,
        projects,
        snapshotNumber,
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
  projects,
  lang
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    cancelToken: source.token,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query:
        'query operationsOverview($hub: Long, $organizations: [Long], $surveys: [Long], $projects: [Long], $toTime: Long, $fromTime: Long) { operationsOverview(hub: $hub, organizations: $organizations,surveys: $surveys, projects: $projects, toTime: $toTime, fromTime: $fromTime) { surveysByMonth } }',
      variables: {
        hub,
        organizations,
        surveys,
        projects: projects,
        toTime: toDate,
        fromTime: fromDate
      }
    })
  });

export const getLastestActivity = (user, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
      'X-locale': normalizeLanguages(lang)
    },
    data: JSON.stringify({
      query:
        'query { recentActivity { id, activityType, params, username, createdAt, familyId, familyName, stoplightClient, message, referenceId } }'
    })
  });

export const cancelFilterRequest = () => {
  filterSource.cancel('Operation canceled by the user.');

  filterSource = CancelToken.source();
};

export const cancelRequest = () => {
  source.cancel('Operation canceled by the user.');

  source = CancelToken.source();
};

export const getDimensionIndicators = (
  user,
  hub,
  organizations = [],
  surveys = [],
  projects = [],
  fromDate,
  toDate,
  snapshotNumber,
  lang
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    cancelToken: source.token,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query: `query dimensionIndicators($hub: Long, $organizations: [Long], $surveys: [Long], $projects: [Long], $snapshotNumber: Long, $fromDate: Long, $toDate: Long) { dimensionIndicators (hub: $hub, organizations: $organizations, surveys: $surveys, projects: $projects, snapshotNumber:$snapshotNumber,  fromDate: $fromDate, toDate: $toDate) { dimension, priorities, achievements, stoplights{count, color, dimension}, indicators{name, dimension, achievements, priorities, stoplights{count, color, dimension, indicator} } } }`,
      variables: {
        hub: hub,
        organizations: organizations,
        surveys: surveys,
        projects: projects,
        snapshotNumber,
        fromDate: fromDate,
        toDate: toDate
      }
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

export const deleteDrafts = (user, drafts) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },

    data: JSON.stringify({
      query: `mutation deleteDrafts($drafts: [String]) {deleteDrafts(drafts: $drafts)}`,
      variables: {
        drafts: drafts
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
  delete sanitizedSnapshot.justStoplight;
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
        'mutation addSnapshot($newSnapshot: NewSnapshotDTOInput) {addSnapshot(newSnapshot: $newSnapshot)  { surveyId  surveyVersionId snapshotId  snapshotStoplightAchievements { action indicator roadmap } snapshotStoplightPriorities { reason action indicator estimatedDate } family { familyId } user { userId  username } indicatorSurveyDataList {key value} economicSurveyDataList {key value} familyDataDTO { latitude longitude accuracy familyMemberDTOList { firstName lastName socioEconomicAnswers {key value} } } } }',
      variables: { newSnapshot: { ...sanitizedSnapshot } }
    })
  });
};

const compressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true
};

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

export const submitPictures = async (user, snapshot) => {
  var formData = new FormData();

  const signProcess = async base64Sign => {
    const sign = await dataURItoBlob(base64Sign);
    formData.append('sign', sign);
  };

  for (const pic of snapshot.pictures) {
    const image = await dataURItoBlob(pic.base64.content);
    const compressedImage = await imageCompression(image, compressionOptions);
    formData.append('pictures', compressedImage);
  }

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
    cancelToken: filterSource.token,
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

export const getOrganizationTypes = (user, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(lang)
    },
    data: JSON.stringify({
      query: 'query { organizantionTypes {code, description } }'
    })
  });

export const getOrganizationAreaTypes = (user, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(lang)
    },
    data: JSON.stringify({
      query: 'query { organizationAreasTypes {code, description } }'
    })
  });

export const getOrganizationFinalUserTypes = (user, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(lang)
    },
    data: JSON.stringify({
      query: 'query { organizationFinalUserTypes {code, description } }'
    })
  });

export const getOrganizationEndSurveyTypesTypes = (user, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(lang)
    },
    data: JSON.stringify({
      query: 'query { organizationEndSurveyTypes {code, description } }'
    })
  });

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

export const getHubsPaginated = (
  user,
  page,
  filter,
  orderBy,
  orderDirection
) => {
  return axios({
    method: 'get',
    url: `${url[user.env]}/api/v1/applications`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    params: {
      page: page,
      filter: filter,
      sort_by: orderBy,
      order: orderDirection
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
        'query { getSnapshotDraft{ snapshotDraftDate draftId lifemapNavHistory { url state } surveyId project justStoplight surveyVersionId snapshotStoplightAchievements { action indicator roadmap } snapshotStoplightPriorities { reason action indicator estimatedDate } indicatorSurveyDataList {key value} economicSurveyDataList {key value multipleValue other} familyDataDTO { countFamilyMembers latitude longitude country familyMemberDTOList { firstParticipant firstName lastName birthCountry gender customGender birthDate documentType customDocumentType documentNumber email phoneCode phoneNumber socioEconomicAnswers {key value other multipleValue} } } } }'
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
  hub,
  projects
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query families($facilitators: [Long], $hub: Long, $organizations: [Long], $name: String, $page: Int, $sortBy: String, $sortDirection: String, $projects: [Long]) ' +
        '{ families(facilitators:$facilitators, hub: $hub, organizations: $organizations, name:$name, projects: $projects, page:$page, sortBy:$sortBy, sortDirection:$sortDirection ){content {familyId name code birthDate documentTypeText  documentNumber countFamilyMembers organizationName  } totalPages totalElements }}',
      variables: {
        facilitators,
        hub,
        organizations,
        projects,
        name,
        page,
        sortBy,
        sortDirection
      }
    })
  });

export const migrateFamilies = (
  user,
  families,
  organization,
  facilitator,
  project,
  lang
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(lang)
    },
    data: JSON.stringify({
      query:
        'mutation migrateFamilies($families: [FamilyModelInput], $organization: Long, $user: Long, $project: Long ) { migrateFamilies(families: $families, organization: $organization, user: $user, project: $project) {successful errors} }',
      variables: {
        families,
        organization,
        user: facilitator,
        project: project
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
        'query familyById($id: Long) { familyById(id: $id) {user{userId username} familyId name code latitude longitude numberOfSnapshots lastSnapshot allowRetake organization { id, name } country{country} project {id title}' +
        'familyMemberDTOList { memberIdentifier firstParticipant firstName lastName gender genderText customGender birthDate documentType documentTypeText customDocumentType documentNumber birthCountry email phoneNumber phoneCode} ' +
        'snapshotEconomics { codeName value multipleValueArray questionText text multipleText multipleTextArray other topic} membersEconomic{ memberIdentifier firstName economic{codeName value multipleValue multipleValueArray questionText text multipleText multipleTextArray other topic} } ' +
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

export const updateFamilyProject = (familyId, projectId, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation updateFamilyProject($familyId: Long, $projectId: Long) ' +
        '{  updateFamilyProject(familyId: $familyId, projectId: $projectId) {    familyId    name    user { userId username role    }  }}',
      variables: {
        familyId,
        projectId
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
        'query prioritiesAchievementsByFamily($familyId: Long!) { prioritiesAchievementsByFamily (familyId: $familyId) { priorities {id updatedAt, color, indicator, reviewDate, reason, action, months, snapshotStoplightId} achievements {id indicator action roadmap snapshotStoplightId} } }',
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
        'mutation addPriority($newPriority : PriorityDtoInput, $client : String) {addPriority(newPriority: $newPriority, client: $client)  {  indicator, reviewDate, reason, action, indicator, months, snapshotStoplightId } }',
      variables: {
        newPriority: {
          reason: reason,
          action: action,
          months: months,
          snapshotStoplightId: snapshotStoplightId
        },
        client: 'WEB'
      }
    })
  });

export const editPriority = (user, id, reason, action, months) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation updateSnapshotStoplightPriority($priority: PriorityDtoInput) {updateSnapshotStoplightPriority(priority: $priority){successful}}',
      variables: {
        priority: {
          id,
          reason,
          action,
          months
        }
      }
    })
  });

export const addAchievement = (user, action, roadmap, snapshotStoplightId) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation addAchievementWeb($achievement: AchievementDtoInput) {addAchievementWeb (achievement: $achievement){successful}}',
      variables: {
        achievement: {
          action,
          roadmap,
          snapshotStoplightId
        },
        client: 'WEB'
      }
    })
  });

export const editAchievement = (user, id, action, roadmap) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation updateAchievement($achievement: AchievementDtoInput) {updateAchievement(achievement: $achievement){successful}}',
      variables: {
        achievement: {
          id,
          action,
          roadmap
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
        'query getSnapshotsByFamily($familyId: Long!) { familySnapshotsOverview (familyId: $familyId) { snapshots { snapshotId snapshotDate stoplightSkipped surveyUser projectTitle  stoplight {codeName value shortName lifemapName priority achievement } priorities {indicator} achievements {indicator} familyData{ name latitude longitude familyMembersList { memberIdentifier firstParticipant firstName lastName gender genderText customGender birthDate documentType documentTypeText customDocumentType documentNumber birthCountry email phoneNumber phoneCode socioEconomicAnswers{ key value } } } economic {codeName value multipleValueArray questionText text multipleText multipleTextArray other topic} membersEconomic{ memberIdentifier firstName economic{codeName value multipleValue multipleValueArray questionText text multipleText multipleTextArray other topic} } } } }',
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
        'query retrieveUser ($userId: Long) { retrieveUser (userId: $userId) {id, username, name, email, organizationName, hubName, role, active, projects {id title description} } }',
      variables: {
        userId
      }
    })
  });
};

export const addOrUpdateProject = (user, values) => {
  if (!values.id) {
    return axios({
      method: 'post',
      url: `${url[user.env]}/graphql`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: JSON.stringify({
        query: `mutation createProject($project: ProjectModelInput) {createProject(project: $project){title}}`,
        variables: {
          project: {
            title: values.title,
            description: values.description,
            active: values.active,
            color: values.color
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
        query: `mutation updateProject($project: ProjectModelInput) {updateProject(project: $project){title}}`,
        variables: {
          project: {
            id: values.id,
            title: values.title,
            description: values.description,
            active: values.active,
            color: values.color
          }
        }
      })
    });
  }
};

export const getProjectsByOrganization = (user, orgsId) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    cancelToken: filterSource.token,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query projectsByOrganization($organizations: [Long]) { projectsByOrganization (organizations: $organizations) { id, title, description, color, active} }',
      variables: {
        organizations: orgsId
      }
    })
  });

export const projectsBySurveyUser = (user, surveyUserId) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    cancelToken: filterSource.token,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query projectsBySurveyUser($user: Long) { projectsBySurveyUser (user: $user) { id, title, description, color, active} }',
      variables: {
        user: surveyUserId
      }
    })
  });

export const getProjectsPaginated = (
  user,
  { page, filter, organizations, sortBy, sortDirection, organization }
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query searchProjects($page: Int, $filter: String, $organizations: [Long], $sortBy: String, $sortDirection: String) { searchProjects (page: $page, filter: $filter, organizations: $organizations, sortBy:$sortBy, sortDirection:$sortDirection) {content { id, title, description, active, color}, totalElements totalPages } }',
      variables: {
        page,
        filter,
        organizations,
        sortBy,
        sortDirection
      }
    })
  });

export const deleteProject = (user, projectId) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation deleteProject($project: ProjectModelInput) {deleteProject(project: $project){successful} }',
      variables: { project: { id: projectId } }
    })
  });

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

export const addOrUpdateUser = (user, values, lang) => {
  if (!values.id) {
    return axios({
      method: 'post',
      url: `${url[user.env]}/graphql`,
      headers: {
        Authorization: `Bearer ${user.token}`,
        'X-locale': normalizeLanguages(lang)
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
        Authorization: `Bearer ${user.token}`,
        'X-locale': normalizeLanguages(lang)
      },
      data: JSON.stringify({
        query: `mutation updateUser($user: UserModelInput) {updateUser(user: $user){username} }`,
        variables: {
          user: {
            id: values.id,
            name: values.name,
            email: values.email,
            active: values.active,
            projects: values.projects
          }
        }
      })
    });
  }
};

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

export const deleteUser = (user, userId, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(lang)
    },
    data: JSON.stringify({
      query:
        'mutation deleteUser($user: Long!) { deleteUser (user: $user) { successful } }',
      variables: {
        user: userId
      }
    })
  });

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

//
export const getCollectionTypes = (user, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query: 'query { listArticlesTypes { code description } }'
    })
  });

export const getArticleById = (user, id, collection, section, language) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(language)
    },
    data: JSON.stringify({
      query:
        'query getArticleById($id: Long, $collection: String, $section: String, $language: String) { getArticleById(id: $id, collection: $collection, section: $section, language: $language) { id title description contentRich contentText collection lang published createdAt section} }',
      variables: {
        id,
        collection,
        section,
        language: language ? normalizeLang(language) : ''
      }
    })
  });

export const deleteArticleById = (user, id) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation deleteArticle($article: HelpArticleModelInput) {deleteArticle (article: $article){ successful }}',
      variables: {
        article: {
          id
        }
      }
    })
  });

export const saveOrUpdateArticle = (user, values) => {
  if (!values.id) {
    return axios({
      method: 'post',
      url: `${url[user.env]}/graphql`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: JSON.stringify({
        query: `mutation createArticle($article: HelpArticleModelInput) {createArticle (article: $article){ id }}`,
        variables: {
          article: {
            title: values.title,
            description: values.subtitle,
            collection: values.collection.value,
            lang: normalizeLanguages(values.language),
            contentText: values.contentText,
            contentRich: values.contentRich,
            published: values.published,
            section: values.section
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
        query: `mutation updateArticle($article: HelpArticleModelInput) {updateArticle (article: $article){ successful }}`,
        variables: {
          article: {
            id: values.id,
            title: values.title,
            description: values.subtitle,
            collection: values.collection.value,
            lang: normalizeLanguages(values.language),
            contentText: values.contentText,
            contentRich: values.contentRich,
            published: values.published,
            section: values.section
          }
        }
      })
    });
  }
};

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
export const getIndicatorsByUser = (user, dimension, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLang(lang)
    },
    data: JSON.stringify({
      query:
        'query getIndicators( $dimension: String) { getIndicators (dimension: $dimension) { codeName, name, surveyIndicatorId  } }',
      variables: {
        dimension: dimension
      }
    })
  });

// submit resources
export const submitResources = async (user, resources) => {
  const formData = new FormData();

  for (const resource of resources) {
    if (resource.type === 'image/jpeg' || resource.type === 'image/png') {
      const compressedImage = await imageCompression(
        resource,
        compressionOptions
      );
      var file = new File([compressedImage], resource.name, {
        type: resource.type
      });
      formData.append('resources', file);
    } else {
      formData.append('resources', resource);
    }
  }

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
        query: `mutation createSolution($solution: StoplightSolutionModelInput) {createSolution(solution: $solution){id, title} }`,
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
        'query solutions($page: Int, $country: String, $name: String, $lang: String, $dimension: String, $indicators: [String], $solutionType: String,  $organizations: [Long], $hub: Long, $user: String, $sortBy: String, $sortDirection: String) { solutions (page: $page, country: $country, name: $name, lang: $lang, dimension: $dimension, indicators:$indicators, solutionType: $solutionType, organizations: $organizations, hub: $hub, user: $user, sortBy:$sortBy, sortDirection:$sortDirection) {content { id, title, country, indicatorsNames , description, dimension, views }  totalElements totalPages } }',
      variables: {
        page: values.page,
        country: values.country,
        lang: normalizeLanguages(values.lang),
        name: values.filter,
        dimension: values.dimension,
        indicators: values.indicators,
        solutionType: values.solutionType,
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
        'query getSolutionById($id: Long!){ getSolutionById(id: $id){id, title, description, contentRich, contentText, country, showAuthor, organization, organizationName, hub, hubName, dimension,stoplightDimension,lang, indicatorsNames, indicatorsCodeNames, contactInfo, type, resources{url type title description, id}, createdBy, createdAt} }',
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

// get access solutions types
export const getSolutionsAccessTypes = (user, lang) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(lang)
    },
    data: JSON.stringify({
      query: 'query solutionsAccess { solutionsAccess { code description} }'
    })
  });

// get list of articles

export const getArticles = (user, filter, collection, lang, tags) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query listArticles($filter: String, $collection: String, $lang: String, $tags: [String]) { listArticles(filter: $filter, collection: $collection, lang: $lang, tags: $tags) { id title description published createdAt collection} }',
      variables: {
        filter,
        collection,
        lang: normalizeLang(lang),
        tags
      }
    })
  });

// get access solutions types
export const updateFamilyDetails = (user, familyId, familyDetails) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation updateFamilyDetails($family: FamilyModelInput) {updateFamilyDetails(family: $family){successful}}',
      variables: {
        family: {
          familyId: familyId,
          familyMembersList: familyDetails
        }
      }
    })
  });

export const updateEconomicData = (user, id, draft) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation updateSnapshot($snapshot: SnapshotUpdateModelInput) {updateSnapshot(snapshot: $snapshot){successful}}',
      variables: {
        snapshot: {
          id: id,
          ...draft
        }
      }
    })
  });

export const updateLocation = (user, familyId, lat, lng) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation updateFamilyLocation($familyLocation: FamilyLocationModelInput) {updateFamilyLocation(familyLocation: $familyLocation){successful}}',
      variables: {
        familyLocation: {
          family: familyId,
          latitude: lat,
          longitude: lng
        }
      }
    })
  });

// submit files
export const savePictures = async (user, images) => {
  const formData = new FormData();

  for (const image of images) {
    const compressedImage = await imageCompression(image, compressionOptions);
    formData.append('pictures', compressedImage);
  }

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

export const updateFamilyImages = (user, snapshotId, pictures) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation updateSnapshotPictures($snapshot: SnapshotUpdateModelInput) {updateSnapshotPictures(snapshot: $snapshot){successful}}',
      variables: {
        snapshot: {
          id: snapshotId,
          pictures: pictures
        }
      }
    })
  });

export const saveSign = (user, base64Sign) => {
  const formData = new FormData();

  const signProcess = async base64Sign => {
    const sign = await dataURItoBlob(base64Sign);
    formData.append('sign', sign);
  };

  signProcess(base64Sign);

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

export const updateSign = (user, id, sign) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation updateSnapshotSign($snapshot: SnapshotUpdateModelInput) {updateSnapshotSign(snapshot: $snapshot){successful}}',
      variables: {
        snapshot: {
          id: id,
          sign
        }
      }
    })
  });

export const familyUserData = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query { familyUserData {user{userId username} familyId name code latitude longitude numberOfSnapshots lastSnapshot profilePictureUrl allowRetake organization { id, name } country{country} project {id title}familyMemberDTOList { memberIdentifier firstParticipant firstName lastName gender genderText customGender birthDate documentType documentTypeText customDocumentType documentNumber birthCountry email phoneNumber phoneCode} snapshotEconomics { codeName value multipleValueArray questionText text multipleText multipleTextArray other topic} membersEconomic{ memberIdentifier firstName economic{codeName value multipleValue multipleValueArray questionText text multipleText multipleTextArray other topic} } snapshotIndicators{ createdAt  stoplightSkipped surveyId indicatorSurveyDataList{value shortName dimension key snapshotStoplightId} priorities{key} achievements{key} countRedIndicators countYellowIndicators countGreenIndicators countSkippedIndicators countIndicatorsAchievements countIndicatorsPriorities indicatorsPriorities{indicator}} } }'
    })
  });

export const attachSnapshotStoplight = (user, draft) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation attachSnapshotStoplight($snapshot: SnapshotUpdateModelInput) {attachSnapshotStoplight(snapshot: $snapshot){successful}}',
      variables: {
        snapshot: {
          id: draft.snapshotId,
          draftId: draft.draftId,
          indicatorSurveyDataList: draft.indicatorSurveyDataList,
          priorities: draft.priorities,
          achievements: draft.achievements
        }
      }
    })
  });

export const updateFamilyProfilePicture = (
  familyId,
  familyProfilePicture,
  user
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation updateFamilyProfilePicture($familyId: Long, $familyProfilePicture: String) ' +
        '{  updateFamilyProfilePicture(familyId: $familyId, familyProfilePicture: $familyProfilePicture) { familyId name } }',
      variables: {
        familyId,
        familyProfilePicture
      }
    })
  });

export const picturesSignaturesBySnapshot = (snapshotId, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query picturesSignaturesBySnapshot($snapshotId: Long!) { picturesSignaturesBySnapshot (snapshotId: $snapshotId) { category url } }',
      variables: {
        snapshotId
      }
    })
  });

export const deletePriority = (id, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation deleteSnapshotStoplightPriority($priority: PriorityDtoInput) {deleteSnapshotStoplightPriority(priority: $priority){successful}}',
      variables: {
        priority: {
          id
        }
      }
    })
  });

export const deleteAchievement = (id, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation deleteAchievement($achievement: AchievementDtoInput) {deleteAchievement(achievement: $achievement){successful}}',
      variables: {
        achievement: {
          id
        }
      }
    })
  });

export const listOfflineMaps = (organization, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query searchOfflineMaps($organization: Long) {searchOfflineMaps(organization: $organization) { id, name, from, to, center }}',
      variables: {
        organization
      }
    })
  });

export const addOrUpdateOfflineMap = (surveyOfflineMap, user) => {
  if (!surveyOfflineMap.id) {
    return axios({
      method: 'post',
      url: `${url[user.env]}/graphql`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: JSON.stringify({
        query:
          'mutation addSurveyOfflineMap($surveyOfflineMap: SurveyOfflineMapInput) {addSurveyOfflineMap (surveyOfflineMap: $surveyOfflineMap){successful}}',
        variables: {
          surveyOfflineMap
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
        query:
          'mutation updateSurveyOfflineMap($surveyOfflineMap: SurveyOfflineMapInput) {updateSurveyOfflineMap (surveyOfflineMap: $surveyOfflineMap){successful}}',
        variables: {
          surveyOfflineMap
        }
      })
    });
  }
};

export const deleteMap = (surveyOfflineMap, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation deleteSurveyOfflineMap($surveyOfflineMap: Long) {deleteSurveyOfflineMap(surveyOfflineMap: $surveyOfflineMap){successful}}',
      variables: {
        surveyOfflineMap: surveyOfflineMap
      }
    })
  });

export const listInterventionsQuestions = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query { interventionPresetQuestions { id codeName shortName answerType coreQuestion presetOptions } }'
    })
  });

export const listInterventionsDefinitions = user =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query { interventionsDefinitionByUser { id title organizations { id name} } }'
    })
  });

export const getInterventionDefinition = (user, interventionDefinition) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query retrieveInterventionDefinition ($interventionDefinition: Long!) { retrieveInterventionDefinition(interventionDefinition: $interventionDefinition) { id title active questions { id codeName shortName answerType coreQuestion required options {value text otherOption}} } } ',
      variables: {
        interventionDefinition
      }
    })
  });

export const listInterventionsBySnapshot = (user, snapshot, params) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query: `query interventionsBySnapshot( $snapshot: Long!) { interventionsBySnapshot( snapshot: $snapshot){ id intervention{id} ${params}}}`,
      variables: {
        snapshot
      }
    })
  });

export const addOrUpdadteInterventionDefinition = (
  user,
  definition,
  organizations
) => {
  if (!definition.id) {
    return axios({
      method: 'post',
      url: `${url[user.env]}/graphql`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: JSON.stringify({
        query:
          'mutation createInterventionDefinition($interventionDefinition: InterventionDefinitionModelInput,$organizations: [Long], $application: Long!) {createInterventionDefinition (interventionDefinition: $interventionDefinition,organizations: $organizations, application: $application){successful}}',
        variables: {
          interventionDefinition: definition,
          organizations,
          application: user.hub && user.hub.id ? user.hub.id : ''
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
        query:
          'mutation updateInterventionDefinition($interventionDefinition: InterventionDefinitionModelInput) {updateInterventionDefinition (interventionDefinition: $interventionDefinition){successful}}',
        variables: {
          interventionDefinition: definition
        }
      })
    });
  }
};

export const deleteInterventionDefinition = (user, definitionId) => {
  return axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation deleteInterventionDefinition($interventionDefinition: InterventionDefinitionModelInput) {deleteInterventionDefinition (interventionDefinition: $interventionDefinition){successful}}',
      variables: {
        id: definitionId
      }
    })
  });
};

export const deleteIntervention = (user, definitionId) => {
  return axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation deleteIntervention($intervention: Long) { deleteIntervention (intervention: $intervention) { successful } }',
      variables: {
        intervention: definitionId
      }
    })
  });
};

export const assignIntervention = (user, interventionId, organizations) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'mutation assignInterventionDefinition($interventionDefinition: Long,$organizations: [Long]!, $application: Long!) {assignInterventionDefinition (interventionDefinition: $interventionDefinition,organizations: $organizations, application: $application){successful}}',
      variables: {
        interventionDefinition: interventionId,
        organizations,
        application: user.hub && user.hub.id ? user.hub.id : ''
      }
    })
  });

export const createOrUpdateIntervention = (
  user,
  values,
  interventionDefinition,
  snapshot,
  relatedIntervention,
  id,
  family,
  params
) => {
  if (id) {
    return axios({
      method: 'post',
      url: `${url[user.env]}/graphql`,
      headers: {
        Authorization: `Bearer ${user.token}`
      },
      data: JSON.stringify({
        query: `mutation updateIntervention($intervention: InterventionDataModelInput) { updateIntervention (intervention: $intervention) { id  intervention{id} ${params} } }`,
        variables: {
          intervention: {
            id,
            values,
            interventionDefinition,
            snapshot,
            intervention: relatedIntervention
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
        query: `mutation createIntervention($intervention: InterventionDataModelInput, $client: String) { createIntervention (intervention: $intervention, client: $client) { id  intervention{id} ${params} } }`,
        variables: {
          intervention: {
            values,
            interventionDefinition,
            snapshot,
            intervention: relatedIntervention,
            family: family.familyId,
            familyName: family.familyName
          },
          client: 'WEB'
        }
      })
    });
  }
};

export const getInterventionById = (user, intervention) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query retrieveInterventionData ($intervention: Long!) { retrieveInterventionData(intervention: $intervention) { values { codeName value multipleValue multipleText other} } } ',
      variables: {
        intervention
      }
    })
  });

export const interventionDefinitionByFamily = (user, family) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: JSON.stringify({
      query:
        'query interventionDefinitionByFamily( $family: Long!) { interventionDefinitionByFamily( family: $family){ id title active questions { id codeName shortName answerType coreQuestion required options {value text otherOption}} }}',
      variables: {
        family
      }
    })
  });

export const supportedLanguages = (user, language) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(language)
    },
    data: JSON.stringify({
      query: 'query { supportedLanguages {code, description } }'
    })
  });

export const economicQuestionsPool = (filter, language, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': language
    },
    data: JSON.stringify({
      query:
        'query economicQuestionsPool($lang : String, $filter : String) { economicQuestionsPool (lang:$lang,filter:$filter) { id, codeName,questionText,topic,answerType,shortName} }',
      variables: {
        lang: language,
        filter: filter
      }
    })
  });

export const unifyFamilies = (families, language, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(language)
    },
    data: JSON.stringify({
      query:
        'mutation unifyFamilies($families: [Long]) { unifyFamilies (families: $families) { successful } }',
      variables: {
        families
      }
    })
  });

export const uploadAudio = (audio, user) => {
  var formData = new FormData();
  formData.append('upload', audio);
  return axios({
    method: 'post',
    url: `${url[user.env]}/api/v1/surveys/audio/upload`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  });
};

export const dimensionsPool = (language, platformLanguage, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(platformLanguage)
    },
    data: JSON.stringify({
      query:
        'query dimensionsByLang($lang : String) { dimensionsByLang (lang:$lang) { surveyDimensionId name } }',
      variables: {
        lang: language
      }
    })
  });

export const createSurveyDefinition = (
  user,
  language,
  privacyPolicy,
  termCond,
  surveyDefinition,
  application
) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(language)
    },
    data: JSON.stringify({
      query:
        'mutation createSurveyDefinition($privacyPolicy: TermCondPolDTOInput, $termCond : TermCondPolDTOInput, $surveyDefinition : SurveyDefinitionModelInput, $application: Long) { createSurveyDefinition (privacyPolicy: $privacyPolicy, termCond:$termCond, surveyDefinition:$surveyDefinition, application:$application) { id, title, description, countryCode,latitude,longitude,lang, privacyPolicy{title,text}, termsConditions{title,text}}  }',
      variables: {
        privacyPolicy,
        termCond,
        surveyDefinition,
        application
      }
    })
  });

export const indicatorsPool = (filter, language, platformLanguage, user) =>
  axios({
    method: 'post',
    url: `${url[user.env]}/graphql`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'X-locale': normalizeLanguages(platformLanguage)
    },
    data: JSON.stringify({
      query:
        'query indicatorsPool($lang : String, $filter : String) { indicatorsPool (lang:$lang,filter:$filter) {id codeName,questionText,shortName, dimension, stoplightColors{value,description, url} ,surveyIndicator{codeName name}} }',
      variables: {
        lang: language,
        filter: filter
      }
    })
  });
