import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Edit } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import IntervetionIcon from '@material-ui/icons/ListAlt';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { listInterventionsDefinitions } from '../api';
import interventionBanner from '../assets/reports_banner.png';
import Container from '../components/Container';
import withLayout from '../components/withLayout';
import SettingsIcon from '@material-ui/icons/MoreVert';

import AssignInterventionModal from './interventions/AssignInterventionModal';

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
  title: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 180
  },
  interventionImage: {
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
  gridAlignRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 2
  },
  row: {
    margin: `${theme.spacing(1)}px 0`,
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.grey.quarter}`
  },
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    fontSize: 32,
    marginRight: theme.spacing(1),
    color: theme.palette.grey.main
  },
  tag: {
    fontWeight: 550,
    backgroundColor: theme.typography.h4.color,
    color: 'white',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    width: 'fit-content',
    height: 'fit-content'
  },
  actionIcon: {
    paddingRight: 0,
    paddingLeft: 10,
    color: 'black'
  }
}));

const Interventions = ({ enqueueSnackbar, closeSnackbar, history, user }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [interventions, setInterventions] = useState([]);
  const [selectedIntervention, setSelectedIntervention] = useState();
  const [openAssignModal, setOpenAssignModal] = useState(false);

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

  const loadInterventions = () => {
    setLoading(true);
    listInterventionsDefinitions(user)
      .then(response => {
        setInterventions(response.data.data.interventionsDefinitionByUser);
        setLoading(false);
      })
      .catch(() => {
        showErrorMessage(t('views.intervention.loadingError'));
      });
  };

  useEffect(() => {
    loadInterventions();
  }, []);

  const onClose = (update, updatedIntervention) => {
    setOpenAssignModal(!openAssignModal);
    if (update) {
      let newInterventions = Array.from(interventions);
      newInterventions[
        newInterventions.findIndex(n => n.id === updatedIntervention.id)
      ] = updatedIntervention;
      setInterventions(newInterventions);
    }
  };

  return (
    <Container variant="stretch">
      <AssignInterventionModal
        open={openAssignModal}
        user={user}
        intervention={selectedIntervention}
        onClose={onClose}
        showSuccessMessage={showSuccessMessage}
        showErrorMessage={showErrorMessage}
      />

      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}

      <div className={classes.titleContainer}>
        <div className={classes.title}>
          <Typography variant="h4">
            {t('views.toolbar.interventions')}
          </Typography>
          <Typography variant="h6" style={{ color: 'grey' }}>
            {t('views.intervention.subtitle')}
          </Typography>
        </div>
        <img
          src={interventionBanner}
          alt="Intervention Banner"
          className={classes.interventionImage}
        />
      </div>

      <Grid container spacing={1} style={{ marginBottom: 32 }}>
        <Grid item md={8} sm={8} xs={12} container alignItems="center">
          <Typography variant="h5">{t('views.intervention.list')}</Typography>
        </Grid>
        <Grid item md={4} sm={4} xs={12} className={classes.gridAlignRight}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              history.push('/interventions/create');
            }}
          >
            {t('views.intervention.add')}
          </Button>
        </Grid>
      </Grid>

      {interventions.map(intervention => (
        <div key={intervention.id} className={classes.row}>
          <div className={classes.container}>
            <IntervetionIcon className={classes.icon} />
            <Typography variant="h6" style={{ color: 'grey' }}>
              {intervention.title}
            </Typography>
          </div>
          <div className={classes.container}>
            {Array.isArray(intervention.organizations) &&
              intervention.organizations.slice(0, 5).map(org => {
                return (
                  <Typography
                    key={org.id}
                    variant="caption"
                    className={classes.tag}
                  >
                    {org.name}
                  </Typography>
                );
              })}
            {Array.isArray(intervention.organizations) &&
              intervention.organizations.length > 5 && (
                <Typography variant="caption" className={classes.tag}>
                  ...
                </Typography>
              )}
          </div>
          <div>
            <Tooltip title={t('views.intervention.assign.title')}>
              <IconButton
                color="inherit"
                onClick={() => {
                  setSelectedIntervention(intervention);
                  setOpenAssignModal(true);
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('general.edit')}>
              <IconButton
                color="inherit"
                onClick={() => {
                  history.push(`/interventions/edit/${intervention.id}`);
                }}
              >
                <Edit />
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
  connect(mapStateToProps)(withLayout(withSnackbar(Interventions)))
);
