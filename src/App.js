import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import Dots from './components/Dots'
import Header from './Header'
import Surveys from './screens/Surveys'
import Lifemap from './screens/Lifemap'
import store from './redux'

class App extends Component {
  render() {
    return (
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
    )
  }
}

export default App
