import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

export default class Footer extends Component {
  render() {
    return (
      <div
        style={{
          height: '40px',
          padding: '10px'
        }}
      >
        <Typography variant="h7">
          {' '}
          ©Copyright 2019 - Spotlight Desktop
        </Typography>
      </div>
    );
  }
}
