import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  hubFilterInput: {
    paddingTop: '12.0px!important',
    paddingBottom: '12.0px!important',
    paddingRight: '14px!important',
    paddingLeft: '14px!important',
    fontFamily: 'Poppins',
    fontSize: '12px'
  },
  hubsLabel: {
    color: theme.palette.grey.middle,
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: 13
  },
  hubsFilterLabelInput: {
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
  containeHubSearch: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    alignItems: 'center'
  }
}));

const HubSearchFilter = ({ onChangeHubFilter }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.containeHubSearch}>
      <Typography variant="subtitle1" className={classes.label}>
        {t('views.hub.search')}
      </Typography>
      <TextField
        InputProps={{
          classes: {
            input: classes.hubFilterInput
          }
        }}
        InputLabelProps={{
          classes: {
            root: classes.hubsLabel,
            shrink: classes.hubsFilterLabelInput
          }
        }}
        variant="outlined"
        margin="dense"
        fullWidth
        className={classes.textField}
        onKeyDown={e => onChangeHubFilter(e)}
        label={t('views.hub.searchHub')}
      />
    </div>
  );
};

export default HubSearchFilter;
