import React from 'react';

const useWindowSize = () => {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = React.useState(getSize);

  React.useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
};

// eslint-disable-next-line import/prefer-default-export
export { useWindowSize };
