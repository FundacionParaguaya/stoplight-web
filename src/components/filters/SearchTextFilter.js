import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  filterInput: {
    paddingTop: '12.0px!important',
    paddingBottom: '12.0px!important',
    paddingRight: '14px!important',
    paddingLeft: '14px!important',
    fontFamily: 'Poppins',
    fontSize: '12px'
  },
  inputRootLabel: {
    color: theme.palette.grey.middle,
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: 13,
    zIndex: 0
  },
  inputLabel: {
    transform: 'translate(14px, -6px) scale(0.75)!important'
  },
  textField: {
    backgroundColor: theme.palette.background.default,
    marginTop: '0px!important',
    marginBottom: '0px!important',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 2,
        border: `1.5px solid ${theme.palette.grey.quarter}`
      },
      '&:hover fieldset': {
        borderColor: 'hsl(0, 0%, 70%)'
      },
      '&.Mui-focused fieldset': {
        border: `1.5px solid ${theme.palette.primary.dark}`
      }
    }
  },
  label: {
    marginRight: 10,
    fontSize: 14
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  stackedContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  stackedLabel: {
    marginRight: 10,
    marginBottom: 5,
    fontSize: 14
  }
}));

const SeachTextFilter = ({
  onChangeInput,
  searchLabel,
  searchByLabel,
  stacked
}) => {
  const classes = useStyles();

  return (
    <div className={stacked ? classes.stackedContainer : classes.container}>
      <Typography
        variant="subtitle1"
        className={stacked ? classes.stackedLabel : classes.label}
      >
        {searchLabel}
      </Typography>
      <TextField
        InputProps={{
          classes: {
            input: classes.filterInput
          }
        }}
        InputLabelProps={{
          classes: {
            root: classes.inputRootLabel,
            shrink: classes.inputLabel
          }
        }}
        variant="outlined"
        margin="dense"
        fullWidth
        className={classes.textField}
        onKeyDown={e => onChangeInput(e)}
        label={searchByLabel}
      />
    </div>
  );
};

export default SeachTextFilter;
