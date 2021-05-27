import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import countries from 'localized-countries';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import AutocompleteWithFormik from '../../components/AutocompleteWithFormik';
import InputWithFormik from '../../components/InputWithFormik';
import RadioInput from '../../components/RadioInput';
import { updateSurvey } from '../../redux/actions';
import UserOrgSelector from '../users/form/UserOrgsSelector';
import { supportedLanguages } from '../../api';

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
    height: '65vh',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      padding: '1em',
      paddingTop: '2.5rem',
      maxHeight: '100vh',
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
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30
  }
}));

const fieldIsRequired = 'validation.fieldIsRequired';

const SurveyCreateModal = ({ open, onClose, updateSurvey, user }) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const history = useHistory();
  const countryList = countries(
    require(`localized-countries/data/${language}`)
  ).array();

  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState([]);

  //Validation criterias
  const validationSchema = Yup.object({
    title: Yup.string().required(fieldIsRequired),
    hub: Yup.string().required(fieldIsRequired),
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
    const survey = {
      title: values.title,
      hub: values.hub,
      country: values.country,
      language: values.language
    };

    updateSurvey(survey);
    console.log(history);
  };

  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      className={classes.modal}
      open={open}
      onClose={() => onClose(false)}
    >
      <div className={classes.container}>
        <Typography variant="h5" align="center" style={{ marginBottom: 10 }}>
          {t('views.survey.create.add')}
        </Typography>
        <IconButton
          className={classes.closeIcon}
          key="dismiss"
          onClick={() => onClose(false)}
        >
          <CloseIcon style={{ color: 'green' }} />
        </IconButton>
        <Formik
          initialValues={{
            title: '',
            organization: '',
            hub: '',
            country: '',
            language: '',
            choice: 'SCRATCH'
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            onSubmit(values);
          }}
        >
          {({ setFieldValue, values }) => (
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
              />

              <AutocompleteWithFormik
                label={t('views.survey.create.country')}
                name="country"
                rawOptions={countryList}
                labelKey="label"
                valueKey="code"
                maxMenuHeight="150"
                isClearable={false}
                required
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
                onChange={e => setFieldValue('choice', e.target.value)}
              />
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

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyCreateModal);
