import React from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from 'react-redux'
import Lifemap from "./Lifemap";

const LifemapRouter = ({ match }) => (
  <>
    <Switch>
      <Route exact path={`${match.path}`} component={Lifemap} />
      <Route path={`${match.path}/terms`} render={() => <h1>test</h1>} />
    </Switch>
  </>
);

export default connect(null, {})(LifemapRouter);
