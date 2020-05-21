import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import DateRangeFilters from './DateRangeFilter';
import OrganizationsFilter from './OrganizationsFilter';
import HubsFilter from './HubsFilter';
import SurveysFilter from './SurveysFilter';
import { ROLES_NAMES } from '../utils/role-utils';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: `${theme.spacing(8)}px 0`,
    paddingBottom: 0
  },
  innerContainer: {
    zIndex: 2
  }
}));

const showHubFilters = ({ role }) =>
  role === ROLES_NAMES.ROLE_PS_TEAM || role === ROLES_NAMES.ROLE_ROOT;

const DashboardFilters = ({
  surveyData,
  hubData,
  onChangeHub,
  onChangeSurvey,
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
        {!showHubFilters(user) && (
          <React.Fragment>
            <Grid item md={12} sm={12} xs={12}>
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
      </Grid>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(DashboardFilters);
