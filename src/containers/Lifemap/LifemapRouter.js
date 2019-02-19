import React from 'react';
import { Route } from 'react-router-dom';
import Lifemap from './index';

const LifemapRouter = ({ match }) => (
  <div>
    <Route exact path={`${match.path}/`} component={Lifemap} />
  </div>
)

export default LifemapRouter;
