import React from 'react';
import Header from '../Header';
import defaultTheme from '../theme';

const withHeader = Component => {
  return props => {
    return (
      <>
        <Header />
        <div style={{ marginTop: defaultTheme.shape.header }}>
          <Component {...props} />
        </div>
      </>
    );
  };
};

export default withHeader;
