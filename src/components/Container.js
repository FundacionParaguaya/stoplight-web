import React from 'react'
import { withStyles } from '@material-ui/core'
import clsx from 'clsx'

function Container(props) {
  const { classes, children, variant, ...other } = props
  
  const className = clsx(
    classes.root,
    {
      [classes.fluid]: variant === 'fluid',
      [classes.strech]: variant === 'strech',
      [classes.slim]: variant === 'slim'
    }
  )

  return (
    <div className={className} {...other}>
      {children}
    </div>
  )
}

const styles = {
  root: {
    width: '60%',
    marginLeft : 'auto',
    marginRight: 'auto'
  },
  fluid: {
    width: '100%'
  },
  strech: {
    width: '75%'
  },
  slim: {
    width: '30%'
  }
}

export default withStyles(styles)(Container)