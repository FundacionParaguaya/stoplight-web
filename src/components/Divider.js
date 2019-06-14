import React from 'react';

const Divider = ({ height }) => {
  return (
    <div
      style={{
        width: '100%',
        height: height ? `${height}rem` : '1rem'
      }}
    />
  );
};

export default Divider;
