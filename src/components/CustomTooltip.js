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
 * @param {Function} format render-prop the payload and receive the wanted text to display
 */
const CustomTooltip = withStyles(tooltipStyles)(
  ({ format, active, payload, label, classes }) => {
    if (active) {
      return (
        <div className={classes.wrapper}>
          <p className={classes.label}>
            {format &&
              format(
                { ...payload[0], name: capitalize(payload[0].name) },
                label
              )}
            {!format && `${payload[0].name} ${payload[0].value}`}
          </p>
        </div>
      );
    }

    return null;
  }
);

export default CustomTooltip;
