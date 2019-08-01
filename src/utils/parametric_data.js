export const NORMALIZED_DIMENSIONS = Object.freeze({
  EDUCATION: Symbol('education'),
  HEALTH: Symbol('health'),
  HOUSING: Symbol('housing'),
  INCOME: Symbol('income'),
  INTERIORITY: Symbol('interiority'),
  ORGANIZATION: Symbol('organization')
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
  'Interiority and Motivation'
];
const ORGANIZATION_OPTIONS = [
  'Organización y Participación',
  'Organization & Participation',
  'Organization and Participation'
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
  // Object.keys(DIMENSIONS_EN).forEach(d => {
  //   if (DIMENSIONS_EN[d] === dimension) {
  //     normalized = NORMALIZED_DIMENSIONS[d];
  //   }
  // });
  // if (!normalized) {
  //   Object.keys(DIMENSIONS_ES).forEach(d => {
  //     if (DIMENSIONS_ES[d] === dimension) {
  //       normalized = NORMALIZED_DIMENSIONS[d];
  //     }
  //   });
  // }
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
  }
  return normalized;
};
