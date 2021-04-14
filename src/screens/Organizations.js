import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import withLayout from '../components/withLayout';
import { connect } from 'react-redux';
import { getOrganizationsPaginated } from '../api';
import { Grid, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import BottomSpacer from '../components/BottomSpacer';
import Container from '../components/Container';
import OrganizationSearchFilter from './organizations/OrganizationSearchFilter';
import DeleteOrganizationModal from './organizations/DeleteOrganizationModal';
import organizationBanner from '../assets/hub.png';
import { ROLES_NAMES, checkAccessToProjects } from '../utils/role-utils';
import NavigationBar from '../components/NavigationBar';
import clsx from 'clsx';
import DefaultOrgLogo from '../assets/grey_isologo.png';
import IconButton from '@material-ui/core/IconButton';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Tooltip from '@material-ui/core/Tooltip';
import PublicIcon from '@material-ui/icons/Public';

const Organizations = ({ history, classes, t, user, i18n: { language } }) => {
  const hubId = history.location.state ? history.location.state.hubId : null;
  const readOnly = user.role !== ROLES_NAMES.ROLE_HUB_ADMIN ? true : false;
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    prevPage: 0
  });

  const loadOrganizations = overwrite => {
    setLoading(true);
    let page = overwrite ? 1 : paginationData.page;

    if (page !== paginationData.prevPage || overwrite) {
      getOrganizationsPaginated(user, page, filter, hubId)
        .then(response => {
          let newOrgs = [];
          let totalPages = response.data.totalPages;

          if (overwrite) {
            newOrgs = response.data.list;
          } else if (page !== paginationData.prevPage) {
            newOrgs = [...organizations, ...response.data.list];
          }

          setPaginationData({
            page: page,
            totalPages: totalPages,
            prevPage: page
          });
          setOrganizations(newOrgs);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleGoNext = org => {
    history.push({
      pathname: '/projects',
      state: { orgId: org.id }
    });
  };

  const nextPage = () => {
    if (paginationData.page + 1 <= paginationData.totalPages)
      setPaginationData({
        page: paginationData.page + 1,
        totalPages: paginationData.totalPages
      });
  };

  const onChangeOrganizationFilter = e => {
    if (e.key === 'Enter') {
      setFilter(e.target.value);
    }
  };
  const toggleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const reloadPage = () => {
    loadOrganizations(true);
  };

  useEffect(() => {
    loadOrganizations(false);
  }, []);

  useEffect(() => {
    !loading && loadOrganizations(false);
  }, [paginationData.page]);

  useEffect(() => {
    !loading && loadOrganizations(true);
  }, [filter]);

  const checkAccessToMaps = ({ role }) =>
    role === ROLES_NAMES.ROLE_ROOT || role === ROLES_NAMES.ROLE_PS_TEAM;

  const navigationOptions = [
    { label: t('views.toolbar.hubs'), link: '/hubs' },
    { label: t('views.toolbar.organizations'), link: '/organizations' }
  ];

  return (
    <div className={classes.mainOrganizationContainerBoss}>
      <Container variant="stretch">
        {readOnly && (
          <NavigationBar options={navigationOptions}></NavigationBar>
        )}
        <DeleteOrganizationModal
          organization={selectedOrganization}
          open={openDeleteModal}
          onClose={toggleDeleteModal}
          afterSubmit={reloadPage}
        />
        <div className={classes.titleContainer}>
          <div className={classes.organizationTopTitle}>
            <Typography variant="h4">
              {t('views.toolbar.organizations')}
            </Typography>
          </div>
          <img
            src={organizationBanner}
            alt="Organization Banner"
            className={clsx(
              classes.organizationImage,
              readOnly && classes.organizationImageTop
            )}
          />
        </div>
        <Grid
          container
          justify="space-between"
          spacing={2}
          className={classes.searchContainer}
        >
          <Grid item xs={12} md={6} sm={6} lg={6}>
            <OrganizationSearchFilter
              onChangeOrganizationFilter={onChangeOrganizationFilter}
            />
          </Grid>
          <Grid item xs={12} md={6} sm={6} lg={6} container justify="flex-end">
            {!readOnly && (
              <Button
                variant="contained"
                className={classes.addOrganization}
                onClick={() => {
                  history.push(`/organization/create`);
                }}
              >
                {t('views.organization.addOrganization')}
              </Button>
            )}
          </Grid>
        </Grid>
        <div className={classes.listContainer}>
          {loading && (
            <div className={classes.spinnerWrapper}>
              <CircularProgress size={50} thickness={2} />
            </div>
          )}
          <Grid container spacing={2}>
            {organizations.map(organization => {
              return (
                <Grid item key={organization.id} xs={12} sm={4} md={3} xl={2}>
                  <div
                    className={clsx(
                      classes.mainOrganizationContainer,
                      readOnly && classes.paddingBottomCard
                    )}
                  >
                    <div className={classes.organizationTitleContainer}>
                      <Typography
                        variant="h6"
                        className={classes.organizationTitle}
                      >
                        {organization.name}
                      </Typography>
                    </div>
                    <div className={classes.logoContainer}>
                      <img
                        src={
                          organization.logoUrl
                            ? organization.logoUrl
                            : DefaultOrgLogo
                        }
                        alt="logo"
                        className={classes.logoImage}
                      />
                    </div>
                    <div className={classes.descriptionContainer}>
                      <Typography noWrap={false} variant="body2">
                        {organization.description.length >= 80
                          ? organization.description.slice(0, 80) + '...'
                          : organization.description}
                      </Typography>
                    </div>

                    <div className={classes.buttonsContainer}>
                      {!readOnly && (
                        <>
                          <Button
                            color="default"
                            aria-label="Edit organization"
                            classes={{
                              root: classes.button,
                              label: classes.buttonLabel
                            }}
                            onClick={() => {
                              history.push(
                                `/organization/${organization.id}/edit`
                              );
                            }}
                          >
                            {t('views.organization.editButton')}
                          </Button>
                          <Button
                            color="default"
                            aria-label="Delete organization"
                            component="span"
                            classes={{
                              root: classes.button,
                              label: classes.buttonLabel
                            }}
                            onClick={() => {
                              setSelectedOrganization(organization);
                              toggleDeleteModal();
                            }}
                          >
                            {t('views.organization.deleteButton')}
                          </Button>
                        </>
                      )}
                      {checkAccessToProjects(user) && (
                        <Tooltip title={t('views.organization.projectsList')}>
                          <IconButton
                            color="default"
                            aria-label="To projects"
                            component="span"
                            className={classes.goNextButton}
                            onClick={() => {
                              handleGoNext(organization);
                            }}
                          >
                            <NavigateNextIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {checkAccessToMaps(user) && (
                        <Tooltip title={t('views.organization.mapsList')}>
                          <IconButton
                            color="default"
                            aria-label="To maps"
                            component="span"
                            className={classes.mapButton}
                            onClick={() => {
                              history.push({
                                pathname: `organizations/${organization.id}/offline-maps`,
                                state: { hubId: hubId }
                              });
                            }}
                          >
                            <PublicIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>

          {paginationData.page < paginationData.totalPages && (
            <div className={classes.showMoreButtonContainer}>
              <Button
                variant="contained"
                aria-label="Show more"
                className={classes.showMoreButton}
                component="span"
                onClick={() => {
                  nextPage();
                }}
              >
                {t('general.showMore')}
              </Button>
            </div>
          )}
        </div>
      </Container>
      <BottomSpacer />
    </div>
  );
};

const styles = theme => ({
  paddingBottomCard: {
    paddingBottom: '1rem'
  },
  organizationTitle: {
    color: theme.palette.primary.dark,
    lineHeight: 1.2,
    fontSize: '18px',
    marginRight: 'auto',
    marginBottom: 7,
    fontWeight: theme.typography.fontWeightMedium
  },
  organizationImage: {
    display: 'block',
    height: 175,
    right: 0,
    position: 'absolute',
    top: -10,
    zIndex: 0,
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  organizationImageTop: {
    top: -51
  },

  searchContainer: {
    paddingTop: 20,
    paddingBottom: 40
  },
  organizationTitleContainer: {
    height: '20%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: 17,
    paddingRight: 17
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    height: 175,
    [theme.breakpoints.down('xs')]: {
      height: 120
    }
  },
  organizationTopTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 180
  },
  mainOrganizationContainerBoss: {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    minHeight: '90vh'
  },
  mainOrganizationContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: '1rem',
    height: '100%',
    '& $p': {
      fontSize: '14px',
      color: theme.palette.grey.middle,
      marginBottom: 7
    },
    '& $p:last-child': {
      marginBottom: 0
    }
  },
  addOrganization: {
    textDecoration: 'none'
  },
  logoContainer: {
    height: 130,
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center'
  },
  logoImage: {
    maxWidth: 130,
    maxHeight: 130,
    padding: 10,
    margin: 'auto'
  },
  descriptionContainer: {
    height: 80,
    padding: '0 16px',
    marginTop: 5
  },

  spinnerWrapper: {
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    backgroundColor: theme.palette.text.light,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  },
  listContainer: {
    position: 'relative'
  },
  buttonsContainer: {
    position: 'relative',
    display: 'flex',
    height: 50,
    padding: '5px 5px',
    paddingRight: 17
  },
  addButton: {
    color: theme.palette.background.default,
    backgroundColor: theme.palette.primary.dark,
    position: 'fixed',
    top: 160,
    right: 24
  },
  button: {
    borderRadius: '0%',
    fontSize: 14,
    padding: 0,
    marginRight: 5,
    justifyContent: 'center',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      textDecoration: 'none'
    }
  },
  mapButton: {
    position: 'absolute',
    top: 6,
    right: 30,
    marginRight: 4
  },
  goNextButton: {
    position: 'absolute',
    top: 6,
    right: 0,
    marginRight: 4
  },
  showMoreButtonContainer: {
    width: '100%',
    marginTop: 30,
    display: 'flex'
  },
  showMoreButton: {
    margin: 'auto'
  }
});
const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(withLayout(Organizations)))
  )
);
