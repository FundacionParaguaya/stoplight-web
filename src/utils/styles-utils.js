import { theme } from '../theme';
import {
  normalizeDimension,
  NORMALIZED_DIMENSIONS
} from '../utils/parametric_data';

const selectStyle = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: theme.palette.background.default,
    borderRadius: 2,
    '&:hover': {
      borderColor: isFocused ? theme.palette.primary.main : 'hsl(0, 0%, 70%)'
    },
    border: isFocused
      ? `1.5px solid ${theme.palette.primary.main}`
      : `1.5px solid ${theme.palette.grey.quarter}`,
    boxShadow: isFocused ? `0 0 0 1px ${theme.palette.primary.main}` : 'none',
    overflowY: 'auto',
    maxHeight: 75
  }),
  multiValueLabel: styles => ({
    ...styles,
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: 500,
    color: 'rgba(28,33,47,0.51)'
  }),
  multiValue: styles => ({ ...styles, color: 'rgba(28,33,47,0.51)' }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? 'hsl(0,0%,90%)' : 'transparent',
    fontSize: 14,
    fontFamily: 'Poppins'
  }),
  noOptionsMessage: styles => ({
    ...styles,
    fontSize: 16,
    fontFamily: 'Poppins'
  }),
  loadingMessage: styles => ({
    ...styles,
    fontSize: 16,
    fontFamily: 'Poppins'
  }),
  menu: styles => ({
    ...styles,
    zIndex: 2
  })
};

const colors = {
  lightOrange: '#FFD6A5',
  lightBlue: '#ACEBF1',
  lightPink: '#FFADAD',
  lightGreen: '#CAFFBF',
  lightYellow: '#FCFF95',
  lightPurple: '#FFC6FF'
};

const dimensionColors = {
  orange: '#FFAF4F',
  blue: '#70E5F0',
  pink: '#FF9494',
  green: '#9AED88',
  yellow: '#F6FB55',
  purple: '#FF9AFF'
};

const pickerColor = [
  '#f28b82',
  '#fbbc04',
  '#fff475',
  '#ccff90',
  '#a7ffeb',
  '#cbf0f8',
  '#aecbfa',
  '#d7aefb',
  '#fdcfe8',
  '#e6c9a8',
  '#e8eaed'
];

const getIndicatorColorByDimension = dimension => {
  switch (normalizeDimension(dimension)) {
    case NORMALIZED_DIMENSIONS.EDUCATION:
      return colors['lightGreen'];
    case NORMALIZED_DIMENSIONS.HEALTH:
      return colors['lightBlue'];
    case NORMALIZED_DIMENSIONS.HOUSING:
      return colors['lightBlue'];
    case NORMALIZED_DIMENSIONS.INCOME:
      return colors['lightOrange'];
    case NORMALIZED_DIMENSIONS.INTERIORITY:
      return colors['lightPurple'];
    case NORMALIZED_DIMENSIONS.ORGANIZATION:
      return colors['lightYellow'];
    case NORMALIZED_DIMENSIONS.EDU_CONDITIONS:
      return colors['lightGreen'];
    case NORMALIZED_DIMENSIONS.EDU_COMMITMENT:
      return colors['lightYellow'];
    case NORMALIZED_DIMENSIONS.EDU_HEALTH:
      return colors['lightBlue'];
    case NORMALIZED_DIMENSIONS.EDU_DISCIPLINE:
      return colors['lightPurple'];
    case NORMALIZED_DIMENSIONS.EDU_INFRAESTRUCTURE:
      return colors['lightBlue'];
    case NORMALIZED_DIMENSIONS.EDU_SAFETY:
      return colors['lightYellow'];
    case NORMALIZED_DIMENSIONS.EDU_INTERIORITY:
      return colors['lightPurple'];
    case NORMALIZED_DIMENSIONS.EDU_PEDAGOGICAL_PRACTICES:
      return colors['lightGreen'];
    case NORMALIZED_DIMENSIONS.EDU_ETHICS:
      return colors['lightYellow'];
    case NORMALIZED_DIMENSIONS.EDU_RESOURCES:
      return colors['lightBlue'];
    case NORMALIZED_DIMENSIONS.EDU_LEARNING_PRACTICES:
      return colors['lightGreen'];
    case NORMALIZED_DIMENSIONS.EDU_EDUCATIONAL_TOOLS:
      return colors['lightOrange'];
    default:
      return colors['lightGreen'];
  }
};

const getDimensionColor = dimension => {
  switch (normalizeDimension(dimension)) {
    case NORMALIZED_DIMENSIONS.EDUCATION:
      return dimensionColors['green'];
    case NORMALIZED_DIMENSIONS.HEALTH:
      return dimensionColors['blue'];
    case NORMALIZED_DIMENSIONS.HOUSING:
      return dimensionColors['blue'];
    case NORMALIZED_DIMENSIONS.INCOME:
      return dimensionColors['orange'];
    case NORMALIZED_DIMENSIONS.INTERIORITY:
      return dimensionColors['purple'];
    case NORMALIZED_DIMENSIONS.ORGANIZATION:
      return dimensionColors['yellow'];
    case NORMALIZED_DIMENSIONS.EDU_CONDITIONS:
      return dimensionColors['green'];
    case NORMALIZED_DIMENSIONS.EDU_COMMITMENT:
      return dimensionColors['yellow'];
    case NORMALIZED_DIMENSIONS.EDU_HEALTH:
      return dimensionColors['blue'];
    case NORMALIZED_DIMENSIONS.EDU_DISCIPLINE:
      return dimensionColors['purple'];
    case NORMALIZED_DIMENSIONS.EDU_INFRAESTRUCTURE:
      return dimensionColors['blue'];
    case NORMALIZED_DIMENSIONS.EDU_SAFETY:
      return dimensionColors['yellow'];
    case NORMALIZED_DIMENSIONS.EDU_INTERIORITY:
      return dimensionColors['purple'];
    case NORMALIZED_DIMENSIONS.EDU_PEDAGOGICAL_PRACTICES:
      return dimensionColors['green'];
    case NORMALIZED_DIMENSIONS.EDU_ETHICS:
      return dimensionColors['yellow'];
    case NORMALIZED_DIMENSIONS.EDU_RESOURCES:
      return dimensionColors['blue'];
    case NORMALIZED_DIMENSIONS.EDU_LEARNING_PRACTICES:
      return dimensionColors['green'];
    case NORMALIZED_DIMENSIONS.EDU_EDUCATIONAL_TOOLS:
      return dimensionColors['orange'];
    default:
      return dimensionColors['green'];
  }
};
export {
  selectStyle,
  getIndicatorColorByDimension,
  getDimensionColor,
  pickerColor
};
