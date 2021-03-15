import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import DateRangeFilters from './DateRangeFilter';
import OrganizationsFilter from './OrganizationsFilter';
import HubsFilter from './HubsFilter';
import SurveysFilter from './SurveysFilter';
import { ROLES_NAMES, checkAccessToProjects } from '../utils/role-utils';
import ProjectSelector from '../components/selectors/ProjectsSelector';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: `${theme.spacing(8)}px 0`,
    paddingBottom: 0,
    [theme.breakpoints.down('sm')]: {
      paddingRight: 20,
      paddingTop: 25
    }
  },
  innerContainer: {
    zIndex: 2,
    display: 'flex',
    alignItems: 'center'
  }
}));

const showHubFilters = ({ role }) =>
  role === ROLES_NAMES.ROLE_PS_TEAM || role === ROLES_NAMES.ROLE_ROOT;

const isMentor = ({ role }) => role === ROLES_NAMES.ROLE_SURVEY_USER;

const DashboardFilters = ({
  surveyData,
  hubData,
  projectsData,
  onChangeHub,
  onChangeSurvey,
  onChangeProjects,
  organizationsData,
  onChangeOrganization,
  from,
  to,
  onFromDateChanged,
  onToDateChanged,
  user
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid className={classes.innerContainer} container spacing={1}>
        {showHubFilters(user) && (
          <React.Fragment>
            <Grid item md={4} sm={4} xs={12}>
              <HubsFilter data={hubData} onChange={onChangeHub} />
            </Grid>
            <Grid item md={8} sm={8} xs={12}>
              <OrganizationsFilter
                data={organizationsData}
                onChange={onChangeOrganization}
                hub={hubData}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <SurveysFilter
                data={surveyData}
                onChange={onChangeSurvey}
                hub={hubData}
                organizations={organizationsData}
                isMulti={true}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <DateRangeFilters
                from={from}
                to={to}
                setFrom={onFromDateChanged}
                setTo={onToDateChanged}
              />
            </Grid>
          </React.Fragment>
        )}
        {!showHubFilters(user) && !isMentor(user) && (
          <React.Fragment>
            <Grid item md={12} sm={12} xs={12}>
              <OrganizationsFilter
                data={organizationsData}
                onChange={onChangeOrganization}
                hub={hubData}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              {checkAccessToProjects(user) && (
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
              )}
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <SurveysFilter
                data={surveyData}
                onChange={onChangeSurvey}
                hub={hubData}
                organizations={organizationsData}
                isMulti={true}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <DateRangeFilters
                from={from}
                to={to}
                setFrom={onFromDateChanged}
                setTo={onToDateChanged}
              />
            </Grid>
          </React.Fragment>
        )}
        {isMentor(user) && checkAccessToProjects(user) && (
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
      </Grid>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(DashboardFilters);
