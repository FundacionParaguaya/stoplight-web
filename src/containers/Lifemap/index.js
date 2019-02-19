import React from 'react';
import { Route } from 'react-router-dom';
import Lifemap from './Lifemap';

const LifemapRouter = ({ match }) => (
  <>
    <Route exact path={`${match.path}/`} component={Lifemap} />
  </>
)

export default LifemapRouter;
