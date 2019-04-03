import React, { Component } from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import countries from 'localized-countries'

const countryList = countries(require('localized-countries/data/en')).array()

class SelectInput extends Component {
  state = {
    errorMessage: null
  }

  validate = event => {
    const value = event ? event.target.value : null

    const { t } = this.props

    // if it's from onChange update value
    if (event) {
      this.props.onChange(this.props.field, value)
    }

    // validate
    if (this.props.setError) {
      if (
        this.props.required &&
        ((!event && !this.props.value) || (event && !value))
      ) {
        this.props.setError(true, this.props.field)
        this.setState({
          errorMessage: t('validation.fieldIsRequired')
        })
      } else {
        this.props.setError(false, this.props.field)
      }
    }
  }
  componentDidMount() {
    this.validate()
  }

  render() {
    const { error } = this.props

    return (
      <FormControl
        className={this.props.classes.container}
        fullWidth
        error={error}
      >
        <InputLabel>{`${this.props.label}${
          this.props.required ? ' *' : ''
        }`}</InputLabel>
        <Select
          value={this.props.value || ''}
          fullWidth
          onChange={this.validate}
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
        {error && <FormHelperText>{this.state.errorMessage}</FormHelperText>}
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

export default withStyles(styles)(withTranslation()(SelectInput))
