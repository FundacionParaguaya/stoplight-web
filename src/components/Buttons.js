import React from 'react'
import { Button, withStyles } from '@material-ui/core'

function SecondaryButtonDefinition(props) {
  const { classes } = props

  return (
    <Button 
      color="primary"
      onClick={props.onClick}
      className={`${classes.secondaryButton} ${classes.button}`}
    >
      {props.children}
    </Button>
  )
}

function PrimaryButtonDefinition(props) {
  const { classes } = props

  return (
    <Button 
      color="primary"
      variant="contained"
      onClick={props.onClick}
      className={`${classes.primaryButton} ${classes.button}`}
    >
      {props.children}
    </Button>
  )
}

const styles = {
  button: {
    width: 280,
    fontSize: 16,
    fontFamily: 'Poppins',
    textTransform: 'capitalize',
    letterSpacing: 0.13,
    lineHeight: '26px',
    fontWeight: 500,
  },
  secondaryButton: {
    textDecoration: 'underline',
    '&:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'underline'
    }
  },
  primaryButton: {
    boxShadow: 'none',
  }
}

const SecondaryButton = withStyles(styles)(SecondaryButtonDefinition)
const PrimaryButton = withStyles(styles)(PrimaryButtonDefinition)

export { SecondaryButton, PrimaryButton }