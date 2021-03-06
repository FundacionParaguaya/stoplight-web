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
import { CircularProgress } from '@material-ui/core';
import { ROLES_NAMES } from '../../utils/role-utils';

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
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      lineHeight: 1.2,
      marginBottom: theme.spacing(2)
    }
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainerForm: {
    display: 'flex',
    marginTop: 40,
    justifyContent: 'space-evenly'
  },
  confirmationModal: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '40px 50px',
    maxHeight: '90vh',
    height: 680,
    width: '85vw',
    maxWidth: 500,
    overflowY: 'auto',
    position: 'relative',
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      padding: '40px 30px',
      height: 600
    }
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
    marginTop: '3rem',
    [theme.breakpoints.down('xs')]: {
      marginTop: '1rem'
    }
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
  extraTitleText: {
    textAlign: 'center',
    fontWeight: 400,
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 10,
    lineHeight: '25px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      lineHeight: 1.2,
      marginBottom: 0
    }
  },
  navBarContainer: {
    paddingLeft: '12%',
    paddingRight: '12%',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 5,
      paddingRight: 5
    }
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '-webkit-fill-available',
    height: '-webkit-fill-available',
    justifyContent: 'space-around'
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
  const [loading, setLoading] = useState(false);

  const listPriorities = history.location.state.priorityList.map(ele => {
    return {
      snapshotStoplightId: ele.snapshotStoplightId
    };
  });
  const [priorities, setPriorities] = useState(listPriorities);
  let { familyId } = useParams();

  const navigationOptions = [
    { label: t('views.familyProfile.families'), link: '/families' },
    { label: t('views.familyProfile.profile'), link: `/family/${familyId}` },
    {
      label: t('views.familyPriorities.priorities'),
      link: `/priorities/${familyId}`
    }
  ];

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

  const fieldIsRequired = 'validation.fieldIsRequired';

  //Validation criterias
  const validationSchema = Yup.object().shape({
    estimatedDate: Yup.string().required(fieldIsRequired)
  });

  // on save priority
  const savePriority = values => {
    addPriority(
      user,
      values.reason,
      values.action,
      values.estimatedDate,
      selectedIndicator.snapshotStoplightId
    )
      .then(response => {
        enqueueSnackbar(t('views.familyPriorities.prioritySaved'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setLoading(false);

        //Update list of priorities
        setPriorities(previous => [
          ...previous,
          { snapshotStoplightId: selectedIndicator.snapshotStoplightId }
        ]);
        setOpen(false);
      })
      .catch(e => {
        setLoading(false);
        setOpen(false);
        enqueueSnackbar(t('views.familyPriorities.errorSaving'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };

  //on close modal
  const onClose = () => {
    setOpen(false);
  };

  const getForwardURLForIndicator = e => {
    if (
      !priorities.find(
        prior => prior.snapshotStoplightId === e.snapshotStoplightId
      )
    ) {
      // you can add a priority
      setSelectedIndicator(e);
      setOpen(true);
    }
  };

  const goToFamilyProfile = e => {
    const redirectionPath =
      user.role === ROLES_NAMES.ROLE_FAMILY_USER
        ? `/my-profile`
        : `/family/${familyId}`;

    history.push(redirectionPath);
  };

  return (
    <div>
      <div className={classes.navBarContainer}>
        <NavigationBar options={navigationOptions} />
      </div>

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
        <Typography variant="h5">
          {t('views.familyPriorities.selectIndicator')}
        </Typography>
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
          {t('views.familyPriorities.backToProfile')}
        </Button>
      </Container>

      <Modal open={open} onClose={onClose} className={classes.modal}>
        {loading ? (
          <div
            className={classes.confirmationModal}
            style={{ justifyContent: 'center' }}
          >
            <CircularProgress />
          </div>
        ) : (
          <div className={classes.confirmationModal}>
            <Typography
              variant="subtitle1"
              align="center"
              className={classes.extraTitleText}
            >
              {selectedIndicator.dimension}
            </Typography>
            <Typography
              variant="h4"
              test-id="title-bar"
              align="center"
              className={classes.typographyStyle}
            >
              {selectedIndicator.questionText}
            </Typography>

            <Formik
              initialValues={{
                reason: '',
                action: ''
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                setLoading(true);
                savePriority(values);
              }}
            >
              <Form className={classes.formContainer}>
                <div>
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
                    maxSelectMenuHeight={190}
                    isClearable={false}
                  />
                </div>
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
                    {t('general.cancel')}
                  </Button>
                </div>
              </Form>
            </Formik>
          </div>
        )}
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
