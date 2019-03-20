import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline' // provides css reset
import Dots from './components/Dots'
import Header from './Header'
import Surveys from './screens/Surveys'
import Lifemap from './screens/Lifemap'
import store from './redux'
import theme from './theme'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <React.Fragment>
          <CssBaseline />
          <Provider store={store}>
            <Router>
              <div>
                <Header />
                <Dots />
                <Switch>
                  <Route exact path="/surveys" component={Surveys} />
                  <Route path="/lifemap" component={Lifemap} />
                </Switch>
              </div>
            </Router>
          </Provider>
        </React.Fragment>
      </MuiThemeProvider>
    )
  }
}

export default App
