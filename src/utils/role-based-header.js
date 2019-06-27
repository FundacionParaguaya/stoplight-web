export const getPlatform = env => ({
  old: `https://${env}.povertystoplight.org`,
  new: `http://app.povertystoplight.org`
});

export const NEW = 'new';
export const OLD = 'old';

export const SURVEY_USER = [
  { item: 'surveys', platform: 'new' },
  { item: 'families', platform: 'old' },
  { item: 'map', platform: 'old' }
];

export const HUB_ADMIN = [
  { item: 'reports', platform: 'old' },
  { item: 'surveys', platform: 'old' },
  { item: 'organizations', platform: 'old' },
  { item: 'users', platform: 'old' },
  { item: 'families', platform: 'old' },
  { item: 'map', platform: 'old' }
];

export const APP_ADMIN = [
  { item: 'reports', platform: 'old' },
  { item: 'surveys', platform: 'old' },
  { item: 'users', platform: 'old' },
  { item: 'families', platform: 'old' },
  { item: 'map', platform: 'old' }
];

export const ROLES = { APP_ADMIN, HUB_ADMIN, SURVEY_USER };
