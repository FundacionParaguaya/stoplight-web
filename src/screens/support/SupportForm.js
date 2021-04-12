import { withSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import InputWithFormik from '../../components/InputWithFormik';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import withLayout from '../../components/withLayout';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import { Typography, Button } from '@material-ui/core';
import SupportLangPicker from './SupportLangPicker';
import Editor from '../../components/Editor';
import CollectionSelector from '../support/CollectionSelector';
import * as Yup from 'yup';
import { saveOrUpdateArticle } from '../../api';

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
  innerForm: {
    paddingLeft: '20vw',
    paddingRight: '20vw'
  },
  headInputs: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: 10
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
  inputTypeTitle: {
    ...inputStyle,
    fontSize: 30,
    [theme.breakpoints.down('sm')]: {
      fontSize: 24
    },
    fontWeight: 600,
    color: theme.typography.h4.color
  },
  inputTypeSubtitle: {
    ...inputStyle,
    fontSize: 16,
    fontWeight: 500,
    color: theme.typography.h4.color
  },
  switch: {
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center'
    }
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 10
  },
  buttonGrid: {
    display: 'flex',
    justifyContent: 'center'
  },
  saveButton: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '20px',
      paddingBottom: '20px'
    }
  }
}));

const SupportForm = ({ user }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();
  const [plainContent, setPlainContent] = useState('');
  const [loading, setLoading] = useState(false);

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
    collection: Yup.object().required()
  });

  const onSubmit = values => {
    setLoading(true);
    saveOrUpdateArticle(user, values).then(response => {
      console.log(response);
    });
  };
  return (
    <div>
      <Formik
        initialValues={{
          id: null,
          title: '',
          subtitle: '',
          contentRich: '',
          collection: '',
          language: localStorage.getItem('language') || 'en',
          published: false
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={values => {
          const articleValues = {
            ...values,
            contentText: plainContent
          };
          onSubmit(articleValues);
        }}
      >
        {({ setFieldValue, setTouched, touched, values, isSubmitting }) => (
          <Form noValidate className={classes.form}>
            <div className={classes.headInputs}>
              <div className={classes.innerForm} style={{ paddingTop: '3rem' }}>
                <InputWithFormik
                  placeholder={t('views.support.form.title')}
                  required
                  name="title"
                  variant="outlined"
                  InputProps={{
                    classes: {
                      input: classes.inputTypeTitle
                    }
                  }}
                  className={clsx(
                    classes.input,
                    !values.title && classes.inputDashed
                  )}
                />
                <InputWithFormik
                  placeholder={t('views.support.form.subtitle')}
                  required
                  multiline
                  name="subtitle"
                  variant="outlined"
                  InputProps={{
                    classes: {
                      input: classes.inputTypeSubtitle
                    }
                  }}
                  className={clsx(
                    classes.input,
                    !values.subtitle && classes.inputDashed
                  )}
                />
              </div>
            </div>
            <div className={classes.innerForm}>
              <Grid container>
                <Grid item md={8} sm={8} xs={12} container>
                  <Grid
                    item
                    lg={8}
                    md={8}
                    xs={12}
                    container
                    className={classes.switch}
                  >
                    {(true || values.published) && (
                      <>
                        <Switch
                          color="primary"
                          checked={values.published}
                          onChange={() =>
                            setFieldValue('published', !values.published)
                          }
                        />
                        <Typography variant="subtitle1" align="center">
                          {t('views.support.form.active')}
                        </Typography>
                      </>
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
                  //className={classes.switch}
                >
                  <SupportLangPicker
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
                    placeholder={t('views.support.form.content')}
                    setTouched={() => {
                      Object.assign(touched, {
                        contentRich: true
                      });
                    }}
                    error={touched.contentRich && !values.contentRich}
                  />
                </Grid>
                <Grid item md={4} sm={4} xs={12}>
                  <Grid item md={12} sm={12} xs={12}>
                    <CollectionSelector
                      collectionData={values.collection}
                      onChangeCollection={collection => {
                        setFieldValue('collection', collection);
                      }}
                      onBlur={() =>
                        setTouched(
                          Object.assign(touched, {
                            collection: true
                          })
                        )
                      }
                      error={touched.collection && !values.collection}
                      required={true}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={8} sm={12} xs={12}>
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
                        disabled={isSubmitting}
                        onClick={() => {}}
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
                      className={classes.saveButton}
                    >
                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={isSubmitting}
                      >
                        {t('general.save')}
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(withSnackbar(withLayout(SupportForm)));
