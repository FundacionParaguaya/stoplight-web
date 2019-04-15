// This file provides the color and typography styles used troughout the App
import { createMuiTheme } from '@material-ui/core/styles'

export const theme = {
  palette: {
    primary: {
      main: '#309E43',
      dark: '#50aa47'
    },
    secondary: {
      main: '#f0cb17'
    },
    error: {
      main: '#e1504d'
    },
    text: {
      primary: '#1c212f',
    },
    background: {
      paper: '#f3f4f6',
      default: '#fff'
    }
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Roboto',
    useNextVariants: true,
    body2: {
      fontSize: 18,
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
    }
  },
  shape: {
    padding: 40
  },
  shadows: Array(25).fill('none'),
  overrides: {
    MuiFilledInput: {
      root: {
        '&:hover': {
          backgroundColor: '#f3f4f6',
          boxShadow: '0'
        },
        '&$focused': {
          'backgroundColor': '#fff'
        },
        backgroundColor: '#f3f4f6',
        borderRadius: '8px 8px 0 0!important',
      },
    },
    MuiInputBase: {
      input: {
        fontSize: '16px',
        padding: '35px 12px 10px!important',
        '&$focused': {
          'backgroundColor': '#fff!important'
        },
      },
      root: {
        '&$focused': {
          'backgroundColor': '#fff!important'
        },
      }
    },
    MuiFormLabel: {
      // shrink: {
      //   transform: 'translate(12px, 10px) scale(1)!important'
      // },
      root: {
        zIndex: 999,
      }
    },
    MuiInputLabel: {
      shrink: {
        transform: 'translate(12px, 10px) scale(1)!important'
      },
      filled: {
        transform: 'translate(12px, 25px) scale(1)'
      },
      formControl: {
        transform: 'translate(12px, 25px) scale(1)'
      }
    },
    MuiInput: {
      formControl: {
        marginTop: '0!important'
      }
    },
    MuiSelect: {
      select: {
        backgroundColor: '#f3f4f6',
        borderRadius: '8px 8px 0 0',
        paddingLeft: 12,
        paddingRight: 12,
        '&:focus': {
          background: '#fff!important'
        },
        borderBottom: '1px solid rgba(0,0,0,0.42)'
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
        width: 280,
        padding: '0 30px',
        textDecoration: 'underline'
      },
      contained: {
        '&:hover': {
          backgroundColor: '#309E43',
        },
        textTransform: 'capitalize',
        fontSize: 16,
        fontFamily: 'Poppins',
        backgroundColor: '#309E43',
        borderRadius: 3,
        border: 0,
        color: '#fff',
        height: 38,
        width: 280,
        padding: '0 30px',
      }
    }
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
}

export default createMuiTheme(theme)
