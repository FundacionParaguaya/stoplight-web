import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { updateUser, updateSurvey, updateDraft } from '../redux/actions';
import { getSurveysByUser } from '../api';
import Container from '../components/Container';
import chooseLifeMap from '../assets/choose_life_map.png';
import BottomSpacer from '../components/BottomSpacer';
import { getDateFormatByLocale } from '../utils/date-utils';
import { ROLES_NAMES } from '../utils/role-utils';
import withLayout from '../components/withLayout';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import AssignModal from './surveys/AssignModal';

const Surveys = ({ classes, t, user, i18n: { language } }) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState({});

  const dateFormat = getDateFormatByLocale(language);

  const getSurveys = () => {
    getSurveysByUser(user)
      .then(response => {
        setSurveys(response.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getSurveys();
  }, []);

  const showHubs = () => {
    return user.role === ROLES_NAMES.ROLE_ROOT;
  };

  const showOrganizations = () => {
    return user.role === ROLES_NAMES.ROLE_HUB_ADMIN;
  };

  const showAssignButton = () => {
    return (
      user.role === ROLES_NAMES.ROLE_ROOT ||
      user.role === ROLES_NAMES.ROLE_HUB_ADMIN
    );
  };

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const updateSurveys = (surveyId, applications, organizations) => {
    let index = surveys.findIndex(survey => survey.id === surveyId);
    let newSurveys = surveys;
    if (index > -1) {
      newSurveys[index].applications = applications;
      newSurveys[index].organizations = organizations;
    }
    setSurveys(newSurveys);
  };

  return (
    <div className={classes.mainSurveyContainerBoss}>
      <AssignModal
        survey={selectedSurvey}
        open={openModal}
        toggleModal={toggleModal}
        updateSurveys={updateSurveys}
      />
      <Container>
        <div className={classes.titleContainer}>
          <div className={classes.surveyTopTitle}>
            <Typography variant="h4">
              {t('views.survey.chooseSurvey')}
            </Typography>
          </div>
          <img
            src={chooseLifeMap}
            alt="Choose Life Map"
            className={classes.chooseLifeMapImage}
          />
        </div>
        <div className={classes.listContainer}>
          {loading && (
            <div className={classes.spinnerWrapper}>
              <CircularProgress size={50} thickness={2} />
            </div>
          )}
          <Grid container spacing={2}>
            {surveys.map(survey => {
              return (
                <Grid item key={survey.id} xs={12} sm={12} md={4}>
                  <div className={classes.mainSurveyContainer}>
                    <div className={classes.surveyTitleContainer}>
                      <Typography variant="h6" className={classes.surveyTitle}>
                        {survey.title}
                      </Typography>
                      {showAssignButton() && (
                        <IconButton
                          color="primary"
                          aria-label="Assign Survey to Hub"
                          component="span"
                          onClick={() => {
                            setSelectedSurvey(survey);
                            setOpenModal(!openModal);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      )}
                    </div>
                    <div style={{ marginBottom: 7 }}>
                      {showHubs() &&
                        survey.applications.map(hub => {
                          return (
                            <Typography
                              key={hub.id ? hub.id : hub.value}
                              variant="caption"
                              className={classes.tag}
                            >
                              {hub.name ? hub.name : hub.label}
                            </Typography>
                          );
                        })}
                      {showOrganizations() &&
                        survey.organizations.map(org => {
                          return (
                            <Typography
                              key={org.id ? org.id : org.value}
                              variant="caption"
                              className={classes.tag}
                            >
                              {org.name ? org.name : org.label}
                            </Typography>
                          );
                        })}
                    </div>

                    <Typography>
                      {t('views.survey.contains')}
                      {': '}
                      <span className={classes.subtitle}>
                        {survey.indicatorsCount} {t('views.survey.indicators')}
                      </span>
                    </Typography>

                    <Typography className={classes.createdOn}>
                      {t('views.survey.createdOn')}
                      {': '}
                      <span className={classes.subtitle}>
                        {moment(survey.createdAt).format(dateFormat)}
                      </span>
                    </Typography>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </Container>
      <BottomSpacer />
    </div>
  );
};

const styles = theme => ({
  surveyTitle: {
    color: theme.palette.primary.dark,
    fontSize: '18px',
    marginRight: 'auto',
    marginBottom: 7,
    fontWeight: theme.typography.fontWeightMedium
  },
  surveyTitleContainer: {
    height: '75%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: theme.palette.grey.quarter,
    '&:hover': {
      borderBottomColor: theme.palette.primary.dark
    }
  },
  subtitle: {
    color: theme.palette.text.primary
  },
  tag: {
    backgroundColor: theme.palette.grey.quarter,
    color: theme.palette.grey.main,
    padding: 3,
    marginBottom: 8,
    marginRight: 8
  },

  chooseLifeMapImage: {
    display: 'block',
    height: 240,
    right: 30,
    position: 'absolute',
    top: 20
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative'
  },
  surveyTopTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 220,
    zIndex: 1
  },
  mainSurveyContainerBoss: {
    backgroundColor: theme.palette.background.paper
  },

  mainSurveyContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 10,
    paddingRight: 5,
    paddingLeft: 17,
    paddingBottom: 17,
    height: '100%',

    '& $p': {
      fontSize: '14px',
      color: theme.palette.grey.middle,
      marginBottom: 7
    },
    '& $p:last-child': {
      marginBottom: 0
    }
  },
  spinnerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    height: 500,
    alignItems: 'center'
  },
  button: {
    marginBottom: 20
  },
  listContainer: {
    position: 'relative'
  }
});

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateUser, updateSurvey, updateDraft };

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(withLayout(Surveys)))
  )
);
