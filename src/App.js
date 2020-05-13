import React, { Component } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline'; // provides css reset
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux';
import defaultTheme from './theme';
import Authenticator from './Authenticator';
import DatePickedProvider from './components/DatePickerProvider';
import Scroller, { ScrollerProvider } from './components/Scroller';
import CustomSnackbarProvider from './components/SnackbarProvider';
import LanguageSwitcher from './components/LanguageSwitcher';
import NonProdWarning from './components/NonProdWarning';
import './index.css';
import Intercom from './components/Intercom';
import Routes from './components/Routes';

class App extends Component {
  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={defaultTheme}>
        <React.Fragment>
          <CssBaseline />
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <DatePickedProvider>
                <Router>
                  <CustomSnackbarProvider>
                    <ScrollerProvider>
                      <Scroller />
                      <LanguageSwitcher />
                      <Authenticator>
                        <div className={classes.appContainer}>
                          <NonProdWarning>
                            <Intercom />
                            <Routes />
                          </NonProdWarning>
                        </div>
                      </Authenticator>
                    </ScrollerProvider>
                  </CustomSnackbarProvider>
                </Router>
              </DatePickedProvider>
            </PersistGate>
          </Provider>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  appContainer: {
    width: '100%',
    margin: 'auto'
  }
};

export default withStyles(styles)(App);
