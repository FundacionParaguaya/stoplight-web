import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import { Grid, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { getHubsPaginated } from '../api';
import Container from '../components/Container';
import BottomSpacer from '../components/BottomSpacer';
import withLayout from '../components/withLayout';
import IconButton from '@material-ui/core/IconButton';
import DefaultHubLogo from '../assets/icon_logo_hub.png';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import HubsSearchFilter from './hubs/HubSearchFilter';
import DeleteHubModal from './hubs/DeleteHubModal';
import HubFormModal from './hubs/HubFormModal';
import hubBanner from '../assets/hub.png';
import { getPlatform } from '../utils/role-utils';

const styles = theme => ({
  hubTitle: {
    color: theme.palette.primary.dark,
    fontSize: '18px',
    marginRight: 'auto',
    marginBottom: 7,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.2
  },
  hubImage: {
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
  searchContariner: {
    display: 'flex',
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'space-between'
  },
  hubTitleContainer: {
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
    paddingTop: 25
  },
  hubTopTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 180
  },
  mainHubContainerBoss: {
    backgroundColor: theme.palette.background.paper
  },
  mainHubContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
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
  logoContainer: {
    height: 130,
    margin: 'auto',
    display: 'flex'
  },
  logoImage: {
    maxWidth: 130,
    maxHeight: 130,
    padding: 10,
    margin: 'auto'
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
    paddingLeft: 11,
    paddingRight: 5,
    marginRight: 5,
    justifyContent: 'flex-start',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      textDecoration: 'none'
    }
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

const Hubs = ({ classes, t, user, history }) => {
  const [loading, setLoading] = useState(true);
  const [hubs, setHubs] = useState([]);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    prevPage: 0
  });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedHub, setSelectedHub] = useState({});
  const [filter, setFilter] = useState('');

  const loadHubs = overwrite => {
    // API requires page 1 as param if complete hub list needs to be  filter
    let page = overwrite ? 1 : paginationData.page;

    if (page !== paginationData.prevPage || overwrite) {
      setLoading(true);
      getHubsPaginated(user, page, filter)
        .then(response => {
          let newHubs = [];
          let totalPages = response.data.totalPages;

          if (overwrite) {
            newHubs = response.data.list;
          } else if (page !== paginationData.prevPage) {
            newHubs = [...hubs, ...response.data.list];
          }

          setPaginationData({
            page: page,
            totalPages: totalPages,
            prevPage: page
          });
          setHubs(newHubs);
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadHubs(false);
  }, []);

  useEffect(() => {
    !openDeleteModal && !openFormModal && !loading && loadHubs(false);
  }, [paginationData.page]);

  useEffect(() => {
    !openDeleteModal && !openFormModal && !loading && loadHubs(true);
  }, [openDeleteModal, openFormModal]);

  useEffect(() => {
    !openDeleteModal && !openFormModal && !loading && loadHubs(true);
  }, [filter]);

  const toggleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const toggleFormModal = () => {
    setOpenFormModal(!openFormModal);
  };

  const onChangeHubFilter = e => {
    if (e.key === 'Enter') {
      setFilter(e.target.value);
    }
  };

  const nextPage = () => {
    if (paginationData.page + 1 <= paginationData.totalPages)
      setPaginationData({
        page: paginationData.page + 1,
        totalPages: paginationData.totalPages
      });
  };

  const handleGoNext = hub => {
    window.location.replace(
      `${getPlatform(user.env)}/#hubs/organizations/${hub.id}`
    );
  };

  return (
    <div className={classes.mainHubContainerBoss}>
      <Container variant="stretch">
        <HubFormModal
          hub={selectedHub}
          open={openFormModal}
          toggleModal={toggleFormModal}
        />
        <DeleteHubModal
          hub={selectedHub}
          open={openDeleteModal}
          onClose={toggleDeleteModal}
        />
        <div className={classes.titleContainer}>
          <div className={classes.hubTopTitle}>
            <Typography variant="h4">{t('views.toolbar.hubs')}</Typography>
          </div>
          <img
            src={hubBanner}
            alt="Choose Life Map"
            className={classes.hubImage}
          />
        </div>
        <Container variant="fluid" className={classes.searchContariner}>
          <HubsSearchFilter onChangeHubFilter={onChangeHubFilter} />
          <Button
            variant="contained"
            onClick={() => {
              setSelectedHub({});
              toggleFormModal();
            }}
          >
            {t('views.hub.addAHub')}
          </Button>
        </Container>

        <div className={classes.listContainer}>
          {loading && (
            <div className={classes.spinnerWrapper}>
              <CircularProgress size={50} thickness={2} />
            </div>
          )}
          <Grid container spacing={2}>
            {hubs.map(hub => {
              return (
                <Grid item key={hub.id} xs={12} sm={4} md={3} xl={2}>
                  <div className={classes.mainHubContainer}>
                    <div className={classes.hubTitleContainer}>
                      <Typography variant="h6" className={classes.hubTitle}>
                        {hub.name}
                      </Typography>
                    </div>
                    <div className={classes.logoContainer}>
                      <img
                        src={hub.logoUrl ? hub.logoUrl : DefaultHubLogo}
                        alt="Choose Life Map"
                        className={classes.logoImage}
                      />
                    </div>
                    <div className={classes.buttonsContainer}>
                      <Button
                        color="default"
                        aria-label="Edit hub"
                        component="span"
                        className={classes.button}
                        onClick={() => {
                          setSelectedHub(hub);
                          toggleFormModal();
                        }}
                      >
                        {t('views.hub.editButton').padEnd(5)}
                      </Button>
                      <Button
                        color="default"
                        aria-label="Delete Hub"
                        className={classes.button}
                        component="span"
                        onClick={() => {
                          setSelectedHub(hub);
                          toggleDeleteModal();
                        }}
                      >
                        {t('views.hub.deleteButton')}
                      </Button>
                      <IconButton
                        color="default"
                        aria-label="To organizations"
                        component="span"
                        className={classes.goNextButton}
                        onClick={() => {
                          handleGoNext(hub);
                        }}
                      >
                        <NavigateNextIcon />
                      </IconButton>
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

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(withLayout(Hubs)))
  )
);
