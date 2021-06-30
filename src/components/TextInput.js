import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  filterInput: {
    height: 15,
    paddingTop: '12.0px!important',
    paddingBottom: '12.0px!important',
    paddingRight: '14px!important',
    paddingLeft: '14px!important',
    fontFamily: 'Poppins',
    fontSize: '12px',
    backgroundColor: theme.palette.background.default
  },
  textField: {
    marginTop: 4,
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderRadius: '2px',
        border: `1.5px solid ${theme.palette.primary.main}`
      }
    }
  }
}));

const TextInput = ({ label, value, onChange, customClasses = {} }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="subtitle2" className={classes.label}>
        {label}
      </Typography>
      <TextField
        InputProps={{
          classes: {
            input: customClasses.input || classes.filterInput
          }
        }}
        variant="outlined"
        margin="dense"
        value={value}
        onChange={onChange}
        fullWidth
        className={customClasses.textField || classes.textField}
      />
    </React.Fragment>
  );
};

export default TextInput;
