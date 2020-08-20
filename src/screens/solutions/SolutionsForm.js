import { Button, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import { withSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import organizationIcon from '../../assets/dimension_organization.png';
import InputWithFormik from '../../components/InputWithFormik';
import CountrySelector from '../../components/selectors/CountrySelector';
import DimensionSelector from '../../components/selectors/DimensionSelector';
import IndicatorSelector from '../../components/selectors/IndicatorSelector';
import FileUploader from './FileUploader';
import { submitResources, saveSolution } from '../../api';
import withLayout from '../../components/withLayout';
import Editor from './Editor';
import SolutionLangPicker from './SolutionLangPicker';

const inputStyle = {
  height: 25,
  paddingTop: '12.0px!important',
  paddingBottom: '12.0px!important',
  paddingRight: '14px!important',
  paddingLeft: '14px!important',
  fontFamily: 'Poppins'
};

const useStyles = makeStyles(theme => ({
  form: {
    width: '100vw',
    height: '100%'
  },
  innerFrom: {
    paddingLeft: '20vw',
    paddingRight: '20vw'
  },
  headInputs: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: 10
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 10
  },
  icon: {
    fontSize: '6vh',
    color: theme.palette.grey.quarter
  },
  inputTypeOne: {
    ...inputStyle,
    fontSize: 30,
    fontWeight: 600
  },
  inputTypeTwo: {
    ...inputStyle,
    fontSize: 16,
    fontWeight: 600
  },
  inputTypeThree: {
    ...inputStyle,
    fontSize: 16
  },
  input: {
    marginBottom: 20,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none',
        borderBottom: `3px dashed ${theme.palette.grey.quarter}`
      },
      '&:hover fieldset': {
        border: 'none',
        borderBottom: `3px dashed ${theme.palette.grey.quarter}`
      }
    }
  },
  loadingContainer: {
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    backgroundColor: theme.palette.text.light,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  }
}));

const SolutionsForm = ({ user, enqueueSnackbar, closeSnackbar, history }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [files, setFiles] = useState([]);
  const [plainContent, setPlainContent] = useState('');
  const [solutionLang, setSolutionLang] = useState(
    localStorage.getItem('language') || 'en'
  );
  const [loading, setLoading] = useState(false);

  //Validation criterias
  const fieldIsRequired = 'validation.fieldIsRequired';

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(fieldIsRequired),
    subtitle: Yup.string().required(fieldIsRequired),
    contentRich: Yup.string().required(fieldIsRequired),
    country: Yup.string().required(fieldIsRequired),
    dimension: Yup.object().required(),
    indicators: Yup.array().required()
  });

  const onSubmit = values => {
    setLoading(true);
    Promise.all([
      files.length > 0 &&
        submitResources(user, files).then(
          response => (values.resources = response.data)
        )
    ]).then(() => {
      values.country = values.country.value;
      values.plainContent = plainContent;
      values.indicatorsCodeNames = values.indicators.map(
        indicator => indicator.value
      );
      values.indicatorNames = values.indicators.map(
        indicator => indicator.codeName
      );
      values.organization =
        !!user.organization && !!user.organization.id
          ? user.organization.id
          : null;
      values.hub = !!user.hub ? user.hub.id : null;
      values.language = solutionLang;
      saveSolution(user, values)
        .then(() => {
          enqueueSnackbar(t('views.solutions.form.save.success'), {
            variant: 'success',
            action: key => (
              <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                <CloseIcon style={{ color: 'white' }} />
              </IconButton>
            )
          });
        })
        .catch(() => {
          enqueueSnackbar(t('views.solutions.form.save.failed'), {
            variant: 'error',
            action: key => (
              <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                <CloseIcon style={{ color: 'white' }} />
              </IconButton>
            )
          });
        })
        .finally(() => {
          setLoading(false);
          history.push(`/`);
        });
    });
  };

  const getOrganizationsName = user => {
    if (!!user.organization && !!user.organization.id)
      return user.organization.name;
    if (!!user.hub && !!user.hub.id) return user.hub.name;
    return 'Fundación Paraguaya';
  };

  return (
    <React.Fragment>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <Formik
        initialValues={{
          title: '',
          subtitle: '',
          contentRich: '',
          country: '',
          showOrg: true,
          dimension: '',
          indicators: [],
          contact: '',
          reference: ''
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          const solutionValues = {
            ...values,
            contentText: plainContent
          };
          onSubmit(solutionValues);
        }}
      >
        {({ setFieldValue, setTouched, values, touched, isSubmitting }) => (
          <Form noValidate className={classes.form}>
            {/* Title and subtitle inputs */}
            <div className={classes.headInputs}>
              <div className={classes.innerFrom} style={{ paddingTop: '3rem' }}>
                <InputWithFormik
                  placeholder={t('views.solutions.form.title')}
                  required
                  name="title"
                  variant="outlined"
                  InputProps={{
                    classes: {
                      input: classes.inputTypeOne
                    }
                  }}
                  className={classes.input}
                />
                <InputWithFormik
                  placeholder={t('views.solutions.form.subtitle')}
                  required
                  name="subtitle"
                  variant="outlined"
                  InputProps={{
                    classes: {
                      input: classes.inputTypeTwo
                    }
                  }}
                  className={classes.input}
                />
              </div>
            </div>
            <div className={classes.innerFrom}>
              {/* Show organizations switch and country selector */}
              <Grid container spacing={1}>
                <Grid item md={1} sm={2} xs={2}>
                  <Switch
                    checked={values.showOrg}
                    onChange={() => setFieldValue('showOrg', !values.showOrg)}
                    color="primary"
                  />
                </Grid>
                <Grid
                  item
                  md={7}
                  sm={7}
                  xs={12}
                  container
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid
                    item
                    lg={7}
                    md={10}
                    sm={11}
                    xs={11}
                    container
                    alignItems="center"
                  >
                    {values.showOrg && (
                      <>
                        <img
                          src={organizationIcon}
                          height="30px"
                          width="30px"
                          alt=""
                          style={{ marginRight: 5 }}
                        />
                        <Typography variant="subtitle1" align="center">
                          {getOrganizationsName(user)}
                        </Typography>
                      </>
                    )}
                  </Grid>
                  <Grid>
                    <SolutionLangPicker
                      language={solutionLang}
                      setLanguage={lang => {
                        setSolutionLang(lang);
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid
                  item
                  md={4}
                  sm={4}
                  xs={12}
                  style={{ display: 'flex' }}
                ></Grid>
              </Grid>
              <Grid container spacing={2} style={{ minHeight: '40vh' }}>
                <Grid item md={8} sm={8} xs={12}>
                  <Editor
                    data={values.contentRich}
                    handleData={editorData =>
                      setFieldValue('contentRich', editorData)
                    }
                    handlePlainData={editorPlain =>
                      setPlainContent(editorPlain)
                    }
                    handleStats={() => {}}
                    placeholder={t('views.solutions.form.content')}
                    setTouched={() => {
                      Object.assign(touched, {
                        contentRich: true
                      });
                    }}
                    error={touched.contentRich && !values.contentRich}
                  />
                </Grid>
                {/* Show organizations switch and country selector */}
                <Grid item md={4} sm={4} xs={12}>
                  <Grid item md={12} sm={12} xs={12}>
                    <CountrySelector
                      withTitle={false}
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
                      error={touched.country && !values.country}
                      required={true}
                    />
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <DimensionSelector
                      withTitle={false}
                      dimensionData={values.dimension}
                      onChangeDimension={dimension =>
                        setFieldValue('dimension', dimension)
                      }
                      onBlur={() =>
                        setTouched(
                          Object.assign(touched, {
                            dimension: true
                          })
                        )
                      }
                      error={touched.dimension && !values.dimension}
                      required={true}
                    />
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <IndicatorSelector
                      withTitle={false}
                      indicatorsData={values.indicators}
                      onChangeIndicator={indicators =>
                        setFieldValue('indicators', indicators)
                      }
                      onBlur={() =>
                        setTouched(
                          Object.assign(touched, {
                            indicators: true
                          })
                        )
                      }
                      error={
                        touched.indicators &&
                        (!values.indicators || values.indicators.length === 0)
                      }
                      required={true}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={8} sm={8} xs={12}>
                <FileUploader files={files} setFiles={setFiles} />
                <Typography variant="h6" className={classes.inputLabel}>
                  {`${t('views.solutions.form.contact')}:`}
                </Typography>
                <InputWithFormik
                  placeholder={t('views.solutions.form.contactPlaceHolder')}
                  name="contact"
                  variant="outlined"
                  InputProps={{
                    classes: {
                      input: classes.inputTypeThree
                    }
                  }}
                  className={classes.input}
                />
                <div className={classes.buttonContainer}>
                  <Button variant="outlined" disabled={isSubmitting}>
                    {t('general.cancel')}
                  </Button>

                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {t('general.save')}
                  </Button>
                </div>
              </Grid>
            </div>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(
  withSnackbar(withLayout(SolutionsForm))
);
