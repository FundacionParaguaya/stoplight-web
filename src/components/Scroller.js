import React from 'react';
import { Spring } from 'react-spring/renderprops';
import { withRouter } from 'react-router-dom';

const Scroller = () => {
  let initial = window.scrollY;
  if (initial > window.innerHeight) {
    initial = window.innerHeight;
  }
  return (
    <div>
      <Spring
        config={{ duration: 300 }}
        from={{ number: 0, startedWith: initial }}
        to={{ number: initial }}
        delay={0}
        reset
      >
        {springProps => (
          <div>
            {window.scrollTo(0, springProps.startedWith - springProps.number)}
            <React.Fragment />
          </div>
        )}
      </Spring>
    </div>
  );
};

export default withRouter(Scroller);
