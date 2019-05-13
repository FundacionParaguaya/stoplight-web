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
import { getSurveys } from '../api';
import Container from '../components/Container';
import chooseLifeMap from '../assets/choose_life_map.png';
import Header from '../Header';
import Footer from '../Footer';
import BottomSpacer from '../components/BottomSpacer';
import { getDateFormatByLocale } from '../utils/date-utils';

export class Surveys extends Component {
  state = { surveys: [], loading: true };

  getSurveys(user) {
    getSurveys(user || this.props.user)
      .then(response => {
        this.setState({
          surveys: response.data.data.surveysByUser
        });
      })
      .catch(error => {
        if (error.response.status === 401) {
          window.location.replace(
            `https://${this.props.user.env}.povertystoplight.org/login.html`
          );
        }
      })

      .finally(() =>
        this.setState({
          loading: false
        })
      );
  }

  getEconomicScreens(survey) {
    this.currentDimension = '';
    const questionsPerScreen = [];
    let totalScreens = 0;

    // go trough all questions and separate them by screen
    survey.surveyEconomicQuestions.forEach(question => {
      // if the dimention of the questions change, change the page
      if (question.topic !== this.currentDimension) {
        this.currentDimension = question.topic;
        totalScreens += 1;
      }

      // if there is object for n screen create one
      if (!questionsPerScreen[totalScreens - 1]) {
        questionsPerScreen[totalScreens - 1] = {
          forFamilyMember: [
            // DO NOT COMMIT!!!
            // {
            //   questionText: 'What is your highest educational level?',
            //   answerType: 'number',
            //   dimension: 'Education',
            //   codeName: 3,
            //   required: true,
            //   forFamilyMember: true
            // },
            // {
            //   questionText:
            //     'What is the property title situation of your household?',
            //   answerType: 'select',
            //   dimension: 'Education',
            //   required: false,
            //   codeName: 2,
            //   forFamilyMember: false,
            //   options: [
            //     { value: 'OWNER', text: 'Owner' },
            //     {
            //       value: 'COUNCIL-HOUSING-ASSOCIATION',
            //       text: 'Council/Housing Association'
            //     },
            //     { value: 'PRIVATE-RENTAL', text: 'Private rental' },
            //     { value: 'LIVING-WITH-PARENTS', text: 'Living with Parents' },
            //     { value: 'PREFER-NOT-TO-SAY', text: 'Prefer not to say' }
            //   ]
            // }
          ],
          forFamily: []
        };
      }

      if (question.forFamilyMember) {
        questionsPerScreen[totalScreens - 1].forFamilyMember.push(question);
      } else {
        questionsPerScreen[totalScreens - 1].forFamily.push(question);
      }
    });

    return {
      questionsPerScreen
    };
  }

  handleClickOnSurvey = survey => {
    const economicScreens = this.getEconomicScreens(survey);
    this.props.updateSurvey({ ...survey, economicScreens });
    this.props.history.push('/lifemap/terms');
  };

  componentDidMount() {
    // clear current draft from store
    this.props.updateDraft(null);
    this.props.updateSurvey(null);

    this.getSurveys();
  }

  render() {
    const {
      classes,
      i18n: { language },
      t
    } = this.props;
    const dateFormat = getDateFormatByLocale(language);

    return (
      <>
        <Header />
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
              <Grid container spacing={16}>
                {this.state.surveys.map(survey => {
                  return (
                    <Grid item key={survey.id} xs={12} sm={12} md={4}>
                      <div className={classes.mainSurveyContainer}>
                        <Typography
                          className={classes.surveyTitle}
                          onClick={() => this.handleClickOnSurvey(survey)}
                        >
                          {survey.title}
                        </Typography>
                        <Typography className={classes.paragraphSurvey}>
                          {survey.description.slice(0, 58)}
                          {survey.description.length > 58 && '...'}
                        </Typography>

                        <Typography className={classes.contains}>
                          {t('views.survey.contains')}
                          {': '}
                          <span style={{ color: '#1C212F' }}>
                            {survey.surveyStoplightQuestions.length} indicators
                          </span>
                        </Typography>

                        <Typography className={classes.createdOn}>
                          {t('views.survey.createdOn')}
                          {': '}
                          <span
                            style={{
                              color: '#1C212F'
                            }}
                          >
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
        <Footer />
      </>
    );
  }
}

const styles = theme => ({
  subtitle: {
    fontWeight: 400
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
    marginTop: `${theme.shape.header}`,
    backgroundColor: theme.palette.background.paper,
    minHeight: `calc(100vh - ${theme.shape.header} - ${theme.shape.footer})`
  },
  surveyTitle: {
    cursor: 'pointer',
    color: '#309E43!important',
    marginRight: 'auto',
    fontSize: '18px!important',
    marginBottom: '15px!important'
  },
  mainSurveyContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: 17,
    paddingRight: 65,
    height: '100%',

    '& $p': {
      fontSize: '14px',
      color: '#6A6A6A',
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
    )(withTranslation()(Surveys))
  )
);
