import { Button, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { saveSign, updateSign } from '../../../api';
import iconPen from '../../../assets/pen_icon.png';
import Container from '../../../components/Container';
import ExitModal from '../../../components/ExitModal';
import withLayout from '../../../components/withLayout';
import { ROLES_NAMES } from '../../../utils/role-utils';

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
  title: {
    marginBottom: '1.5rem'
  },
  buttonContainerForm: {
    display: 'flex',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    justifyContent: 'space-evenly'
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
  questionsContainer: {
    height: '25rem',
    paddingTop: '1%',
    paddingBottom: 0,
    paddingLeft: '9%',
    paddingRight: '9%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 9,
    marginTop: '3rem'
  },
  basicInfoText: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconPriorityBorder: {
    border: '2px solid #FFFFFF',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    minWidth: 90,
    minHeight: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-2%',
    position: 'relative'
  },
  iconPriority: {
    maxWidth: 50,
    maxHeight: 50,
    objectFit: 'contain'
  },
  modalTitle: {
    paddingBottom: '2rem'
  },
  canvas: {
    height: '25rem',
    width: '100%',
    background: 'rgba(243, 244, 246, 0.558396)',
    borderRadius: '2px'
  }
}));

const EditSign = ({ history, user, enqueueSnackbar, closeSnackbar }) => {
  let sigPad = useRef();
  const classes = useStyles();
  const { familyId, snapshotId } = useParams();
  const { t } = useTranslation();
  const redirectionPath =
    user.role === ROLES_NAMES.ROLE_FAMILY_USER
      ? `/my-profile`
      : `/family/${familyId}`;

  const [empty, setEmpty] = useState(true);
  const [openExitModal, setOpenExitModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onClear = () => {
    sigPad.clear();
  };
  const onSave = () => {
    setLoading(true);
    let url = sigPad.getTrimmedCanvas().toDataURL('image/png');
    saveSign(user, url)
      .then(response => {
        updateSign(user, snapshotId, response.data[0].url)
          .then(response => {
            enqueueSnackbar(t('views.familySignature.save.success'), {
              variant: 'success',
              action: key => (
                <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                  <CloseIcon style={{ color: 'white' }} />
                </IconButton>
              )
            });
          })
          .catch(() => {
            enqueueSnackbar(t('views.familySignature.save.failed'), {
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
  };

  const allowSumit = () => {
    if (!sigPad.isEmpty()) {
      setEmpty(false);
    }
  };

  return (
    <>
      {loading && (
        <div className={classes.loadingSurveyContainer}>
          <CircularProgress />
        </div>
      )}
      <ExitModal
        open={openExitModal}
        onDissmiss={() => setOpenExitModal(false)}
        onClose={() => history.push(redirectionPath)}
      />
      <Container className={classes.basicInfo} variant="stretch">
        <div className={classes.iconPriorityBorder}>
          <img
            src={iconPen}
            className={classes.iconPriority}
            alt="Priority icon"
          />
        </div>
      </Container>

      <Container className={classes.basicInfoText} variant="fluid">
        <Typography variant="h5">{t('views.sign.addSign')}</Typography>
      </Container>
      <div className={classes.questionsContainer}>
        <SignatureCanvas
          canvasProps={{ className: classes.canvas }}
          onEnd={allowSumit}
          ref={ref => {
            sigPad = ref;
          }}
        />
      </div>

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

        <Button variant="outlined" onClick={onClear}>
          {t('views.sign.erase')}
        </Button>

        <Button
          color="primary"
          variant="contained"
          onClick={onSave}
          disabled={empty}
        >
          {t('general.save')}
        </Button>
      </div>
    </>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withSnackbar(withLayout(EditSign)));
