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

  const [size, setSize] = useState(0);

  useEffect(() => {
    props.updateDraft({
      ...currentDraft,
      pictures: myFiles
    });
  }, [myFiles]);

  useEffect(() => {
    currentDraft.pictures &&
      currentDraft.pictures.length > 0 &&
      setMyFiles(
        currentDraft.pictures.map(file => {
          delete file.url;
          return file;
        })
      );
  }, []);

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const onDrop = acceptedFiles => {
    let dropSize = 0;
    Promise.all(
      acceptedFiles.map(async file => {
        const image = {};
        image.url = window.URL.createObjectURL(file);
        delete file.url;
        delete file.key;
        delete file.fileSize;
        const base64File = await toBase64(file);
        image.key = new Date().getTime();
        image.path = file.path;
        image.fileSize = file.size;
        dropSize += file.size;
        image.base64 = {
          content: base64File,
          name: file.name,
          type: file.type
        };
        return image;
      })
    ).then(pictures => {
      if (size + dropSize <= 10485760) {
        setMyFiles([...myFiles, ...pictures]);
        setError(false);
        setSize(size + dropSize);
      } else {
        setError(true);
      }
    });
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

  const removeItem = key => {
    let deletedSize = 0;
    let updatedFiles = myFiles.filter(file => {
      if (file.key === key) deletedSize = file.fileSize;
      return file.key !== key;
    });
    updatedFiles ? setMyFiles([...updatedFiles]) : setMyFiles([]);
    setSize(size - deletedSize);
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
          removeItem={removeItem}
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
