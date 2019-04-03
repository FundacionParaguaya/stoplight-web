import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Form from '../../components/Form'
import Input from '../../components/Input'
import { updateDraft } from '../../redux/actions'

class Priority extends Component {
  achievement = this.props.currentDraft.achievements.find(
    item => item.indicator === this.props.match.params.indicator
  )

  state = {
    question: this.props.currentSurvey.surveyStoplightQuestions.find(
      indicator => indicator.codeName === this.props.match.params.indicator
    ),
    roadmap: (this.achievement && this.achievement.roadmap) || '',
    action: (this.achievement && this.achievement.action) || ''
  }

  updateAnswer = (field, value) => {
    this.setState({
      [field]: field === 'estimatedDate' ? parseInt(value, 10) : value
    })
  }

  savePriority = () => {
    const { currentDraft } = this.props
    const { question, roadmap, action } = this.state

    const achievement = {
      roadmap,
      action,
      indicator: question.codeName
    }

    const item = currentDraft.achievements.filter(
      item => item.indicator === question.codeName
    )[0]

    // If item exists update it
    if (item) {
      const index = currentDraft.achievements.indexOf(item)
      this.props.updateDraft({
        ...currentDraft,
        achievements: [
          ...currentDraft.achievements.slice(0, index),
          achievement,
          ...currentDraft.achievements.slice(index + 1)
        ]
      })
    } else {
      // If item does not exist create it
      this.props.updateDraft({
        ...currentDraft,
        achievements: [...currentDraft.achievements, achievement]
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
        <Form onSubmit={this.savePriority} submitLabel={t('general.save')}>
          <Input
            required
            label={t('views.lifemap.howDidYouGetIt')}
            value={this.state.action}
            field="action"
            onChange={this.updateAnswer}
          />
          <Input
            label={t('views.lifemap.whatDidItTakeToAchieveThis')}
            value={this.state.roadmap}
            field="roadmap"
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
