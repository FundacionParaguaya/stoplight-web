import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline' // provides css reset
import Header from './Header'
import Surveys from './screens/Surveys'
import Lifemap from './screens/Lifemap'
import store from './redux'
import defaultTheme from './theme'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={defaultTheme}>
        <React.Fragment>
          <CssBaseline />
          <Provider store={store}>
            <Router>
              <div>
                <Header />
                <div style={{ marginTop: 60 }}>
                  <Switch>
                    <Route path="/surveys" component={Surveys} />
                    <Route path="/lifemap" component={Lifemap} />
                  </Switch>
                </div>
              </div>
            </Router>
          </Provider>
        </React.Fragment>
      </MuiThemeProvider>
    )
  }
}

export default App
