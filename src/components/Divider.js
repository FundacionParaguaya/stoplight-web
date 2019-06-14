import React from 'react';

const Divider = ({ height }) => {
  return (
    <div
      style={{
        width: '100%',
        height: height ? `${height}em` : '1em'
      }}
    />
  );
};

export default Divider;
