import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import TermsView from './Terms'
import PrimaryParticipant from './PrimaryParticipant'

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
      </div>
    )
  }
}

export default Lifemap
