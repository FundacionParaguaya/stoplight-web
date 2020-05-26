import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../Header';
import defaultTheme from '../theme';
import Footer from '../Footer';

const withHeader = Component => {
  return withRouter(({ location, ...props }) => {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Header path={location.pathname} />
        <div
          style={{
            marginTop: defaultTheme.shape.header,
            flexGrow: 1
          }}
        >
          <Component {...props} />
        </div>
        <Footer />
      </div>
    );
  });
};

export default withHeader;
