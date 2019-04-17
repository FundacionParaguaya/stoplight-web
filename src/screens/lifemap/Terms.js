import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import checkboxWithDots from '../../assets/checkbox_with_dots.png'
import { withTranslation } from 'react-i18next'
import { Typography, Button } from '@material-ui/core'
import { theme } from '../../theme'
import NavIcons from '../../components/NavIcons'
import Container from '../../components/Container'
import BottomSpacer from '../../components/BottomSpacer'

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
            <Container style={{ position: 'relative' }}>
              <Typography className={classes.title} variant="h4">{t('views.termsConditions')}</Typography>
              <img src={checkboxWithDots} className={classes.termsCheckboxImage} alt="" />
            </Container>
          </div>
        ) : (
            <div className={classes.titleContainer}>
              <NavIcons />
              <Container style={{ position: 'relative' }}>
                <Typography className={classes.title} variant="h4">{t('views.privacyPolicy')}</Typography>
                <img src={checkboxWithDots} className={classes.termsCheckboxImage} alt="" />
              </Container>
            </div>
          )}

        <Container>
          <div className={classes.contentContainer}>
            <Typography variant="h5">{this.state.title}</Typography>
            <br />
            {this.state.text
              .split(/(?:\\n)/g)
              .map((i, key) =>
                (<Typography color="textPrimary" key={key}>{i}<br /></Typography>)
              )
            }
          </div>
        </Container>
        <div className={classes.buttonContainerTerms}>
          <Button variant="text" onClick={this.handleDisagree}>
            {t('general.disagree')}
          </Button>
          <Button variant="contained" onClick={this.handleContinue}>
            {t('general.agree')}
          </Button>
        </div>
        <BottomSpacer />
      </div>
    )
  }
}
const styles = {
  titleContainer: {
    height: 220,
    backgroundColor: theme.palette.background.paper,
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
    paddingTop: theme.shape.padding,
    maxWidth: 660
  },
  termsCheckboxImage: {
    margin: 'auto',
    position: 'absolute',
    right: 0,
    bottom: -30,
    width: 370
  },
  list: {
    display: 'flex',
    flexDirection: 'column'
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
