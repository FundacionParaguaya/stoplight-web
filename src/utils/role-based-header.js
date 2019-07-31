export const getPlatform = env => `https://${env}.povertystoplight.org`;

export const NEW = 'new';
export const OLD = 'old';

export const ROLE_ROOT = [
  { item: 'reports', platform: OLD },
  { item: 'hubs', platform: OLD },
  { item: 'surveys', platform: OLD },
  { item: 'users', platform: OLD },
  { item: 'families', platform: OLD },
  { item: 'map', platform: OLD }
];

export const ROLE_HUB_ADMIN = [
  { item: 'reports', platform: OLD },
  { item: 'surveys', platform: OLD },
  { item: 'organizations', platform: OLD },
  { item: 'users', platform: OLD },
  { item: 'families', platform: OLD },
  { item: 'map', platform: OLD }
];

export const ROLE_PS_TEAM = [
  { item: 'hubs', platform: NEW },
  { item: 'users', platform: OLD },
  { item: 'surveys', platform: OLD },
  { item: 'map', platform: OLD }
];

export const ROLE_APP_ADMIN = [
  { item: 'reports', platform: OLD },
  { item: 'surveys', platform: OLD },
  { item: 'users', platform: OLD },
  { item: 'families', platform: OLD },
  { item: 'map', platform: OLD }
];

export const ROLE_SURVEY_USER = [
  { item: 'surveys', platform: NEW },
  { item: 'families', platform: OLD },
  { item: 'map', platform: OLD }
];

export const ROLES = {
  ROLE_ROOT,
  ROLE_HUB_ADMIN,
  ROLE_PS_TEAM,
  ROLE_APP_ADMIN,
  ROLE_SURVEY_USER
};
