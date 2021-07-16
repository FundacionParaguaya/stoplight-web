export const getPlatform = env => `https://${env}.povertystoplight.org`;

export const NEW = 'new';
export const OLD = 'old';
//Used to mark access to a new view
export const ACCESS = 'access';

//In the commets are the user role names used by Fundacion Paraguaya's team
export const ROLES = {
  ROLE_ROOT: [
    // Admin user
    { item: 'dashboard', platform: ACCESS },
    { item: 'reports', platform: NEW },
    { item: 'hubs', platform: NEW },
    { item: 'organizations', platform: ACCESS },
    { item: 'projects', platform: ACCESS },
    { item: 'surveysList', platform: NEW },
    { item: 'users', platform: NEW },
    { item: 'families', platform: NEW },
    { item: 'detail', platform: ACCESS },
    { item: 'map', platform: NEW },
    { item: 'solutions', platform: ACCESS },
    { item: 'editFamilyImages', platform: ACCESS },
    { item: 'offline-maps', platform: ACCESS },
    { item: 'support', platform: ACCESS },
    { item: 'survey-builder', platform: ACCESS },
    { item: 'libraries', platform: NEW, options: ['dimensions'] },
    { item: 'dimensions', platform: ACCESS }
  ],
  ROLE_HUB_ADMIN: [
    // Hub admin user
    { item: 'dashboard', platform: ACCESS },
    { item: 'reports', platform: NEW },
    { item: 'projects', platform: ACCESS },
    { item: 'surveysList', platform: NEW },
    { item: 'organizations', platform: NEW },
    { item: 'organizationEdit', platform: ACCESS },
    { item: 'users', platform: NEW },
    { item: 'families', platform: NEW },
    { item: 'detail', platform: ACCESS },
    { item: 'map', platform: NEW },
    { item: 'solutions', platform: ACCESS },
    { item: 'offline-maps', platform: ACCESS },
    { item: 'support', platform: ACCESS },
    { item: 'interventions', platform: NEW }
  ],
  ROLE_PS_TEAM: [
    // PS Team user
    { item: 'dashboard', platform: ACCESS },
    { item: 'reports', platform: NEW },
    { item: 'hubs', platform: NEW },
    { item: 'users', platform: NEW },
    { item: 'surveysList', platform: NEW },
    { item: 'map', platform: NEW },
    { item: 'organizations', platform: ACCESS },
    { item: 'projects', platform: ACCESS },
    { item: 'solutions', platform: ACCESS },
    { item: 'editFamilyImages', platform: ACCESS },
    { item: 'offline-maps', platform: ACCESS },
    { item: 'support', platform: ACCESS },
    { item: 'survey-builder', platform: ACCESS }
  ],
  ROLE_APP_ADMIN: [
    // Org admin user
    { item: 'dashboard', platform: ACCESS },
    { item: 'reports', platform: NEW },
    { item: 'projects', platform: NEW },
    { item: 'surveysList', platform: NEW },
    { item: 'users', platform: NEW },
    { item: 'families', platform: NEW },
    { item: 'detail', platform: ACCESS },
    { item: 'map', platform: NEW },
    { item: 'solutions', platform: ACCESS },
    { item: 'editFamily', platform: ACCESS },
    { item: 'editFamilyImages', platform: ACCESS },
    { item: 'support', platform: ACCESS }
  ],
  ROLE_SURVEY_USER: [
    // Facilitator user
    { item: 'surveys', platform: NEW },
    { item: 'dashboard', platform: ACCESS },
    { item: 'families', platform: NEW },
    { item: 'priorities', platform: ACCESS },
    { item: 'detail', platform: ACCESS },
    { item: 'map', platform: NEW },
    { item: 'editFamily', platform: ACCESS },
    { item: 'editFamilyImages', platform: ACCESS },
    { item: 'support', platform: ACCESS }
  ],
  ROLE_SURVEY_USER_ADMIN: [
    // Facilitator admin user
    { item: 'surveys', platform: NEW },
    { item: 'dashboard', platform: ACCESS },
    { item: 'families', platform: NEW },
    { item: 'priorities', platform: ACCESS },
    { item: 'detail', platform: ACCESS },
    { item: 'map', platform: NEW },
    { item: 'editFamily', platform: ACCESS },
    { item: 'editFamilyImages', platform: ACCESS },
    { item: 'support', platform: ACCESS }
  ],
  ROLE_SURVEY_TAKER: [
    // Surveyor  user
    { item: 'surveys', platform: NEW },
    { item: 'support', platform: ACCESS }
  ],
  ROLE_FAMILY_USER: [
    // Family  user
    { item: 'my-profile', platform: NEW },
    { item: 'detail', platform: ACCESS },
    { item: 'priorities', platform: ACCESS },
    { item: 'support', platform: ACCESS }
  ]
};

export const ROLE_ROOT = 'ROLE_ROOT';
export const ROLE_HUB_ADMIN = 'ROLE_HUB_ADMIN';
export const ROLE_PS_TEAM = 'ROLE_PS_TEAM';
export const ROLE_APP_ADMIN = 'ROLE_APP_ADMIN';
export const ROLE_SURVEY_USER = 'ROLE_SURVEY_USER';
export const ROLE_SURVEY_USER_ADMIN = 'ROLE_SURVEY_USER_ADMIN';
export const ROLE_SURVEY_TAKER = 'ROLE_SURVEY_TAKER';
export const ROLE_FAMILY_USER = 'ROLE_FAMILY_USER';

export const ROLES_NAMES = {
  ROLE_ROOT,
  ROLE_HUB_ADMIN,
  ROLE_PS_TEAM,
  ROLE_APP_ADMIN,
  ROLE_SURVEY_USER,
  ROLE_SURVEY_USER_ADMIN,
  ROLE_SURVEY_TAKER,
  ROLE_FAMILY_USER
};

export const roleHasMoreThanOneAccess = role => {
  return ROLES[role].filter(r => r.platform === NEW).length > 1;
};

export const checkAccess = ({ role }, item) => {
  return !!role && !!ROLES[role].find(r => r.item === item);
};

export const checkAccessToSolution = ({ role, hub, organization }) => {
  if (!role) return false;
  else if (role === ROLES_NAMES.ROLE_ROOT || role === ROLES_NAMES.ROLE_PS_TEAM)
    return true;
  else if (role === ROLES_NAMES.ROLE_HUB_ADMIN && !!hub && hub.allowSolutions)
    return true;
  else if (
    checkAccess({ role }, 'solutions') &&
    !!organization &&
    !!organization.application &&
    organization.application.allowSolutions &&
    !!organization.solutionsAccess &&
    organization.solutionsAccess !== 'NONE'
  )
    return true;

  return false;
};

export const getHomePage = role => {
  return (!!role && ROLES[role][0].item) || '';
};

export const checkAccessToProjects = ({ role, hub, organization }) => {
  if (!role) return false;
  else if (role === ROLES_NAMES.ROLE_ROOT || role === ROLES_NAMES.ROLE_PS_TEAM)
    return true;
  else if (role === ROLES_NAMES.ROLE_HUB_ADMIN && !!hub && hub.projectsSupport)
    return true;
  else if (
    !!organization &&
    !!organization.projectsAccess &&
    !!organization.application &&
    !!organization.application.projectsSupport
  )
    return true;

  return false;
};

export const checkAccessToFamilyUsers = ({ role, hub }) => {
  if (!role) return false;
  else if (role === ROLES_NAMES.ROLE_ROOT || role === ROLES_NAMES.ROLE_PS_TEAM)
    return true;
  else if (
    !!hub &&
    Array.isArray(hub.labels) &&
    hub.labels.includes('allowFamilyUsers')
  )
    return true;
  return false;
};

export const checkAccessToInterventions = ({ role, hub }) => {
  if (!role) return false;
  else if (role === ROLES_NAMES.ROLE_ROOT || role === ROLES_NAMES.ROLE_PS_TEAM)
    return true;
  else if (
    !!hub &&
    Array.isArray(hub.labels) &&
    hub.labels.includes('allowInterventions')
  )
    return true;
  return false;
};
