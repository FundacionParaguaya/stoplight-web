import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { updateUser, updateSurvey, updateDraft } from '../../redux/actions';
import withLayout from '../../components/withLayout';
import DimensionQuestion from '../../components/summary/DimensionQuestion';
import Container from '../../components/Container';
import iconPriority from '../../assets/icon_priority.png';
import { Formik, Form } from 'formik';
import InputWithFormik from '../../components/InputWithFormik';
import AutocompleteWithFormik from '../../components/AutocompleteWithFormik';
import { withStyles, Modal, Typography, Button } from '@material-ui/core';
import * as Yup from 'yup';
import { constructEstimatedMonthsOptions } from '../../utils/form-utils';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import { addPriority } from '../../api';
import NavigationBar from '../../components/NavigationBar';

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
    padding: '45px',
    paddingBottom: 0
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

const SelectIndicatorPriority = ({
  classes,
  t,
  i18n: { language },
  history,
  user,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState({});
  const monthsOptions = constructEstimatedMonthsOptions(t);
  const fieldIsRequired = 'validation.fieldIsRequired';

  const navigationOptions = [
    { label: t('views.familyProfile.families'), link: '/families' },
    { label: t('views.familyProfile.profile'), link: '/family' }
  ];

  const listPriorities = history.location.state.questions.priorities.map(
    ele => {
      return {
        indicator: ele.key
      };
    }
  );
  const [priorities, setPriorities] = useState(listPriorities);
  let { familyId } = useParams();

  const questions = history.location.state.questions.indicatorSurveyDataList
    .filter(e => e.value === 1 || e.value === 2)
    .map(ele => {
      return {
        value: ele.value,
        questionText: ele.shortName,
        dimension: ele.dimension,
        key: ele.key,
        snapshotStoplightId: ele.snapshotStoplightId
      };
    });

  console.log(questions);
  const validationSchema = Yup.object().shape({
    estimatedDate: Yup.string().required(fieldIsRequired)
  });

  // on save priority
  const savePriority = values => {
    console.log('saving');
    console.log(values);
    addPriority(
      user,
      values.reason,
      values.action,
      values.estimatedDate,
      selectedIndicator.snapshotStoplightId
    )
      .then(response => {
        enqueueSnackbar('Agregado Correctamente', {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setOpen(false);
        //Update list of priorities
        setPriorities(previous => [
          ...previous,
          { indicator: selectedIndicator.key }
        ]);
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(
          'Ocurrió un error al agregar la prioridad. Favor vuelva a intentarr',
          {
            variant: 'error',
            action: key => (
              <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                <CloseIcon style={{ color: 'white' }} />
              </IconButton>
            )
          }
        );
      });
  };

  //on close modal
  const onClose = () => {
    setOpen(false);
  };

  const getForwardURLForIndicator = e => {
    console.log('open modal for indicator');
    console.log(e);
    setSelectedIndicator(e);
    setOpen(true);
  };

  const goToFamilyProfile = e => {
    history.push(`/family/${familyId}`);
  };

  return (
    <div>
      <NavigationBar options={navigationOptions}></NavigationBar>
      <Container className={classes.basicInfo} variant="fluid">
        <div className={classes.iconPriorityBorder}>
          <img
            src={iconPriority}
            className={classes.iconPriority}
            alt="Priority icon"
          />
        </div>
      </Container>

      <Container className={classes.basicInfoText} variant="fluid">
        <Typography variant="h5">Seleccione un indicador</Typography>
      </Container>
      <div className={classes.questionsContainer}>
        <DimensionQuestion
          questions={questions ? questions : []}
          priorities={priorities}
          achievements={[]}
          history={history}
          onClickIndicator={getForwardURLForIndicator}
        />
      </div>
      <Container className={classes.backButton} variant="fluid">
        <Button color="primary" variant="contained" onClick={goToFamilyProfile}>
          Volver a la Familia
        </Button>
      </Container>

      <Modal open={open} onClose={onClose}>
        <div className={classes.confirmationModal}>
          <Typography
            className={classes.modalTitle}
            variant="h5"
            test-id="modal-title"
            // color="error"
          >
            Agregar Prioridad
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            className={classes.typographyStyle}
          >
            {selectedIndicator.questionText} · {selectedIndicator.dimension}
          </Typography>

          <Formik
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              savePriority(values);
              setSubmitting(false);
            }}
          >
            <Form noValidate>
              <InputWithFormik
                label={t('views.lifemap.whyDontYouHaveIt')}
                name="reason"
              />
              <InputWithFormik
                label={t('views.lifemap.whatWillYouDoToGetIt')}
                name="action"
              />
              <AutocompleteWithFormik
                label={t('views.lifemap.howManyMonthsWillItTake')}
                name="estimatedDate"
                rawOptions={monthsOptions}
                labelKey="label"
                valueKey="value"
                required
                isClearable={false}
              />
              <div className={classes.buttonContainerForm}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  //disabled={isSubmitting}
                >
                  {t('general.save')}
                </Button>

                <Button variant="outlined" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </Form>
          </Formik>
        </div>
      </Modal>
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
    )(withTranslation()(withLayout(withSnackbar(SelectIndicatorPriority))))
  )
);
