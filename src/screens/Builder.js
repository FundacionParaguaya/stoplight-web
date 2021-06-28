import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import InfoView from './survey-builder/Info';
import FamilyDetails from './survey-builder/FamilyDetails';
import Economics from './survey-builder/Economics';
import Summary from './survey-builder/Summary';

class Builder extends Component {
  render() {
    return (
      <React.Fragment>
        <Route path={`${this.props.match.path}/info`} component={InfoView} />

        <Route
          path={`${this.props.match.path}/details`}
          component={FamilyDetails}
        />

        <Route
          path={`${this.props.match.path}/economics`}
          component={Economics}
        />

        <Route path={`${this.props.match.path}/summary`} component={Summary} />
      </React.Fragment>
    );
  }
}

export default Builder;
