import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Delete, Edit, LocationOn } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import { listOfflineMaps } from '../api';
import mapsBanner from '../assets/hub.png';
import Container from '../components/Container';
import NavigationBar from '../components/NavigationBar';
import withLayout from '../components/withLayout';
import MapFormModal from './offline-maps/MapFormModal';
import MapDeleteModal from './offline-maps/MapDeleteModal';

const useStyles = makeStyles(theme => ({
  loadingContainer: {
    zIndex: 100,
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
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    height: 175
  },
  mapsTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 180
  },
  mapsImage: {
    display: 'block',
    height: 175,
    right: 0,
    position: 'absolute',
    top: -51,
    zIndex: 0,
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  gridAlignRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 2
  },
  row: {
    margin: `${theme.spacing(1)} 0`,
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.grey.quarter}`
  },
  icon: {
    fontSize: 32,
    color: theme.palette.grey.main
  },
  actionIcon: {
    paddingRight: 0,
    paddingLeft: 10,
    color: 'black'
  }
}));

const OfflineMaps = ({ enqueueSnackbar, closeSnackbar, user }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { organizationId } = useParams();

  const navigationOptions = [
    { label: t('views.toolbar.hubs'), link: '/hubs' },
    { label: t('views.toolbar.organizations'), link: '/organizations' }
  ];

  const [loading, setLoading] = useState(true);
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState();
  const [openMapForm, setOpenMapForm] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const showErrorMessage = message =>
    enqueueSnackbar(message, {
      variant: 'error',
      action: key => (
        <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      )
    });

  const showSuccessMessage = message =>
    enqueueSnackbar(message, {
      variant: 'success',
      action: key => (
        <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      )
    });

  useEffect(() => {
    listOfflineMaps(user)
      .then(response => {
        setMaps([
          { id: 1, name: 'Pilar' },
          { id: 2, name: 'Asunción' }
        ]);
        setLoading(false);
      })
      .catch(() => {
        showErrorMessage('error');
      });
  }, []);

  const onCloseForm = reload => {
    setOpenMapForm(false);
    reload && window.reload();
  };

  const onCloseDeleteModal = reload => {
    setOpenDeleteModal(false);
    reload && window.reload();
  };

  return (
    <Container variant="stretch">
      <MapFormModal
        open={openMapForm}
        organizationId={organizationId}
        mapToEdit={selectedMap}
        onClose={onCloseForm}
        showErrorMessage={showErrorMessage}
        showSuccessMessage={showSuccessMessage}
      />

      <MapDeleteModal
        open={openDeleteModal}
        mapToDelete={selectedMap}
        onClose={onCloseDeleteModal}
        showErrorMessage={showErrorMessage}
        showSuccessMessage={showSuccessMessage}
      />

      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}

      <NavigationBar options={navigationOptions}></NavigationBar>

      <div className={classes.titleContainer}>
        <div className={classes.mapsTitle}>
          <Typography variant="h4">{t('views.offlineMaps.title')}</Typography>
          <Typography variant="h6" style={{ color: 'grey' }}>
            {t('views.offlineMaps.subtitle')}
          </Typography>
        </div>
        <img src={mapsBanner} alt="Maps Banner" className={classes.mapsImage} />
      </div>

      <Grid container spacing={1} style={{ marginBottom: 32 }}>
        <Grid item md={8} sm={8} xs={12} container alignItems="center">
          <Typography variant="h5">{t('views.offlineMaps.list')}</Typography>
        </Grid>
        <Grid item md={4} sm={4} xs={12} className={classes.gridAlignRight}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setSelectedMap();
              setOpenMapForm(true);
            }}
          >
            {t('views.offlineMaps.add')}
          </Button>
        </Grid>
      </Grid>

      {maps.map(map => (
        <div key={map.name} className={classes.row}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn className={classes.icon} />
            <Typography variant="h6" style={{ color: 'grey' }}>
              {map.name}
            </Typography>
          </div>
          <div>
            <Tooltip title={t('general.edit')}>
              <IconButton
                color="inherit"
                onClick={() => {
                  setOpenMapForm(true);
                  setSelectedMap(map);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('general.delete')}>
              <IconButton
                color="inherit"
                onClick={() => {
                  setOpenDeleteModal(true);
                  setSelectedMap(map);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ))}
    </Container>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  connect(mapStateToProps)(withLayout(withSnackbar(OfflineMaps)))
);
