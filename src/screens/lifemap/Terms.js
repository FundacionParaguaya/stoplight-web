import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import Checkbox from '../../assets/Checkbox.png'
import { withTranslation } from 'react-i18next'
import TitleBar from '../../components/TitleBar'

export class Terms extends Component {
  state = {
    title:
      this.props.location.pathname === '/lifemap/terms'
        ? this.props.currentSurvey.termsConditions.title
        : this.props.currentSurvey.privacyPolicy.title,
    text:
      this.props.location.pathname === '/lifemap/terms'
        ? this.props.currentSurvey.termsConditions.text
        : this.props.currentSurvey.privacyPolicy.text
  }
  handleContinue = () => {
    this.props.history.push(
      this.props.location.pathname === '/lifemap/terms'
        ? '/lifemap/privacy'
        : '/lifemap/primary-participant'
    )
  }
  handleDisagree = () => {
    this.props.history.push('/')
  }
  render() {
    const { classes, t } = this.props
    return (
      <div>
        {this.props.location.pathname === '/lifemap/terms' ? (
          <div className={classes.titleContainer}>
            <NavIcons />
            <Typography className={classes.title} variant="h4">{t('views.termsConditions')}</Typography>
            <img src={Checkbox} className={classes.termsCheckboxImage} alt="" />
          </div>
        ) : (
          <div className={classes.titleContainer}>
            <NavIcons />
            <Typography className={classes.title} variant="h4">{t('views.privacyPolicy')}</Typography>
            <img src={Checkbox} className={classes.termsCheckboxImage} alt="" />
          </div>
        )}

        <div className={classes.CheckboxImgAndTitleContainer}>
          <img src={Checkbox} className={classes.termsCheckboxImage} alt="" />
          <div className={classes.lowerTitle}>{this.state.title}</div>
        </div>
        <hr className={classes.hoziontalLine} />

        <p className={classes.termsDescription}>{this.state.text}</p>

        <div className={classes.buttonContainerTerms}>
          <Button
            variant="contained"
            className={classes.buttonTermsDisagree}
            onClick={this.handleDisagree}
          >
            {t('general.disagree')}
          </Button>
          <Button
            className={classes.buttonTermsAgree}
            variant="contained"
            color="primary"
            onClick={this.handleContinue}
          >
            {t('general.agree')}
          </Button>
        </div>
      </div>
    )
  }
}
const styles = {
  buttonTermsDisagree: {
    width: 260,
    margin: '0 10px'
  },
  buttonTermsAgree: {
    width: 260,
    margin: '0 10px'
  },
  buttonContainerTerms: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 25
  },
  termsDescription: {
    marginTop: 15,
    whiteSpace: 'pre-line'
  },
  hoziontalLine: {
    border: 0,
    borderTop: '1px solid rgba(0, 0, 0, 0.1)'
  },
  lowerTitle: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 15
  },
  CheckboxImgAndTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  termsCheckboxImage: {
    margin: 'auto'
  },
  list: {
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    marginBottom: 20
  }
}
const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey })
export default withStyles(styles)(
  connect(mapStateToProps)(withTranslation()(Terms))
)
