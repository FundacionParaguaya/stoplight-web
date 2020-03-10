import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { updateUser, updateSurvey, updateDraft } from '../../redux/actions';
import Container from '../../components/Container';
import iconPen from '../../assets/pen_icon.png';
import { withSnackbar } from 'notistack';
import SignatureCanvas from 'react-signature-canvas';
import { withStyles, Typography, Button } from '@material-ui/core';
import TitleBar from '../../components/TitleBar';

const styles = theme => ({
  backButton: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 9,
    marginBottom: '3rem'
  },
  typographyStyle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4)
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
    //position: 'relative'
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
});

const SignIn = ({
  classes,
  t,
  i18n: { language },
  currentSurvey,
  currentDraft,
  history,
  updateSurvey,
  user,
  enqueueSnackbar,
  closeSnackbar,
  updateDraft
}) => {
  let sigPad = useRef();
  const [empty, setEmpty] = useState(true);
  const [displaySign, setDisplaySign] = useState(false);

  const onClear = () => {
    !displaySign && sigPad.clear();
    setEmpty(true);
    setDisplaySign(false);
  };
  const onSave = () => {
    console.log('Saving Sign');

    if (!displaySign) {
      let url = sigPad.getTrimmedCanvas().toDataURL('image/png');
      // console.log(url);

      // If item does not exist create it
      updateDraft({
        ...currentDraft,
        sign: url
      });
    }

    handleContinue();
  };

  const handleContinue = () => {
    history.push('/lifemap/final');
  };

  useEffect(() => {
    console.log('Drawing Current Sign');
    //Draw a canvas if it already exists
    if (currentDraft.sign) {
      setEmpty(false);
      setDisplaySign(true);
    }
  }, []);

  const allowSumit = () => {
    if (!sigPad.isEmpty()) {
      setEmpty(false);
    }
  };

  return (
    <div>
      <TitleBar title={t('views.yourLifeMap')} progressBar />
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
        <Typography variant="h5">{t('views.sign.signHere')}</Typography>
      </Container>
      <div className={classes.questionsContainer}>
        {displaySign ? (
          <img
            src={currentDraft.sign}
            alt="signImg"
            style={{
              height: currentDraft.sign.height,
              width: currentDraft.sign.width
            }}
          />
        ) : (
          <SignatureCanvas
            canvasProps={{ className: classes.canvas }}
            onEnd={allowSumit}
            ref={ref => {
              sigPad = ref;
            }}
          />
        )}
      </div>

      <div className={classes.buttonContainerForm}>
        <Button variant="outlined" onClick={onClear}>
          {t('views.sign.erase')}
        </Button>

        <Button
          color="primary"
          variant="contained"
          onClick={onSave}
          disabled={empty}
        >
          {t('views.sign.continue')}
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});

const mapDispatchToProps = { updateUser, updateSurvey, updateDraft };

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(withSnackbar(SignIn)))
  )
);
