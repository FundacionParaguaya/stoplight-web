import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Typography
} from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import BackupIcon from '@material-ui/icons/Backup';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import AvatarEditor from 'react-avatar-editor';
import styled from 'styled-components';
import { savePictures, updateFamilyProfilePicture } from '../../../api';
import { MB_SIZE } from '../../../utils/files-utils';
import { theme } from '../../../theme';

const height = '36px';
const thumbHeight = 36;
const upperBackground = `linear-gradient(to bottom, ${
  theme.palette.grey.light
}, ${
  theme.palette.grey.light
}) 100% 50% / 100% ${'16px'} no-repeat transparent`;
const lowerBackground = `linear-gradient(to bottom, ${
  theme.palette.primary.main
}, ${
  theme.palette.primary.main
}) 100% 50% / 100% ${'16px'} no-repeat transparent`;

// Webkit cannot style progress so we fake it with a long shadow on the thumb element
const makeLongShadow = (color, size) => {
  let i = 18;
  let shadow = `${i}px 0 0 ${size} ${color}`;

  for (; i < 706; i++) {
    shadow = `${shadow}, ${i}px 0 0 ${size} ${color}`;
  }

  return shadow;
};

const Wrapper = styled.div`
  margin-top: 30px;
  padding-top: 30px;
`;
const Range = styled.input`
  overflow: hidden;
  display: block;
  appearance: none;
  max-width: 700px;
  width: 100%;
  margin: 0;
  height: ${height};
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: ${height};
    background: ${lowerBackground};
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none;
    height: ${thumbHeight}px;
    width: ${thumbHeight}px;
    background: ${theme.palette.grey.main};
    border-radius: 100%;
    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow(theme.palette.grey.light, '-10px')};
    transition: background-color 150ms;
  }

  &::-moz-range-track,
  &::-moz-range-progress {
    width: 100%;
    height: ${height};
    background: ${upperBackground};
  }

  &::-moz-range-progress {
    background: ${lowerBackground};
  }

  &::-moz-range-thumb {
    appearance: none;
    margin: 0;
    height: ${thumbHeight};
    width: ${thumbHeight};
    background: ${theme.palette.grey.main};
    border-radius: 100%;
    border: 0;
    transition: background-color 150ms;
  }

  &::-ms-track {
    width: 100%;
    height: ${height};
    border: 0;
    /* color needed to hide track marks */
    color: transparent;
    background: transparent;
  }

  &::-ms-fill-lower {
    background: ${lowerBackground};
  }

  &::-ms-fill-upper {
    background: ${upperBackground};
  }

  &::-ms-thumb {
    appearance: none;
    height: ${thumbHeight};
    width: ${thumbHeight};
    background: ${theme.palette.grey.main};
    border-radius: 100%;
    border: 0;
    transition: background-color 150ms;
    /* IE Edge thinks it can support -webkit prefixes */
    top: 0;
    margin: 0;
    box-shadow: none;
  }

  &:hover,
  &:focus {
    &::-webkit-slider-thumb {
      background-color: ${theme.palette.grey.quarter};
    }
    &::-moz-range-thumb {
      background-color: ${theme.palette.grey.quarter};
    }
    &::-ms-thumb {
      background-color: ${theme.palette.grey.quarter};
    }
  }
`;

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
      height: '85vh',
      maxHeight: 600
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
    marginTop: 30,
    [theme.breakpoints.down('xs')]: {
      marginTop: 70
    }
  },
  avatarEditor: {
    position: 'absolute',
    top: '10%',
    [theme.breakpoints.down('xs')]: {
      top: '7%'
    }
  }
}));

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

  const handleScale = e => {
    const imageScale = parseFloat(e.target.value);
    setScale(imageScale);
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
        {!loading && files.length > 0 && files[0] && (
          <Wrapper>
            <Range
              type="range"
              onChange={handleScale}
              min={1}
              max={3}
              step={0.01}
              defaultValue={1}
            />
          </Wrapper>
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
    </Modal>
  );
};

export default withSnackbar(UploadImageModal);
