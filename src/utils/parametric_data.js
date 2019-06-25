export const NORMALIZED_DIMENSIONS = Object.freeze({
  EDUCATION: Symbol('education'),
  HEALTH: Symbol('health'),
  HOUSING: Symbol('housing'),
  INCOME: Symbol('income'),
  INTERIORITY: Symbol('interiority'),
  ORGANIZATION: Symbol('organization')
});

export const DIMENSIONS_EN = Object.freeze({
  EDUCATION: 'Education and Culture',
  HEALTH: 'Health and Environment',
  HOUSING: 'Housing and Infrastructure',
  INCOME: 'Income and Employment',
  INTERIORITY: 'Interiority and Motivation',
  ORGANIZATION: 'Organization and Participation'
});

export const DIMENSIONS_ES = Object.freeze({
  EDUCATION: 'Educación y Cultura',
  HEALTH: 'Salud y Medioambiente',
  HOUSING: 'Vivienda e Infraestructura',
  INCOME: 'Ingreso y Empleo',
  INTERIORITY: 'Interioridad y Motivación',
  ORGANIZATION: 'Organización y Participación'
});

export const normalizeDimension = dimension => {
  let normalized = '';
  Object.keys(DIMENSIONS_EN).forEach(d => {
    if (DIMENSIONS_EN[d] === dimension) {
      normalized = NORMALIZED_DIMENSIONS[d];
    }
  });
  if (!normalized) {
    Object.keys(DIMENSIONS_ES).forEach(d => {
      if (DIMENSIONS_ES[d] === dimension) {
        normalized = NORMALIZED_DIMENSIONS[d];
      }
    });
  }
  return normalized;
};
