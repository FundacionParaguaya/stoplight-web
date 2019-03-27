import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import Checkbox from '../../assets/Checkbox.png'
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
    const { classes, currentSurvey } = this.props

    return (
      <div className={classes.mainContainerTermsAndPolicy}>
        <div className={classes.titleAndIconContainerPolicy}>
          <i
            onClick={this.props.history.goBack}
            style={{ cursor: 'pointer', fontSize: 32 }}
            className="material-icons"
          >
            arrow_back
          </i>
          {this.props.location.pathname === '/lifemap/terms' ? (
            <h2 className={classes.titleMainTerms}>Terms and Conditions</h2>
          ) : (
            <h2 className={classes.titleMainTerms}>Privacy Policy</h2>
          )}
        </div>
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
            Disagree
          </Button>
          <Button
            className={classes.buttonTermsAgree}
            variant="contained"
            color="primary"
            onClick={this.handleContinue}
          >
            Agree
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
  titleAndIconContainerPolicy: {
    backgroundColor: '#faefe1',
    display: 'flex',
    padding: '10px 25px 10px 10px',
    alignItems: 'center'
  },
  titleMainTerms: {
    margin: 'auto'
  },
  mainContainerTermsAndPolicy: {
    width: 600,
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
  connect(
    mapStateToProps,

    {}
  )(Terms)
)
