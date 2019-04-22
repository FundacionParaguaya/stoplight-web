import React from 'react'
import { withStyles } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import ArrowBack from '@material-ui/icons/ArrowBack'
import Close from '@material-ui/icons/Close'

function NavIcons(props) {
  const { classes } = props
  return (
    <div className={classes.container}>
      <ArrowBack
        className={classes.icon} 
        color="primary" 
        onClick={props.uniqueBack || props.history.goBack} 
      />
      <Close 
        color="primary" 
        className={classes.icon}  
      />
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    padding: 35,
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'space-between'
  },
  icon: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
}

export default withRouter(withStyles(styles)(NavIcons))