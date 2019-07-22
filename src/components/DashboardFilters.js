import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import DateRangeFilters from './DateRangeFilter';
import OrganizationsFilter from './OrganizationsFilter';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: `${theme.spacing(5)}px 0`
  }
}));

const DashboardFilters = ({
  organizationsData,
  onChangeOrganization,
  from,
  to,
  onFromDateChanged,
  onToDateChanged
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Grid container spacing={1}>
        <Grid item md={6} sm={6} xs={12}>
          <OrganizationsFilter
            data={organizationsData}
            onChange={onChangeOrganization}
          />
        </Grid>
        {/* <Grid item md={1} sm={1} xs={1} /> */}
        <Grid item md={6} sm={6} xs={12}>
          <DateRangeFilters
            from={from}
            to={to}
            setFrom={onFromDateChanged}
            setTo={onToDateChanged}
          />
        </Grid>
      </Grid>
    </div>
  );
};
export default DashboardFilters;
