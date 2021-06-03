import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import * as _ from 'lodash';
import { getHubs, getOrganizationsByHub } from '../../../api';
import { ROLES_NAMES } from '../../../utils/role-utils';
import { withStyles, Grid } from '@material-ui/core';
import AutocompleteWithFormik from '../../../components/AutocompleteWithFormik';

const styles = () => ({
  mainContainer: {
    marginTop: 5
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  label: {
    margin: 'auto',
    fontSize: 14
  },
  selector: {
    width: '90%'
  }
});

const UserOrgsSelector = ({
  classes,
  t,
  user,
  applicationValue,
  organizationValue,
  selectedRole,
  required = true
}) => {
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [hubs, setHubs] = useState();
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    setOptionsLoading(true);
    showHubsFilter(user) &&
      getHubs(user)
        .then(response => {
          const hubsFromAPI = _.get(response, 'data.data.hubsByUser', []).map(
            hub => ({
              label: hub.name,
              value: hub.id
            })
          );
          setHubs(hubsFromAPI);
        })
        .finally(() => setOptionsLoading(false));
    let hub = user.hub;
    showOrganizationsFilter(user) &&
      getOrganizationsByHub(user, hub && hub.value ? hub.value : null)
        .then(response => {
          const orgs = _.get(response, 'data.data.organizations', []).map(
            org => ({
              label: org.name,
              value: org.id
            })
          );
          setOrgs(orgs);
        })
        .finally(() => setOptionsLoading(false));
  }, [selectedRole]);

  const showHubsFilter = ({ role }) =>
    (role === ROLES_NAMES.ROLE_ROOT || role === ROLES_NAMES.ROLE_PS_TEAM) &&
    selectedRole === ROLES_NAMES.ROLE_HUB_ADMIN;

  const showOrganizationsFilter = ({ role }) =>
    role === ROLES_NAMES.ROLE_HUB_ADMIN;

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      className={classes.mainContainer}
    >
      {showHubsFilter(user) && (
        <Grid item md={12} sm={12} xs={12}>
          <AutocompleteWithFormik
            value={{ value: applicationValue }}
            label={t('views.hubsFilter.label')}
            name={'hub'}
            rawOptions={hubs}
            labelKey="label"
            valueKey="value"
            isLoading={optionsLoading}
            loadingMessage={() => t('views.organizationsFilter.loading')}
            noOptionsMessage={() => t('views.organizationsFilter.noOption')}
            isClearable={false}
            required={required}
          />
        </Grid>
      )}

      {showOrganizationsFilter(user) && (
        <Grid item md={12} sm={12} xs={12}>
          <AutocompleteWithFormik
            value={{ value: organizationValue }}
            label={t('views.organizationsFilter.label')}
            name={'organization'}
            rawOptions={orgs}
            labelKey="label"
            valueKey="value"
            isClearable={false}
            isLoading={optionsLoading}
            loadingMessage={() => t('views.organizationsFilter.loading')}
            noOptionsMessage={() => t('views.organizationsFilter.noOption')}
            required={required}
          />
        </Grid>
      )}
    </Grid>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(UserOrgsSelector))
  )
);
