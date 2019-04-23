import React from 'react'
import { withStyles } from '@material-ui/core'

function ContainerSmall(props) {
  const { classes, children } = props

  return (
    <div style={props.style} className={classes.ContainerSmall}>
      {children}
    </div>
  )
}

const styles = {
  ContainerSmall: {
    width: '500px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  fluid: {
    width: '100%'
  }
}

export default withStyles(styles)(ContainerSmall)
