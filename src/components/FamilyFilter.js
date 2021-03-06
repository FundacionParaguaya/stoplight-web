import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { ROLES_NAMES, checkAccessToProjects } from '../utils/role-utils';
import OrganizationsFilter from './OrganizationsFilter';
import FacilitatorFilter from './FacilitatorFilter';
import HubsFilter from './HubsFilter';
import ProjectSelector from './selectors/ProjectsSelector';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // padding: `${theme.spacing(4)}px 0`,
    paddingBottom: 20,
    position: 'relative'
  },
  innerContainer: {
    zIndex: 11 // To override material table
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
    fontSize: '13px',
    zIndex: 0
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

const showHubFilters = ({ role }) => {
  return role === ROLES_NAMES.ROLE_ROOT;
};

const showFalicitatorFilters = ({ role }) => {
  return role === ROLES_NAMES.ROLE_APP_ADMIN;
};

const showProjectFilter = user => {
  const role = user.role;
  return (
    (role === ROLES_NAMES.ROLE_HUB_ADMIN ||
      role === ROLES_NAMES.ROLE_APP_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER) &&
    checkAccessToProjects(user)
  );
};

const FamilyFilter = ({
  organizationsData,
  onChangeOrganization,
  hubData,
  onChangeHub,
  onChangeFamiliesFilter,
  user,
  facilitatorsData,
  onChangeFacilitator,
  projectsData,
  onChangeProjects
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid
      container
      className={classes.container}
      alignItems="center"
      direction="column"
    >
      <Grid
        container
        spacing={1}
        className={classes.container}
        alignItems="center"
      >
        {showHubFilters(user) ? (
          <>
            <Grid item md={4} sm={12} xs={12}>
              <HubsFilter data={hubData} onChange={onChangeHub} />
            </Grid>
            <Grid item md={8} sm={12} xs={12}>
              <OrganizationsFilter
                data={organizationsData}
                onChange={onChangeOrganization}
                hub={hubData}
              />
            </Grid>
          </>
        ) : (
          <>
            {showOrgFilters(user) && (
              <Grid item md={12} sm={12} xs={12}>
                <OrganizationsFilter
                  data={organizationsData}
                  onChange={onChangeOrganization}
                  hub={hubData}
                />
              </Grid>
            )}
          </>
        )}
        {showProjectFilter(user) && (
          <Grid item md={12} sm={12} xs={12}>
            <ProjectSelector
              withTitle={true}
              projectData={projectsData}
              organizationData={organizationsData}
              onChangeProject={(selected, allProjects) => {
                if (selected.some(project => project.value === 'ALL')) {
                  onChangeProjects(allProjects);
                } else {
                  onChangeProjects(selected);
                }
              }}
              isMulti={true}
              isClearable={true}
              stacked={false}
            />
          </Grid>
        )}
        <Grid
          item
          md={7}
          sm={7}
          xs={12}
          container
          className={classes.container}
        >
          <div className={classes.containerFamilySearch}>
            <Typography variant="subtitle1" className={classes.label}>
              {t('views.familyList.search')}
            </Typography>
            <TextField
              InputProps={{
                // startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
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
        {showFalicitatorFilters(user) && (
          <Grid item md={5} sm={5} xs={12}>
            <FacilitatorFilter
              data={facilitatorsData}
              organizations={organizationsData}
              onChange={onChangeFacilitator}
              isMulti={true}
              label={t('views.facilitatorFilter.label')}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(FamilyFilter);
