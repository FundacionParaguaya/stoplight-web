import React from 'react';
import { withStyles } from '@material-ui/styles';
import { PIE, BAR } from '../utils/types';
import IndicatorsFilter from './summary/IndicatorsFilter';

const Controllers = ({
  type,
  setIndicatorsType,
  classes,
  sorting,
  sortingBy,
  onSortingChanged
}) => {
  return (
    <div className={classes.iconsContainer}>
      <div className={classes.typesSelectorContainer}>
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
      {sorting && (
        <div className={classes.indicatorsFilterContainer}>
          <IndicatorsFilter
            sorting={sorting}
            sortingBy={sortingBy}
            onSortingChanged={onSortingChanged}
          />
        </div>
      )}
    </div>
  );
};

const styles = theme => ({
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
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  typesSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 32
    }
  },
  iconActive: {
    color: '#626262'
  },
  indicatorsFilterContainer: {
    width: '40%',
    marginLeft: 10,
    maxWidth: '250px',
    [theme.breakpoints.down('xs')]: {
      width: '60%',
      marginTop: 10
    }
  }
});

export default withStyles(styles)(Controllers);
