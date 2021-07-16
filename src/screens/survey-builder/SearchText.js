import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';

const useStyles = makeStyles(theme => ({
  filterInput: {
    padding: '14.0px!important',
    fontFamily: 'Poppins',
    fontSize: '12px'
  },
  inputRootLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    color: theme.palette.grey.middle,
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: 13,
    zIndex: 0
  },
  inputLabel: {
    transform: 'translate(14px, -6px) scale(0.75)!important',
    width: 'fit-content'
  },
  textField: {
    minWidth: 255,
    backgroundColor: theme.palette.background.default,
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
  icon: {
    fontSize: 20,
    color: '#BDBDBD'
  }
}));

const SearchText = ({ label, onChange = () => {}, onKeyDown = () => {} }) => {
  const classes = useStyles();
  return (
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
      className={classes.textField}
      onChange={e => onChange(e)}
      label={
        <React.Fragment>
          <Typography>{label}</Typography>
          <SearchIcon className={classes.icon} />
        </React.Fragment>
      }
      onKeyDown={onKeyDown}
    />
  );
};

export default SearchText;
