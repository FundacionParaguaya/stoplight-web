import { theme } from '../theme';

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
    boxShadow: isFocused ? `0 0 0 1px ${theme.palette.primary.main}` : 'none'
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
  })
};

export { selectStyle };
