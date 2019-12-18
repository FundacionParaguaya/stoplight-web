import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import OrganizationsFilter from './OrganizationsFilter';
import { ROLES_NAMES } from '../utils/role-utils';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: `${theme.spacing(4)}px 0`,
    paddingBottom: 40,
    zIndex: 99,
    position: 'relative'
  },
  innerContainer: {
    zIndex: 2
  },
  familiesFilterContainer: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
    '& .MuiFormControl-marginDense': {
      marginTop: 0,
      marginBottom: 0
    }
  },
  familiesFilterInput: {
    paddingTop: '12.0px!important',
    paddingBottom: '12.0px!important',
    paddingRight: '14px!important',
    paddingLeft: '14px!important',
    fontFamily: 'Poppins',
    fontSize: '12px'
  },
  familiesLabel: {
    color: '#6A6A6A',
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '13px'
  },
  familiesFilterLabelInput: {
    transform: 'translate(14px, -6px) scale(0.75)!important'
  },
  textField: {
    backgroundColor: '#fff',
    marginTop: '0px!important',
    marginBottom: '0px!important',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: '2px',
        border: '1.5px solid #DCDEE3'
      },
      '&:hover fieldset': {
        borderColor: 'hsl(0, 0%, 70%)'
      },
      '&.Mui-focused fieldset': {
        border: '1.5px solid #309E43'
      }
    }
  },
  label: { marginRight: 10, fontSize: 14 },
  containerFamilySearch: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  }
}));

const showOrgFilters = ({ role }) => {
  return (
    role === ROLES_NAMES.ROLE_HUB_ADMIN ||
    role === ROLES_NAMES.ROLE_APP_ADMIN ||
    role === ROLES_NAMES.ROLE_ROOT
  );
};

const FamilyFilter = ({
  organizationsData,
  onChangeOrganization,
  familiesFilter,
  onChangeFamiliesFilter,
  user,
  setResetPagination
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid
      container
      spacing={2}
      className={classes.container}
      alignItems="center"
    >
      {showOrgFilters(user) && (
        <Grid item md={4} sm={4} xs={12}>
          <OrganizationsFilter
            data={organizationsData}
            onChange={onChangeOrganization}
          />
        </Grid>
      )}
      {showOrgFilters(user) && (
        <Grid item md={4} sm={4} xs={12}>
          <OrganizationsFilter
            data={organizationsData}
            onChange={onChangeOrganization}
          />
        </Grid>
      )}
      <Grid item md={4} sm={4} xs={12}>
        <div className={classes.containerFamilySearch}>
          <Typography variant="subtitle1" className={classes.label}>
            {t('views.familyList.search')}
          </Typography>
          <TextField
            InputProps={{
              //startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
              classes: {
                input: classes.familiesFilterInput
              }
            }}
            InputLabelProps={{
              classes: {
                root: classes.familiesLabel,
                shrink: classes.familiesFilterLabelInput
              }
            }}
            variant="outlined"
            margin="dense"
            fullWidth
            className={classes.textField}
            onKeyDown={e => onChangeFamiliesFilter(e)}
            label={t('views.familyList.searchFamily')}
          />
        </div>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(FamilyFilter);
