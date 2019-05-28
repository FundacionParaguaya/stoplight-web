import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import TermsView from './lifemap/Terms';
import PrimaryParticipantScreen from './lifemap/PrimaryParticipant';
import { Location } from './lifemap/Location';
import EconomicsScreen from './lifemap/Economics';
import BeginStoplight from './lifemap/BeginStoplight';
import { StoplightQuestions } from './lifemap/StoplightQuestions';
import SkippedIndicator from './lifemap/SkippedIndicator';
import OverviewScreen from './lifemap/Overview';
import FinalScreen from './lifemap/Final';
import FamilyMembersScreen from './lifemap/FamilyMembers';
import SkippedQuestionsScreen from './lifemap/SkippedQuestions';
import Priority from './lifemap/Priority';
import Achievement from './lifemap/Achievement';
import { ProgressBarProvider } from '../components/ProgressBar';

class Lifemap extends Component {
  render() {
    return (
      <React.Fragment>
        <ProgressBarProvider>
          <Route
            path={`${this.props.match.path}/terms`}
            component={TermsView}
          />
          <Route
            path={`${this.props.match.path}/privacy`}
            component={TermsView}
          />
          <Route
            path={`${this.props.match.path}/primary-participant`}
            component={PrimaryParticipantScreen}
          />
          <Route
            path={`${this.props.match.path}/family-members`}
            component={FamilyMembersScreen}
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
            component={SkippedQuestionsScreen}
          />
          <Route
            path={`${this.props.match.path}/skipped-indicator/:indicator`}
            component={SkippedIndicator}
          />
          <Route
            path={`${this.props.match.path}/overview`}
            component={OverviewScreen}
          />
          <Route
            path={`${this.props.match.path}/achievement/:indicator`}
            component={Achievement}
          />
          <Route
            path={`${this.props.match.path}/priority/:indicator`}
            component={Priority}
          />
          <Route
            path={`${this.props.match.path}/final`}
            component={FinalScreen}
          />
        </ProgressBarProvider>
      </React.Fragment>
    );
  }
}

export default Lifemap;
