// This file provides the color and typography styles used troughout the App
import { createMuiTheme } from '@material-ui/core/styles';

export const COLORS = {
  RED: '#e1504d',
  YELLOW: '#f0cb17',
  GREEN: '#50aa47',
  LIGHT_GREY: '#E6E4E2',
  TEXT_GREY: '#6A6A6A',
  TEXT_LIGHTGREY: 'rgba(0,0,0,0.5)'
};

export const theme = {
  palette: {
    primary: {
      main: '#309E43',
      dark: '#50aa47'
    },
    secondary: {
      main: '#e1504d'
    },
    error: {
      main: '#e1504d'
    },
    text: {
      primary: '#1c212f',
      secondary: '#fff'
    },
    grey: {
      main: '#909090'
    },
    background: {
      default: '#fff',
      paper: '#f3f4f6'
    }
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Roboto',
    useNextVariants: true,
    body2: {
      fontSize: 18,
      fontFamily: 'Poppins'
    },
    subtitle1: {
      fontSize: 16,
      fontFamily: 'Poppins',
      letterSpacing: 0.2,
      color: '#6A6A6A',
      lineHeight: '20px',
      fontWeight: 500
    },
    subtitle2: {
      fontSize: 14,
      fontFamily: 'Poppins',
      letterSpacing: '0.16px',
      color: '#1C212F',
      lineHeight: '18px',
      fontWeight: 400
    },
    h4: {
      fontFamily: 'Poppins',
      color: '#626262',
      fontWeight: 600,
      fontSize: 30,
      letterSpacing: 0.33,
      lineHeight: '46px'
    },
    h5: {
      fontFamily: 'Poppins',
      color: '#626262',
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: 0.24,
      lineHeight: '33px'
    },
    h6: {
      fontSize: 16,
      fontFamily: 'Poppins',
      fontWeight: 400
    }
  },
  shape: {
    padding: 40,
    marginButton: '40px 0 50px 0',
    header: '60px',
    footer: '40px'
  },
  shadows: Array(25).fill('none'),
  overrides: {
    MuiFilledInput: {
      root: {
        '&:hover': {
          backgroundColor: '#fff',
          boxShadow: '0'
        },
        '&$focused': {
          backgroundColor: '#fff'
        },
        '& $input[value=""]': {
          backgroundColor: '#f3f4f6',
          borderRadius: '8px 8px 0 0!important'
        },
        backgroundColor: '#fff',
        borderRadius: '8px 8px 0 0!important'
      }
    },
    MuiFormHelperText: {
      root: {
        fontSize: 16
      }
    },
    MuiIconButton: {
      root: {
        padding: 8
      }
    },
    MuiFormControlLabel: {
      label: {
        color: '#6A6A6A',
        fontSize: 16
      }
    },
    MuiInputBase: {
      input: {
        fontSize: '16px',
        padding: '40px 12px 10px!important',
        '&$focused': {
          backgroundColor: '#fff!important'
        }
      },
      root: {
        '&$focused': {
          backgroundColor: '#fff!important'
        }
      },
      multiline: {
        padding: '0px 0px 1px !important'
      }
    },
    MuiInputLabel: {
      root: {
        '&$error': {
          top: '40%!important'
          // transform: 'translate(12px, -50%) scale(1)!important'
        }
      },
      shrink: {
        transform: 'translate(12px, -85%) scale(1)!important',
        color: '#6A6A6A'
      },
      filled: {
        top: '50%',
        transform: 'translate(12px, -50%) scale(1)',
        color: '#6A6A6A',
        paddingRight: 24
      },
      formControl: {
        // top: '50%',
        transform: 'translate(12px, 25px) scale(1)',
        color: '#6A6A6A',
        lineHeight: 1.2
      }
    },
    MuiInput: {
      formControl: {
        marginTop: '0!important'
      }
    },
    MuiSelect: {
      select: {
        '&:focus': {
          background: '#fff!important'
        }
      }
    },
    MuiButton: {
      text: {
        '&:hover': {
          backgroundColor: 'transparent',
          textDecoration: 'underline'
        },
        textTransform: 'capitalize',
        fontSize: 16,
        fontFamily: 'Poppins',
        borderRadius: 3,
        border: 0,
        color: '#309E43',
        height: 38,
        // width: 280,
        padding: '0 30px',
        textDecoration: 'underline'
      },
      contained: {
        '&:hover': {
          backgroundColor: '#309E43'
        },
        textTransform: 'capitalize',
        fontSize: 16,
        fontFamily: 'Poppins',
        backgroundColor: '#309E43',
        borderRadius: 3,
        border: 0,
        color: '#fff',
        height: 38,
        padding: '0 30px'
      },
      outlined: {
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: 600,
        letterSpacing: 0.25,
        textTransform: 'capitalize',
        width: 107,
        border: '1.5px solid rgba(0, 0, 0, 0.23)',
        color: 'rgba(0, 0, 0, 0.23)'
      },
      outlinedSecondary: {
        border: '1.5px solid #e1504d',
        '&:hover': {
          border: '1.5px solid #e1504d'
        }
      }
    }
  },
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  }
};

export default createMuiTheme(theme);
