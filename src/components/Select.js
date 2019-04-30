import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import countries from 'localized-countries';
import { FilledInput } from '@material-ui/core';

const countryList = countries(require('localized-countries/data/en')).array();

class SelectInput extends Component {
  state = {
    errorMessage: null,
    value: null
  };

  handleOnChange = event => {
    this.setState({
      value: event.target.value
    });
    this.validate(event);
  };

  validate = event => {
    const value = event ? event.target.value : null;

    const { t } = this.props;

    // if it's from onChange update value
    if (event) {
      this.props.onChange(this.props.field, value);
    }

    // validate
    if (this.props.setError) {
      if (
        this.props.required &&
        ((!event && !this.props.value) || (event && !value))
      ) {
        this.props.setError(true, this.props.field);
        this.setState({
          errorMessage: t('validation.fieldIsRequired')
        });
      } else {
        this.props.setError(false, this.props.field);
      }
    }
  };

  componentDidMount() {
    this.validate();
  }

  render() {
    const { error } = this.props;
    return (
      <FormControl
        className={this.props.classes.container}
        fullWidth
        error={error}
        variant="filled"
      >
        <InputLabel>{`${this.props.label}${
          this.props.required ? ' *' : ''
        }`}</InputLabel>
        <Select
          className={
            this.state.value || this.props.value
              ? `${this.props.classes.input} ${this.props.classes.inputFilled}`
              : `${this.props.classes.input}`
          }
          value={this.props.value || ''}
          fullWidth
          onChange={this.handleOnChange}
          inputProps={{
            name: this.props.label
          }}
          input={<FilledInput />}
        >
          {this.props.country
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
    );
  }
}

const styles = {
  container: {
    marginTop: 10,
    marginBottom: 10
  },
  inputFilled: {
    '& $div': {
      backgroundColor: '#fff',
      borderBottom: '.5px solid #909090'
    }
  }
};

export default withStyles(styles)(withTranslation()(SelectInput));
