import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import Form from '../../components/Form'
import Input from '../../components/Input'
import TextField from '@material-ui/core/TextField'
import { updateDraft } from '../../redux/actions'

class Achievement extends Component {
  state = {
    question: null,
    modalTitle: '',
    whyDontYouHaveItText: '',
    howManyMonthsWillItTakeText: ''
  }

  render() {
    const { classes, t } = this.props

    return (
      <div className={classes.modalPopupContainer}>
        <div className={classes.modalAnswersDetailsContainer}>
          <h1 className={classes.containerTitle}>{this.state.modalTitle}</h1>
          <Form onSubmit={this.updateAnswer} submitLabel={t('general.save')}>
            <Input
              label={t('views.lifemap.whyDontYouHaveIt')}
              value={this.state.whyDontYouHaveItText}
              onChange={e =>
                this.setState({ whyDontYouHaveItText: e.target.value })
              }
            />
            <Input
              required
              label={t('views.lifemap.whatWillYouDoToGetIt')}
              value={this.state.whatWillYouDoToGetItText}
              onChange={e =>
                this.setState({ whatWillYouDoToGetItText: e.target.value })
              }
            />
            <TextField
              inputProps={{ min: '1' }}
              label={t('views.lifemap.howManyMonthsWillItTake')}
              value={this.state.howManyMonthsWillItTakeText}
              onChange={e =>
                this.setState({
                  howManyMonthsWillItTakeText: e.target.value
                })
              }
              type="number"
              required
            />
          </Form>
        </div>
      </div>
    )
  }
}

const styles = {
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
  )(withTranslation()(Achievement))
)
