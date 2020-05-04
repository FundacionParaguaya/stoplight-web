import React, { useState } from 'react';
import {
  Modal,
  Typography,
  Button,
  CircularProgress,
  IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import InputWithFormik from '../../components/InputWithFormik';
import AutocompleteWithFormik from '../../components/AutocompleteWithFormik';
import * as Yup from 'yup';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import { useDropzone } from 'react-dropzone';
import { MB_SIZE, toBase64 } from '../../utils/files-utils';
import { addOrUpdateHub } from '../../api';

const useStyles = makeStyles(theme => ({
  typographyStyle: {
    marginBottom: 20
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30
  },
  confirmationModal: {
    backgroundColor: theme.palette.background.default,
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
    padding: '40px 50px'
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },
  dropzone: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 70,
    paddingBottom: 15,
    borderWidth: 4,
    borderRadius: 2,
    borderColor: theme.palette.grey.quarter,
    borderStyle: 'dashed',
    backgroundColor: theme.palette.grey.light,
    outline: 'none',
    width: '100%'
  },
  img: {
    position: 'absolute',
    width: '40%',
    height: '70%',
    top: '10%',
    left: '30%',
    backgroundColor: theme.palette.background.default
  },
  icon: {
    fontSize: '8vh',
    color: theme.palette.grey.quarter
  }
}));

const DeleteFamilyModal = ({
  open,
  toggleModal,
  user,
  hub,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const isCreate = !hub.id;
  const classes = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [file, setFile] = useState('');

  const langagueOptions = [
    { label: 'English', value: 'en_US' },
    { label: 'Español', value: 'es_PY' },
    { label: 'Português', value: 'pt_BR' }
  ];
  const fieldIsRequired = 'validation.fieldIsRequired';

  //Validation criterias
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(fieldIsRequired)
      .max(50, t('views.hub.form.nameLengthExceeded')),
    description: Yup.string()
      .required(fieldIsRequired)
      .max(256, t('views.hub.form.descriptionLengthExceeded')),
    language: Yup.string().required(fieldIsRequired)
  });

  const onDrop = async acceptedFiles => {
    setError(false);
    const base64File = await toBase64(acceptedFiles[0]);
    setFile(base64File);
  };

  const onDropRejected = () => {
    setError(true);
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 10 * MB_SIZE,
    onDrop,
    onDropRejected,
    accept: ['.png', '.jpg', '.heic', '.heif']
  });

  const onSubmit = values => {
    setLoading(true);
    addOrUpdateHub(user, { ...values, file })
      .then(() => {
        setLoading(false);
        onClose({ deleteModalOpen: false });
        enqueueSnackbar(t('views.hub.form.save.success'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(t('views.hub.form.save.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setLoading(false);
        onClose();
      });
  };
  const onClose = () => {
    setFile('');
    toggleModal();
  };
  return (
    <Modal open={open} onClose={() => onClose()}>
      {loading ? (
        <div className={classes.confirmationModal}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.confirmationModal}>
          <Typography
            variant="h4"
            test-id="title-bar"
            align="center"
            className={classes.typographyStyle}
          >
            {isCreate
              ? t('views.hub.form.addTitle')
              : t('views.hub.form.editTitle')}
          </Typography>
          <IconButton
            className={classes.closeIcon}
            key="dismiss"
            onClick={() => onClose()}
          >
            <CloseIcon style={{ color: 'green' }} />
          </IconButton>
          <Formik
            initialValues={{
              id: (!!hub.id && hub.id) || '',
              name: (!!hub.name && hub.name) || '',
              description: (!!hub.description && hub.description) || '',
              language: (!!hub.language && hub.language) || ''
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
              setLoading(true);
              onSubmit(values);
            }}
          >
            <Form>
              <InputWithFormik
                label={t('views.hub.form.name')}
                name="name"
                required
              />
              <InputWithFormik
                label={t('views.hub.form.description')}
                name="description"
                required
              />
              <AutocompleteWithFormik
                label={t('views.hub.form.language')}
                name="language"
                rawOptions={langagueOptions}
                labelKey="label"
                valueKey="value"
                isClearable={false}
                required
              />
              <div style={{ position: 'relative' }}>
                <div {...getRootProps({ className: classes.dropzone })}>
                  <input {...getInputProps()} />
                  <AddAPhoto className={classes.icon} />
                  <Typography style={{ paddingTop: 55 }} variant="subtitle1">
                    {!isCreate && !!hub.logoUrl
                      ? t('views.hub.form.changeLogo')
                      : t('views.hub.form.logoUpload')}{' '}
                  </Typography>
                </div>
                {(!!file || !!hub.logoUrl) && (
                  <img
                    src={file ? file : hub.logoUrl}
                    alt="Choose Life Map"
                    className={classes.img}
                  />
                )}
              </div>

              {error && (
                <Typography color="error">
                  {t('views.fileUploadError')}
                </Typography>
              )}
              <div className={classes.buttonContainerForm}>
                <Button type="submit" color="primary" variant="contained">
                  {t('general.save')}
                </Button>
              </div>
            </Form>
          </Formik>
        </div>
      )}
    </Modal>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(withSnackbar(DeleteFamilyModal));
