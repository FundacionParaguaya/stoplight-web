import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline'; // provides css reset
import { PersistGate } from 'redux-persist/integration/react';
import Surveys from './screens/SurveysWithDrafts';
import SurveyList from './screens/Surveys';
import Organizations from './screens/Organizations';
import Lifemap from './screens/Lifemap';
import Families from './screens/Families';
import store, { persistor } from './redux';
import defaultTheme from './theme';
import Authenticator from './Authenticator';
import DatePickedProvider from './components/DatePickerProvider';
import Scroller, { ScrollerProvider } from './components/Scroller';
import CustomSnackbarProvider from './components/SnackbarProvider';
import LanguageSwitcher from './components/LanguageSwitcher';
import Dashboard from './screens/Dashboard';
import NonProdWarning from './components/NonProdWarning';
import './index.css';
import Intercom from './components/Intercom';
import FamilyProfile from './screens/FamilyProfile';
import LifemapDetails from './screens/LifemapDetails';
import SelectIndicatorPriority from './screens/priorities/SelectIndicatorPriority';

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
                            <Switch>
                              <Route path="/surveys" component={Surveys} />
                              <Route
                                path="/surveysList"
                                component={SurveyList}
                              />
                              <Route
                                path="/organizations"
                                component={Organizations}
                              />
                              <Route path="/lifemap" component={Lifemap} />
                              <Route path="/families" component={Families} />
                              <Route
                                path="/family/:familyId"
                                component={FamilyProfile}
                              />
                              <Route
                                path="/detail/:familyId"
                                component={LifemapDetails}
                              />
                              <Route
                                path="/priorities/:familyId"
                                component={SelectIndicatorPriority}
                              />
                              {/* <Route path="/analytics" component={Analytics} /> */}{' '}
                              <Route path="/dashboard" component={Dashboard} />
                            </Switch>
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
