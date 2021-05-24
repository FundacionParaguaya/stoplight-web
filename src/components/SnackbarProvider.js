import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarProvider, useSnackbar } from 'notistack';
import React from 'react';
import { COLORS } from '../theme';

const DismissAction = ({ id }) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton key="dismiss" onClick={() => closeSnackbar(id)}>
      <CloseIcon style={{ color: 'white' }} />
    </IconButton>
  );
};

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
      root: props.classes.containerRoot,
      variantSuccess: props.classes.success,
      variantError: props.classes.error,
      variantWarning: props.classes.warning,
      variantInfo: props.classes.info
    }}
    action={key => <DismissAction id={key} />}
  >
    {props.children}
  </SnackbarProvider>
);

const styles = theme => ({
  containerRoot: {
    '& .MuiSnackbarContent-message': {
      [theme.breakpoints.down('lg')]: {
        width: '80%'
      }
    }
  },
  success: { backgroundColor: COLORS.GREEN },
  error: { backgroundColor: COLORS.RED },
  warning: { backgroundColor: COLORS.YELLOW }
});

export default withStyles(styles)(CustomSnackbarProvider);
