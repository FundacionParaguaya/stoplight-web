import * as Yup from 'yup';
import * as _ from 'lodash';

import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Typography
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';

import CloseIcon from '@material-ui/icons/Close';
import IconSelector from './IconSelector';
import InputWithFormik from '../../components/InputWithFormik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createOrUpdateStoplightDimension } from '../../api';
import { getDimensionbyId } from '../../api';
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

const DimensionForm = ({
  open,
  toggleModal,
  afterSubmit,
  surveyDimensionId,
  user,
  icons
}) => {
  const _isEdit = !!surveyDimensionId;
  const classes = useStyles();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [dimension, setDimension] = useState(null);

  const [loading, setLoading] = useState(false);
  const openIcon = Boolean(anchorEl);
  const id = openIcon ? 'simple-popover' : undefined;

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

  const handleChangeIcon = event => {
    if (!!anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const loadDimension = () => {
    getDimensionbyId(user, surveyDimensionId).then(response => {
      const data = _.get(response, 'data.data.retrieveDimension');
      setDimension(data);
    });
  };

  useEffect(() => {
    if (_isEdit && open) {
      loadDimension();
    } else {
      setDimension(null);
    }
  }, [open]);

  const onSubmit = values => {
    setLoading(true);
    createOrUpdateStoplightDimension(user, values)
      .then(() => {
        onModalClose(true);
        enqueueSnackbar(t('views.dimensions.form.saved'), {
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

  const enTranslation =
    !!dimension &&
    (
      dimension.translations.find(translation => translation.lang === 'EN') || {
        translation: ''
      }
    ).translation;
  const esTranslation =
    !!dimension &&
    (
      dimension.translations.find(translation => translation.lang === 'ES') || {
        translation: ''
      }
    ).translation;

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
            id: (!!dimension && dimension.id) || '',
            spanishTitle: esTranslation || '',
            englishTitle: enTranslation || '',
            icon: (!!dimension && dimension.iconUrl) || ''
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
                items={icons}
                handleChangeIcon={handleChangeIcon}
                id={id}
                anchorEl={anchorEl}
                openIcon={openIcon}
                onChangeIcon={value => setFieldValue('icon', value)}
                onBlur={() =>
                  setTouched(
                    Object.assign(touched, {
                      icon: true
                    })
                  )
                }
                setTouched={setTouched}
                setFieldValue={setFieldValue}
                error={touched.icon && !values.icon}
                icon={values.icon}
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

DimensionForm.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  afterSubmit: PropTypes.func.isRequired,
  surveyDimensionId: PropTypes.number,
  user: PropTypes.object.isRequired,
  icons: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(DimensionForm);
