import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { withSnackbar } from 'notistack';
import {
  withStyles,
  Modal,
  Typography,
  Button,
  CircularProgress
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import * as Yup from 'yup';
import { updateUser, updateSurvey, updateDraft } from '../../redux/actions';
import withLayout from '../../components/withLayout';
import DimensionQuestion from '../../components/summary/DimensionQuestion';
import Container from '../../components/Container';
import iconAchievement from '../../assets/icon_achievement.png';
import { Formik, Form } from 'formik';
import InputWithFormik from '../../components/InputWithFormik';
import { addAchievement } from '../../api';
import NavigationBar from '../../components/NavigationBar';
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
      lineHeight: 1.2
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
    maxHeight: '95vh',
    width: '500px',
    overflowY: 'auto',
    position: 'relative',
    outline: 'none'
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
  },
  basicInfoText: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconAchievementBorder: {
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
  iconAchievement: {
    maxWidth: 50,
    maxHeight: 50,
    objectFit: 'contain'
  },
  modalTitle: {
    paddingBottom: '2rem'
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
      lineHeight: 1.2
    }
  }
});

const SelectIndicatorAchievement = ({
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
  const [loading, setLoading] = useState(false);

  const listAchievements = [];
  history.location.state.questions.achievements.map(ele => {
    return {
      indicator: ele.key
    };
  });
  const [achievements, setAchievements] = useState(listAchievements);
  const { familyId } = useParams();

  const navigationOptions = [
    { label: t('views.familyProfile.families'), link: '/families' },
    { label: t('views.familyProfile.profile'), link: `/family/${familyId}` },
    {
      label: t('views.familyAchievements.achievements'),
      link: `/achievements/${familyId}`
    }
  ];

  const questions = history.location.state.questions.indicatorSurveyDataList
    .filter(e => e.value === 3)
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

  // Validation criterias
  const validationSchema = Yup.object().shape({
    action: Yup.string().required(fieldIsRequired)
  });

  // on save achievement
  const saveAchievement = values => {
    addAchievement(
      user,
      values.action,
      values.roadmap,
      selectedIndicator.snapshotStoplightId
    )
      .then(response => {
        enqueueSnackbar(t('views.familyAchievements.achievementSaved'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setLoading(false);

        // Update list of achievements
        setAchievements(previous => [
          ...previous,
          { indicator: selectedIndicator.key }
        ]);
        setOpen(false);
      })
      .catch(e => {
        setLoading(false);
        setOpen(false);
        enqueueSnackbar(t('views.familyAchievements.errorSaving'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };

  // on close modal
  const onClose = () => {
    setOpen(false);
  };

  const getForwardURLForIndicator = e => {
    if (!achievements.find(prior => prior.indicator === e.key)) {
      // you can add a achievement
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
      <div
        style={{
          paddingLeft: '12%',
          paddingRight: '12%'
        }}
      >
        <NavigationBar options={navigationOptions} />
      </div>

      <Container className={classes.basicInfo} variant="stretch">
        <div className={classes.iconAchievementBorder}>
          <img
            src={iconAchievement}
            className={classes.iconAchievement}
            alt="Achievement icon"
          />
        </div>
      </Container>

      <Container className={classes.basicInfoText} variant="fluid">
        {achievements.length > 0 && (
          <Typography variant="h5">
            {t('views.familyAchievements.selectIndicator')}
          </Typography>
        )}
        {achievements.length === 0 && (
          <Typography variant="h5">
            {t('views.familyAchievements.noIndicatorsAvailable')}
          </Typography>
        )}
      </Container>
      <div className={classes.questionsContainer}>
        <DimensionQuestion
          questions={!!questions ? questions : []}
          priorities={[]}
          achievements={achievements}
          history={history}
          onClickIndicator={getForwardURLForIndicator}
        />
      </div>
      <Container className={classes.backButton} variant="fluid">
        <Button color="primary" variant="contained" onClick={goToFamilyProfile}>
          {t('views.familyAchievements.backToProfile')}
        </Button>
      </Container>

      <Modal open={open} onClose={onClose} className={classes.modal}>
        {loading ? (
          <div className={classes.confirmationModal}>
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
                action: '',
                roadmap: ''
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                setLoading(true);
                saveAchievement(values);
              }}
            >
              <Form>
                <InputWithFormik
                  label={t('views.lifemap.whatDidItTakeToAchieveThis')}
                  name="action"
                  required
                />
                <InputWithFormik
                  label={t('views.lifemap.howDidYouGetIt')}
                  name="roadmap"
                />
                <div className={classes.buttonContainerForm}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    // disabled={isSubmitting}
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
    )(withTranslation()(withLayout(withSnackbar(SelectIndicatorAchievement))))
  )
);
