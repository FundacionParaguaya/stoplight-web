import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import OrganizationsFilter from '../../components/OrganizationsFilter';
import HubsFilter from '../../components/HubsFilter';
import { ROLES_NAMES } from '../../utils/role-utils';
import UserSearchFilter from './filters/UsersSearchFilter';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20
  },
  innerContainer: {
    zIndex: 11 // To override material table
  },
  gridAlignRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 2
  }
}));

const showHubFilters = ({ role }) =>
  role === ROLES_NAMES.ROLE_PS_TEAM || role === ROLES_NAMES.ROLE_ROOT;

const showOnlyOrganizationsFilter = ({ role }) =>
  role === ROLES_NAMES.ROLE_HUB_ADMIN;

const UserFilters = ({
  hubData,
  organizationsData,
  onChangeHub,
  onChangeOrganization,
  onChangeUserFilter,
  user,
  toggleFormModal
}) => {
  const { t } = useTranslation();
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
            <Grid item md={8} sm={8} xs={12}>
              <UserSearchFilter onChangeUserFilter={onChangeUserFilter} />
            </Grid>
            <Grid item md={4} sm={4} xs={12} className={classes.gridAlignRight}>
              <Button
                variant="contained"
                onClick={() => {
                  toggleFormModal({});
                }}
              >
                {t('views.user.addUser')}
              </Button>
            </Grid>
          </React.Fragment>
        )}
        {showOnlyOrganizationsFilter(user) && (
          <React.Fragment>
            <Grid item md={12} sm={12} xs={12}>
              <OrganizationsFilter
                data={organizationsData}
                onChange={onChangeOrganization}
                hub={hubData}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <UserSearchFilter onChangeUserFilter={onChangeUserFilter} />
            </Grid>
            <Grid item md={6} sm={6} xs={12} className={classes.gridAlignRight}>
              <Button
                variant="contained"
                onClick={() => {
                  toggleFormModal({});
                }}
              >
                {t('views.user.addUser')}
              </Button>
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(UserFilters);
