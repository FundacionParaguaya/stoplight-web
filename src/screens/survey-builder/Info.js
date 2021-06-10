import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import Container from '../../components/Container';
import withLayout from '../../components/withLayout';
import InputWithLabel from '../../components/InputWithLabel';

const styles = theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    fontSize: 24,
    lineHeight: 1.4,
    paddingTop: 30
  },
  label: {
    paddingBottom: 10
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper
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
  }
});

const fieldIsRequired = 'validation.fieldIsRequired';

// Validation criterias
const validationSchema = Yup.object({
  termsSubtitle: Yup.string().required(fieldIsRequired),
  termsText: Yup.string().required(fieldIsRequired),
  privacyPolicySubtitle: Yup.string().required(fieldIsRequired),
  privacyPolicyText: Yup.string().required(fieldIsRequired)
});

const onSubmit = values => {
  console.log(values);
};

const Info = ({ classes, t, user }) => {
  return (
    <div className={classes.mainContainer}>
      <Formik
        enableReinitialize
        initialValues={{
          title: 'traer valor anterior',
          // title: (currentSurvey && currentSurvey.title) || '',
          // organization: (currentSurvey && currentSurvey.organization) || '',
          // hub: (currentSurvey && currentSurvey.hub) || '',
          // country: (currentSurvey && currentSurvey.country) || '',
          // language: (currentSurvey && currentSurvey.language) || '',
          // choice:
          //   (currentSurvey &&
          //     selectedSurvey &&
          //     selectedSurvey.id &&
          //     currentSurvey.choice) ||
          //   'SCRATCH',
          termsSubtitle: 'a',
          termsText: 'b',
          privacyPolicySubtitle: 'c',
          privacyPolicyText: 'd'
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          onSubmit(values);
        }}
      >
        {({ setFieldValue, values, touched, setTouched }) => (
          <Form noValidate autoComplete={'off'}>
            <Container className={classes.container}>
              <Typography className={classes.title} variant="h4">
                {'Surveys Info'}
              </Typography>
              <Grid container style={{ width: 'auto' }} spacing={2}>
                <div
                  className={classes.inforContainer}
                  style={{ width: '100%' }}
                >
                  <Grid item md={6} sm={6} xs={6}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <InputWithLabel
                        title={'Title'}
                        multiline={false}
                        name="title"
                      />
                      {/*<CountrySelector*/}
                      {/*  withTitle={true}*/}
                      {/*  countryData={values.country}*/}
                      {/*  onChangeCountry={country => setFieldValue('country', country)}*/}
                      {/*  onBlur={() =>*/}
                      {/*    setTouched(*/}
                      {/*      Object.assign(touched, {*/}
                      {/*        country: true*/}
                      {/*      })*/}
                      {/*    )*/}
                      {/*  }*/}
                      {/*  parentLang={getLanguageByCode(values.language)}*/}
                      {/*  error={touched.country && !values.country}*/}
                      {/*  required={true}*/}
                      {/*/>*/}
                      <Typography className={classes.label} variant="subtitle1">
                        {'Language'}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item md={6} sm={6} xs={6}>
                    <div className={classes.divider} />
                  </Grid>
                </div>
              </Grid>
              <Typography className={classes.title} variant="h4">
                {'Privacy Policy'}
              </Typography>
              <div className={classes.infoContainer}>
                <InputWithLabel
                  title={'Subtitle'}
                  multiline={true}
                  name="termsSubtitle"
                  inputProps={{ maxLength: '10000' }}
                />
                <InputWithLabel
                  title={'Text'}
                  multiline={true}
                  name="termsText"
                  inputProps={{ maxLength: '10000' }}
                />
              </div>
              <Typography className={classes.title} variant="h4">
                {'Terms And Conditions'}
              </Typography>
              <div className={classes.infoContainer}>
                <InputWithLabel
                  title={'Subtitle'}
                  multiline={true}
                  name="privacyPolicySubtitle"
                  inputProps={{ maxLength: '10000' }}
                />
                <InputWithLabel
                  title={'Text'}
                  multiline={true}
                  name="privacyPolicyText"
                  inputProps={{ maxLength: '10000' }}
                />
              </div>
            </Container>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default withStyles(styles)(
  withRouter(withTranslation()(withLayout(Info)))
);
