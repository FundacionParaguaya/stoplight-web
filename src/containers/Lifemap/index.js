import React from "react";
import { Route } from "react-router-dom";
import Lifemap from "./Lifemap";

const LifemapRouter = ({ match }) => (
  <>
    <Route exact path={`${match.path}`} component={Lifemap} />
    <Route path={`${match.path}/:surveyId`} component={Lifemap} />
  </>
);

export default LifemapRouter;
