import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import { Typography, Grid } from '@material-ui/core';
import TitleBar from '../../components/TitleBar';
import { updateDraft } from '../../redux/actions';
import Container from '../../components/Container';
import BottomSpacer from '../../components/BottomSpacer';
import { COLORS } from '../../theme';

const questionsWrapperStyles = {
  questionContainer: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20
  },
  questionImage: {
    objectFit: 'cover',
    height: '100%',
    width: '100%',
    display: 'block'
  },
  answeredQuestion: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '-36px',
    left: '50%',
    transform: 'translate(-50%,0)',
    zIndex: -1
  },
  questionDescription: {
    position: 'relative',
    zIndex: 22,
    margin: 0,
    textAlign: 'center',
    color: 'white',
    padding: '30px 20px',
    height: '100%'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  innerContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  answeredIcon: {
    color: 'white',
    paddingTop: '3px',
    fontSize: 39,
    height: 70,
    width: 70,
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  imageContainer: {
    height: 240
  },
  circularProgress: {
    color: 'white'
  }
};

let QuestionsWrapper = ({
  question,
  answeredValue,
  classes,
  submitQuestion,
  handleImageLoaded,
  imageStatus
}) => {
  const [showIcon, setShowIcon] = useState(0);
  let sortedQuestions;

  if (question) {
    sortedQuestions = question.stoplightColors;
    sortedQuestions.sort((a, b) => {
      return b.value - a.value;
    });
  }

  return (
    <Grid container spacing={16}>
      {question &&
        sortedQuestions.map(e => {
          let color;
          let textColor = 'white';
          if (e.value === 3) {
            color = COLORS.GREEN;
          } else if (e.value === 2) {
            color = COLORS.YELLOW;
            textColor = 'black';
          } else if (e.value === 1) {
            color = COLORS.RED;
          }

          return (
            <Grid
              item
              key={e.value}
              onClick={() => submitQuestion(e.value)}
              className={classes.questionContainer}
              md={4}
              onMouseEnter={() => setShowIcon(e.value)}
              onMouseLeave={() => setShowIcon(0)}
            >
              <div
                style={{
                  borderTop: `5px solid ${color}`,
                  borderRadius: 2,
                  backgroundColor: color
                }}
                className={classes.innerContainer}
              >
                <React.Fragment>
                  {imageStatus < sortedQuestions.length && (
                    <div className={classes.imageContainer}>
                      <div className={classes.loadingContainer}>
                        {' '}
                        <CircularProgress
                          color="inherit"
                          className={classes.circularProgress}
                        />
                      </div>
                      <img
                        onLoad={handleImageLoaded}
                        src={e.url}
                        alt="surveyImg"
                        style={{ display: 'none', height: 0 }}
                      />
                    </div>
                  )}
                  {imageStatus === sortedQuestions.length && (
                    <div className={classes.imageContainer}>
                      <img
                        className={classes.questionImage}
                        src={e.url}
                        alt="surveyImg"
                      />
                    </div>
                  )}
                </React.Fragment>

                <div
                  style={{ backgroundColor: color }}
                  className={classes.questionDescription}
                >
                  {(answeredValue === e.value || showIcon === e.value) && (
                    <div className={classes.answeredQuestion}>
                      <i
                        style={{ backgroundColor: color }}
                        className={`material-icons ${classes.answeredIcon}`}
                      >
                        done
                      </i>
                    </div>
                  )}
                  <Typography style={{ color: textColor }}>
                    {e.description}
                  </Typography>
                </div>
              </div>
            </Grid>
          );
        })}
    </Grid>
  );
};

QuestionsWrapper = withStyles(questionsWrapperStyles)(QuestionsWrapper);
export class StoplightQuestions extends Component {
  state = {
    imageStatus: null,
    question: this.props.currentSurvey.surveyStoplightQuestions[
      this.props.match.params.page
    ]
  };

  handleContinue = () => {
    const currentQuestionPage = this.props.match.params.page;
    const { currentDraft } = this.props;
    let goToSkipped = false;
    currentDraft.indicatorSurveyDataList.forEach(ele => {
      if (ele.value === 0) {
        goToSkipped = true;
      }
    });
    if (this.props.location.state) {
      if (this.props.location.state.overviewReturn) {
        this.props.history.push('/lifemap/overview');
      } else if (this.props.location.state.skippedReturn) {
        if (goToSkipped) {
          this.props.history.push('/lifemap/skipped-questions');
        } else {
          this.props.history.push('/lifemap/overview');
        }
      }
    } else if (
      currentQuestionPage <
      this.props.currentSurvey.surveyStoplightQuestions.length - 1
    ) {
      this.props.history.push(
        `/lifemap/stoplight/${parseInt(currentQuestionPage, 10) + 1}`
      );
    } else if (goToSkipped) {
      this.props.history.push('/lifemap/skipped-questions');
    } else if (!goToSkipped) {
      this.props.history.push('/lifemap/overview');
    }
  };

  submitQuestion(value) {
    const { codeName } = this.state.question;
    const { currentDraft } = this.props;
    const dataList = this.props.currentDraft.indicatorSurveyDataList;
    let update = false;
    // ////////////// CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST and if it is the set update to true and edit the answer
    dataList.forEach(e => {
      if (e.key === codeName) {
        update = true;
        e.value = value;
      }
    });
    // /////////if the question is in the data list then update the question
    if (update) {
      const indicatorSurveyDataList = dataList;
      this.props.updateDraft({
        ...currentDraft,
        indicatorSurveyDataList
      });
      this.handleContinue();
    } else {
      // ////////// add the question to the data list if it doesnt exist
      this.props.updateDraft({
        ...currentDraft,
        indicatorSurveyDataList: [
          ...currentDraft.indicatorSurveyDataList,
          {
            key: codeName,
            value
          }
        ]
      });
      this.handleContinue();
    }
  }

  setCurrentScreen() {
    this.setState({
      imageStatus: 0,
      question: this.props.currentSurvey.surveyStoplightQuestions[
        this.props.match.params.page
      ]
    });
  }

  handleImageLoaded = () => {
    this.setState(prevState => ({
      imageStatus: prevState.imageStatus + 1
    }));
  };

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.page !== this.props.match.params.page) {
      this.setCurrentScreen();
    }
  }

  render() {
    const { question } = this.state;
    const { classes, t, currentDraft } = this.props;
    let answered = false;
    let answeredValue = null;
    let sortedQuestions;
    if (question) {
      sortedQuestions = question.stoplightColors;
      const compare = (a, b) => {
        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;
        return 0;
      };
      sortedQuestions.sort(compare);
    }
    return (
      <div>
        <TitleBar
          title={question && question.questionText}
          extraTitleText={question && question.dimension}
          progressBar
        />

        <Container className={classes.mainQuestionsAndBottomContainer}>
          <div className={classes.mainQuestionsContainer}>
            {question !== null &&
              currentDraft.indicatorSurveyDataList.forEach(ele => {
                if (question.codeName === ele.key) {
                  answered = true;
                  answeredValue = ele.value;
                }
              })}
            {answered ? (
              <QuestionsWrapper
                question={question}
                answeredValue={answeredValue}
                submitQuestion={e => this.submitQuestion(e)}
                handleImageLoaded={this.handleImageLoaded}
                imageStatus={this.state.imageStatus}
              />
            ) : (
              <QuestionsWrapper
                question={question}
                submitQuestion={e => this.submitQuestion(e)}
                handleImageLoaded={this.handleImageLoaded}
                imageStatus={this.state.imageStatus}
              />
            )}
          </div>
          <div className={classes.bottomContainer}>
            {/* "i" icon temporarily hidden since we still don't have all the content for the surveys */}
            {/* <i
              style={{ color: 'green', cursor: 'pointer' }}
              className="material-icons"
            >
              info
            </i> */}
            {question && !question.required && (
              <span>
                <Button
                  style={{ textDecoration: 'none', padding: 0 }}
                  onClick={() => this.submitQuestion(0)}
                >
                  {t('views.lifemap.skipThisQuestion')}
                </Button>
              </span>
            )}
          </div>
        </Container>
        <BottomSpacer />
      </div>
    );
  }
}

const styles = {
  mainQuestionsAndBottomContainer: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  skipButton: {
    cursor: 'pointer'
  },
  questionTextTitle: {
    textAlign: 'center',
    margin: '4px 0 10px 0',
    color: '#444'
  },
  questionDimension: {
    fontSize: 24,
    textAlign: 'center',
    color: 'grey',
    margin: 0,
    marginTop: 10
  },
  mainQuestionsContainer: {
    margin: 'auto',
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20
  }
};

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});

const mapDispatchToProps = { updateDraft };

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(StoplightQuestions))
);
