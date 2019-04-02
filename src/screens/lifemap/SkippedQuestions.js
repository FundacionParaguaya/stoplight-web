import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import TitleBar from '../../components/TitleBar'
import { withTranslation } from 'react-i18next'
export class SkippedQuestions extends Component {
  goToQuestion = e => {
    const { currentDraft, currentSurvey } = this.props
    currentSurvey.surveyStoplightQuestions.forEach((ele, index) => {
      if (e.key === ele.codeName) {
        this.props.history.push({
          pathname: `/lifemap/stoplight/${index}`,
          state: { skippedReturn: true }
        })
      }
    })
  }
  render() {
    const { t, classes, currentDraft, currentSurvey } = this.props
    let groupedAnswers
    let finalQuestion
    let userAnswers = []
    if (currentSurvey) {
      finalQuestion = currentSurvey.surveyStoplightQuestions.length - 1
      currentSurvey.surveyStoplightQuestions.forEach(e => {
        currentDraft.indicatorSurveyDataList.forEach(ele => {
          if (e.codeName === ele.key && ele.value === 0) {
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
        <TitleBar
          //do not delete uniqueBack for now, we are probably going to use that in the future
          //   uniqueBack={() =>
          //     this.props.history.push(`/lifemap/stoplight/${finalQuestion}`)
          //   }
          title={t('views.skippedIndicators')}
        />

        {Object.keys(groupedAnswers).map(elem => {
          return (
            <div className={classes.SkippedQuestionsContainer} key={elem}>
              {/* <h1>{elem}</h1> */}
              {groupedAnswers[elem].map(e => {
                return (
                  <Button
                    onClick={ele => this.goToQuestion(e)}
                    key={e.key}
                    className={classes.overviewAnswers}
                  >
                    <div className={classes.buttonInsideContainer}>
                      <p>{e.questionText}</p>
                    </div>
                  </Button>
                )
              })}
            </div>
          )
        })}

        <Button
          style={{ marginTop: 35, marginBottom: 35 }}
          variant="contained"
          fullWidth
          onClick={() => this.props.history.push('/lifemap/overview')}
          color="primary"
        >
          {t('general.continue')}
        </Button>
      </div>
    )
  }
}

const styles = {
  titleAndIconContainerPolicy: {
    backgroundColor: '#faefe1',
    display: 'flex',
    padding: '10px 40px 10px 10px',
    alignItems: 'center'
  },
  titleMainAll: {
    margin: 'auto'
  },
  overviewAnswers: {
    cursor: 'pointer',
    width: '100%'
  },
  buttonInsideContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 'auto'
  },
  SkippedQuestionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
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
  )(withTranslation()(SkippedQuestions))
)
