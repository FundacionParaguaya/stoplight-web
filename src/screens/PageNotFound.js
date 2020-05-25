import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import interrogation from '../assets/interrogation.png';
import { useTranslation } from 'react-i18next';
import { ROLES_NAMES } from '../utils/role-utils';

const pageNotFoundStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    height: '100vh',
    width: '90vw',
    margin: 'auto',
    paddingTop: '3rem',
    paddingBottom: '3rem',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    display: 'flex',
    marginRight: '3rem'
  },
  img: {
    maxWidth: '80%',
    maxHeight: '80vh',
    margin: 'auto'
  },
  textContainer: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    padding: 20
  },
  text: {
    color: theme.palette.grey.middle
  },
  codeText: {
    fontSize: 120,
    fontWeight: 600,
    color: theme.palette.grey.main,
    height: 90
  },
  linkText: {
    fontWeight: 600,
    position: 'relative',
    marginTop: 20,
    textDecoration: 'none',
    fontSize: 16,
    color: theme.palette.primary.dark
  }
}));

const PageNotFound = ({ user }) => {
  const { t } = useTranslation();

  const classes = pageNotFoundStyles();

  const redirectionPath = ({ role }) => {
    if (role === ROLES_NAMES.ROLE_SURVEY_TAKER) {
      return 'surveys';
    } else return 'dashboard';
  };

  return (
    <div className={classes.container}>
      <div className={classes.imageContainer}>
        <img src={interrogation} alt="interrogation" className={classes.img} />
      </div>
      <div className={classes.textContainer}>
        <Typography variant="h4" className={classes.codeText}>
          {'404'}
        </Typography>
        <Typography variant="h5" className={classes.text}>
          {t('views.404.missing')}
        </Typography>
        <Typography variant="h6" className={classes.text}>
          {t('views.404.pageNotFound')}
        </Typography>
        <Link to={redirectionPath(user)} className={classes.linkText}>
          {`${t('views.404.toHomePage')} >`}
        </Link>
      </div>
    </div>
  );
};
export default withStyles(pageNotFoundStyles)(PageNotFound);
