import React, { useState } from 'react';
import {
  Modal,
  Typography,
  withStyles,
  Button,
  CircularProgress,
  IconButton,
  Checkbox
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
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmationModal: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '40px 50px',
    maxHeight: '95vh',
    width: '500px',
    overflowY: 'auto',
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
  dropzone: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 5,
    paddingTop: 70,
    paddingBottom: 10,
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
    top: '10%',
    left: '30%',
    backgroundColor: theme.palette.background.default
  },
  icon: {
    fontSize: '8vh',
    color: theme.palette.grey.quarter
  },
  allowRetake: {
    fontWeight: 400,
    padding: 11,
    paddingLeft: 14,
    font: 'Roboto'
  }
}));

const HubFormModal = ({
  open,
  toggleModal,
  afterSubmit,
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

  const partnerTypeOptions = [
    { label: 'Hub', value: 'HUB' },
    { label: 'Special Project', value: 'SPECIAL_PROJECT' }
  ];
  const fieldIsRequired = 'validation.fieldIsRequired';

  const GreenCheckbox = withStyles(theme => ({
    root: {
      color: theme.palette.grey.main
    },
    checked: {
      color: theme.palette.primary.main
    }
  }))(props => <Checkbox color={'default'} {...props} />);

  //Validation criterias
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(fieldIsRequired)
      .max(50, t('views.hub.form.nameLengthExceeded')),
    description: Yup.string()
      .required(fieldIsRequired)
      .max(256, t('views.hub.form.descriptionLengthExceeded')),
    language: Yup.string().required(fieldIsRequired),
    partnerType: Yup.string().required(fieldIsRequired)
  });

  const onDropAccepted = async acceptedFiles => {
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
    onDropAccepted,
    onDropRejected,
    accept: ['.png', '.jpg', '.heic', '.heif']
  });

  const onSubmit = values => {
    if (values.allowRetake) {
      delete values.allowRetake;
      values.labels = ['allowRetake'];
    }
    addOrUpdateHub(user, { ...values, file })
      .then(() => {
        setLoading(false);
        onClose(true);
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
        onClose(true);
      });
  };
  const onClose = submitted => {
    setFile('');
    submitted && afterSubmit();
    toggleModal();
  };
  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      className={classes.modal}
      open={open}
      onClose={() => onClose(false)}
    >
      {loading ? (
        <div className={classes.confirmationModal}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.confirmationModal}>
          <Typography variant="h5" test-id="title-bar" align="center">
            {isCreate
              ? t('views.hub.form.addTitle')
              : t('views.hub.form.editTitle')}
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
              id: (!!hub.id && hub.id) || '',
              name: (!!hub.name && hub.name) || '',
              description: (!!hub.description && hub.description) || '',
              language: (!!hub.language && hub.language) || '',
              partnerType: (!!hub.partnerType && hub.partnerType) || '',
              allowRetake: !!hub.labels
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
              setLoading(true);
              onSubmit(values);
            }}
          >
            {({ setFieldValue, values }) => (
              <Form noValidate>
                <InputWithFormik
                  label={t('views.hub.form.name')}
                  name="name"
                  required
                  className={classes.input}
                />
                <InputWithFormik
                  label={t('views.hub.form.description')}
                  name="description"
                  required
                  className={classes.input}
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
                <AutocompleteWithFormik
                  label={t('views.hub.form.partnerType')}
                  name="partnerType"
                  rawOptions={partnerTypeOptions}
                  labelKey="label"
                  valueKey="value"
                  isClearable={false}
                  required
                />
                <div style={{ display: 'flex' }}>
                  <Typography
                    variant="subtitle1"
                    className={classes.allowRetake}
                  >
                    {t('views.hub.form.allowRetake')}
                  </Typography>
                  <GreenCheckbox
                    name={'allowRetake'}
                    value={'allowRetake'}
                    onChange={e => {
                      setFieldValue('allowRetake', !values.allowRetake);
                    }}
                    checked={values.allowRetake}
                  />
                </div>
                <div style={{ position: 'relative', marginBottom: 10 }}>
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
                    {t('views.hub.form.fileUploadError')}
                  </Typography>
                )}
                <div className={classes.buttonContainerForm}>
                  <Button type="submit" color="primary" variant="contained">
                    {t('general.save')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </Modal>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(withSnackbar(HubFormModal));
