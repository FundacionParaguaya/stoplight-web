import * as Yup from 'yup';
import * as _ from 'lodash';

import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Popover,
  Typography
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';

import CloseIcon from '@material-ui/icons/Close';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputWithFormik from '../../components/InputWithFormik';
import PhotoSizeSelectActualSharpIcon from '@material-ui/icons/PhotoSizeSelectActualSharp';
import { connect } from 'react-redux';
import { getDimensionsIcons } from '../../api';
import logo from '../../assets/dimension_income.png';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
    maxHeight: '100vh'
  },
  container: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '40px 50px',
    maxHeight: '85vh',
    minHeight: '45vh',
    width: '85vw',
    maxWidth: 500,
    overflow: 'auto',
    position: 'relative',
    outline: 'none'
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },
  input: {
    marginBottom: 10,
    marginTop: 10
  },
  icon: {
    width: 40,
    marginRight: 5
  },
  smallIcon: {
    width: 32
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30,
    marginBottom: 30
  },
  selectorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  label: {
    fontWeight: 400,
    fontFamily: 'Roboto'
  }
}));

const fieldIsRequired = 'validation.fieldIsRequired';

const DimensionForm = ({ open, toggleModal, afterSubmit, dimension, user }) => {
  const _isEdit = !!dimension.id;
  const classes = useStyles();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { enqueSnackbar } = useSnackbar();
  const [dimensionsIcons, setDimensionsIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const id = openIcon ? 'simple-popover' : undefined;
  const openIcon = Boolean(anchorEl);

  const validationSchema = Yup.object({
    title: Yup.string().required(fieldIsRequired),
    spanishTitle: Yup.string().required(fieldIsRequired),
    englishTitle: Yup.string().required(fieldIsRequired)
  });

  const onModalClose = submitted => {
    submitted && afterSubmit();
    toggleModal();
  };

  const handleOpenChangeIcon = event => {
    console.log('ola');
    setAnchorEl(event.currentTarget);
  };

  const handleCloseChangeIcon = () => {
    setAnchorEl(null);
  };

  const loadDimensionsIcons = () => {
    getDimensionsIcons(user).then(response => {
      const data = _.get(response, 'data.data.dimensionsIcons', []);
      setDimensionsIcons(data);
    });
  };

  useEffect(() => {
    loadDimensionsIcons();
  }, []);

  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      className={classes.modal}
      open={open}
      onClose={() => onModalClose(false)}
    >
      <div className={classes.container}>
        <Typography className={classes.title} variant="h5" align="center">
          {_isEdit
            ? t('views.dimensions.form.editTitle')
            : t('views.dimensions.form.createTitle')}
        </Typography>
        <IconButton
          className={classes.closeIcon}
          key="dismiss"
          onClick={() => onModalClose(false)}
        >
          <CloseIcon color="primary" />
        </IconButton>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            id: '',
            title: '',
            spanishTitle: '',
            englishTitle: '',
            icon: ''
          }}
        >
          {({ setFieldValue, values, touched, setTouched }) => (
            <Form noValidate>
              <InputWithFormik
                label={t('views.dimensions.form.title')}
                name="title"
                required
                className={classes.input}
              />
              <InputWithFormik
                label={t('views.dimensions.form.spanishTitle')}
                name="spanishTitle"
                required
                className={classes.input}
              />
              <InputWithFormik
                label={t('views.dimensions.form.englishTitle')}
                name="englishTitle"
                required
                className={classes.input}
              />
              <div className={classes.selectorContainer}>
                <Typography variant="subtitle1" className={classes.label}>
                  {t('views.dimensions.form.change')}
                </Typography>
                {values.icon ? (
                  <img
                    src={values.icon}
                    className={classes.smallIcon}
                    onClick={handleOpenChangeIcon}
                  />
                ) : (
                  <PhotoSizeSelectActualSharpIcon
                    color="primary"
                    onClick={event => {
                      setTouched(
                        Object.assign(touched, {
                          icon: true
                        })
                      );
                      handleOpenChangeIcon(event);
                    }}
                  />
                )}

                <Popover
                  id={id}
                  anchorEl={anchorEl}
                  open={openIcon}
                  onClose={handleCloseChangeIcon}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                  }}
                >
                  <Grid
                    container
                    style={{
                      marginTop: 10,
                      maxHeight: 140,
                      maxWidth: 360
                    }}
                  >
                    {dimensionsIcons.map((dimensionIcon, index) => {
                      return (
                        <Grid
                          key={index}
                          md={4}
                          sm={4}
                          xs={4}
                          align="center"
                          item
                        >
                          <img
                            onClick={() => {
                              setFieldValue('icon', dimensionIcon.value);
                              handleCloseChangeIcon();
                            }}
                            src={dimensionIcon.value}
                            className={classes.icon}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Popover>
              </div>
              {touched.icon && !values.icon && (
                <FormHelperText error={touched.icon && !values.icon}>
                  {t('validation.fieldIsRequired')}
                </FormHelperText>
              )}
              {loading && (
                <CircularProgress className={classes.loadingContainer} />
              )}
              <div className={classes.buttonContainerForm}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={loading}
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

export default connect(mapStateToProps)(DimensionForm);
