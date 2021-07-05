import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Typography
} from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import Slider from '@material-ui/core/Slider';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import BackupIcon from '@material-ui/icons/Backup';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from 'notistack';
import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { savePictures } from '../../../api';
import imagePlaceholder from '../../../assets/grey_isologo.png';
import { theme } from '../../../theme';
import { MB_SIZE } from '../../../utils/files-utils';

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
    maxWidth: 650,
    overflowY: 'auto',
    position: 'relative',
    outline: 'none'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    marginTop: 40
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
    height: 410,
    width: 410,
    marginTop: 21,
    padding: 5,
    border: `3px dashed black`,
    backgroundColor: theme.palette.grey.light
  },
  previewContainer: {
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 125,
    height: 125,
    minWidth: 125,
    width: 125,
    marginRight: 16
  },
  hover: {
    cursor: 'pointer',
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000BF',
    zIndex: 2
  },
  img: {
    position: 'relative',
    zIndex: 1,
    minHeight: 125,
    height: 125,
    minWidth: 125,
    width: 125,
    borderRadius: '0 0 4px 4px'
  },
  icon: {
    fontSize: '10vh',
    color: theme.palette.grey.quarter
  },
  placeholderText: {
    paddingTop: 15,
    textAlign: 'center'
  },
  avatarEditor: {
    position: 'absolute',
    top: '10%'
  },
  zoomSelectorContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30
  },
  zoomLabel: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    paddingRight: 25
  },
  buttonContainerForm: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30
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

const ImageForm = ({ imageUrl, handleChange, user }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  const [scale, setScale] = useState(1.0);
  let editorRef = useRef();

  const onSubmit = async () => {
    setLoading(true);
    const imgURL = editorRef.getImage().toDataURL('image/jpeg', 1.0);
    const blob = await (await fetch(imgURL)).blob();
    const file = new File([blob], 'fileName.jpg', {
      type: 'image/jpeg',
      lastModified: new Date()
    });

    savePictures(user, [file])
      .then(response => {
        handleChange(response.data[0].url);
        setOpenModal(false);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(t(`views.surveyBuilder.stoplight.upload.error`), {
          variant: 'error'
        });
        setLoading(false);
      });
  };

  const onDropAccepted = acceptedFiles => {
    setErrorMessage('');
    const accepted = Object.assign(acceptedFiles[0], {
      preview: URL.createObjectURL(acceptedFiles[0])
    });
    setFile(accepted);
  };

  const onDropRejected = rejectedFiles => {
    const dropSize = rejectedFiles[0].size;
    const message =
      dropSize > maxSize
        ? t('views.familyImages.uploadError')
        : t('views.familyImages.typeError');
    setErrorMessage(message);
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxSize,
    multiple: false,
    onDropAccepted,
    onDropRejected,
    accept: ['.png', '.jpg', '.jpeg', '.heic', '.heif']
  });

  const handleScaleChange = (event, newValue) => {
    setScale(newValue);
  };

  return (
    <React.Fragment>
      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={classes.previewContainer}
      >
        {hovering && (
          <div className={classes.hover} onClick={() => setOpenModal(true)}>
            <EditIcon style={{ color: 'white' }} />
            <Typography style={{ color: 'white' }} variant="subtitle2">
              {t('general.edit')}
            </Typography>
          </div>
        )}
        {
          <img
            alt={'colorImage'}
            src={imageUrl ? imageUrl : imagePlaceholder}
            className={classes.img}
          />
        }
      </div>

      <Modal
        disableEnforceFocus
        disableAutoFocus
        className={classes.modal}
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <div className={classes.modalBody}>
          <IconButton
            className={classes.closeIcon}
            key="dismiss"
            onClick={() => setOpenModal(false)}
          >
            <CloseIcon style={{ color: 'green' }} />
          </IconButton>
          <div {...getRootProps({ className: classes.dropzone })}>
            <input {...getInputProps()} />
            <BackupIcon className={classes.icon} />
            <Typography className={classes.placeholderText} variant="subtitle2">
              {t(`views.surveyBuilder.stoplight.upload.placeholder`)}
            </Typography>
          </div>
          {!!file && (
            <AvatarEditor
              ref={ref => {
                editorRef = ref;
              }}
              image={file.preview}
              width={250}
              height={250}
              border={76}
              color={[255, 255, 255, 0.6]}
              scale={scale}
              borderRadius={0}
              rotate={0}
              className={classes.avatarEditor}
            />
          )}
          {!!errorMessage && (
            <FormHelperText error={true} style={{ textAlign: 'center' }}>
              {errorMessage}
            </FormHelperText>
          )}

          {loading && <CircularProgress className={classes.loadingContainer} />}

          {!loading && !!file && (
            <div className={classes.zoomSelectorContainer}>
              <Typography className={classes.zoomLabel} variant="subtitle2">
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
              onClick={() => setOpenModal()}
              disabled={loading}
            >
              {t('general.cancel')}
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading || !!errorMessage}
              onClick={() => onSubmit()}
            >
              {t('general.save')}
            </Button>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(ImageForm);
