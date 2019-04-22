import React from 'react'
import { withStyles } from '@material-ui/core'

function BottomSpacer(props) {
  const { children, classes } = props

  return (
    <div className={classes.bottomSpacer}>
      {children}
    </div>
  )
}

const styles = theme => ({
  bottomSpacer: {
    height: '100px',
    width: '100%'
  }
})

export default withStyles(styles)(BottomSpacer)