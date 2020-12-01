import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography, Modal, Box } from '@material-ui/core';
import TitleBar from '../../components/TitleBar';
import { updateDraft } from '../../redux/actions';
import Container from '../../components/Container';
import BottomSpacer from '../../components/BottomSpacer';
import AudioHelp from '../../components/AudioHelp';
import StopLightQuestionCarousel from './StopLightQuestionCarousel';

class StoplightQuestions extends Component {
  state = {
    imageStatus: null,
    question: this.props.currentSurvey.surveyStoplightQuestions[
      this.props.match.params.page
    ],
    aspectRatio: null,
    infoModal: false,
    playHelpAudio: false,
    audioProgress: null,
    audioDuration: null
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
    let valueChanged = false;
    this.setState({ playHelpAudio: false });
    // ////////////// CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST and if it is the set update to true and edit the answer

    dataList.forEach(e => {
      if (e.key === codeName) {
        update = true;
        valueChanged = e.value !== value;
        e.value = value;
      }
    });
    // /////////if the question is in the data list then update the question
    if (update) {
      const indicatorSurveyDataList = dataList;
      let priorities = this.props.currentDraft.priorities;
      let achievements = this.props.currentDraft.achievements;
      if (valueChanged) {
        priorities = priorities.filter(p => p.indicator !== codeName);
      }
      if (value !== 3 || value === 0) {
        achievements = achievements.filter(a => a.indicator !== codeName);
      }
      this.props.updateDraft({
        ...currentDraft,
        indicatorSurveyDataList,
        priorities,
        achievements,
        stoplightSkipped: false
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
        ],
        stoplightSkipped: false
      });
      this.handleContinue();
    }
  }

  setCurrentScreen() {
    this.setState({
      imageStatus: 0,
      question: this.props.currentSurvey.surveyStoplightQuestions[
        this.props.match.params.page
      ],
      aspectRatio: null,
      playHelpAudio: false
    });
  }

  handleImageLoaded = () => {
    this.setState(prevState => ({
      imageStatus: prevState.imageStatus + 1
    }));
  };

  setAspectRatio = aspectRatio => {
    this.setState(prevState => {
      const maxAspectRatio =
        prevState.aspectRatio > aspectRatio
          ? prevState.aspectRatio
          : aspectRatio;
      return {
        aspectRatio: maxAspectRatio
      };
    });
  };

  handleClose = () => {
    this.setState({ infoModal: false });
  };

  handleOpen = () => {
    this.setState({ infoModal: true });
  };

  handleAudioPlay = () => {
    this.setState({ playHelpAudio: !this.state.playHelpAudio });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.page !== this.props.match.params.page) {
      this.setCurrentScreen();
    }
  }

  render() {
    const { question, playHelpAudio } = this.state;
    const { classes, t, currentDraft, user } = this.props;
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
          </div>
          {answered ? (
            <StopLightQuestionCarousel
              submitQuestion={e => this.submitQuestion(e)}
              answeredValue={answeredValue}
              handleImageLoaded={this.handleImageLoaded}
              imageStatus={this.state.imageStatus}
              setAspectRatio={this.setAspectRatio}
              aspectRatio={this.state.aspectRatio}
              questions={question.stoplightColors.sort((a, b) => {
                return b.value - a.value;
              })}
            />
          ) : (
            <StopLightQuestionCarousel
              submitQuestion={e => this.submitQuestion(e)}
              handleImageLoaded={this.handleImageLoaded}
              imageStatus={this.state.imageStatus}
              setAspectRatio={this.setAspectRatio}
              aspectRatio={this.state.aspectRatio}
              questions={question.stoplightColors.sort((a, b) => {
                return b.value - a.value;
              })}
            />
          )}

          <div
            className={classes.bottomContainer}
            style={{
              justifyContent:
                question.definition || user.interative_help
                  ? 'space-between'
                  : 'flex-end',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {question.definition && (
                <i
                  onClick={this.handleOpen}
                  className={`material-icons ${classes.icon}`}
                >
                  info
                </i>
              )}

              {user.interative_help && question && question.questionAudio && (
                <React.Fragment>
                  <div style={{ width: '300px' }}>
                    <AudioHelp
                      audio={question.questionAudio}
                      playAudio={playHelpAudio}
                      handlePlayPause={() =>
                        this.setState({ playHelpAudio: !playHelpAudio })
                      }
                      handleStop={() => this.setState({ playHelpAudio: false })}
                    />
                  </div>
                </React.Fragment>
              )}
            </div>
            {question && !question.required && (
              <span>
                <Button
                  style={{
                    textDecoration: 'none',
                    padding: 0,
                    paddingRight: 20
                  }}
                  onClick={() => this.submitQuestion(0)}
                >
                  {t('views.lifemap.skipThisQuestion')}
                </Button>
              </span>
            )}
          </div>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.infoModal}
            onClose={this.handleClose}
          >
            <div className={classes.infoModal}>
              <i
                onClick={this.handleClose}
                className={`material-icons ${classes.closeModalIcon} ${classes.icon}`}
              >
                close
              </i>
              <Typography variant="h5" id="modal-title">
                {t('views.lifemap.indicatorDefinition')}
              </Typography>
              <Box mt={4} />
              <div className={classes.innerContainer}>
                {question.definition &&
                  question.definition.split(/(?:\\n)/g).map((i, key) => (
                    <Typography variant="body2" color="textPrimary" key={key}>
                      {i}
                      <Box mt={2} />
                    </Typography>
                  ))}
              </div>
            </div>
          </Modal>
        </Container>
        <BottomSpacer />
      </div>
    );
  }
}

const styles = theme => ({
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
    paddingLeft: 28
  },
  icon: {
    color: 'green',
    cursor: 'pointer',
    fontSize: 30
  },
  skipButton: {
    cursor: 'pointer',
    paddingRight: 22
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
  },
  infoModal: {
    width: 500,
    maxHeight: 500,
    backgroundColor: '#fff',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    padding: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  closeModalIcon: {
    alignSelf: 'flex-end'
  },
  innerContainer: {
    height: '100%',
    width: '100%',
    overflowY: 'auto'
  },
  playerContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  progressBar: {
    width: 75,
    backgroundColor: '#d8d8d8'
  },
  audioHelpText: {
    marginLeft: 5,
    font: 'Roboto',
    fontWeight: 400
  }
});

const mapStateToProps = ({ currentSurvey, currentDraft, user }) => ({
  currentSurvey,
  currentDraft,
  user
});

const mapDispatchToProps = { updateDraft };

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(StoplightQuestions))
);
