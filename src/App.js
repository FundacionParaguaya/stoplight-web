import React, { Component, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline'; // provides css reset
import { PersistGate } from 'redux-persist/integration/react';
import SurveysComponent from './screens/Surveys';
import Lifemap from './screens/Lifemap';
import store, { persistor } from './redux';
import defaultTheme from './theme';
import Authenticator from './Authenticator';
import DatePickedProvider from './components/DatePickerProvider';

let Scroller = ({ location }) => {
  useEffect(() => window.scrollTo(0, 0), [location]);
  return <React.Fragment />;
};
Scroller = withRouter(Scroller);

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
                  <Scroller />
                  <Authenticator>
                    <div className={classes.appContainer}>
                      <Switch>
                        <Route path="/surveys" component={SurveysComponent} />
                        <Route path="/lifemap" component={Lifemap} />
                      </Switch>
                    </div>
                  </Authenticator>
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
