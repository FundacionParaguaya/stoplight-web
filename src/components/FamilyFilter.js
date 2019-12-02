import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import OrganizationsFilter from './OrganizationsFilter';
import { ROLES_NAMES } from '../utils/role-utils';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: `${theme.spacing(10)}px 0`,
    paddingBottom: 40
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
    paddingTop: '10.5px!important',
    paddingBottom: '10.5px!important',
    paddingRight: '14px!important',
    paddingLeft: '14px!important',
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '13px'
  },
  familiesLabel: {
    color: '#6A6A6A',
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '13px'
  },
  familiesFilterLabelInput: {
    transform: 'translate(14px, -6px) scale(0.75)!important'
  }
}));

const showHubFilters = ({ role }) =>
  role === ROLES_NAMES.ROLE_PS_TEAM || role === ROLES_NAMES.ROLE_ROOT;

const FamilyFilter = ({
  hubData,
  onChangeHub,
  organizationsData,
  onChangeOrganization,
  from,
  to,
  onFromDateChanged,
  onToDateChanged,
  familiesFilter,
  setFamiliesFilter,
  user
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
      <Grid item md={4} sm={4} xs={12}>
        <OrganizationsFilter
          data={[]}
          showLabel={false}
          //onChange={onChangeOrganization}
          //hub={hubData}
        />
      </Grid>
      <Grid item md={8} sm={8} xs={12}>
        <div className={classes.familiesFilterContainer}>
          <TextField
            InputProps={{
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
            label={t('views.snapshotsTable.searchFamily')}
            variant="outlined"
            value={familiesFilter}
            margin="dense"
            fullWidth
            onChange={e => setFamiliesFilter(e.target.value)}
          />
        </div>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(FamilyFilter);
