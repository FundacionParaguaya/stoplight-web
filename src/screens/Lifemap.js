import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import TermsView from './lifemap/Terms'
import PrimaryParticipantScreen from './lifemap/PrimaryParticipant'
import Location from './lifemap/Location'
import EconomicsScreen from './lifemap/Economics'
import BeginStoplight from './lifemap/BeginStoplight'
import StoplightQuestions from './lifemap/StoplightQuestions'
import OverviewScreen from './lifemap/Overview'
import FinalScreen from './lifemap/Final'
import FamilyMembers from './lifemap/FamilyMembers'
import GenderAndBirthrates from './lifemap/GenderAndBirthrates'
import SkippedQuestions from './lifemap/SkippedQuestions'
class Lifemap extends Component {
  render() {
    return (
      <React.Fragment>
        <Route path={`${this.props.match.path}/terms`} component={TermsView} />
        <Route
          path={`${this.props.match.path}/privacy`}
          component={TermsView}
        />
        <Route
          path={`${this.props.match.path}/primary-participant`}
          component={PrimaryParticipantScreen}
        />
        <Route
          path={`${this.props.match.path}/gender-and-birthrates`}
          component={GenderAndBirthrates}
        />
        <Route
          path={`${this.props.match.path}/family-members`}
          component={FamilyMembers}
        />

        <Route
          path={`${this.props.match.path}/location`}
          component={Location}
        />
        <Route
          path={`${this.props.match.path}/economics/:page`}
          component={EconomicsScreen}
        />
        <Route
          path={`${this.props.match.path}/begin-stoplight`}
          component={BeginStoplight}
        />
        <Route
          path={`${this.props.match.path}/stoplight/:page`}
          component={StoplightQuestions}
        />
        <Route
          path={`${this.props.match.path}/skipped-questions`}
          component={SkippedQuestions}
        />
        <Route
          path={`${this.props.match.path}/overview`}
          component={OverviewScreen}
        />
        <Route
          path={`${this.props.match.path}/final`}
          component={FinalScreen}
        />
      </React.Fragment>
    )
  }
}

export default Lifemap
