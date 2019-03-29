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
    showAnswerDetailsModal: false,
    modalTitle: '',
    howManyMonthsWillItTakeText: '',
    whyDontYouHaveItText: '',
    whatWillYouDoToGetItText: ''
  }
  handleContinue = () => {}
  updateAnswer = () => {
    let details = {
      howManyMonthsWillItTakeText: this.state.howManyMonthsWillItTakeText,
      whyDontYouHaveItText: this.state.whyDontYouHaveItText,
      whatWillYouDoToGetItText: this.state.whatWillYouDoToGetItText
    }
    console.log(details)

    ///////// UPDATE THE DRAFT !!!!! (NOT WORKING RIGHT NOW )

    // let dataList = this.props.currentDraft.indicatorSurveyDataList
    // let update = false
    // //////////////// CHECK IF THE QUESTION details are ALREADY IN THE DATA LIST and if they are,  set update to true and edit the answers
    // dataList.forEach(e => {
    //   if (e.questionText === this.state.modalTitle) {
    //     update = true
    //     e.details=details
    //   }
    // })
  }
  render() {
    const { t, classes, currentDraft, currentSurvey } = this.props
    let groupedAnswers
    let userAnswers = []
    if (currentSurvey) {
      currentSurvey.surveyStoplightQuestions.forEach(e => {
        currentDraft.indicatorSurveyDataList.forEach(ele => {
          if (e.codeName == ele.key) {
            userAnswers.push({
              value: ele.value,
              questionText: e.questionText,
              dimension: e.dimension,
              key: ele.key
            })
          }
        })
      })
      console.log(userAnswers)
      groupedAnswers = userAnswers.reduce(function(r, a) {
        r[a.dimension] = r[a.dimension] || []
        r[a.dimension].push(a)
        return r
      }, {})
    }

    return (
      <div>
        {this.state.showAnswerDetailsModal ? (
          <div className={classes.modalPopupContainer}>
            <div className={classes.modalAnswersDetailsContainer}>
              <h1 className={classes.containerTitle}>
                {this.state.modalTitle}
              </h1>
              <Input
                label={t('views.lifemap.whyDontYouHaveIt')}
                value={this.state.whyDontYouHaveItText}
                onChange={e =>
                  this.setState({ whyDontYouHaveItText: e.target.value })
                }
              />
              <Input
                label={t('views.lifemap.whatWillYouDoToGetIt')}
                value={this.state.whatWillYouDoToGetItText}
                onChange={e =>
                  this.setState({ whatWillYouDoToGetItText: e.target.value })
                }
              />
              <Input
                label={t('views.lifemap.howManyMonthsWillItTake')}
                value={this.state.howManyMonthsWillItTakeText}
                onChange={e =>
                  this.setState({ howManyMonthsWillItTakeText: e.target.value })
                }
              />
              <div className={classes.buttonsContainer}>
                <Button
                  size="large"
                  className={classes.modalButtonAnswersBack}
                  onClick={() =>
                    this.setState({
                      showAnswerDetailsModal: false,
                      modalTitle: '',
                      howManyMonthsWillItTakeText: '',
                      whyDontYouHaveItText: '',
                      whatWillYouDoToGetItText: ''
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
                  onClick={this.updateAnswer}
                >
                  {t('general.save')}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
        <TitleBar title={t('views.yourLifeMap')} />
        <div>
          {Object.keys(groupedAnswers).map(elem => {
            return (
              <div key={elem}>
                <h1>{elem}</h1>
                {groupedAnswers[elem].map(e => {
                  let color
                  if (e.value === 3) {
                    color = '#89bd76'
                  } else if (e.value === 2) {
                    color = '#f0cb17'
                  } else if (e.value === 1) {
                    color = '#e1504d'
                  } else if (e.value === 0) {
                    color = 'grey'
                  }
                  return (
                    <Button
                      onClick={() =>
                        this.setState({
                          showAnswerDetailsModal: true,
                          modalTitle: e.questionText
                        })
                      }
                      key={e.key}
                      className={classes.overviewAnswers}
                    >
                      <div className={classes.buttonInsideContainer}>
                        <div
                          style={{ backgroundColor: color }}
                          className={classes.roundBox}
                        />
                        <p>{e.questionText}</p>
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
