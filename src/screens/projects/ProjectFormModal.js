import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import PaletteOutlinedIcon from '@material-ui/icons/PaletteOutlined';
import Switch from '@material-ui/core/Switch';
import Popover from '@material-ui/core/Popover';
import { CirclePicker } from 'react-color';
import {
  Modal,
  CircularProgress,
  Typography,
  IconButton,
  Button
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as Yup from 'yup';
import InputWithFormik from '../../components/InputWithFormik';
import { addOrUpdateProject } from '../../api';
import { pickerColor } from '../../utils/styles-utils';

const ProjectFormModal = ({
  open,
  toggleModal,
  afterSubmit,
  user,
  project,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const isCreate = !project.id;
  const classes = useStyles();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const onClose = submitted => {
    submitted && afterSubmit();
    toggleModal();
  };
  const fieldIsRequired = 'validation.fieldIsRequired';

  const openColor = Boolean(anchorEl);
  const id = openColor ? 'simple-popover' : undefined;

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required(fieldIsRequired)
      .max(50, t('views.projects.form.nameLengthExceeded')),
    description: Yup.string()
      .required(fieldIsRequired)
      .max(80, t('views.projects.form.descriptionLengthExceeded'))
  });

  const handleOpenChangeColor = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseChangeColor = () => {
    setAnchorEl(null);
  };

  const onSubmit = values => {
    addOrUpdateProject(user, { ...values })
      .then(() => {
        setLoading(false);
        onClose(true);
        enqueueSnackbar(t('views.projects.form.save.success'), {
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
        enqueueSnackbar(t('views.projects.form.save.failed'), {
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

  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      open={open}
      onClose={() => onClose(false)}
      className={classes.modal}
    >
      {loading ? (
        <div className={classes.confirmationModal}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.confirmationModal}>
          <Typography className={classes.title} variant="h5" align="center">
            {isCreate
              ? t('views.projects.form.addTitle')
              : t('views.projects.form.editTitle')}
          </Typography>
          <IconButton
            className={classes.closeIcon}
            key="dismiss"
            onClick={() => {
              onClose(false);
            }}
          >
            <CloseIcon style={{ color: 'green' }} />
          </IconButton>
          <Formik
            initialValues={{
              id: (!!project.id && project.id) || '',
              title: (!!project.title && project.title) || '',
              description: (!!project.description && project.description) || '',
              active: !isCreate ? project.active : true,
              color: (!!project.color && project.color) || ''
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
                  label={t('views.projects.form.name')}
                  name="title"
                  required
                  className={classes.input}
                />
                <InputWithFormik
                  label={t('views.projects.form.description')}
                  name="description"
                  required
                  className={classes.input}
                />
                {!isCreate && (
                  <div className={classes.switchOptionsContainer}>
                    <Typography
                      variant="subtitle1"
                      className={classes.switchLabel}
                    >
                      {t('views.projects.form.active')}
                    </Typography>
                    <Switch
                      name={'active'}
                      value={'active'}
                      onChange={e => {
                        setFieldValue('active', !values.active);
                      }}
                      checked={values.active}
                      color="primary"
                    />
                  </div>
                )}
                <div className={classes.switchOptionsContainer}>
                  <Typography
                    variant="subtitle1"
                    className={classes.switchLabel}
                  >
                    {t('views.projects.form.color')}
                  </Typography>
                  {values.color ? (
                    <div
                      className={classes.circle}
                      style={{ background: values.color ? values.color : null }}
                      onClick={handleOpenChangeColor}
                    />
                  ) : (
                    <PaletteOutlinedIcon
                      style={{
                        color: '#309E43',
                        marginRight: 10,
                        cursor: 'pointer'
                      }}
                      onClick={handleOpenChangeColor}
                    />
                  )}

                  <Popover
                    id={id}
                    anchorEl={anchorEl}
                    open={openColor}
                    onClose={handleCloseChangeColor}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left'
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                  >
                    <div className={classes.colorPicker}>
                      <CirclePicker
                        circleSpacing={20}
                        onChange={color => {
                          setFieldValue('color', color.hex);
                          handleCloseChangeColor();
                        }}
                        colors={pickerColor}
                      />
                    </div>
                  </Popover>
                </div>
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

const useStyles = makeStyles(theme => ({
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
    justifyContent: 'center',
    padding: '40px 50px',
    maxHeight: '65vh',
    minHeight: '45vh',
    width: '500px',
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
  crossIcon: {
    color: 'green'
  },
  colorPicker: {
    padding: 10,

    overflow: 'hidden'
  },
  title: {
    paddingBottom: 30
  },
  input: {
    marginBottom: 10,
    marginTop: 10
  },
  switchOptionsContainer: {
    display: 'flex',
    marginBottom: '1em',
    marginTop: '1em',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  switchLabel: {
    fontWeight: 400,
    padding: 11,
    paddingLeft: 14,
    font: 'Roboto'
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30
  },
  circle: {
    marginRight: 12,
    borderRadius: '50%',
    width: 20,
    height: 20,
    cursor: 'pointer'
  }
}));

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(withSnackbar(ProjectFormModal));
