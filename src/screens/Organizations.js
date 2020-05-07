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
import organizationBanner from '../assets/hub.png';

const Organizations = ({ classes, t, user, i18n: { language } }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    prevPage: 0
  });

  const loadOrganizations = overwrite => {
    setLoading(true);
    let page = overwrite ? 1 : paginationData.page;

    if (page !== paginationData.prevPage || overwrite) {
      getOrganizationsPaginated(user, page, filter)
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

  useEffect(() => {
    loadOrganizations(false);
  }, []);

  useEffect(() => {
    !loading && loadOrganizations(false);
  }, [paginationData.page]);

  useEffect(() => {
    !loading && loadOrganizations(true);
  }, [filter]);

  return (
    <div className={classes.mainOrganizationContainerBoss}>
      <Container variant="stretch">
        <div className={classes.titleContainer}>
          <div className={classes.organizationTopTitle}>
            <Typography variant="h4">
              {t('views.toolbar.organizations')}
            </Typography>
          </div>
          <img
            src={organizationBanner}
            alt="Organization Banner"
            className={classes.organizationImage}
          />
        </div>
        <Container variant="fluid" className={classes.searchContainer}>
          <OrganizationSearchFilter
            onChangeOrganizationFilter={onChangeOrganizationFilter}
          />
          <Button
            variant="contained"
            className={classes.addOrganization}
            onClick={() => {}}
          >
            {t('views.organization.addOrganization')}
          </Button>
        </Container>
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
                  <div className={classes.mainOrganizationContainer}>
                    <div className={classes.organizationTitleContainer}>
                      <Typography
                        variant="h6"
                        className={classes.organizationTitle}
                      >
                        {organization.name}
                      </Typography>
                    </div>
                    <div className={classes.descriptionContainer}>
                      <Typography noWrap={false} variant="body2">
                        {organization.description.length >= 80
                          ? organization.description.slice(0, 80) + '...'
                          : organization.description}
                      </Typography>
                    </div>
                    <div className={classes.buttonsContainer}>
                      <Button
                        color="default"
                        aria-label="Edit organization"
                        classes={{
                          root: classes.button,
                          label: classes.buttonLabel
                        }}
                        onClick={() => {}}
                      >
                        {t('views.organization.editButton')}
                      </Button>
                      <Button
                        color="default"
                        aria-label="Delete organization"
                        classes={{
                          root: classes.button,
                          label: classes.buttonLabel
                        }}
                        onClick={() => {}}
                      >
                        {t('views.organization.deleteButton')}
                      </Button>
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
  organizationTitle: {
    color: theme.palette.primary.dark,
    fontSize: '18px',
    marginRight: 'auto',
    marginBottom: 7,
    fontWeight: theme.typography.fontWeightMedium
  },
  organizationImage: {
    display: 'block',
    height: 240,
    right: 70,
    position: 'absolute',
    top: -10,
    zIndex: 0,
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  searchContainer: {
    display: 'flex',
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'space-between'
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
    position: 'relative'
  },
  organizationTopTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 220
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
    paddingTop: 15,
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
  descriptionContainer: {
    height: 80,
    padding: 16
  },

  spinnerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    height: 500,
    alignItems: 'center'
  },
  listContainer: {
    position: 'relative'
  },
  buttonsContainer: {
    position: 'relative',
    display: 'flex',
    height: 50,
    marginLeft: 0
  },
  addButton: {
    color: theme.palette.background.default,
    backgroundColor: theme.palette.primary.dark,
    position: 'fixed',
    top: 160,
    right: 24
  },
  button: {
    borderRadius: 0,
    fontSize: 14,
    padding: '0 17px 0 17px',

    textDecoration: 'none',
    marginRight: 10,
    justifyContent: 'flex-start',
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: theme.palette.background.paper
    }
  },

  goNextButton: {
    position: 'absolute',
    top: 4,
    right: 0
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
