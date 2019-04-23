import React from 'react'
import { withStyles } from '@material-ui/core'
import clsx from 'clsx'

function Container(props) {
  const { classes, children, fluid, strech, flex, ...other } = props
  const className = clsx(
    classes.root,
    {
      [classes.fluid]: fluid,
      [classes.strech]: strech,
      [classes.flex]: flex
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
  },
  flex: {
    display: 'flex'
  }
}

export default withStyles(styles)(Container)