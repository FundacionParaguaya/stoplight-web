import React from "react";
import { Route } from "react-router-dom";
import Lifemap from "./Lifemap";

const LifemapRouter = ({ match }) => (
  <>
    {/* TODO: this first route is not used anymore */}
    <Route exact path={`${match.path}`} component={Lifemap} />
    <Route path={`${match.path}/:surveyId`} component={Lifemap} />
  </>
);

export default LifemapRouter;
