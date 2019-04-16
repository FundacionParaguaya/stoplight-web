import React from 'react'
import { withStyles } from '@material-ui/core'

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
    width: '1024px',
    marginLeft : 'auto',
    marginRight: 'auto'
  },
  fluid: {
    width: '100%'
  }
}

export default withStyles(styles)(Container)