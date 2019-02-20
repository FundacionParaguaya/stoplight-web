import React from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import Lifemap from "./Lifemap";

const LifemapRouter = ({ match }) => (
  <>
    <Route exact path={`${match.path}`} component={Lifemap} />
    <Route path={`${match.path}/:surveyId`} component={Lifemap} />
  </>
);

export default connect(
  null,
  {}
)(LifemapRouter);
