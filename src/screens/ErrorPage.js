import React from 'react';
import { getHomePage } from '../utils/role-utils';
import { Link, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { withTranslation } from 'react-i18next';

const styles = theme => ({
  container: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  textContainer: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: 120,
    fontWeight: 600,
    color: theme.palette.grey.main,
    height: 90
  },
  subtitle: {
    marginTop: 10,
    color: theme.palette.grey.middle
  },
  linkText: {
    fontWeight: 600,
    position: 'relative',
    marginTop: 20,
    textDecoration: 'none',
    fontSize: 16,
    color: theme.palette.primary.dark
  }
});

const ErrorPage = ({ user, classes, t }) => {
  return (
    <div className={classes.container}>
      <div className={classes.textContainer}>
        <Typography variant="h4" className={classes.title}>
          {'Oops!'}
        </Typography>
        <Typography variant="h5" className={classes.subtitle}>
          {`${t('views.error.subtitle')} `}
        </Typography>
        <Link to={'/' + getHomePage(user.role)} className={classes.linkText}>
          {`${t('views.error.toHomePage')} `}
        </Link>
      </div>
    </div>
  );
};

export default withRouter(withStyles(styles)(withTranslation()(ErrorPage)));
