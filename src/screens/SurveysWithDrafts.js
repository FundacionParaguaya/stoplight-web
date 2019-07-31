import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation, useTranslation } from 'react-i18next';
import { Grid, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { capitalize } from 'lodash';
import { updateUser, updateSurvey, updateDraft } from '../redux/actions';
import { getSurveys, getEconomicOverview } from '../api';
import Container from '../components/Container';
import chooseLifeMap from '../assets/choose_life_map.png';
import BottomSpacer from '../components/BottomSpacer';
import { CONDITION_TYPES } from '../utils/conditional-logic';
import withLayout from '../components/withLayout';
import FamiliesOverviewBlock from '../components/FamiliesOverviewBlock';
import SnapshotsTable from '../components/SnapshotsTable';
import { useWindowSize } from '../utils/hooks-helpers';

const useSurveysListStyle = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    width: '100%'
  },
  listStyle: {
    overflow: 'auto',
    paddingTop: 0,
    paddingBottom: 0,
    WebkitAppearance: 'none'
    // width: 7
  },
  listItemStyle: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing()
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  itemLeftContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%'
  },
  surveyTitle: {
    color: '#309E43',
    fontSize: '18px',
    fontWeight: theme.typography.fontWeightMedium
  },
  containsStyle: {
    color: '#909090',
    fontSize: '12px',
    fontWeight: theme.typography.fontWeightMedium,
    marginTop: theme.spacing() / 2
  },
  spanStyle: {
    color: '#6A6A6A'
  },
  buttonStyle: {
    width: '40%',
    height: 'unset',
    minHeight: '38px'
  }
}));

const SurveysList = ({ surveys, heightRef, handleSurveyClick }) => {
  const classes = useSurveysListStyle();
  const { t } = useTranslation();
  const [height, setHeight] = React.useState('unset');
  const windowSize = useWindowSize();
  React.useLayoutEffect(() => {
    setHeight((heightRef.current && heightRef.current.clientHeight) || 'unset');
  }, [heightRef, windowSize]);
  return (
    <div className={classes.mainContainer} style={{ maxHeight: height }}>
      <Typography variant="h5">{t('views.survey.surveys')}</Typography>
      <List dense className={classes.listStyle}>
        {surveys.map((survey, index) => (
          <React.Fragment key={survey.id}>
            <ListItem className={classes.listItemStyle}>
              <div className={classes.itemContainer}>
                <div className={classes.itemLeftContainer}>
                  <Typography variant="h6" className={classes.surveyTitle}>
                    {survey.title}
                  </Typography>
                  <Typography variant="h6" className={classes.containsStyle}>
                    {t('views.survey.contains')}
                    {': '}
                    <span className={classes.spanStyle}>
                      {`${survey.surveyStoplightQuestions.length} ${t(
                        'views.survey.indicators'
                      )}`}
                    </span>
                  </Typography>
                </div>
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.buttonStyle}
                  onClick={() => handleSurveyClick(survey)}
                >
                  {t('views.survey.createSurvey')}
                </Button>
              </div>
            </ListItem>
            {index !== surveys.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

class Surveys extends Component {
  state = { surveys: [], familiesOverview: [], loading: true };

  constructor(props) {
    super(props);
    this.heightSurveysRef = React.createRef();
  }

  getSurveys(user) {
    Promise.all([
      getSurveys(user || this.props.user),
      getEconomicOverview(user || this.props.user)
    ])
      .then(response => {
        this.setState({
          surveys: response[0].data.data.surveysByUser,
          familiesOverview: response[1].data.data.economicOverview
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

  static getConditionalQuestions = survey => {
    const surveyEconomicQuestions = survey.surveyEconomicQuestions || [];
    const conditionalQuestions = [];
    surveyEconomicQuestions.forEach(eq => {
      if (
        (eq.conditions && eq.conditions.length > 0) ||
        (eq.conditionGroups && eq.conditionGroups.length > 0)
      ) {
        conditionalQuestions.push(eq);
      } else {
        // Checking conditional options only if needed
        const options = eq.options || [];
        for (const option of options) {
          if (option.conditions && option.conditions.length > 0) {
            conditionalQuestions.push(eq);
            return;
          }
        }
      }
    });
    return conditionalQuestions;
  };

  static getElementsWithConditionsOnThem = conditionalQuestions => {
    const questionsWithConditionsOnThem = [];
    const memberKeysWithConditionsOnThem = [];

    const addTargetIfApplies = condition => {
      // Addind this so it works after changing the key to scope
      const scope = condition.scope || condition.type;
      if (
        scope !== CONDITION_TYPES.FAMILY &&
        !questionsWithConditionsOnThem.includes(condition.codeName)
      ) {
        questionsWithConditionsOnThem.push(condition.codeName);
      }
      if (
        scope === CONDITION_TYPES.FAMILY &&
        !memberKeysWithConditionsOnThem.includes(condition.codeName)
      ) {
        memberKeysWithConditionsOnThem.push(condition.codeName);
      }
    };

    conditionalQuestions.forEach(conditionalQuestion => {
      let conditions = [];
      const { conditionGroups } = conditionalQuestion;
      if (conditionGroups && conditionGroups.length > 0) {
        conditionGroups.forEach(conditionGroup => {
          conditions = [...conditions, ...conditionGroup.conditions];
        });
      } else {
        ({ conditions = [] } = conditionalQuestion);
      }

      conditions.forEach(addTargetIfApplies);

      // Checking conditional options only if needed
      const options = conditionalQuestion.options || [];
      options.forEach(option => {
        const { conditions: optionConditions = [] } = option;
        optionConditions.forEach(addTargetIfApplies);
      });
    });
    return { questionsWithConditionsOnThem, memberKeysWithConditionsOnThem };
  };

  handleClickOnSurvey = survey => {
    const economicScreens = this.getEconomicScreens(survey);
    const conditionalQuestions = Surveys.getConditionalQuestions(survey);
    const elementsWithConditionsOnThem = Surveys.getElementsWithConditionsOnThem(
      conditionalQuestions
    );
    this.props.updateSurvey({
      ...survey,
      economicScreens,
      conditionalQuestions,
      elementsWithConditionsOnThem
    });
    this.props.history.push('/lifemap/terms');
  };

  handleClickOnSnapshot = snapshot => {
    const survey = this.state.surveys.find(s => s.id === snapshot.surveyId);
    const economicScreens = this.getEconomicScreens(survey);
    const conditionalQuestions = Surveys.getConditionalQuestions(survey);
    const elementsWithConditionsOnThem = Surveys.getElementsWithConditionsOnThem(
      conditionalQuestions
    );
    const draft = { ...snapshot };
    const { lifemapNavHistory } = snapshot;
    delete draft.status;
    this.props.updateDraft(draft);
    this.props.updateSurvey({
      ...survey,
      economicScreens,
      conditionalQuestions,
      elementsWithConditionsOnThem
    });

    if (lifemapNavHistory && lifemapNavHistory.length > 0) {
      lifemapNavHistory.forEach(lnh =>
        this.props.history.push({
          pathname: lnh.url,
          state: lnh.state
        })
      );
    } else {
      this.props.history.push('/lifemap/terms');
    }
  };

  componentDidMount() {
    // Clear current draft from store
    this.props.updateDraft(null);
    this.props.updateSurvey(null);
    this.getSurveys();
  }

  render() {
    const { classes, t } = this.props;

    return (
      <div className={classes.mainSurveyContainerBoss}>
        <Container variant="stretch">
          <div className={classes.titleContainer}>
            <div className={classes.surveyTopTitle}>
              <Typography variant="h4">
                {`${t('views.survey.welcome')} ${capitalize(
                  this.props.user.username
                )}`}
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
                <CircularProgress />
              </div>
            )}
            {!this.state.loading && (
              <Grid container spacing={3}>
                <Grid item sm={4} xs={12}>
                  <FamiliesOverviewBlock
                    familiesOverview={this.state.familiesOverview}
                    innerRef={this.heightSurveysRef}
                  />
                </Grid>
                <Grid item sm={8} xs={12}>
                  <SurveysList
                    surveys={this.state.surveys}
                    heightRef={this.heightSurveysRef}
                    handleSurveyClick={this.handleClickOnSurvey}
                  />
                </Grid>
              </Grid>
            )}
          </div>

          <div className={classes.snapshotsContainer}>
            {!this.state.loading && (
              <SnapshotsTable
                handleClickOnSnapshot={this.handleClickOnSnapshot}
              />
            )}
          </div>
        </Container>
        <BottomSpacer />
      </div>
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
    backgroundColor: theme.palette.background.paper,
    minHeight: 'calc(100vh - 110px)'
  },
  spinnerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    height: 500,
    alignItems: 'center'
  },
  listContainer: {
    position: 'relative'
  },
  snapshotsContainer: {
    marginTop: theme.spacing(4)
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
