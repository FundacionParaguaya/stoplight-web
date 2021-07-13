import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Tooltip,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Edit from '@material-ui/icons/Create';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { getSurveyById, supportedLanguages } from '../../api';
import AutocompleteWithFormik from '../../components/AutocompleteWithFormik';
import InputWithFormik from '../../components/InputWithFormik';
import RadioInput from '../../components/RadioInput';
import CountrySelector from '../../components/selectors/CountrySelector';
import { updateSurvey } from '../../redux/actions';
import { getLanguageByCode } from '../../utils/lang-utils';
import {
  getConditionalQuestions,
  getEconomicScreens,
  getElementsWithConditionsOnThem
} from '../../utils/survey-utils';
import UserOrgSelector from '../users/form/UserOrgsSelector';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
    maxHeight: '100vh'
  },
  container: {
    padding: '2em',
    paddingBottom: 0,
    backgroundColor: theme.palette.background.default,
    outline: 'none',
    width: '45vw',
    maxWidth: 600,
    height: '75vh',
    minHeight: 660,
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      width: '65vw'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '1em',
      paddingTop: '2.5rem',
      height: '100vh',
      width: '100vw'
    },
    overflowY: 'auto'
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto'
  },
  surveyNameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  surveyName: {
    marginLeft: 40,
    fontWeight: 700,
    color: theme.palette.primary.main
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30,
    marginBottom: 30
  }
}));

const fieldIsRequired = 'validation.fieldIsRequired';

const SurveyCreateModal = ({
  open,
  currentSurvey,
  selectedSurvey,
  setChoosingSurvey,
  onClose,
  updateSurvey,
  user
}) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState([]);

  //Validation criterias
  const validationSchema = Yup.object({
    title: Yup.string().required(fieldIsRequired),
    hub: Yup.string(),
    country: Yup.string().required(fieldIsRequired),
    language: Yup.string().required(fieldIsRequired),
    choice: Yup.string().required(fieldIsRequired)
  });

  useEffect(() => {
    supportedLanguages(user, language)
      .then(response => {
        setLanguages(response.data.data.supportedLanguages);
        setLoading(false);
      })
      .catch(e => console.log(e));
  }, [language]);

  const onSubmit = values => {
    setLoading(true);
    let data = {
      title: values.title,
      hub: values.hub,
      country: values.country,
      language: values.language
    };

    if (selectedSurvey && selectedSurvey.id) {
      getSurveyById(user, selectedSurvey.id)
        .then(response => {
          let survey = response.data.data.surveyById;
          const economicScreens = getEconomicScreens(survey);
          const conditionalQuestions = getConditionalQuestions(survey);
          const elementsWithConditionsOnThem = getElementsWithConditionsOnThem(
            conditionalQuestions
          );
          updateSurvey({
            ...survey,
            ...data,
            economicScreens,
            conditionalQuestions,
            elementsWithConditionsOnThem
          });
          setLoading(false);
          history.push('/survey-builder/info');
        })
        .catch(() => {
          enqueueSnackbar(t('views.familyProfile.surveyError'), {
            variant: 'error'
          });
          setLoading(false);
        });
    } else {
      updateSurvey({
        surveyEconomicQuestions: [],
        surveyStoplightQuestions: [],
        ...data
      });
      history.push('/survey-builder/info');
    }
  };

  const onModalClose = choose => {
    if (!choose) {
      setChoosingSurvey(false);
      updateSurvey({});
    }
    onClose();
  };

  const handleBaseSurvey = survey => {
    updateSurvey(survey);
    setChoosingSurvey(true);
    onModalClose(true);
  };

  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      className={classes.modal}
      open={open}
      onClose={() => onModalClose(false)}
    >
      <div className={classes.container}>
        <Typography variant="h5" align="center" style={{ marginBottom: 10 }}>
          {t('views.survey.create.add')}
        </Typography>
        <IconButton
          className={classes.closeIcon}
          key="dismiss"
          onClick={() => onModalClose(false)}
        >
          <CloseIcon style={{ color: 'green' }} />
        </IconButton>
        <Formik
          enableReinitialize
          initialValues={{
            title: (currentSurvey && currentSurvey.title) || '',
            organization: (currentSurvey && currentSurvey.organization) || '',
            hub: (currentSurvey && currentSurvey.hub) || '',
            country: (currentSurvey && currentSurvey.country) || '',
            language: (currentSurvey && currentSurvey.language) || '',
            choice:
              (currentSurvey &&
                selectedSurvey &&
                selectedSurvey.id &&
                currentSurvey.choice) ||
              'SCRATCH'
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            onSubmit(values);
          }}
        >
          {({ setFieldValue, values, touched, setTouched }) => (
            <Form noValidate autoComplete={'off'}>
              <InputWithFormik
                label={t('views.survey.create.title')}
                name="title"
                required
                className={classes.nameField}
              />

              <UserOrgSelector
                applicationValue={values.hub}
                organizationValue={values.organization}
                selectedRole={'ROLE_HUB_ADMIN'}
                required={false}
              />

              <CountrySelector
                withTitle={false}
                withAutoCompleteStyle
                countryData={values.country}
                onChangeCountry={country => setFieldValue('country', country)}
                onBlur={() =>
                  setTouched(
                    Object.assign(touched, {
                      country: true
                    })
                  )
                }
                parentLang={getLanguageByCode(values.language)}
                error={touched.country && !values.country}
                required={true}
              />

              <AutocompleteWithFormik
                label={t('views.survey.create.language')}
                name="language"
                rawOptions={languages}
                labelKey="description"
                valueKey="code"
                maxMenuHeight="150"
                isClearable={false}
                required
              />

              <RadioInput
                label={t('views.survey.create.scratch')}
                value={'SCRATCH'}
                currentValue={values.choice}
                onChange={e => setFieldValue('choice', e.target.value)}
              />

              <RadioInput
                label={t('views.survey.create.existing')}
                value={'EXISTING'}
                currentValue={values.choice}
                onChange={e => {
                  let survey = {
                    ...values,
                    choice: e.target.value
                  };
                  handleBaseSurvey(survey);
                }}
              />
              {!!selectedSurvey && selectedSurvey.id && (
                <div className={classes.surveyNameContainer}>
                  <Typography
                    variant="subtitle1"
                    className={classes.surveyName}
                  >
                    {selectedSurvey.title}
                  </Typography>
                  <Tooltip title={'Change survey'}>
                    <IconButton
                      color="inherit"
                      onClick={() => {
                        let survey = {
                          ...values,
                          choice: 'EXISTING'
                        };
                        handleBaseSurvey(survey);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
              {loading && (
                <CircularProgress className={classes.loadingContainer} />
              )}
              <div className={classes.buttonContainerForm}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={loading}
                >
                  {t('general.save')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

const mapDispatchToProps = { updateSurvey };

const mapStateToProps = ({ currentSurvey, user }) => ({
  currentSurvey,
  user
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyCreateModal);
