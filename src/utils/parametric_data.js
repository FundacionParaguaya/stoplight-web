export const NORMALIZED_DIMENSIONS = Object.freeze({
  EDUCATION: Symbol('education'),
  HEALTH: Symbol('health'),
  HOUSING: Symbol('housing'),
  INCOME: Symbol('income'),
  INTERIORITY: Symbol('interiority'),
  ORGANIZATION: Symbol('organization'),
  EDU_CONDITIONS: Symbol('eduConditions'),
  EDU_COMMITMENT: Symbol('eduCommitment'),
  EDU_HEALTH: Symbol('eduHealth'),
  EDU_DISCIPLINE: Symbol('eduDiscipline')
});

const EDUCATION_OPTIONS = [
  'Educación y Cultura',
  'Education & Culture',
  'Education and Culture'
];
const HEALTH_OPTIONS = [
  'Health & Environment',
  'Health and Environment',
  'Salud y Medio Ambiente',
  'Salud y Medioambiente'
];
const HOUSING_OPTIONS = [
  'Housing & Infrastructure',
  'Housing and Infrastructure',
  'Vivienda e Infraestructura',
  'housing and Infrastructure'
];
const INCOME_OPTIONS = [
  'Income & Employment',
  'Income and Employment',
  'Ingreso y Empleo',
  'Ingreso y Empleo',
  'Ingresos y Empleo'
];
const INTERIORITY_OPTIONS = [
  'Interioridad y Motivación',
  'Interiority & Motivation',
  'Interiority and Motivation',
  'Desarrollo Personal'
];
const ORGANIZATION_OPTIONS = [
  'Organización y Participación',
  'Organization & Participation',
  'Organization and Participation'
];

const EDU_CONDITIONS_OPTIONS = [
  'Condiciones para el Aprendizaje',
  'Conditions for Learning'
];

const EDU_COMMITMENT_OPTIONS = [
  'Compromiso y Comunicación',
  'Commitment and Communication'
];

const EDU_HEALTH_OPTIONS = [
  'Salud y Bienestar Familiar',
  'Health and Family Wellbeing'
];

const EDU_DISCIPLINE_OPTIONS = [
  'Disciplina y Afectividad',
  'Discipline and Affectivity'
];

const {
  INCOME,
  HEALTH,
  HOUSING,
  EDUCATION,
  ORGANIZATION,
  INTERIORITY,
  EDU_CONDITIONS,
  EDU_COMMITMENT,
  EDU_HEALTH,
  EDU_DISCIPLINE
} = NORMALIZED_DIMENSIONS;

// TODO: find a better way of doing this
// it's backwards because on each call on sort
// if the condition is met creating a stack like data structure
// so one is stacked after the previous
// see implementation on Dashboard.js on setDimension call
export const ORDERED_DIMENSIONS = [
  INTERIORITY,
  ORGANIZATION,
  EDUCATION,
  HOUSING,
  HEALTH,
  INCOME,
  EDU_CONDITIONS,
  EDU_COMMITMENT,
  EDU_HEALTH,
  EDU_DISCIPLINE
];

export const DIMENSIONS_EN = Object.freeze({
  EDUCATION: 'Education & Culture',
  HEALTH: 'Health & Environment',
  HOUSING: 'Housing & Infrastructure',
  INCOME: 'Income & Employment',
  INTERIORITY: 'Interiority & Motivation',
  ORGANIZATION: 'Organization & Participation'
});

export const DIMENSIONS_ES = Object.freeze({
  EDUCATION: 'Educación y Cultura',
  HEALTH: 'Salud y Medioambiente',
  HOUSING: 'Vivienda e Infraestructura',
  INCOME: 'Ingreso y Empleo',
  INTERIORITY: 'Interioridad y Motivación',
  ORGANIZATION: 'Organización y Participación'
});

export const normalizeDimension = d => {
  const dimension = d.trim();
  let normalized = '';
  if (EDUCATION_OPTIONS.indexOf(dimension) >= 0) {
    normalized = NORMALIZED_DIMENSIONS.EDUCATION;
  } else if (HEALTH_OPTIONS.indexOf(dimension) >= 0) {
    normalized = NORMALIZED_DIMENSIONS.HEALTH;
  } else if (HOUSING_OPTIONS.indexOf(dimension) >= 0) {
    normalized = NORMALIZED_DIMENSIONS.HOUSING;
  } else if (INCOME_OPTIONS.indexOf(dimension) >= 0) {
    normalized = NORMALIZED_DIMENSIONS.INCOME;
  } else if (INTERIORITY_OPTIONS.indexOf(dimension) >= 0) {
    normalized = NORMALIZED_DIMENSIONS.INTERIORITY;
  } else if (ORGANIZATION_OPTIONS.indexOf(dimension) >= 0) {
    normalized = NORMALIZED_DIMENSIONS.ORGANIZATION;
  } else if (EDU_CONDITIONS_OPTIONS.indexOf(dimension) >= 0) {
    normalized = NORMALIZED_DIMENSIONS.EDU_CONDITIONS;
  } else if (EDU_COMMITMENT_OPTIONS.indexOf(dimension) >= 0) {
    normalized = NORMALIZED_DIMENSIONS.EDU_COMMITMENT;
  } else if (EDU_HEALTH_OPTIONS.indexOf(dimension) >= 0) {
    normalized = NORMALIZED_DIMENSIONS.EDU_HEALTH;
  } else if (EDU_DISCIPLINE_OPTIONS.indexOf(dimension) >= 0) {
    normalized = NORMALIZED_DIMENSIONS.EDU_DISCIPLINE;
  }

  return normalized;
};
