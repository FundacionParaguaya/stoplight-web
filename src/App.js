import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline'; // provides css reset
import { PersistGate } from 'redux-persist/integration/react';
import Surveys from './screens/SurveysWithDrafts';
import Lifemap from './screens/Lifemap';
import store, { persistor } from './redux';
import defaultTheme from './theme';
import Authenticator from './Authenticator';
import DatePickedProvider from './components/DatePickerProvider';
import Scroller, { ScrollerProvider } from './components/Scroller';
import CustomSnackbarProvider from './components/SnackbarProvider';
import LanguageSwitcher from './components/LanguageSwitcher';
import Analytics from './screens/Analytics';

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
                          <Switch>
                            <Route path="/surveys" component={Surveys} />
                            <Route path="/lifemap" component={Lifemap} />
                            <Route path="/analytics" component={Analytics} />
                          </Switch>
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
