import React from 'react';
import { capitalize } from 'lodash';
import { withStyles } from '@material-ui/core';

const tooltipStyles = {
  wrapper: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: '0.9em',
    borderRadius: 3,
    margin: 0,
    padding: '7px 10px'
  },
  label: {
    margin: 0
  }
};

/**
 * @param {Object} payload Data passed by recharts for the tooltip
 * @param {Function} format Function formatting the payload
 */
const CustomTooltip = withStyles(tooltipStyles)(
  ({ format, active, payload, label, classes }) => {
    if (active) {
      return (
        <div className={classes.wrapper}>
          <p className={classes.label}>
            {format && format({ ...payload[0].payload, label })}
            {!format && `${payload[0].name} ${payload[0].value}`}
          </p>
        </div>
      );
    }

    return null;
  }
);

export default CustomTooltip;
