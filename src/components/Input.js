import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'

class Input extends Component {
  render() {
    return (
      <TextField
        label={this.props.label}
        value={this.props.value || ''}
        onChange={this.props.onChange}
        fullWidth
        margin="normal"
      />
    )
  }
}

export default Input
