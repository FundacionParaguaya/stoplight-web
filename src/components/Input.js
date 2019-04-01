import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'

class Input extends Component {
  render() {
    return (
      <TextField
        required={this.props.required || false}
        className={this.props.classes.input}
        label={this.props.label}
        value={this.props.value || ''}
        onChange={this.props.onChange}
        fullWidth
      />
    )
  }
}

const styles = {
  input: {
    marginTop: 10,
    marginBottom: 10
  }
}

export default withStyles(styles)(Input)
