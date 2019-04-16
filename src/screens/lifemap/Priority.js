import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Form from '../../components/Form'
import Input from '../../components/Input'
import { updateDraft } from '../../redux/actions'

class Priority extends Component {
  priority = this.props.currentDraft.priorities.find(
    item => item.indicator === this.props.match.params.indicator
  )

  state = {
    question: this.props.currentSurvey.surveyStoplightQuestions.find(
      indicator => indicator.codeName === this.props.match.params.indicator
    ),
    reason: (this.priority && this.priority.reason) || '',
    action: (this.priority && this.priority.action) || '',
    estimatedDate: (this.priority && this.priority.estimatedDate) || 1
  }

  updateAnswer = (field, value) => {
    this.setState({
      [field]: field === 'estimatedDate' ? parseInt(value, 10) : value
    })
  }

  savePriority = () => {
    const { currentDraft } = this.props
    const { question, reason, action, estimatedDate } = this.state

    const priority = {
      reason,
      action,
      estimatedDate,
      indicator: question.codeName
    }

    const item = currentDraft.priorities.filter(
      item => item.indicator === question.codeName
    )[0]

    // If item exists update it
    if (item) {
      const index = currentDraft.priorities.indexOf(item)
      this.props.updateDraft({
        ...currentDraft,
        priorities: [
          ...currentDraft.priorities.slice(0, index),
          priority,
          ...currentDraft.priorities.slice(index + 1)
        ]
      })
    } else {
      // If item does not exist create it
      this.props.updateDraft({
        ...currentDraft,
        priorities: [...currentDraft.priorities, priority]
      })
    }

    this.props.history.goBack()
  }

  render() {
    const { t } = this.props
    const { question } = this.state

    return (
      <div>
        <Typography variant="h3" gutterBottom>
          {question.questionText}
        </Typography>
        <h3>{t('views.lifemap.priorities')}</h3>
        <Form onSubmit={this.savePriority} submitLabel={t('general.save')}>
          <Input
            label={t('views.lifemap.whyDontYouHaveIt')}
            value={this.state.reason}
            field="reason"
            onChange={this.updateAnswer}
          />
          <Input
            label={t('views.lifemap.whatWillYouDoToGetIt')}
            value={this.state.action}
            field="action"
            onChange={this.updateAnswer}
          />
          <Input
            months
            label={t('views.lifemap.howManyMonthsWillItTake')}
            value={this.state.estimatedDate}
            field="estimatedDate"
            onChange={this.updateAnswer}
          />
        </Form>
      </div>
    )
  }
}

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
})
const mapDispatchToProps = { updateDraft }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Priority))
