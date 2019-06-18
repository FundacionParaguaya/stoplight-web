import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../Header';
import defaultTheme from '../theme';
import Footer from '../Footer';

const withHeader = Component => {
  return withRouter(({ location, ...props }) => {
    return (
      <>
        <Header path={location.pathname} />
        <div style={{ marginTop: defaultTheme.shape.header }}>
          <Component {...props} />
        </div>
        <Footer />
      </>
    );
  });
};

export default withHeader;
