// This file provides the color and typography styles used troughout the App
import { createMuiTheme } from '@material-ui/core/styles'

export const theme = {
  palette: {
    primary: {
      main: '#7cd071',
      dark: '#50aa47'
    },
    secondary: {
      main: '#f0cb17'
    },
    error: {
      main: '#e1504d'
    }
  },
  typography: {
    useNextVariants: true
  }
}

export default createMuiTheme(theme)
