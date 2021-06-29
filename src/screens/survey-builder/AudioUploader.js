import { Tooltip, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import BackupIcon from '@material-ui/icons/Backup';
import GetAppIcon from '@material-ui/icons/GetApp';
import NotInterestedIcon from '@material-ui/icons/HighlightOff';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { uploadAudio } from '../../api';
import AudioHelp from '../../components/AudioHelp';
import { MB_SIZE } from '../../utils/files-utils';

const useStyles = makeStyles(theme => ({
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '15vh',
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
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  deleteIcon: {
    height: 'min-content',
    color: 'red',
    opacity: '50%',
    padding: 4,
    marginLeft: 4,
    '&:hover': {
      opacity: '100%'
    }
  }
}));

const maxSize = 10 * MB_SIZE;

const AudioUploader = ({ audioUrl, onChange, user }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [errorMessage, setErrorMessage] = useState('');
  const [playAudio, setPlayAudio] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDropAccepted = acceptedFiles => {
    setLoading(true);
    setErrorMessage('');
    uploadAudio(acceptedFiles[0], user)
      .then(response => {
        onChange(response.data);
        setLoading(false);
      })
      .catch(() => {
        enqueueSnackbar(t('views.surveyBuilder.audio.saveError'), {
          variant: 'error'
        });
        setLoading(false);
      });
  };

  const onDropRejected = rejectedFiles => {
    const dropSize = rejectedFiles[0].size;
    const message =
      dropSize > maxSize
        ? t('views.surveyBuilder.audio.maxSize')
        : t('views.surveyBuilder.audio.extensionError');
    setErrorMessage(message);
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: maxSize,
    onDropAccepted,
    onDropRejected,
    accept: ['.mp3']
  });

  return (
    <React.Fragment>
      <div
        {...getRootProps({ className: classes.dropzone })}
        data-testid="dropzone"
      >
        <input {...getInputProps()} />
        {loading ? (
          <CircularProgress />
        ) : (
          <BackupIcon className={classes.icon} />
        )}
        <Typography style={{ paddingTop: 15 }} variant="subtitle2">
          {t('views.surveyBuilder.audio.placeholder')}
        </Typography>
      </div>

      {!!errorMessage && (
        <FormHelperText error={true} style={{ textAlign: 'center' }}>
          {errorMessage}
        </FormHelperText>
      )}

      {!!audioUrl && (
        <div className={classes.container}>
          <AudioHelp
            label={t('views.surveyBuilder.audio.currentAudio')}
            audio={audioUrl}
            playAudio={playAudio}
            handlePlayPause={() => setPlayAudio(!playAudio)}
            handleStop={() => setPlayAudio(false)}
          />
          <div>
            <Tooltip title={t('general.delete')} className={classes.deleteIcon}>
              <IconButton
                color="default"
                component="span"
                onClick={() => onChange('')}
              >
                <NotInterestedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('views.final.download')}>
              <IconButton href={audioUrl} download color="primary">
                <GetAppIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(AudioUploader);
