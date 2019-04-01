import React, { Component } from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'
import countries from 'localized-countries'

const countryList = countries(require('localized-countries/data/en')).array()

class SelectInput extends Component {
  render() {
    return (
      <FormControl className={this.props.classes.container} fullWidth>
        <InputLabel>{this.props.label}</InputLabel>
        <Select
          value={this.props.value || ''}
          fullWidth
          onChange={this.props.onChange}
          inputProps={{
            name: this.props.label
          }}
        >
          {!!this.props.country
            ? countryList.map(country => (
                <MenuItem key={country.code} value={country.code}>
                  {country.label}
                </MenuItem>
              ))
            : this.props.options.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.text}
                </MenuItem>
              ))}
        </Select>
      </FormControl>
    )
  }
}

const styles = {
  container: {
    marginTop: 10,
    marginBottom: 10
  }
}

export default withStyles(styles)(SelectInput)
