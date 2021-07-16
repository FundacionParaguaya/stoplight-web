import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import Arrow from '@material-ui/icons/ArrowForward';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    width: '100%',
    minHeight: 50,
    backgroundColor: theme.palette.background.default,
    padding: '0 4%',
    boxShadow: '0px 4px 5px rgba(209, 209, 209, 0.25)',
    position: 'relative',
    zIndex: 10
  },
  sectionContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    color: '#BDBDBD',
    fontSize: 20,
    margin: '0 16px'
  },
  option: {
    height: '100%',
    paddingTop: theme.spacing(1.5),
    fontWeight: 400,
    fontSize: 16,
    textDecoration: 'none'
  },
  availableOption: {
    color: theme.palette.text.primary
  },
  currentOption: {
    color: theme.palette.primary.dark,
    borderBottom: `2px solid ${theme.palette.primary.dark}`
  },
  unAvailableOption: {
    color: theme.palette.text.light
  }
}));

const ProgressBar = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const [currentPageIndex, setCurrentPageIndex] = useState();

  const sections = [
    {
      path: '/survey-builder/info',
      label: t('views.surveyBuilder.infoScreen.surveysInfo')
    },
    {
      path: '/survey-builder/details',
      label: t('views.familyProfile.familyDetails')
    },
    {
      path: '/survey-builder/economics',
      label: t('views.surveyBuilder.economic.socioeconomic')
    },
    {
      path: '/survey-builder/stoplights',
      label: t('views.surveyBuilder.stoplight.section')
    },
    {
      path: '/survey-builder/summary',
      label: t('views.surveyBuilder.final.confirm')
    }
  ];

  useEffect(() => {
    let index = sections.findIndex(s => s.path === history.location.pathname);
    setCurrentPageIndex(index);
  }, []);

  return (
    <div className={classes.container}>
      {sections.map(({ path, label }, index) => (
        <div key={path} className={classes.sectionContainer}>
          {index > 0 && <Arrow className={classes.icon} />}
          {currentPageIndex > index && (
            <Link
              to={{ pathname: path }}
              className={clsx(classes.option, classes.availableOption)}
            >
              {label}
            </Link>
          )}
          {currentPageIndex === index && (
            <Typography
              variant="h6"
              className={clsx(classes.option, classes.currentOption)}
            >
              {label}
            </Typography>
          )}
          {currentPageIndex < index && (
            <Typography
              variant="h6"
              className={clsx(classes.option, classes.unAvailableOption)}
            >
              {label}
            </Typography>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
