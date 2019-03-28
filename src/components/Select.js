import React, { Component } from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'

class Input extends Component {
  render() {
    return (
      <FormControl fullWidth>
        <InputLabel shrink>{this.props.label}</InputLabel>
        <Select
          value={this.props.value || ''}
          fullWidth
          onChange={this.props.onChange}
        >
          {this.props.options.map(item => (
            <MenuItem key={item.value} value={item.value}>
              {item.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }
}

export default Input
