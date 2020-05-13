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
    { item: 'reports', platform: OLD },
    { item: 'hubs', platform: NEW },
    { item: 'surveysList', platform: NEW },
    { item: 'users', platform: OLD },
    { item: 'families', platform: NEW },
    { item: 'detail', platform: ACCESS },
    { item: 'map', platform: OLD }
  ],
  ROLE_HUB_ADMIN: [
    // Hub admin user
    { item: 'dashboard', platform: ACCESS },
    { item: 'reports', platform: OLD },
    { item: 'surveysList', platform: NEW },
    { item: 'organizations', platform: OLD },
    { item: 'users', platform: OLD },
    { item: 'families', platform: NEW },
    { item: 'detail', platform: ACCESS },
    { item: 'map', platform: OLD }
  ],
  ROLE_PS_TEAM: [
    // PS Team user
    { item: 'dashboard', platform: ACCESS },
    { item: 'reports', platform: OLD },
    { item: 'hubs', platform: NEW },
    { item: 'users', platform: OLD },
    { item: 'surveysList', platform: NEW },
    { item: 'map', platform: OLD }
  ],
  ROLE_APP_ADMIN: [
    // Org admin user
    { item: 'dashboard', platform: ACCESS },
    { item: 'reports', platform: OLD },
    { item: 'surveysList', platform: NEW },
    { item: 'users', platform: OLD },
    { item: 'families', platform: NEW },
    { item: 'detail', platform: ACCESS },
    { item: 'map', platform: OLD }
  ],
  ROLE_SURVEY_USER: [
    // Facilitator user
    { item: 'dashboard', platform: ACCESS },
    { item: 'surveys', platform: NEW },
    { item: 'families', platform: NEW },
    { item: 'priorities', platform: ACCESS },
    { item: 'detail', platform: ACCESS },
    { item: 'map', platform: OLD }
  ],
  ROLE_SURVEY_USER_ADMIN: [
    // Facilitator admin user
    { item: 'dashboard', platform: ACCESS },
    { item: 'surveys', platform: NEW },
    { item: 'families', platform: NEW },
    { item: 'priorities', platform: ACCESS },
    { item: 'detail', platform: ACCESS },
    { item: 'map', platform: OLD }
  ],
  ROLE_SURVEY_TAKER: [
    // Surveyor  user
    { item: 'surveys', platform: NEW }
  ]
};

export const ROLE_ROOT = 'ROLE_ROOT';
export const ROLE_HUB_ADMIN = 'ROLE_HUB_ADMIN';
export const ROLE_PS_TEAM = 'ROLE_PS_TEAM';
export const ROLE_APP_ADMIN = 'ROLE_APP_ADMIN';
export const ROLE_SURVEY_USER = 'ROLE_SURVEY_USER';
export const ROLE_SURVEY_USER_ADMIN = 'ROLE_SURVEY_USER_ADMIN';
export const ROLE_SURVEY_TAKER = 'ROLE_SURVEY_TAKER';
export const ROLES_NAMES = {
  ROLE_ROOT,
  ROLE_HUB_ADMIN,
  ROLE_PS_TEAM,
  ROLE_APP_ADMIN,
  ROLE_SURVEY_USER,
  ROLE_SURVEY_USER_ADMIN,
  ROLE_SURVEY_TAKER
};

export const checkAccess = ({ role }, item) => {
  return !!role && !!ROLES[role].find(r => r.item === item);
};
