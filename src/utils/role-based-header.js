export const getPlatform = env => `https://${env}.povertystoplight.org`;

export const NEW = 'new';
export const OLD = 'old';

export const SURVEY_USER = [
  { item: 'surveys', platform: NEW },
  { item: 'families', platform: OLD },
  { item: 'map', platform: OLD }
];

export const HUB_ADMIN = [
  { item: 'reports', platform: OLD },
  { item: 'surveys', platform: OLD },
  { item: 'organizations', platform: OLD },
  { item: 'users', platform: OLD },
  { item: 'families', platform: OLD },
  { item: 'map', platform: OLD }
];

export const ROOT = [
  { item: 'reports', platform: OLD },
  { item: 'surveys', platform: OLD },
  { item: 'users', platform: OLD },
  { item: 'families', platform: OLD },
  { item: 'map', platform: OLD }
];

export const ROLES = { ROOT, ROLE_ROOT: ROOT, HUB_ADMIN, SURVEY_USER };
