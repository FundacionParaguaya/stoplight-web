import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';

class DatePicker extends Component {
  state = {
    errorMessage: null,
    value: this.props.value
      ? moment.unix(this.props.value).format('YYYY-MM-DD')
      : ''
  };

  validate = event => {
    const value = event ? event.target.value : null;

    const { t } = this.props;

    // if it's from onChange update value
    if (event) {
      this.setState({
        value
      });
      this.props.onChange(
        this.props.field,
        moment.utc(event.target.value).unix()
      );
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
    const { classes, error } = this.props;
    // format either the date from the stored draft, or today

    return (
      <div className={classes.container}>
        <TextField
          disabled={this.props.disabled}
          label={`${this.props.label}${this.props.required ? ' *' : ''}`}
          type="date"
          onChange={this.validate}
          InputLabelProps={{
            shrink: true
          }}
          value={this.state.value}
          error={error}
          helperText={error && this.state.errorMessage}
          fullWidth
        />
      </div>
    );
  }
}

const styles = {
  container: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    flexWrap: 'wrap'
  }
};

export default withStyles(styles)(withTranslation()(DatePicker));
