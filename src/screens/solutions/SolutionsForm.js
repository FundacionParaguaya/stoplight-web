import { Button, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import countries from 'localized-countries';
import * as _ from 'lodash';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import {
  getSolutionById,
  getSolutionTypes,
  saveOrUpdateSolution,
  submitResources
} from '../../api';
import InputWithFormik from '../../components/InputWithFormik';
import CountrySelector from '../../components/selectors/CountrySelector';
import DimensionSelector from '../../components/selectors/DimensionSelector';
import IndicatorSelector from '../../components/selectors/IndicatorSelector';
import withLayout from '../../components/withLayout';
import { getPreviewForFile } from '../../utils/files-utils';
import { ROLES_NAMES } from '../../utils/role-utils';
import Editor from './Editor';
import ExitSolutionModal from '../../components/ExitModal';
import FileUploader from './FileUploader';
import SolutionLangPicker from './SolutionLangPicker';
import SolutionTypeSelector from './SolutionTypeSelector';
import { getLanguageByCode } from '../../utils/lang-utils';

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
    [theme.breakpoints.down('sm')]: {
      fontSize: 24
    },
    fontWeight: 600,
    color: theme.typography.h4.color
  },
  inputTypeTwo: {
    ...inputStyle,
    fontSize: 16,
    fontWeight: 500,
    color: theme.typography.h4.color
  },
  inputTypeThree: {
    ...inputStyle,
    fontSize: 16
  },
  input: {
    marginBottom: 20,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none'
      },
      '&:hover fieldset': {
        border: 'none'
      }
    }
  },
  inputDashed: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderBottom: `3px dashed ${theme.palette.grey.quarter}`
      },
      '&:hover fieldset': {
        borderBottom: `3px dashed ${theme.palette.grey.quarter}`
      }
    }
  },
  inputLabel: {
    fontWeight: 500
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
  },
  label: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%'
  },
  tag: {
    color: theme.palette.grey.middle,
    fontFamily: 'Poppins',
    borderRadius: 6,
    padding: 3,
    marginBottom: 10,
    marginRight: 4,
    width: 'fit-content',
    height: 'fit-content',
    whiteSpace: 'nowrap'
  },
  iconPreview: {
    color: theme.palette.primary.main,
    marginRight: 5
  },
  button: {
    margin: 5,
    height: 40,
    width: 85
  },
  actionIcon: {
    padding: 0,
    paddingBottom: 6,
    color: theme.palette.grey.middle,
    width: 30
  },
  preview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '3px 6px 3px 6px'
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginBottom: 16
  },
  thumb: {
    position: 'relative',
    display: 'inline-flex',
    borderRadius: 2,
    border: `1px solid ${theme.palette.primary.main}`,
    marginBottom: 8,
    marginRight: 8,
    width: 125,
    height: 125,
    padding: 4,
    boxSizing: 'border-box'
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },
  thumbName: {
    maxWidth: 100,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  img: {
    display: 'block',
    width: '100%',
    height: '100%'
  },
  downloadButton: {
    position: 'absolute',
    bottom: -5,
    right: 2,
    minWidth: 36,
    padding: 0,
    borderRadius: '50%'
  },
  closeButton: {
    position: 'absolute',
    top: -5,
    right: -6
  },
  switches: {
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center'
    }
  },
  buttonGrid: {
    display: 'flex',
    justifyContent: 'center'
  },
  publishButtonGrid: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '20px',
      paddingBottom: '20px'
    }
  }
}));

const SolutionsForm = ({ user, enqueueSnackbar, closeSnackbar, history }) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const { id } = useParams();

  const [files, setFiles] = useState([]);
  const [plainContent, setPlainContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState({});
  const [openExitModal, setOpenExitModal] = useState(false);

  //Validation criterias
  const fieldIsRequired = 'validation.fieldIsRequired';
  const lessThan64Characters = 'validation.lessThan64Characters';
  const lessThan200Characters = 'validation.lessThan200Characters';

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required(fieldIsRequired)
      .max(64, lessThan64Characters),
    subtitle: Yup.string()
      .required(fieldIsRequired)
      .max(200, lessThan200Characters),
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
      values.plainContent = plainContent;
      values.indicatorsCodeNames = values.indicators.map(
        indicator => indicator.codeName
      );
      values.indicatorNames = values.indicators.map(
        indicator => indicator.label
      );
      values.organization =
        !!user.organization && !!user.organization.id
          ? user.organization.id
          : null;
      values.hub = !!user.hub ? user.hub.id : null;
      values.type = values.solutionType.value;
      !values.type && delete values.type;
      values.resources = solution.resources
        ? solution.resources.concat(values.resources ? values.resources : [])
        : values.resources;

      let redirectId;
      saveOrUpdateSolution(user, values)
        .then(response => {
          redirectId = !!id ? id : response.data.data.createSolution.id;
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
          history.push(`/solution/${redirectId}`);
        });
    });
  };

  const getOrganizationsName = user => {
    if (!!user.organization && !!user.organization.id)
      return user.organization.name;
    if (!!user.hub && !!user.hub.id) return user.hub.name;
    return 'Fundación Paraguaya';
  };

  const removeItem = index => {
    const resources = solution.resources;
    resources.splice(index, 1);
    const updatedSolution = {
      ...solution,
      resources: resources
    };
    setSolution(updatedSolution);
  };

  const canEdit = solution => {
    return (
      (!!user.organization &&
        !!user.organization.id &&
        user.organization.id === solution.organization) ||
      (!!user.hub &&
        !!user.hub.id &&
        user.hub.id === solution.hub &&
        user.role === ROLES_NAMES.ROLE_HUB_ADMIN) ||
      user.role === ROLES_NAMES.ROLE_ROOT ||
      user.role === ROLES_NAMES.ROLE_PS_TEAM
    );
  };

  useEffect(() => {
    window.onbeforeunload = () => true;
    if (!!id) {
      setLoading(true);
      getSolutionById(user, id)
        .then(res => {
          const fetchedSolution = res.data.data.getSolutionById;
          if (!canEdit(fetchedSolution)) throw new Error();
          getSolutionTypes(user, language).then(response => {
            const typeOptions = _.get(
              response,
              'data.data.solutionTypes',
              []
            ).map(type => ({
              label: type.description,
              value: type.code
            }));
            const lang = getLanguageByCode(language);
            let countryOptions = countries(
              require(`localized-countries/data/${lang}`)
            ).array();

            const updatedSolution = {
              ...fetchedSolution,
              dimension: {
                label: fetchedSolution.dimension,
                value: fetchedSolution.stoplightDimension
              },
              country: {
                label:
                  countryOptions.find(
                    country => country.code === fetchedSolution.country
                  ) &&
                  countryOptions.find(
                    country => country.code === fetchedSolution.country
                  ).label,
                value: fetchedSolution.country
              },
              indicators: fetchedSolution.indicatorsCodeNames.map(
                (item, index) => {
                  return {
                    codeName: item,
                    label: fetchedSolution.indicatorsNames[index]
                  };
                }
              ),
              type: {
                label: fetchedSolution.type,
                value:
                  typeOptions.find(
                    type => type.label === fetchedSolution.type
                  ) &&
                  typeOptions.find(type => type.label === fetchedSolution.type)
                    .value
              },
              lang: fetchedSolution.lang.split('_')[0]
            };
            setSolution(updatedSolution);
            setPlainContent(fetchedSolution.contentText);
            setLoading(false);
          });
        })
        .catch(e => {
          console.error(e);
          enqueueSnackbar(t('views.solutions.form.userNotAllowed'), {
            variant: 'error',
            action: key => (
              <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                <CloseIcon style={{ color: 'white' }} />
              </IconButton>
            )
          });
          history.push('/solutions');
        });
    }
    return () => (window.onbeforeunload = undefined);
  }, []);

  return (
    <React.Fragment>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <ExitSolutionModal
        open={openExitModal}
        onDissmiss={() => setOpenExitModal(false)}
        onClose={() => history.push(`/solutions`)}
      />
      <Prompt
        when={!openExitModal && !loading}
        message={t('views.exitModal.confirmText')}
      />

      <Formik
        initialValues={{
          id: (!!solution.id && solution.id) || null,
          title: (!!solution.title && solution.title) || '',
          subtitle: (!!solution.description && solution.description) || '',
          contentRich: (!!solution.contentRich && solution.contentRich) || '',
          country: (!!solution.country && solution.country) || '',
          showOrg: (!!solution.showAuthor && solution.showAuthor) || true,
          solutionType: (!!solution.type && solution.type) || '',
          dimension: (!!solution.dimension && solution.dimension) || '',
          indicators: (!!solution.indicators && solution.indicators) || [],
          contact: (!!solution.contactInfo && solution.contactInfo) || '',
          type: (!!solution.type && solution.type.value) || '',
          language:
            (!!solution.lang && solution.lang) ||
            localStorage.getItem('language') ||
            'en'
        }}
        enableReinitialize
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
                  className={clsx(
                    classes.input,
                    !values.title && classes.inputDashed
                  )}
                />
                <InputWithFormik
                  placeholder={t('views.solutions.form.subtitle')}
                  required
                  multiline
                  name="subtitle"
                  variant="outlined"
                  InputProps={{
                    classes: {
                      input: classes.inputTypeTwo
                    }
                  }}
                  className={clsx(
                    classes.input,
                    !values.subtitle && classes.inputDashed
                  )}
                />
              </div>
            </div>
            <div className={classes.innerFrom}>
              {/* Show organizations switch and country selector */}
              <Grid container>
                <Grid item md={8} sm={8} xs={12} container>
                  <Grid
                    item
                    lg={8}
                    md={8}
                    xs={12}
                    container
                    className={classes.switches}
                  >
                    <Switch
                      checked={values.showOrg}
                      onChange={() => setFieldValue('showOrg', !values.showOrg)}
                      color="primary"
                    />
                    {values.showOrg && (
                      <Typography variant="subtitle1" align="center">
                        {getOrganizationsName(user)}
                      </Typography>
                    )}
                  </Grid>
                </Grid>

                <Grid
                  item
                  lg={4}
                  md={4}
                  sm={4}
                  xs={12}
                  container
                  className={classes.switches}
                >
                  <SolutionLangPicker
                    language={values.language}
                    setLanguage={lang => {
                      setFieldValue('language', lang);
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ minHeight: '40vh' }}>
                <Grid item md={8} sm={12} xs={12}>
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
                <Grid item md={4} sm={12} xs={12}>
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
                      parentLang={getLanguageByCode(values.language)}
                      error={touched.country && !values.country}
                      required={true}
                    />
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <DimensionSelector
                      withTitle={false}
                      dimensionData={values.dimension}
                      onChangeDimension={dimension => {
                        setFieldValue('dimension', dimension);
                        setFieldValue('indicators', []);
                      }}
                      onBlur={() =>
                        setTouched(
                          Object.assign(touched, {
                            dimension: true
                          })
                        )
                      }
                      parentLang={values.language}
                      error={touched.dimension && !values.dimension}
                      required={true}
                    />
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <IndicatorSelector
                      withTitle={false}
                      indicatorsData={values.indicators}
                      dimensionData={values.dimension}
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
                      parentLang={values.language}
                      error={
                        touched.indicators &&
                        (!values.indicators || values.indicators.length === 0)
                      }
                      required={true}
                      isMulti={true}
                    />
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <SolutionTypeSelector
                      withTitle={false}
                      solutionTypeData={values.solutionType}
                      onChangeSolutionType={solutionType =>
                        setFieldValue('solutionType', solutionType)
                      }
                      parentLang={values.language}
                      isClearable={true}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={8} sm={12} xs={12}>
                <FileUploader files={files} setFiles={setFiles} />

                {!!solution.resources && solution.resources.length > 0 && (
                  <>
                    <aside className={classes.thumbsContainer}>
                      {solution.resources.map((resource, index) => (
                        <div className={classes.preview} key={index}>
                          <div className={classes.thumb}>
                            <div className={classes.thumbInner}>
                              <IconButton
                                className={classes.closeButton}
                                key="clear"
                                onClick={() => removeItem(index)}
                              >
                                <CloseIcon className={classes.color} />
                              </IconButton>
                              <Button
                                href={resource.url}
                                className={classes.downloadButton}
                                download
                                color="primary"
                              >
                                <GetAppIcon />
                              </Button>
                              <img
                                alt="index"
                                className={classes.img}
                                src={getPreviewForFile(resource)}
                              />
                            </div>
                          </div>
                          <Tooltip title={resource.title}>
                            <Typography
                              variant="subtitle2"
                              align="center"
                              className={classes.thumbName}
                            >
                              {resource.title}
                            </Typography>
                          </Tooltip>
                        </div>
                      ))}
                    </aside>
                  </>
                )}

                <Typography variant="h6" className={classes.inputLabel}>
                  {`${t('views.solutions.form.contact')}:`}
                </Typography>
                <InputWithFormik
                  placeholder={t('views.solutions.form.contactPlaceHolder')}
                  name="contact"
                  variant="outlined"
                  multiline
                  InputProps={{
                    classes: {
                      input: classes.inputTypeThree
                    }
                  }}
                  className={clsx(
                    classes.input,
                    !values.contact && classes.inputDashed
                  )}
                />
                <div className={classes.buttonContainer}>
                  <Grid container>
                    <Grid
                      item
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className={classes.buttonGrid}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setOpenExitModal(true);
                        }}
                        disabled={isSubmitting}
                      >
                        {t('general.cancel')}
                      </Button>
                    </Grid>
                    <Grid
                      item
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className={classes.publishButtonGrid}
                    >
                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={isSubmitting}
                      >
                        {t('general.publish')}
                      </Button>
                    </Grid>
                  </Grid>
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
