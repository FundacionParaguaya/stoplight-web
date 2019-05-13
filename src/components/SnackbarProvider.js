import React from 'react';
import { SnackbarProvider } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import { COLORS } from '../theme';

const CustomSnackbarProvider = props => (
  <SnackbarProvider
    autoHideDuration={7000}
    maxSnack={5}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    preventDuplicate
    classes={{
      variantSuccess: props.classes.success,
      variantError: props.classes.error,
      variantWarning: props.classes.warning,
      variantInfo: props.classes.info
    }}
  >
    {props.children}
  </SnackbarProvider>
);

const styles = {
  success: { backgroundColor: COLORS.GREEN },
  error: { backgroundColor: COLORS.RED },
  warning: { backgroundColor: COLORS.YELLOW }
};

export default withStyles(styles)(CustomSnackbarProvider);
