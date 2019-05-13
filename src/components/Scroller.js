import React, { useState, useContext } from 'react';
import { Spring } from 'react-spring/renderprops';
import { withRouter } from 'react-router-dom';

const ScrollerContext = React.createContext(false);
export const ScrollerProvider = props => {
  const [forceRerender, setForceRerender] = useState(false);
  return (
    <ScrollerContext.Provider value={{ forceRerender, setForceRerender }}>
      {props.children}
    </ScrollerContext.Provider>
  );
};

const Scroller = () => {
  let initial = window.scrollY;
  if (initial > window.innerHeight) {
    initial = window.innerHeight;
  }
  useContext(ScrollerContext);
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

export const withScroller = WrappedComponent => props => {
  const { setForceRerender } = useContext(ScrollerContext);
  return (
    <WrappedComponent
      scrollToTop={() => setForceRerender(prevState => !prevState)}
      {...props}
    />
  );
};
