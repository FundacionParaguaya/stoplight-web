import { Button, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useParams } from 'react-router-dom';
import {
  getFamilyImages,
  savePictures,
  updateFamilyImages
} from '../../../api';
import ExitModal from '../../../components/ExitModal';
import withLayout from '../../../components/withLayout';
import { ROLES_NAMES } from '../../../utils/role-utils';
import ImageUploader from './ImageUploader';

const useStyles = makeStyles(theme => ({
  loadingSurveyContainer: {
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  },
  mainContainer: {
    padding: '2rem 12%'
  },
  title: {
    marginBottom: '1.5rem'
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 40
  }
}));

const EditIamges = ({ enqueueSnackbar, closeSnackbar, user, history }) => {
  const classes = useStyles();
  const { familyId, snapshotId } = useParams();
  const { t } = useTranslation();
  const redirectionPath =
    user.role === ROLES_NAMES.ROLE_FAMILY_USER
      ? `/my-profile`
      : `/family/${familyId}`;

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openExitModal, setOpenExitModal] = useState(false);
  const [fileError, setFileError] = useState(false);

  useEffect(() => {
    setLoading(true);
    getFamilyImages(familyId, user).then(response => {
      const pictures = response.data.data.picturesSignaturesByFamily
        .filter(el => el.category === 'picture')
        .map(file => ({
          url: file.url,
          category: file.category,
          name: file.url.split('stoplight-file-')[1],
          saved: true
        }));
      setImages(pictures);
      setLoading(false);
    });
  }, [familyId]);

  const onSubmit = () => {
    setLoading(true);
    let newImages = images.filter(image => !image.saved) || [];
    let oldImages = images.filter(image => image.saved) || [];
    oldImages = oldImages.map(image => ({
      file: null,
      content: null,
      name: null,
      category: null,
      type: null,
      url: image.url
    }));
    if (newImages.length > 0) {
      savePictures(user, newImages)
        .then(response => {
          updateFamily([...oldImages, ...response.data]);
        })
        .catch(() => {
          enqueueSnackbar(t('views.familyImages.save.failed'), {
            variant: 'error',
            action: key => (
              <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                <CloseIcon style={{ color: 'white' }} />
              </IconButton>
            )
          });
        });
    } else {
      updateFamily(oldImages);
    }
  };

  const updateFamily = pictures => {
    updateFamilyImages(user, snapshotId, pictures)
      .then(response => {
        enqueueSnackbar(t('views.familyImages.save.success'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      })
      .catch(() => {
        enqueueSnackbar(t('views.familyImages.save.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      })
      .finally(() => {
        history.push(redirectionPath);
      });
  };

  return (
    <>
      {loading && (
        <div className={classes.loadingSurveyContainer}>
          <CircularProgress />
        </div>
      )}
      <Prompt
        when={!openExitModal && !loading}
        message={t('views.exitModal.confirmText')}
      />
      <ExitModal
        open={openExitModal}
        onDissmiss={() => setOpenExitModal(false)}
        onClose={() => history.push(redirectionPath)}
      />
      <div className={classes.mainContainer}>
        <Typography variant="h4" className={classes.title}>
          {`${t('views.familyImages.uploadImages')}:`}
        </Typography>
        <ImageUploader
          files={images}
          setFiles={setImages}
          fileError={fileError}
          setFileError={setFileError}
        />

        <div className={classes.buttonContainerForm}>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenExitModal(true);
            }}
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
    </>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withSnackbar(withLayout(EditIamges)));
