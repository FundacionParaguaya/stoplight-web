import React from 'react'
import { withStyles } from '@material-ui/core'
import clsx from 'clsx'

function Container(props) {
  const { classes, children } = props

  return (
    <div style={props.style} className={classes.container}>
      {children}
    </div>
  )
}

const styles = {
  container: {
    width: '60%',
    marginLeft : 'auto',
    marginRight: 'auto'
  },
  fluid: {
    width: '100%'
  },
  strech: {
    width: '30%'
  },
  flex: {
    display: 'flex'
  }
}

export default withStyles(styles)(Container)