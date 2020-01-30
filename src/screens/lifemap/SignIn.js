import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { updateUser, updateSurvey, updateDraft } from '../../redux/actions';
import withLayout from '../../components/withLayout';
import Container from '../../components/Container';
import iconPriority from '../../assets/icon_priority.png';
import { withSnackbar } from 'notistack';
import SignatureCanvas from 'react-signature-canvas';
import { withStyles, Typography, Button } from '@material-ui/core';

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
    justifyContent: 'center',
    marginTop: 40,
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
    paddingTop: '5%',
    paddingBottom: 0,
    paddingLeft: '9%',
    paddingRight: '9%'
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
  }
});

const SignIn = ({
  classes,
  t,
  i18n: { language },
  history,
  user,
  enqueueSnackbar,
  closeSnackbar
}) => {
  let sigPad = useRef();
  const [signUrl, setSignUrl] = useState({});

  const onClear = () => {
    sigPad.clear();
  };
  const onSave = () => {
    console.log('Saving Sign');
    console.log(sigPad.getTrimmedCanvas().toDataURL('image/png'));
    setSignUrl({
      trimmedDataURL: sigPad.getTrimmedCanvas().toDataURL('image/png')
    });
  };

  return (
    <div>
      <Container className={classes.basicInfo} variant="stretch">
        <div className={classes.iconPriorityBorder}>
          <img
            src={iconPriority}
            className={classes.iconPriority}
            alt="Priority icon"
          />
        </div>
      </Container>

      <Container className={classes.basicInfoText} variant="fluid">
        <Typography variant="h5">Firme aqui</Typography>
      </Container>
      <div className={classes.questionsContainer}>
        <SignatureCanvas
          canvasProps={{ width: 500, height: 200, className: 'sigPad' }}
          ref={ref => {
            sigPad = ref;
          }}
        />
      </div>

      <div className={classes.buttonContainerForm}>
        <Button color="primary" variant="contained" onClick={onSave}>
          Guardar
        </Button>

        <Button variant="outlined" onClick={onClear}>
          Limpiar
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateUser, updateSurvey, updateDraft };

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(withLayout(withSnackbar(SignIn))))
  )
);
