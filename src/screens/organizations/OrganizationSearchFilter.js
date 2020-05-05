import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  organizationFilterInput: {
    paddingTop: '12.0px!important',
    paddingBottom: '12.0px!important',
    paddingRight: '14px!important',
    paddingLeft: '14px!important',
    fontFamily: 'Poppins',
    fontSize: '12px'
  },
  organizationsLabel: {
    color: theme.palette.grey.middle,
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: 13
  },
  organizationsFilterLabelInput: {
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
  containerOrganizationSearch: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    alignItems: 'center'
  }
}));

const OrganizationSearchFilter = ({ onChangeOrganizationFilter }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.containerOrganizationSearch}>
      <Typography variant="subtitle1" className={classes.label}>
        {t('views.organization.search')}
      </Typography>
      <TextField
        InputProps={{
          classes: {
            input: classes.organizationFilterInput
          }
        }}
        InputLabelProps={{
          classes: {
            root: classes.organizationsLabel,
            shrink: classes.OrganizationFilterLabelInput
          }
        }}
        variant="outlined"
        margin="dense"
        fullWidth
        className={classes.textField}
        onKeyDown={e => onChangeOrganizationFilter(e)}
        label={t('views.organization.searchOrganization')}
      />
    </div>
  );
};

export default OrganizationSearchFilter;
