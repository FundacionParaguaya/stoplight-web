import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { theme } from '../theme'
class TopTitleContainer extends Component {
  state = {
    showLeaveModal: false
  }
  leaveSurvey = () => {
    this.props.history.push('/surveys')
  }
  render() {
    const { classes, t } = this.props

    return (
      <React.Fragment>
        {this.state.showLeaveModal ? (
          <div className={classes.leaveModal}>
            <Typography className={classes.leaveModalTitle} variant="h5">
              {t('views.modals.yourLifemapIsNotComplete')}
            </Typography>
            <div className={classes.buttonContainer}>
              <Button
                className={classes.button}
                fullWidth
                onClick={() => this.setState({ showLeaveModal: false })}
              >
                {t('general.no')}
              </Button>
              <Button
                className={classes.button}
                color="primary"
                variant="contained"
                fullWidth
                onClick={this.leaveSurvey}
              >
                {t('general.yes')}
              </Button>{' '}
            </div>
          </div>
        ) : (
          <div className={classes.titleAndIconContainerPolicy}>
            <i
              onClick={this.props.uniqueBack || this.props.history.goBack}
              style={{ cursor: 'pointer', fontSize: 37 }}
              className="material-icons"
            >
              arrow_back
            </i>
            <h2 className={classes.titleMainAll}>{this.props.title}</h2>
            <i
              onClick={() => this.setState({ showLeaveModal: true })}
              className="material-icons"
              style={{ cursor: 'pointer', fontSize: 37 }}
            >
              close
            </i>
          </div>
        )}
      </React.Fragment>
    )
  }
}
const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey })

const styles = {
  button: {
    margin: '0 30px',
    width: '100px'
  },
  leaveModalTitle: {
    marginTop: '40px',
    marginBottom: '40px'
  },
  buttonContainer: {
    display: 'flex'
  },
  leaveModal: {
    height: '100vh',
    width: '720px',
    position: 'fixed',
    zIndex: 2,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  titleAndIconContainerPolicy: {
    backgroundColor: theme.palette.background.default,
    height: 220,
    position: 'relative',
    display: 'flex',
    padding: '10px 10px 10px 10px',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleMainAll: {
    margin: 'auto'
  }
}
export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(TopTitleContainer))
  )
)
