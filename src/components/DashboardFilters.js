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
    background: '#ffff',
    padding: `${theme.spacing(1.7)}px ${theme.spacing(6)}px ${theme.spacing(
      1.7
    )}px ${theme.spacing(6)}px`
  }
}));

const DashboardFilters = ({ organizationsData, onChangeOrganization }) => {
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
        <Grid item md={2} sm={1} xs={1} />
        <Grid item md={4} sm={5} xs={12}>
          <DateRangeFilters />
        </Grid>
      </Grid>
    </div>
  );
};
export default DashboardFilters;
