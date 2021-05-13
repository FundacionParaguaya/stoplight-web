import React from 'react';
import { create } from 'jss';
import rtl from 'jss-rtl';
import {
  MuiThemeProvider,
  StylesProvider,
  jssPreset
} from '@material-ui/core/styles';
import defaultTheme from '../theme';

// Configura JSS

const RTL = ({ children }) => {
  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

  return (
    <StylesProvider jss={jss}>
      <MuiThemeProvider theme={defaultTheme}>{children}</MuiThemeProvider>
    </StylesProvider>
  );
};

export default RTL;
