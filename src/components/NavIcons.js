import React from 'react'
import { withStyles } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { theme } from '../theme'

function NavIcons(props) {
  const { classes } = props
  const onClick = props.uniqueBack || props.history.goBack
  const className = `material-icons ${classes.icon}`
  const attr = { onClick, className}
  const icons = ['arrow_back', 'close']

  return (
    <div className={classes.container}>
      {icons.map((icon) => (
        <i key={icon} {...attr} >
          {icon}
        </i>
      ))}
    </div>
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