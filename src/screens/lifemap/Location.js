import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import TitleBar from '../../components/TitleBar'


export class Location extends Component {
  handleContinue = () => {
    console.log(this.props.currentSurvey)
    // validation happens here
    this.props.history.push('/lifemap/economics/0')
  }

  componentDidMount() {
    // get user location happens here
  }

  render() {
    const { t } = this.props
    return (
      <div>
        <TitleBar title={t('views.location')} />

        <Button variant="contained" fullWidth onClick={this.handleContinue}>
          {t('general.continue')}
        </Button>
      </div>
    )
  }
}

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
})

const mapDispatchToProps = { updateDraft }
const styles = {}
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Location))
)
