import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import TitleBar from '../../components/TitleBar';
import { updateDraft } from '../../redux/actions';

export class StoplightQuestions extends Component {
  state = {
    imageStatus: 'loading',
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

  skipQuestion = () => {
    const { codeName } = this.state.question;
    const { currentDraft } = this.props;
    const dataList = this.props.currentDraft.indicatorSurveyDataList;
    let update = false;
    // ////////////// CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST AND UPDATE my dataList
    dataList.forEach(e => {
      if (e.key === codeName) {
        update = true;
        e.value = 0;
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
            value: 0
          }
        ]
      });
      this.handleContinue();
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
      imageStatus: 'loading',
      question: this.props.currentSurvey.surveyStoplightQuestions[
        this.props.match.params.page
      ]
    });
  }

  handleImageLoaded = () => {
    this.setState({ imageStatus: 'loaded' });
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
          title={question && question.dimension}
          extraTitleText={question && question.questionText}
        />

        <div className={classes.mainQuestionsAndBottomContainer}>
          <div className={classes.mainQuestionsContainer}>
            {question !== null
              ? currentDraft.indicatorSurveyDataList.forEach(ele => {
                  if (question.codeName === ele.key) {
                    answered = true;
                    answeredValue = ele.value;
                  }
                })
              : null}
            {answered ? (
              <React.Fragment>
                {question !== null
                  ? sortedQuestions.map(e => {
                      let color;
                      let displayTick = 'none';
                      let textColor = 'white';
                      if (e.value === 3) {
                        color = '#89bd76';
                      } else if (e.value === 2) {
                        color = '#f0cb17';
                        textColor = 'black';
                      } else if (e.value === 1) {
                        color = '#e1504d';
                      }
                      if (e.value === answeredValue) {
                        displayTick = 'flex';
                      }

                      return (
                        <div
                          key={e.value}
                          onClick={() => this.submitQuestion(e.value)}
                          className={classes.questionContainer}
                        >
                          {this.state.imageStatus === 'loading' ? (
                            <React.Fragment>
                              <div>
                                {' '}
                                <CircularProgress />
                              </div>
                              <img
                                onLoad={this.handleImageLoaded}
                                className={classes.questionImage}
                                src={e.url}
                                alt="surveyImg"
                              />
                            </React.Fragment>
                          ) : (
                            <img
                              onLoad={this.handleImageLoaded}
                              className={classes.questionImage}
                              src={e.url}
                              alt="surveyImg"
                            />
                          )}

                          <p
                            style={{ backgroundColor: color, color: textColor }}
                            className={classes.questionDescription}
                          >
                            <div
                              className={classes.answeredQuestion}
                              style={{ display: displayTick }}
                            >
                              <i
                                style={{
                                  color: 'white',
                                  backgroundColor: color,
                                  paddingTop: '3px',
                                  fontSize: 39,
                                  height: 70,
                                  width: 70,
                                  margin: 'auto',
                                  display: 'flex',
                                  borderRadius: '50%',
                                  justifyContent: 'center',
                                  alignItems: 'flex-start'
                                }}
                                className="material-icons"
                              >
                                done
                              </i>
                            </div>
                            {e.description}
                          </p>
                        </div>
                      );
                    })
                  : null}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {' '}
                {question !== null
                  ? sortedQuestions.map(e => {
                      let color;
                      let textColor = 'white';
                      if (e.value === 3) {
                        color = '#89bd76';
                      } else if (e.value === 2) {
                        color = '#f0cb17';
                        textColor = 'black';
                      } else if (e.value === 1) {
                        color = '#e1504d';
                      }

                      return (
                        <div
                          key={e.value}
                          onClick={() => this.submitQuestion(e.value)}
                          className={classes.questionContainer}
                        >
                          {this.state.imageStatus === 'loading' ? (
                            <React.Fragment>
                              <div
                                style={{
                                  fontSize: '40px',
                                  marginTop: '50px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                              >
                                <CircularProgress />
                                <img
                                  onLoad={this.handleImageLoaded}
                                  className={classes.questionImage}
                                  src={e.url}
                                  alt="surveyImg"
                                />
                              </div>
                            </React.Fragment>
                          ) : (
                            <img
                              onLoad={this.handleImageLoaded}
                              className={classes.questionImage}
                              src={e.url}
                              alt="surveyImg"
                            />
                          )}

                          <p
                            style={{ backgroundColor: color, color: textColor }}
                            className={classes.questionDescription}
                          >
                            {e.description}
                          </p>
                        </div>
                      );
                    })
                  : null}
              </React.Fragment>
            )}
          </div>
          <div className={classes.bottomContainer}>
            <i
              style={{ color: 'green', cursor: 'pointer' }}
              className="material-icons"
            >
              info
            </i>
            {question && !question.required ? (
              <span style={{ width: 220 }}>
                <Button
                  style={{ textDecoration: 'none' }}
                  onClick={this.skipQuestion}
                >
                  {t('views.lifemap.skipThisQuestion')}
                </Button>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  answeredQuestion: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '-36px',
    left: '50%',
    transform: 'translate(-50%,0)',
    zIndex: -1
  },
  mainQuestionsAndBottomContainer: {
    margin: 'auto',
    width: '840px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomContainer: {
    padding: '0 10px 0 10px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
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
  questionImage: {
    objectFit: 'cover',
    height: 240
  },
  questionDescription: {
    position: 'relative',
    zIndex: 22,
    margin: 0,
    textAlign: 'center',
    color: 'white',
    height: '100%',
    padding: '20px 20px'
  },
  questionContainer: {
    margin: '0 10px 0 10px',
    cursor: 'pointer',
    width: 260,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '20px'
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
