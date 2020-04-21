import React, { Component } from 'react';
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

export class Surveys extends Component {
  state = { surveys: [], loading: true };

  getSurveys(user) {
    getSurveysByUser(user || this.props.user)
      .then(response => {
        this.setState({
          surveys: response.data
        });
      })
      .finally(() =>
        this.setState({
          loading: false
        })
      );
  }

  componentDidMount() {
    // Clear current draft from store

    this.getSurveys();
  }

  showHubs() {
    return this.props.user.role === ROLES_NAMES.ROLE_ROOT;
  }

  showOrganizations() {
    return this.props.user.role === ROLES_NAMES.ROLE_HUB_ADMIN;
  }

  showAssignButton() {
    return (
      this.props.user.role === ROLES_NAMES.ROLE_ROOT ||
      this.props.user.role === ROLES_NAMES.ROLE_HUB_ADMIN
    );
  }

  render() {
    const {
      classes,
      i18n: { language },
      t
    } = this.props;
    const dateFormat = getDateFormatByLocale(language);

    return (
      <div className={classes.mainSurveyContainerBoss}>
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
            {this.state.loading && (
              <div className={classes.spinnerWrapper}>
                <CircularProgress size={50} thickness={2} />
              </div>
            )}
            <Grid container spacing={2}>
              {this.state.surveys.map(survey => {
                return (
                  <Grid item key={survey.id} xs={12} sm={12} md={4}>
                    <div className={classes.mainSurveyContainer}>
                      <div className={classes.surveyTitleContainer}>
                        <Typography
                          variant="h6"
                          className={classes.surveyTitle}
                        >
                          {survey.title}
                        </Typography>
                        {this.showAssignButton() && (
                          <IconButton
                            color="primary"
                            aria-label="Assign Survey to Hub"
                            component="span"
                            onClick={() => {
                              //TODO
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        )}
                      </div>
                      <div style={{ marginBottom: 7 }}>
                        {this.showHubs() &&
                          survey.applications.map(hub => {
                            return (
                              <Typography
                                key={hub.id}
                                variant="caption"
                                className={classes.tag}
                              >
                                {hub.name}
                              </Typography>
                            );
                          })}
                        {this.showOrganizations() &&
                          survey.organization.map(org => {
                            return (
                              <Typography
                                key={org.id}
                                variant="caption"
                                className={classes.tag}
                              >
                                {org.name}
                              </Typography>
                            );
                          })}
                      </div>

                      <Typography>
                        {t('views.survey.contains')}
                        {': '}
                        <span className={classes.subtitle}>
                          {survey.indicatorsCount}{' '}
                          {t('views.survey.indicators')}
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
  }
}

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
