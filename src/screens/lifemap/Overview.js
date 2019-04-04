import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import TitleBar from '../../components/TitleBar'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import { updateDraft } from '../../redux/actions'
import Input from '../../components/Input'
export class Overview extends Component {
  state = {
    prioritiesModal: false,
    achievementsModal: false,
    modalTitle: '',
    howManyMonthsWillItTakeText: '',
    whyDontYouHaveItText: '',
    whatWillYouDoToGetItText: '',
    whatDidItTake: '',
    howDidYouGetIt: '',
    questionKey: '',
    questionValue: ''
  }
  updateAnswer = e => {
    e.preventDefault()
    const { currentDraft } = this.props
    if (this.state.questionValue === 3) {
      let achievementsNew = currentDraft.achievements
      let update = false
      //////////////// check if the question is already in the achievements list and update it
      achievementsNew.forEach(e => {
        if (e.indicator === this.state.questionKey) {
          update = true
          e.action = this.state.whatDidItTake
          e.roadmap = this.state.howDidYouGetIt
        }
      })
      if (update) {
        let achievements = achievementsNew
        this.props.updateDraft({
          ...currentDraft,
          achievements
        })
      } else {
        //////////// add the question to the achievements list if it doesnt exist
        this.props.updateDraft({
          ...currentDraft,
          achievements: [
            ...currentDraft.achievements,
            {
              action: this.state.whatDidItTake,
              roadmap: this.state.howDidYouGetIt,
              indicator: this.state.questionKey
            }
          ]
        })
      }
    } else {
      let prioritiesNew = currentDraft.priorities
      let update = false
      //////////////// check if the question is already in the priorities list and update it
      prioritiesNew.forEach(e => {
        if (e.indicator === this.state.questionKey) {
          update = true
          e.action = this.state.whatDidItTake
          e.roadmap = this.state.howDidYouGetIt
        }
      })
      if (update) {
        let priorities = prioritiesNew
        this.props.updateDraft({
          ...currentDraft,
          priorities
        })
      } else {
        //////////// add the question to the priorities list if it doesnt exist
        this.props.updateDraft({
          ...currentDraft,
          priorities: [
            ...currentDraft.priorities,
            {
              reason: this.state.whyDontYouHaveItText,
              action: this.state.whatWillYouDoToGetItText,
              estimatedDate: this.state.howManyMonthsWillItTakeText,
              indicator: this.state.questionKey
            }
          ]
        })
      }
    }
    this.setState({
      prioritiesModal: false,
      achievementsModal: false,
      modalTitle: '',
      howManyMonthsWillItTakeText: '',
      whyDontYouHaveItText: '',
      whatWillYouDoToGetItText: '',
      whatDidItTake: '',
      howDidYouGetIt: '',
      questionKey: '',
      questionValue: ''
    })
  }
  showModal = (key, value, title) => {
    if (value === 1 || value === 2) {
      this.setState({
        prioritiesModal: true,
        modalTitle: title,
        questionKey: key,
        questionValue: 1
      })
    } else if (value === 3) {
      this.setState({
        achievementsModal: true,
        modalTitle: title,
        questionKey: key,
        questionValue: 3
      })
    }
  }
  render() {
    const { t, classes, currentDraft, currentSurvey } = this.props
    let groupedAnswers
    let userAnswers = []
    if (currentSurvey) {
      currentSurvey.surveyStoplightQuestions.forEach(e => {
        currentDraft.indicatorSurveyDataList.forEach(ele => {
          if (e.codeName === ele.key) {
            userAnswers.push({
              value: ele.value,
              questionText: e.questionText,
              dimension: e.dimension,
              key: ele.key
            })
          }
        })
      })

      groupedAnswers = userAnswers.reduce(function(r, a) {
        r[a.dimension] = r[a.dimension] || []
        r[a.dimension].push(a)
        return r
      }, {})
    }

    return (
      <div>
        {this.state.achievementsModal ? (
          <form
            onSubmit={this.updateAnswer}
            className={classes.modalPopupContainer}
          >
            <div className={classes.modalAnswersDetailsContainer}>
              <h1 className={classes.containerTitle}>
                {this.state.modalTitle}
              </h1>
              <Input
                label={t('views.lifemap.whyDontYouHaveIt')}
                value={this.state.whatDidItTake}
                onChange={e => this.setState({ whatDidItTake: e.target.value })}
              />
              <Input
                required
                label={t('views.lifemap.whatWillYouDoToGetIt')}
                value={this.state.howDidYouGetIt}
                onChange={e =>
                  this.setState({ howDidYouGetIt: e.target.value })
                }
              />

              <div className={classes.buttonsContainer}>
                <Button
                  size="large"
                  className={classes.modalButtonAnswersBack}
                  onClick={() =>
                    this.setState({
                      achievementsModal: false,
                      modalTitle: '',
                      whatDidItTake: '',
                      howDidYouGetIt: ''
                    })
                  }
                >
                  Go Back
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  className={classes.modalButtonAnswersSave}
                  type="submit"
                >
                  {t('general.save')}
                </Button>
              </div>
            </div>
          </form>
        ) : null}

        <TitleBar title={t('views.yourLifeMap')} />
        <div className={classes.ballsContainer}>
          {this.props.currentDraft.indicatorSurveyDataList.map(indicator => {
            let color

            if (indicator.value === 3) {
              color = '#89bd76'
            } else if (indicator.value === 2) {
              color = '#f0cb17'
            } else if (indicator.value === 1) {
              color = '#e1504d'
            } else if (indicator.value === 0) {
              color = 'grey'
            }

            return (
              <div
                key={indicator.key}
                style={{ backgroundColor: color }}
                className={classes.roundBall}
              />
            )
          })}
        </div>
        <div>
          {Object.keys(groupedAnswers).map(elem => {
            return (
              <div key={elem}>
                <h1>{elem}</h1>
                {groupedAnswers[elem].map(indicator => {
                  let color
                  let displayType = 'none'
                  if (indicator.value === 3) {
                    color = '#89bd76'
                  } else if (indicator.value === 2) {
                    color = '#f0cb17'
                  } else if (indicator.value === 1) {
                    color = '#e1504d'
                  } else if (indicator.value === 0) {
                    color = 'grey'
                  }
                  currentDraft.priorities.forEach(prior => {
                    if (prior.indicator === indicator.key) displayType = 'block'
                  })
                  currentDraft.achievements.forEach(achieve => {
                    if (achieve.indicator === indicator.key)
                      displayType = 'block'
                  })

                  return (
                    <Button
                      disabled={!indicator.value}
                      onClick={() =>
                        this.props.history.push(
                          `${
                            indicator.value === 3 ? 'achievement' : 'priority'
                          }/${indicator.key}`
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
                  )
                })}
              </div>
            )
          })}
        </div>
        <Button
          style={{ marginTop: 35, marginBottom: 35 }}
          variant="contained"
          fullWidth
          onClick={() => this.props.history.push('/lifemap/final')}
          color="primary"
        >
          {t('general.continue')}
        </Button>
      </div>
    )
  }
}
const styles = {
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
}

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
})
const mapDispatchToProps = { updateDraft }

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Overview))
)
