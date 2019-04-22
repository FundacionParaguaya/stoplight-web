import React, { Component } from 'react'
import { withStyles, Modal, Typography, Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { theme } from '../theme'
import { withTranslation } from 'react-i18next'
import redExclamation from '../assets/red_exclamation.png'

const modalStyles = theme => ({
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
})

const LeaveModal = withRouter(withStyles(modalStyles)((props) => {
  const { classes } = props

  const leaveSurvey = () => {
    props.history.push('/surveys')
  }
  
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
    >
      <div className={classes.leaveModal}>
        <img src={redExclamation} alt="Red Exclamation" />
        <Typography variant="h5" color="error">
          Warning!
        </Typography>
        <Typography className={classes.leaveModalSubtitle} variant="subtitle1">
          {props.subtitleModalText}
        </Typography>
        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            onClick={leaveSurvey}
          >
            {props.deleteButtonText}
          </Button>
          <Button
            className={classes.button}
            variant="outlined"
            onClick={props.handleClose}
          >
            {props.cancelButtonText}
          </Button>
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