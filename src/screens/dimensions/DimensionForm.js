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
import {
  createOrUpdateStoplightDimension,
  getDimensionsIcons
} from '../../api';

import CloseIcon from '@material-ui/icons/Close';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconSelector from './IconSelector';
import InputWithFormik from '../../components/InputWithFormik';
import { connect } from 'react-redux';
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
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto'
  }
}));

const fieldIsRequired = 'validation.fieldIsRequired';

const DimensionForm = ({ open, toggleModal, afterSubmit, dimension, user }) => {
  const _isEdit = !!dimension.surveyDimensionId;
  const classes = useStyles();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [dimensionsIcons, setDimensionsIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const id = openIcon ? 'simple-popover' : undefined;
  const openIcon = Boolean(anchorEl);

  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object({
    spanishTitle: Yup.string().required(fieldIsRequired),
    englishTitle: Yup.string().required(fieldIsRequired),
    icon: Yup.string().required(fieldIsRequired)
  });

  const onModalClose = submitted => {
    submitted && afterSubmit();
    toggleModal();
  };

  const handleOpenChangeIcon = event => {
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

  const onSubmit = values => {
    setLoading(true);
    createOrUpdateStoplightDimension(user, values)
      .then(() => {
        onModalClose(true);
        enqueueSnackbar(t('views.dimensions.form.save'), {
          variant: 'success'
        });
      })
      .catch(() => {
        enqueueSnackbar(t('views.dimensions.form.failSave'), {
          variant: 'error'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            id:
              (!!dimension.surveyDimensionId && dimension.surveyDimensionId) ||
              '',
            spanishTitle: '',
            englishTitle: '',
            icon: ''
          }}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, values, touched, setTouched }) => (
            <Form noValidate>
              <InputWithFormik
                label={t('views.dimensions.form.englishTitle')}
                name="englishTitle"
                required
                className={classes.input}
              />
              <InputWithFormik
                label={t('views.dimensions.form.spanishTitle')}
                name="spanishTitle"
                required
                className={classes.input}
              />

              <IconSelector
                items={dimensionsIcons}
                handleOpenChangeIcon={handleOpenChangeIcon}
                id={id}
                anchorEl={anchorEl}
                openIcon={openIcon}
                touched={touched}
                setTouched={setTouched}
                setFieldValue={setFieldValue}
                error={touched.icon && !values.icon}
                icon={values.icon}
                handleCloseChangeIcon={handleCloseChangeIcon}
              />
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
