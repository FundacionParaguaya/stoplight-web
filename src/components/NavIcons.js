import React, { Component } from 'react'
import { withStyles, Modal, Typography, Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { theme } from '../theme'
import { withTranslation } from 'react-i18next'
import redExclamation from '../assets/red_exclamation.png'

class NavIcons extends Component {
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
        <div className={classes.container}>
          <i
            onClick={this.props.uniqueBack || this.props.history.goBack}
            className={`material-icons ${classes.icon}`}
          >
            arrow_back
            </i>
          <h2 className={classes.titleMainAll}>{this.props.title}</h2>
          <i
            className={`material-icons ${classes.icon}`}
            onClick={() => this.setState({ showLeaveModal: true })}
          >
            close
            </i>
        </div>
        <Modal
          open={this.state.showLeaveModal}
          onClose={() => this.setState({ showLeaveModal: false })}
        >
          <div className={classes.leaveModal}>
            <img src={redExclamation} alt="Red Exclamation" />
            <Typography variant="h5" color="error">
              Warning!
            </Typography>
            <Typography className={classes.leaveModalSubtitle} variant="subtitle1">
              {t('views.modals.yourLifemapIsNotComplete')}
            </Typography>
            <div className={classes.buttonContainer}>
              <Button
                className={classes.button}
                variant="outlined"
                onClick={() => this.setState({ showLeaveModal: false })}
              >
                {t('general.no')}
              </Button>
              <Button
                className={classes.button}
                variant="outlined"
                onClick={this.leaveSurvey}
              >
                {t('general.yes')}
              </Button>{' '}
            </div>
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

const styles = {
  container: {
    width: '100%',
    padding: 25,
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'space-between'
  },
  icon: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      borderRadius: '50%',
      boxSizing: 'border-box',
    },
    borderRadius: '50%',
    color: theme.palette.primary.main,
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leaveModal: {
    width: 370,
    height: 330,
    backgroundColor: theme.palette.background.default,
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
    padding: '25px 40px',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  leaveModalSubtitle: {
    textAlign: 'center'
  }
}

export default withRouter(withStyles(styles)(withTranslation()(NavIcons)))