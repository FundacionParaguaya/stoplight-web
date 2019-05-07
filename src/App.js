import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline'; // provides css reset
import { PersistGate } from 'redux-persist/integration/react';
import Header from './Header';
import Footer from './Footer';
import SurveysComponent from './screens/Surveys';
import Lifemap from './screens/Lifemap';
import store, { persistor } from './redux';
import defaultTheme from './theme';
import Authenticator from './Authenticator';
import DatePickedProvider from './components/DatePickerProvider';

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
                  <Authenticator>
                    <Header />
                    <div className={classes.appContainer}>
                      <Switch>
                        <Route path="/surveys" component={SurveysComponent} />
                        <Route path="/lifemap" component={Lifemap} />
                      </Switch>
                    </div>
                    <Footer />
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
    marginTop: 60,
    width: '100%',
    margin: 'auto',
    display: 'inline-block',
    minHeight: 'calc(95vh - 60px)'
  }
};

export default withStyles(styles)(App);
