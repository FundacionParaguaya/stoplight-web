import React from 'react';

const Divider = ({ variant }) => {
  return (
    <div
      style={{
        width: '100%',
        height: variant ? `${variant}em` : '1em'
      }}
    />
  );
};

export default Divider;
