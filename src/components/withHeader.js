import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../Header';
import defaultTheme from '../theme';

const withHeader = Component => {
  return withRouter(props => {
    return (
      <>
        <Header path={props.location.match.path} />
        <div style={{ marginTop: defaultTheme.shape.header }}>
          <Component {...props} />
        </div>
      </>
    );
  });
};

export default withHeader;
