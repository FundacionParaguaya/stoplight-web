import React from 'react'
import { withStyles } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { theme } from '../theme'

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
    <div className={classes.container}>
      <i
        onClick={props.uniqueBack || props.history.goBack}
        className={`material-icons ${classes.icon}`}
      >
        arrow_back
            </i>
      <h2 className={classes.titleMainAll}>{props.title}</h2>
      <i
        className={`material-icons ${classes.icon}`}
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
  }
}

export default withRouter(withStyles(styles)(NavIcons))