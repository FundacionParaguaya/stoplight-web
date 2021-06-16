import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import DotsImage from '../../assets/left_bar_dots.png';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    position: 'relative',
    height: 110
  },
  titleContainer: {
    marginBottom: theme.spacing(3)
  },
  bottomTitleContainer: {
    marginBottom: 0
  },
  interventionImage: {
    display: 'block',
    objectFit: 'contain',
    height: 100,
    transform: 'rotate(45deg)',
    marginRight: theme.spacing(1.5),
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  }
}));

const Header = ({ title, bottomTitle = false }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography
        variant="h5"
        className={
          bottomTitle ? classes.bottomTitleContainer : classes.titleContainer
        }
      >
        {title}
      </Typography>
      <img src={DotsImage} alt="Banner" className={classes.interventionImage} />
    </div>
  );
};

export default Header;
