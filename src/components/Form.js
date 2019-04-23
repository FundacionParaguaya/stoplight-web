import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import BottomSpacer from './BottomSpacer';

class Form extends Component {
  state = {
    errors: [],
    showErrors: false
  };

  submit = () => {
    // check if form is validate
    if (!this.state.errors.length) {
      this.props.onSubmit();
    } else if (!this.state.showErrors) {
      // show errors for the first time
      this.setState({
        showErrors: true
      });
    }
  };

  render() {
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        setError: (isError, field) => {
          const { errors } = this.state;

          if (isError && !errors.includes(field)) {
            this.setState({
              errors: [...errors, field]
            });
            errors.push(field);
          } else if (!isError) {
            this.setState({
              errors: errors.filter(item => item !== field)
            });
          }
        },
        error:
          this.state.showErrors &&
          this.state.errors.some(error => error === child.props.field)
      });
    });

    const { classes } = this.props;

    return (
      <div class={classes.formContainer}>
        {children}
        <div className={classes.buttonContainerForm}>
          <Button color="primary" variant="contained" onClick={this.submit}>
            {this.props.submitLabel}
          </Button>
        </div>
        <BottomSpacer />
      </div>
    );
  }
}

const styles = {
  formContainer: {
    marginTop: 40
  },
  input: {
    marginTop: 10,
    marginBottom: 10
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40
  }
};

export default withStyles(styles)(Form);
