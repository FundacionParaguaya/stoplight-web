import React from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import OrganizationsFilter from '../../components/OrganizationsFilter';
import HubsFilter from '../../components/HubsFilter';
import { ROLES_NAMES } from '../../utils/role-utils';
import DateRangeFilters from '../../components/DateRangeFilter';
import SurveysFilter from '../../components/SurveysFilter';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10
  },
  gridAlignRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 2
  },
  label: {
    marginRight: theme.spacing(1),
    fontSize: 14
  }
}));

const showHubFilters = ({ role }) =>
  role === ROLES_NAMES.ROLE_PS_TEAM || role === ROLES_NAMES.ROLE_ROOT;

const showOrganizationFilters = ({ role }) =>
  role === ROLES_NAMES.ROLE_PS_TEAM ||
  role === ROLES_NAMES.ROLE_ROOT ||
  role === ROLES_NAMES.ROLE_HUB_ADMIN ||
  role === ROLES_NAMES.ROLE_APP_ADMIN;

const ReportsFilters = ({
  hubData,
  organizationsData,
  surveyData,
  from,
  to,
  includeRetake,
  onChangeHub,
  onChangeOrganization,
  onChangeSurvey,
  onFromDateChanged,
  onToDateChanged,
  toggleIncludeRetake,
  user
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid container spacing={1}>
        {showHubFilters(user) && (
          <Grid item md={12} sm={12} xs={12}>
            <HubsFilter data={hubData} onChange={onChangeHub} stacked={true} />
          </Grid>
        )}
        {showOrganizationFilters(user) && (
          <Grid item md={12} sm={12} xs={12}>
            <OrganizationsFilter
              data={organizationsData}
              onChange={onChangeOrganization}
              hub={hubData}
              stacked={true}
            />
          </Grid>
        )}
        <Grid item md={12} sm={12} xs={12}>
          <SurveysFilter
            data={surveyData}
            onChange={onChangeSurvey}
            hub={hubData}
            organizations={organizationsData}
            isMulti={false}
            stacked={true}
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <DateRangeFilters
            from={from}
            to={to}
            setFrom={onFromDateChanged}
            setTo={onToDateChanged}
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <div className={classes.container}>
            <Typography variant="subtitle1" className={classes.label}>
              {t('views.report.filters.followUpSurvey')}
            </Typography>
            <Switch
              checked={includeRetake}
              onChange={toggleIncludeRetake}
              color="primary"
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(ReportsFilters);
