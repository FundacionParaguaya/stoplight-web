import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Economics from './survey-builder/Economics';
import FamilyDetails from './survey-builder/FamilyDetails';
import Final from './survey-builder/Final';
import InfoView from './survey-builder/Info';
import Stoplights from './survey-builder/Stoplights';
import Summary from './survey-builder/Summary';
import SurveyBuilderNav from './survey-builder/SurveyBuilderNav';

class Builder extends Component {
  render() {
    return (
      <React.Fragment>
        <SurveyBuilderNav />

        <Route path={`${this.props.match.path}/info`} component={InfoView} />

        <Route
          path={`${this.props.match.path}/details`}
          component={FamilyDetails}
        />

        <Route
          path={`${this.props.match.path}/economics`}
          component={Economics}
        />

        <Route
          path={`${this.props.match.path}/stoplights`}
          component={Stoplights}
        />

        <Route path={`${this.props.match.path}/summary`} component={Summary} />

        <Route path={`${this.props.match.path}/final`} component={Final} />
      </React.Fragment>
    );
  }
}

export default Builder;
