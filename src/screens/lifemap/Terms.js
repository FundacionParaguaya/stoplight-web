import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Checkbox from '../../assets/Checkbox.png'
import { withTranslation } from 'react-i18next'
import { Typography, Button } from '@material-ui/core'
import { theme } from '../../theme'
import NavIcons from '../../components/NavIcons'

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

        <div className={classes.contentContainer}>
          <Typography variant="h5">{this.state.title}</Typography>
          <Typography color="textPrimary">{this.state.text.replace(/(\r\n|\n|\r)/gm,'asgsd')}</Typography>
        </div>

        <div className={classes.buttonContainerTerms}>
          <Button onClick={this.handleDisagree}>
            {t('general.disagree')} 
          </Button>
          <Button onClick={this.handleContinue}>
            {t('general.agree')}
          </Button>
        </div>
      </div>
    )
  }
}
const styles = {
  titleContainer: {
    height: 220,
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.shape.padding,
    position: 'relative',
    display: 'flex',
    overflow: 'hidden'
  },
  title: {
    position: 'relative',
    top: '55%',
  },
  buttonTermsDisagree: {
    '&:hover': {
      backgroundColor: 'transparent'
    },  
    textTransform: 'capitalize',
    textDecoration: 'underline'
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
  lowerTitle: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 15
  },
  contentContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    padding: theme.shape.padding,
    maxWidth: 600
  },
  termsCheckboxImage: {
    margin: 'auto',
    position: 'relative',
    bottom: -30,
    width: 230
  },
  list: {
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    marginBottom: 20
  },
  divider1: {
    width: '100%',
    height: 20
  }
}
const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey })
export default withStyles(styles)(
  connect(mapStateToProps)(withTranslation()(Terms))
)
