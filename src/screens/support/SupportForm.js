import { withSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import React from 'react';
import InputWithFormik from '../../components/InputWithFormik';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import withLayout from '../../components/withLayout';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import { Typography } from '@material-ui/core';

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
  }
}));

const SupportForm = ({ user }) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  return (
    <div>
      <Formik
        initialValues={{
          id: null,
          title: '',
          subtitle: '',
          published: false
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className={classes.form}>
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
