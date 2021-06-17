import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useTranslation, withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { useHistory, withRouter } from 'react-router-dom';
import { Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import withLayout from '../../components/withLayout';
import InputWithLabel from '../../components/InputWithLabel';
import Header from './Header';
import CountrySelector from '../../components/selectors/CountrySelector';
import { getLanguageByCode } from '../../utils/lang-utils';
import { updateSurvey } from '../../redux/actions';
import { supportedLanguages } from '../../api';

const styles = theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    paddingTop: 30
  },
  label: {
    paddingBottom: 10
  },
  questionsAmount: {
    fontSize: 48,
    fontWeight: '500'
  },
  questionsLabel: {
    fontSize: 12,
    fontWeight: '400'
  },
  questionsGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  questionsInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  dividerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    padding: '0 12%'
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    marginBottom: 20
  },
  inforContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.palette.background.default,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    marginBottom: 20
  },
  outlinedInputContainer: {
    marginBottom: 20
  },
  outlinedInput: {},
  divider: {
    height: '100%',
    width: 2,
    backgroundColor: theme.palette.background.paper
  },
  buttonContainer: {
    marginTop: '2rem',
    marginBottom: '2rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
});

const fieldIsRequired = 'validation.fieldIsRequired';

// Validation criterias
const validationSchema = Yup.object({
  title: Yup.string().required(fieldIsRequired),
  country: Yup.string().required(fieldIsRequired),
  language: Yup.string().required(fieldIsRequired),
  termsSubtitle: Yup.string().required(fieldIsRequired),
  termsText: Yup.string().required(fieldIsRequired),
  privacyPolicySubtitle: Yup.string().required(fieldIsRequired),
  privacyPolicyText: Yup.string().required(fieldIsRequired)
});

const Info = ({ classes, t, user, currentSurvey, updateSurvey }) => {
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState([]);
  const {
    i18n: { language }
  } = useTranslation();
  const history = useHistory();

  const onSubmit = values => {
    setLoading(true);
    const data = {
      title: values.title,
      hub: values.hub,
      country: values.country,
      language: values.language,
      termsConditions: {
        text: values.termsText,
        title: values.termsSubtitle
      },
      privacyPolicy: {
        text: values.privacyPolicyText,
        title: values.privacyPolicySubtitle
      },
      surveyEconomicQuestions: values.surveyEconomicQuestions,
      surveyStoplightQuestions: values.surveyStoplightQuestions,
      surveyConfig: values.surveyConfig,
      conditionalQuestions: values.conditionalQuestions,
      createdAt: values.createdAt,
      description: values.description,
      economicScreens: values.economicScreens,
      elementsWithConditionsOnThem: values.elementsWithConditionsOnThem,
      minimumPriorities: values.minimumPriorities
    };

    updateSurvey(data);
    history.push('/survey-builder/details');
  };

  useEffect(() => {
    supportedLanguages(user, language)
      .then(response => {
        setLanguages(response.data.data.supportedLanguages);
        setLoading(false);
      })
      .catch(e => console.log(e));
  }, [language, user]);
  return (
    <div className={classes.mainContainer}>
      <Formik
        enableReinitialize
        initialValues={{
          title: (currentSurvey && currentSurvey.title) || '',
          hub: (currentSurvey && currentSurvey.hub) || '',
          country: (currentSurvey && currentSurvey.country) || '',
          language:
            (!!currentSurvey &&
              languages.length > 0 &&
              currentSurvey.language) ||
            '',
          termsSubtitle:
            (currentSurvey.termsConditions &&
              currentSurvey.termsConditions.title) ||
            '',
          termsText:
            (currentSurvey.termsConditions &&
              currentSurvey.termsConditions.text) ||
            '',
          privacyPolicySubtitle:
            (currentSurvey.privacyPolicy &&
              currentSurvey.privacyPolicy.title) ||
            '',
          privacyPolicyText:
            (currentSurvey.privacyPolicy && currentSurvey.privacyPolicy.text) ||
            '',
          surveyEconomicQuestions: currentSurvey.surveyEconomicQuestions || [],
          surveyStoplightQuestions:
            currentSurvey.surveyStoplightQuestions || [],
          surveyConfig: currentSurvey.surveyConfig || '',
          conditionalQuestions: currentSurvey.conditionalQuestions || [],
          createdAt: currentSurvey.createdAt || '',
          description: currentSurvey.description || '',
          economicScreens: currentSurvey.economicScreens || '',
          elementsWithConditionsOnThem:
            currentSurvey.elementsWithConditionsOnThem || '',
          minimumPriorities: currentSurvey.minimumPriorities || 0
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          onSubmit(values);
        }}
      >
        {({ setFieldValue, values, touched, setTouched }) => (
          <Form noValidate autoComplete={'off'}>
            <div className={classes.container}>
              <Header
                title={t('views.surveyBuilder.infoScreen.surveysInfo')}
                bottomTitle
              />
              <div className={classes.inforContainer} style={{ width: '100%' }}>
                <Grid item md={5} sm={5} xs={5}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <InputWithLabel
                      title={t('views.surveyBuilder.infoScreen.title')}
                      multiline={false}
                      required
                      name="title"
                    />
                    <CountrySelector
                      withTitle={true}
                      countryData={values.country}
                      onChangeCountry={country =>
                        setFieldValue('country', country)
                      }
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
                  </div>
                </Grid>
                {values.surveyEconomicQuestions.length > 0 &&
                  values.surveyStoplightQuestions.length > 0 && (
                    <Grid
                      item
                      md={1}
                      sm={1}
                      xs={1}
                      className={classes.dividerContainer}
                    >
                      <div className={classes.divider} />
                    </Grid>
                  )}
                {values.surveyEconomicQuestions.length > 0 &&
                  values.surveyStoplightQuestions.length > 0 && (
                    <Grid
                      item
                      md={6}
                      sm={6}
                      xs={6}
                      className={classes.questionsGrid}
                    >
                      <div className={classes.questionsInfoContainer}>
                        <Typography
                          className={classes.questionsAmount}
                          variant="h4"
                        >
                          {currentSurvey.surveyEconomicQuestions.length}
                        </Typography>
                        <Typography
                          className={classes.questionsLabel}
                          variant="subtitle1"
                        >
                          {t(
                            'views.surveyBuilder.infoScreen.socioeconomicQuestions'
                          )}
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          className={classes.questionsAmount}
                          variant="h4"
                        >
                          {currentSurvey.surveyStoplightQuestions.length}
                        </Typography>
                        <Typography
                          className={classes.questionsLabel}
                          variant="subtitle1"
                        >
                          {t(
                            'views.surveyBuilder.infoScreen.stoplightQuestions'
                          )}
                        </Typography>
                      </div>
                    </Grid>
                  )}
              </div>
              <Typography className={classes.title} variant="h5">
                {t('views.surveyBuilder.infoScreen.privacyPolicy')}
              </Typography>
              <div className={classes.infoContainer}>
                <InputWithLabel
                  title={t('views.surveyBuilder.infoScreen.subtitle')}
                  inputProps={{ maxLength: '100' }}
                  multiline={true}
                  name="termsSubtitle"
                />
                <InputWithLabel
                  title={t('views.surveyBuilder.infoScreen.text')}
                  multiline={true}
                  name="termsText"
                  minHeight={150}
                />
              </div>
              <Typography className={classes.title} variant="h5">
                {t('views.surveyBuilder.infoScreen.termsAndConditions')}
              </Typography>
              <div
                style={{ marginBottom: 0 }}
                className={classes.infoContainer}
              >
                <InputWithLabel
                  title={t('views.surveyBuilder.infoScreen.subtitle')}
                  inputProps={{ maxLength: '100' }}
                  multiline={true}
                  name="privacyPolicySubtitle"
                />
                <InputWithLabel
                  title={t('views.surveyBuilder.infoScreen.text')}
                  multiline={true}
                  name="privacyPolicyText"
                  minHeight={150}
                />
              </div>
              <div className={classes.buttonContainer}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={loading}
                >
                  {t('views.surveyBuilder.infoScreen.save')}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const mapDispatchToProps = { updateSurvey };

const mapStateToProps = ({ currentSurvey, user }) => ({
  currentSurvey,
  user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(withTranslation()(withLayout(Info)))));
