import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { relative } from 'path';
import chooseLifemapImage from '../assets/choose_lifemap_image.png';
import { updateUser, updateSurvey, updateDraft } from '../redux/actions';
import { getSurveys } from '../api';
import i18n from '../i18n';

export class Surveys extends Component {
  state = { surveys: [], loading: true };

  setupUser(token) {
    const user = {
      username: 'cannot get user name at this stage',
      token,
      env:
        document.referrer.split('.').length > 1
          ? document.referrer.split('.')[0].split('//')[1]
          : 'testing'
    };
    this.props.updateUser(user);
    this.getSurveys(user);
  }

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
    let currentDimension = '';
    const questionsPerScreen = [];
    let totalScreens = 0;

    // go trough all questions and separate them by screen
    survey.surveyEconomicQuestions.forEach(question => {
      // if the dimention of the questions change, change the page
      if (question.topic !== currentDimension) {
        currentDimension = question.topic;
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

    // check for user token from the location params,
    // else check if there is one in the store
    if (this.props.location.search.match(/sid=(.*)&/)) {
      // remove .replace later when the &lang=en} is changed to &lang=en
      const lng = this.props.location.search
        .match(/&lang=(.*)/)[1]
        .replace(/}/, '');

      localStorage.setItem('language', lng);
      i18n.changeLanguage(lng);
      const token = this.props.location.search.match(/sid=(.*)&/)[1];
      if (this.props.user && token !== this.props.user.token) {
        this.setupUser(token);
      } else {
        this.getSurveys();
      }
    } else {
      this.getSurveys();
    }
  }

  render() {
    const { classes, t } = this.props;
    return (
      <div className={classes.mainSurveyContainerBoss}>
        <Container>
          <div className={classes.titleContainer}>
            <div className={classes.surveyTopTitle}>
              <Typography variant="h4">Choose a life map</Typography>
              <Typography variant="h7">
                <span style={{ color: '#626262', fontSize: 20 }}>
                  Surveys > Choose a life map
                </span>
              </Typography>
              <div className={classes.ball1} />
              <div className={classes.ball2} />
              <div className={classes.ball3} />
              <div className={classes.ball4} />
              <div className={classes.ball5} />
              <div className={classes.ball6} />
              <img className={classes.imageLifemap} src={chooseLifemapImage} />
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
            <span className={classes.listSurveys}>
              {this.state.surveys.map(survey => {
                return (
                  <div key={survey.id} className={classes.mainSurveyContainer}>
                    <Typography
                      variant="h6"
                      align="center"
                      className={classes.surveyTitle}
                      onClick={() => this.handleClickOnSurvey(survey)}
                    >
                      {survey.title}
                    </Typography>
                    <Typography
                      className={classes.paragraphSurvey}
                      variant="h7"
                    >
                      Short description that can go over two lines...
                    </Typography>

                    <Typography className={classes.contains} variant="h7">
                      Contains:
                      <span style={{ color: '#1C212F' }}>
                        {survey.surveyStoplightQuestions.length} indicators
                      </span>
                    </Typography>

                    <Typography className={classes.createdOn} variant="h7">
                      Created on:{' '}
                      <span style={{ color: '#1C212F' }}>14 april , 2019</span>
                    </Typography>
                  </div>
                );
              })}
            </span>
          </div>
        </Container>
      </div>
    );
  }
}

const styles = {
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
    height: 220
  },
  mainSurveyContainerBoss: {
    backgroundColor: '#F3F4F6',
    minHeight: 'calc(95vh - 60px)'
  },
  surveyTitle: {
    cursor: 'pointer',
    color: '#309E43!important',
    marginRight: 'auto',
    fontSize: '18px!important',
    marginBottom: '12px!important'
  },
  mainSurveyContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: 17,
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
};

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
