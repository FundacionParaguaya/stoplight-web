import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import InfoView from './survey-builder/Info';

class Builder extends Component {
  render() {
    return (
      <React.Fragment>
        <Route path={`${this.props.match.path}/info`} component={InfoView} />
      </React.Fragment>
    );
  }
}

export default Builder;
