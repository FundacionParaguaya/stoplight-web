import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Dots from './components/Dots'
import Surveys from './screens/Surveys'
import Lifemap from './screens/Lifemap'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Dots />
          <Switch>
            <Route exact path="/surveys" component={Surveys} />
            <Route path="/lifemap" component={Lifemap} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
