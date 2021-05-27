import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Typography
} from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import BackupIcon from '@material-ui/icons/Backup';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import AvatarEditor from 'react-avatar-editor';
import { savePictures, updateFamilyProfilePicture } from '../../../api';
import { MB_SIZE } from '../../../utils/files-utils';
import { theme } from '../../../theme';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalBody: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '40px 50px',
    minHeight: '35vh',
    width: '85vw',
    maxWidth: 800,
    overflowY: 'auto',
    position: 'relative',
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      height: 'auto',
      maxHeight: 600,
      padding: '60px 35px'
    }
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto'
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '35vh',
    marginTop: 8,
    padding: 5,
    borderWidth: 3,
    borderRadius: 2,
    borderColor: theme.palette.grey.quarter,
    borderStyle: 'dashed',
    backgroundColor: theme.palette.grey.light,
    outline: 'none',
    width: '100%',
    marginBottom: 10
  },
  icon: {
    fontSize: '10vh',
    color: theme.palette.grey.quarter
  },
  buttonContainerForm: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30
  },
  avatarEditor: {
    position: 'absolute',
    top: '10%',
    [theme.breakpoints.down('xs')]: {
      top: '7%'
    }
  }
}));

const ZoomSlider = withStyles({
  root: {
    color: theme.palette.primary.main,
    height: 8
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit'
    }
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)'
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  }
})(Slider);

const maxSize = 10 * MB_SIZE;

const UploadImageModal = ({
  open,
  toggleModal,
  user,
  familyId,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState([]);
  const [filesSize, setFilesSize] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [typeError, setTypeError] = useState(false);

  const [scale, setScale] = useState(1.0);
  let editorRef = useRef();

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
    setFileError(filesSize > maxSize);
  }, [filesSize]);

  const onDropAccepted = acceptedFiles => {
    setTypeError(false);
    let dropSize = 0;
    const accepted = acceptedFiles.map(file => {
      dropSize += file.size;
      return file.type.includes('image/')
        ? Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        : file;
    });
    const newFiles = [...files, ...accepted];
    setFiles(newFiles);
    setFilesSize(filesSize + dropSize);
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxSize,
    multiple: false,
    onDropAccepted,
    onDropRejected: () => setTypeError(true),
    accept: ['.png', '.jpg', '.jpeg', '.heic', '.heif']
  });

  const onSubmit = async () => {
    const imgURL = editorRef.getImage().toDataURL('image/jpeg', 1.0);

    const blob = await (await fetch(imgURL)).blob();
    const file = new File([blob], 'fileName.jpg', {
      type: 'image/jpeg',
      lastModified: new Date()
    });

    setLoading(true);
    savePictures(user, [file])
      .then(response => {
        updateFamilyProfilePicture(familyId, response.data[0].url, user)
          .then(() => {
            showSuccessMessage(t('views.myProfile.picture.save.success'));
            toggleModal(true);
            setLoading(false);
          })
          .catch(() => {
            showErrorMessage(t('views.myProfile.picture.save.error'));
            setLoading(false);
          });
      })
      .catch(() => {
        showErrorMessage(t('views.myProfile.picture.save.error'));
        setLoading(false);
      });
  };

  const handleScaleChange = (event, newValue) => {
    setScale(newValue);
  };

  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      className={classes.modal}
      open={open}
      onClose={() => toggleModal(false)}
    >
      <div className={classes.modalBody}>
        <IconButton
          className={classes.closeIcon}
          key="dismiss"
          onClick={() => toggleModal(false)}
        >
          <CloseIcon style={{ color: 'green' }} />
        </IconButton>
        <div
          {...getRootProps({ className: classes.dropzone })}
          data-testid="dropzone"
        >
          <input {...getInputProps()} />
          <BackupIcon className={classes.icon} />
          <Typography
            style={{ paddingTop: 15, textAlign: 'center' }}
            variant="subtitle2"
          >
            {t('views.myProfile.picture.placeholder')}
          </Typography>
        </div>
        {files.length > 0 && files[0] && (
          <AvatarEditor
            ref={ref => {
              editorRef = ref;
            }}
            image={files[0].preview}
            width={152}
            height={152}
            border={76}
            color={[255, 255, 255, 0.6]} // RGBA s
            scale={scale}
            borderRadius={125}
            rotate={0}
            className={classes.avatarEditor}
          />
        )}
        {fileError && (
          <FormHelperText error={fileError} style={{ textAlign: 'center' }}>
            {t('views.myProfile.picture.uploadError')}
          </FormHelperText>
        )}
        {typeError && (
          <FormHelperText error={typeError} style={{ textAlign: 'center' }}>
            {t('views.familyImages.typeError')}
          </FormHelperText>
        )}

        {loading && <CircularProgress className={classes.loadingContainer} />}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 30
          }}
        >
          {!loading && files.length > 0 && files[0] && (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Typography
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  paddingRight: 25
                }}
                variant="subtitle2"
              >
                {t('views.myProfile.picture.zoom')}
              </Typography>
              <div style={{ width: 150 }}>
                <ZoomSlider
                  onChange={handleScaleChange}
                  min={1}
                  max={3}
                  step={0.01}
                  defaultValue={1}
                />
              </div>
            </div>
          )}
          <div className={classes.buttonContainerForm}>
            <Button
              variant="outlined"
              onClick={() => toggleModal()}
              disabled={loading}
            >
              {t('general.cancel')}
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading || fileError}
              onClick={() => onSubmit()}
            >
              {t('general.save')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default withSnackbar(UploadImageModal);
