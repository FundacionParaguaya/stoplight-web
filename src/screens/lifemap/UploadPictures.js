import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateDraft } from '../../redux/actions';
import { withSnackbar } from 'notistack';
import BottomSpacer from '../../components/BottomSpacer';
import { Typography, makeStyles } from '@material-ui/core';
import FileForm from '../../components/FileForm';
import Container from '../../components/Container';
import TitleBar from '../../components/TitleBar';
import Button from '@material-ui/core/Button';

const mapStateToProps = ({ currentDraft, currentSurvey }) => ({
  currentDraft,
  currentSurvey
});

const mapDispatchToProps = { updateDraft };

const UploadPictures = props => {
  const { currentDraft, currentSurvey } = props;

  const redirectUrl = currentSurvey.surveyConfig.signSupport
    ? '/lifemap/sign'
    : '/lifemap/final';

  const { t } = useTranslation();

  const [error, setError] = useState(false);

  const [myFiles, setMyFiles] = useState([]);

  useEffect(() => {
    props.updateDraft({
      ...currentDraft,
      pictures: myFiles
    });
  }, [myFiles]);

  useEffect(() => {
    currentDraft.pictures &&
      currentDraft.pictures.length > 0 &&
      setMyFiles(currentDraft.pictures);
  }, []);

  const onDrop = acceptedFiles => {
    setError(false);
    setMyFiles([...myFiles, ...acceptedFiles]);
  };

  const onDropRejected = rejectFile => {
    setError(true);
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: true,
    maxSize: 10485760,
    onDrop,
    onDropRejected,
    accept: ['.png', '.jpg', '.heic', '.heif']
  });

  const removeAll = () => {
    setMyFiles([]);
    setError(false);
  };

  return (
    <div>
      <TitleBar title={t('views.yourPictures')} progressBar />
      <br />
      <Container variant="stretch" style={{ textAlign: 'center' }}>
        <FileForm
          acceptedFiles={myFiles}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          removeAll={removeAll}
          t={t}
        />
        {error && (
          <Typography color="error">{t('views.fileUploadError')}</Typography>
        )}
        <Button
          variant="contained"
          test-id="continue"
          color="primary"
          onClick={() => props.history.push(redirectUrl)}
          style={{ color: 'white' }}
        >
          {t('general.continue')}
        </Button>
        <BottomSpacer />
      </Container>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(UploadPictures));
