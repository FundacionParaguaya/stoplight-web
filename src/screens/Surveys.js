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
        <div className={classes.list}>
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
                  <Typography className={classes.paragraphSurvey} variant="h7">
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
      </div>
    );
  }
}

const styles = {
  ball1: {
    position: 'absolute',
    borderRadius: '50%',
    backgroundColor: '#50AA47',
    height: 58,
    width: 58,
    zIndex: 1,
    top: 150,
    right: 340
  },
  ball2: {
    position: 'absolute',
    borderRadius: '50%',
    backgroundColor: '#E1504D',
    height: 30,
    width: 30,
    zIndex: 2,
    top: 120,
    right: 280
  },
  ball3: {
    position: 'absolute',
    backgroundColor: '#F0CB17',
    borderRadius: '50%',
    height: 40,
    width: 40,
    zIndex: 1,
    top: -10,
    right: 280
  },
  ball4: {
    position: 'absolute',
    borderRadius: '50%',
    backgroundColor: '#50AA47',
    height: 20,
    width: 20,
    zIndex: 2,
    top: 58,
    right: 70
  },
  ball5: {
    position: 'absolute',
    backgroundColor: '#F0CB17',
    borderRadius: '50%',
    height: 64,
    width: 64,
    zIndex: 1,
    top: 98,
    right: 0
  },
  ball6: {
    position: 'absolute',
    backgroundColor: '#E1504D',
    borderRadius: '50%',
    height: 12,
    width: 12,
    zIndex: 1,
    top: 18,
    right: 10
  },
  imageLifemap: {
    position: 'absolute',
    right: 70,
    height: 230,
    width: 230,
    zIndex: 1,
    top: -13
  },
  surveyTopTitle: {
    position: 'relative',
    maxWidth: 1300,
    margin: '0 40px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '170px'
  },
  contains: {
    color: '#626262',
    marginBottom: 5
  },
  createdOn: {
    color: '#626262',
    marginBottom: 5
  },
  mainSurveyContainerBoss: {
    minHeight: '86vh',
    backgroundColor: '#F3F4F6'
  },
  paragraphSurvey: {
    color: '#626262',
    marginTop: 10,
    marginBottom: 10
  },
  surveyTitle: {
    cursor: 'pointer',
    color: '#309E43',
    marginRight: 'auto'
  },
  mainSurveyContainer: {
    zIndex: 2,
    padding: '19px 14px',
    backgroundColor: '#fff',
    margin: '10px 10px',
    width: 306,
    height: 167,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  spinnerWrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
  listSurveys: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: 1000,
    justifyContent: 'center'
  },
  list: {
    display: 'flex',
    margin: 'auto',
    justifyContent: 'center'
  },
  button: {
    marginBottom: 20
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
