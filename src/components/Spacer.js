import React from 'react'
import { withStyles } from '@material-ui/core'

function Spacer(props) {
  const { children, classes } = props

  return (
    <div className={classes.buttonSpacer}>
      {children}
    </div>
  )
}

const styles = theme => ({
  buttonSpacer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.shape.margin,
    marginBottom: theme.shape.margin
  }
})

export default withStyles(styles)(Spacer)