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
    fontSize: 18,
    fontFamily: 'Roboto',
    useNextVariants: true,
    caption: {
      fontSize: 18,
      color: '#fff'
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
  }
}

export default createMuiTheme(theme)
