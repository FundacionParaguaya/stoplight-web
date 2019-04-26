import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import TitleBar from '../../components/TitleBar';
import BottomSpacer from '../../components/BottomSpacer';
import Container from '../../components/Container';
import SummaryDonut from '../../components/summary/SummaryDonut';
import { updateDraft } from '../../redux/actions';

export class Overview extends Component {
  state = {
    modalTitle: '',
    howManyMonthsWillItTakeText: '',
    whyDontYouHaveItText: '',
    whatWillYouDoToGetItText: '',
    whatDidItTake: '',
    howDidYouGetIt: '',
    questionKey: '',
    questionValue: '',
    showPrioritiesNote: false,
    questionsCount: this.props.currentSurvey.surveyStoplightQuestions.length,
    greenIndicatorCount: this.props.currentDraft.indicatorSurveyDataList.filter(
      indicator => indicator.value === 3
    ).length,
    yellowIndicatorCount: this.props.currentDraft.indicatorSurveyDataList.filter(
      indicator => indicator.value === 2
    ).length,
    redIndicatorCount: this.props.currentDraft.indicatorSurveyDataList.filter(
      indicator => indicator.value === 1
    ).length,
    skippedIndicatorCount: this.props.currentDraft.indicatorSurveyDataList.filter(
      indicator => !indicator.value
    ).length
  };

  finishSurvey = () => {
    const { minimumPriorities } = this.props.currentSurvey;
    //  this.props.currentDraft.indicatorSurveyDataList.forEach(e=>{
    //    if(e.value ==1 ||e.value ==2){}
    //  })
    if (minimumPriorities === 0) {
      this.props.history.push('/lifemap/final');
    } else {
      if (minimumPriorities - this.props.currentDraft.priorities.length !== 0) {
        this.setState({ showPrioritiesNote: true });
      } else {
        this.props.history.push('/lifemap/final');
      }
      let priorDiff = 0;
      this.props.currentDraft.indicatorSurveyDataList.forEach(ele => {
        if (ele.value === 2 || ele.value === 1) {
          priorDiff += 1;
        }
      });
      if (
        minimumPriorities -
          minimumPriorities +
          priorDiff -
          this.props.currentDraft.priorities.length ===
        0
      ) {
        this.props.history.push('/lifemap/final');
      }
    }
  };

  static getForwardURLForIndicator = indicator => {
    let forward = 'skipped-indicator';
    if (indicator.value) {
      forward = indicator.value === 3 ? 'achievement' : 'priority';
    }
    return `${forward}/${indicator.key}`;
  };

  render() {
    const { t, classes, currentDraft, currentSurvey } = this.props;
    let priorDiff = 0;
    let groupedAnswers;
    const userAnswers = [];
    let differentCalcPriorities = false;

    if (currentSurvey) {
      currentDraft.indicatorSurveyDataList.forEach(ele => {
        if (ele.value === 2 || ele.value === 1) {
          priorDiff += 1;
        }
      });
      currentSurvey.surveyStoplightQuestions.forEach(e => {
        currentDraft.indicatorSurveyDataList.forEach(ele => {
          if (e.codeName === ele.key) {
            userAnswers.push({
              value: ele.value,
              questionText: e.questionText,
              dimension: e.dimension,
              key: ele.key
            });
          }
        });
      });
      if (priorDiff < this.props.currentSurvey.minimumPriorities) {
        differentCalcPriorities = true;
      }
      console.log(differentCalcPriorities);
      console.log(priorDiff);
      groupedAnswers = userAnswers.reduce((r, a) => {
        r[a.dimension] = r[a.dimension] || [];
        r[a.dimension].push(a);
        return r;
      }, {});
    }

    return (
      <div>
        <TitleBar title={t('views.yourLifeMap')} />
        <Container variant="stretch">
          <SummaryDonut
            greenIndicatorCount={this.state.greenIndicatorCount}
            yellowIndicatorCount={this.state.yellowIndicatorCount}
            redIndicatorCount={this.state.redIndicatorCount}
            skippedIndicatorCount={this.state.skippedIndicatorCount}
          />
        </Container>
        <div className={classes.ballsContainer}>
          {this.props.currentDraft.indicatorSurveyDataList.map(indicator => {
            let color;

            if (indicator.value === 3) {
              color = '#89bd76';
            } else if (indicator.value === 2) {
              color = '#f0cb17';
            } else if (indicator.value === 1) {
              color = '#e1504d';
            } else if (indicator.value === 0) {
              color = 'grey';
            }

            return (
              <div
                key={indicator.key}
                style={{ backgroundColor: color }}
                className={classes.roundBall}
              />
            );
          })}
        </div>
        <div>
          {Object.keys(groupedAnswers).map(elem => {
            return (
              <div key={elem}>
                <h1>{elem}</h1>
                {groupedAnswers[elem].map(indicator => {
                  let color;
                  let displayType = 'none';
                  if (indicator.value === 3) {
                    color = '#89bd76';
                  } else if (indicator.value === 2) {
                    color = '#F0CB17';
                  } else if (indicator.value === 1) {
                    color = '#e1504d';
                  } else if (indicator.value === 0) {
                    color = 'grey';
                  }
                  currentDraft.priorities.forEach(prior => {
                    if (prior.indicator === indicator.key)
                      displayType = 'block';
                  });
                  currentDraft.achievements.forEach(achieve => {
                    if (achieve.indicator === indicator.key)
                      displayType = 'block';
                  });

                  return (
                    <Button
                      onClick={() =>
                        this.props.history.push(
                          Overview.getForwardURLForIndicator(indicator)
                        )
                      }
                      key={indicator.key}
                      className={classes.overviewAnswers}
                    >
                      <div className={classes.buttonInsideContainer}>
                        <div
                          style={{ backgroundColor: color }}
                          className={classes.roundBox}
                        >
                          <div
                            style={{ display: displayType }}
                            className={classes.roundBoxSmall}
                          />
                        </div>

                        <p>{indicator.questionText}</p>
                      </div>
                    </Button>
                  );
                })}
              </div>
            );
          })}
        </div>
        {this.state.showPrioritiesNote ? (
          <div className={classes.modalPopupContainer}>
            <div className={classes.createPrioritiesContainer}>
              <h2>{t('views.lifemap.toComplete')}</h2>
              <p className={classes.paragraphPriorities}>
                {t('general.create')}
                <span className={classes.prioritiesCurrentCount}>
                  {differentCalcPriorities ? (
                    <span>
                      {this.props.currentSurvey.minimumPriorities -
                        this.props.currentSurvey.minimumPriorities +
                        priorDiff -
                        this.props.currentDraft.priorities.length}
                    </span>
                  ) : (
                    <span>
                      {this.props.currentSurvey.minimumPriorities -
                        this.props.currentDraft.priorities.length}
                    </span>
                  )}
                </span>
                <span className={classes.lowercaseParagraph}>
                  {t('views.lifemap.priorities')}
                </span>
              </p>
              <Button
                style={{ marginTop: 35, marginBottom: 35 }}
                variant="contained"
                fullWidth
                onClick={() => this.setState({ showPrioritiesNote: false })}
                color="primary"
              >
                {t('general.gotIt')}
              </Button>
            </div>
          </div>
        ) : null}

        <Button
          style={{ marginTop: 35, marginBottom: 35 }}
          variant="contained"
          fullWidth
          onClick={this.finishSurvey}
          color="primary"
        >
          {t('general.continue')}
        </Button>
      </div>
    );
  }
}
const styles = {
  lowercaseParagraph: {
    textTransform: 'lowercase'
  },
  paragraphPriorities: {
    fontSize: 20
  },
  prioritiesCurrentCount: {
    margin: '0 4px 0 3px'
  },
  createPrioritiesContainer: {
    zIndex: 11,
    width: 650,
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: '150px',
    margin: 'auto'
  },
  ballsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '20px'
  },
  roundBall: {
    display: 'block',
    width: 25,
    height: 25,
    borderRadius: '50%'
  },
  roundBoxSmall: {
    width: 15,
    height: 15,
    borderRadius: '50%',
    backgroundColor: '#856DFF'
  },
  buttonsContainer: {
    marginTop: 20,
    display: 'flex'
  },
  modalButtonAnswersBack: {
    marginRight: 20
  },
  containerTitle: {
    zIndex: 12
  },
  modalAnswersDetailsContainer: {
    zIndex: 11,
    width: 650,
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '120px',
    margin: 'auto'
  },
  modalPopupContainer: {
    position: 'fixed',
    width: '100vw',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
    height: '100vh',
    backgroundColor: 'white',
    zIndex: 1
  },
  buttonInsideContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 'auto'
  },
  overviewAnswers: {
    cursor: 'pointer',
    width: '100%'
  },
  roundBox: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    marginRight: '10px'
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
  )(withTranslation()(Overview))
);
