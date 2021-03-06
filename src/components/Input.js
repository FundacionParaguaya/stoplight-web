import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';

class Input extends Component {
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
      console.log(this.props);
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

  componentDidUpdate(prevProps) {
    // Added this because required message was not being re-localized after language change
    const { t, setError, required } = this.props;
    if (t !== prevProps.t && setError && required) {
      this.setState({
        errorMessage: t('validation.fieldIsRequired')
      });
    }
  }

  render() {
    const { error } = this.props;

    return (
      <TextField
        className={this.props.classes.input}
        label={`${this.props.label}${this.props.required ? ' *' : ''}`}
        value={this.props.value || ''}
        onChange={this.handleOnChange}
        error={error}
        fullWidth
        variant="filled"
        helperText={error && this.state.errorMessage}
        type={this.props.months ? 'number' : 'string'}
        inputProps={this.props.months ? { min: '1' } : {}}
        multiline={this.props.multiline}
        rowsMax={this.props.rowsMax}
      />
    );
  }
}

const styles = {
  input: {
    marginTop: 10,
    marginBottom: 10
  },
  inputFilled: {
    '& $div': {
      backgroundColor: '#fff!important'
    }
  }
};

export default withStyles(styles)(withTranslation()(Input));
