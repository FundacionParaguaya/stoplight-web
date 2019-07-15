import React from 'react';
import { withStyles } from '@material-ui/styles';
import { PIE, BAR } from '../utils/types';

const Controllers = ({ type, setIndicatorsType, classes }) => {
  return (
    <div className={classes.iconsContainer}>
      <i
        className={`material-icons ${
          type === PIE ? classes.iconActive : null
        } ${classes.icon}`}
        onClick={() => setIndicatorsType(PIE)}
      >
        trip_origin
      </i>
      <i
        className={`material-icons ${
          type === BAR ? classes.iconActive : null
        } ${classes.icon}`}
        onClick={() => setIndicatorsType(BAR)}
      >
        view_headline
      </i>
    </div>
  );
};

const styles = {
  icon: {
    color: '#E5E4E2',
    cursor: 'pointer',
    fontSize: 36,
    paddingLeft: 10,
    '&:nth-child(1)': {
      borderRight: '2px solid #E5E4E2',
      paddingRight: 10,
      paddingLeft: 0
    }
  },
  iconsContainer: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  iconActive: {
    color: '#626262'
  }
};

export default withStyles(styles)(Controllers);
