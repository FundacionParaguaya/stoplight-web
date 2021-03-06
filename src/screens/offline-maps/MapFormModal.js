import { IconButton, Modal, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { addOrUpdateOfflineMap } from '../../api';
import InputWithFormik from '../../components/InputWithFormik';
import Map from './Map';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
    maxHeight: '100vh'
  },
  container: {
    padding: '2em',
    paddingBottom: 0,
    backgroundColor: theme.palette.background.default,
    outline: 'none',
    width: '80vw',
    minWidth: '80vw',
    maxWidth: 800,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      padding: '1em'
    },
    overflowY: 'auto'
  },
  title: {
    marginTop: 20,
    paddingBottom: 5
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: '30px 0'
  },
  mapContainer: {
    paddingTop: '2rem',
    maxWidth: '100%',
    height: 'unset',
    maxHeight: 'unset',
    position: 'relative'
  },
  mapElement: {
    height: '85%',
    minHeight: 500,
    maxHeight: '85%',
    paddingTop: '2rem',
    position: 'relative',
    [theme.breakpoints.down('lg')]: {
      maxHeight: '75%',
      minHeight: 400
    },
    [theme.breakpoints.down('xs')]: {
      minHeight: 300
    }
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    marginTop: '1rem'
  }
}));

const fieldIsRequired = 'validation.fieldIsRequired';

const MapFormModal = ({
  open,
  onClose,
  organizationId,
  mapToEdit,
  setMapToEdit,
  showErrorMessage,
  showSuccessMessage,
  user
}) => {
  const classes = useStyles();
  const isEdit = !!mapToEdit && !!mapToEdit.id;

  const { t } = useTranslation();
  const [area, setArea] = useState();
  const [error, setError] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(fieldIsRequired)
      .max(50, t('views.offlineMaps.form.nameLengthExceeded'))
  });

  const boundsToCoordinates = bounds => {
    const keys = Object.keys(bounds);
    const latitudes = bounds[keys[0]];
    const longitudes = bounds[keys[1]];

    let from = [
      Number(latitudes.g.toPrecision(8)),
      Number(longitudes.g.toPrecision(8))
    ];
    let to = [
      Number(latitudes.i.toPrecision(8)),
      Number(longitudes.i.toPrecision(8))
    ];
    let center = [
      Number(((from[0] + to[0]) / 2).toPrecision(8)),
      Number(((from[1] + to[1]) / 2).toPrecision(8))
    ];

    return {
      from,
      to,
      center
    };
  };

  const checkArea = (from, to) => {
    const MAX_SIZE = 575000; //  diagonal max size in meters

    const R = 6371e3; // metres
    const φ1 = (from[0] * Math.PI) / 180; // φ, λ in radians
    const φ2 = (to[0] * Math.PI) / 180;
    const Δφ = ((to[0] - from[0]) * Math.PI) / 180;
    const Δλ = ((to[1] - from[1]) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in metres

    setError(distance > MAX_SIZE);
  };

  useEffect(() => {
    if (!!area) {
      const { from, to } = boundsToCoordinates(area.getBounds());
      checkArea(from, to);
    }
  }, [area]);

  const onSubmit = values => {
    let coordinates = {};

    if (!!area) {
      coordinates = boundsToCoordinates(area.getBounds());
    }

    let map = {
      organization: Number(organizationId),
      name: values.name,
      description: values.name,
      ...coordinates
    };

    if (isEdit) {
      map = {
        ...mapToEdit,
        ...map
      };
    }

    addOrUpdateOfflineMap(map, user)
      .then(response => {
        showSuccessMessage(t('views.offlineMaps.form.success'));
        onClose(true);
      })
      .catch(e => {
        showErrorMessage(t('views.offlineMaps.form.error'));
      });
  };

  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      className={classes.modal}
      open={open}
      onClose={() => onClose(false)}
    >
      <div className={classes.container}>
        <Typography
          variant="h5"
          test-id="title-bar"
          align="center"
          style={{ marginBottom: '2rem' }}
        >
          {isEdit
            ? t('views.offlineMaps.form.editTitle')
            : t('views.offlineMaps.form.addTitle')}
        </Typography>
        <IconButton
          className={classes.closeIcon}
          key="dismiss"
          onClick={() => onClose(false)}
        >
          <CloseIcon style={{ color: 'green' }} />
        </IconButton>

        <Formik
          initialValues={{
            id: (isEdit && mapToEdit.id) || null,
            name: (isEdit && mapToEdit.name) || ''
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            onSubmit(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form noValidate autoComplete={'off'}>
              <InputWithFormik
                label={t('views.offlineMaps.form.name')}
                name="name"
                required
                className={classes.nameField}
              />
              <Map
                open={open}
                mapToEdit={mapToEdit}
                setArea={newArea => {
                  !!area && !isEdit && area.setVisible(false);
                  if (isEdit) {
                    let coordinates = boundsToCoordinates(newArea.getBounds());
                    checkArea(coordinates.from, coordinates.to);
                    setMapToEdit({ ...mapToEdit, ...coordinates });
                  }
                  setArea(newArea);
                }}
                loadingElement={<div className={classes.mapContainer} />}
                containerElement={<div className={classes.mapContainer} />}
                mapElement={<div className={classes.mapElement} />}
              />

              {error && (
                <FormHelperText error={error} style={{ textAlign: 'center' }}>
                  {t('views.offlineMaps.form.sizeError')}
                </FormHelperText>
              )}

              {isSubmitting && (
                <CircularProgress className={classes.loadingContainer} />
              )}
              <div className={classes.buttonContainerForm}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    !!area && area.setVisible(false);
                  }}
                  disabled={isSubmitting || isEdit}
                >
                  {t('general.clear')}
                </Button>

                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting || (!area && !isEdit) || error}
                >
                  {t('general.save')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(MapFormModal);
