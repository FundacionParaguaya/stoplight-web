import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import TermsView from './Terms'
import PrimaryParticipant from './lifemap/PrimaryParticipant'
import Location from './lifemap/Location'

class Lifemap extends Component {
  render() {
    return (
      <div>
        <h1>Lifemap</h1>
        <Route path={`${this.props.match.path}/terms`} component={TermsView} />
        <Route
          path={`${this.props.match.path}/privacy`}
          component={TermsView}
        />
        <Route
          path={`${this.props.match.path}/primary-participant`}
          component={PrimaryParticipant}
        />
        <Route
          path={`${this.props.match.path}/location`}
          component={Location}
        />
      </div>
    )
  }
}

export default Lifemap
