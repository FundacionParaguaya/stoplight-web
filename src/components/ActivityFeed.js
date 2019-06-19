import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { COLORS } from '../theme';

const ActivityFeed = ({ classes, history }) => {
  const handleClick = () => {
    // history.push()
    console.log('routed');
  };

  return (
    <div className={classes.container}>
      {data.map(({ name, mentor, date }, index) => (
        <div key={index} className={classes.children} onClick={handleClick}>
          <div className={classes.iconContainer}>
            <i className={`material-icons ${classes.primaryIcon}`}>
              swap_calls
            </i>
          </div>
          <div className={classes.content}>
            <Typography className={classes.title}>{name}</Typography>
            <Typography className={classes.subtitle}>{mentor}</Typography>
            <Typography className={classes.date}>{date}</Typography>
            <i className={`material-icons ${classes.arrowIcon}`}>
              keyboard_arrow_right
            </i>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = theme => ({
  container: {
    width: '40%',
    maxHeight: 200,
    overflowY: 'scroll'
  },
  children: {
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    '&:hover': {
      backgroundColor: theme.palette.background.paper
    }
  },
  iconContainer: {
    width: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryIcon: {
    color: COLORS.TEXT_GREY,
    transform: 'rotate3d(50%,0,0)'
  },
  content: {
    position: 'relative',
    paddingTop: 15,
    paddingBottom: 20,
    borderBottom: '1px solid #E6E4E2',
    width: 'calc(100% - 60px)',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: 14
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_GREY
  },
  date: {
    fontSize: 13,
    color: COLORS.TEXT_GREY,
    right: 25,
    lineHeight: '14px',
    position: 'absolute',
    bottom: 10
  },
  arrowIcon: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    color: COLORS.TEXT_GREY
  }
});

export default withStyles(styles)(withRouter(ActivityFeed));
