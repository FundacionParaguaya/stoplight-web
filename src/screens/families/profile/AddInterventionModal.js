import { IconButton, Modal, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import { Form, Formik } from 'formik';
import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { createOrUpdateIntervention, getInterventionById } from '../../../api';
import AutocompleteWithFormik from '../../../components/AutocompleteWithFormik';
import BooleanWithFormik from '../../../components/BooleanWithFormik';
import CheckboxWithFormik from '../../../components/CheckboxWithFormik';
import DatePickerWithFormik from '../../../components/DatePickerWithFormik';
import InputWithFormik from '../../../components/InputWithFormik';
import OtherOptionInput from '../../../components/OtherOptionInput';
import RadioWithFormik from '../../../components/RadioWithFormik';
import SelectWithFormik from '../../../components/SelectWithFormik';
import { capitalize } from '../../../utils/survey-utils';
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
    maxHeight: '85vh',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      padding: '1em',
      paddingTop: '2.5rem',
      maxHeight: '100vh',
      width: '100vw'
    },
    overflowY: 'auto'
  },
  title: {
    marginBottom: '2rem',
    [theme.breakpoints.down('xs')]: {
      marginBottom: 0
    }
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },
  alert: {
    marginTop: 10,
    '& .MuiAlert-message': {
      marginLeft: theme.spacing(1),
      fontSize: 15
    }
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: '30px 0'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    marginTop: '1rem'
  }
}));

export const buildInitialValuesForForm = (questions, draft) => {
  const initialValue = {};

  questions.forEach(question => {
    const draftQuestion =
      draft.find(e => e.codeName === question.codeName) || {};

    const hasOtherOption = (question.options || []).find(o => o.otherOption);

    const draftHasOtherValue =
      draftQuestion.hasOwnProperty('other') && !!draftQuestion.other;

    if (hasOtherOption && draftHasOtherValue) {
      initialValue[question.codeName] =
        Array.isArray(draftQuestion.multipleValue) &&
        draftQuestion.multipleValue.length > 0
          ? draftQuestion.multipleValue
          : hasOtherOption.value;
      initialValue[`custom${capitalize(question.codeName)}`] =
        draftQuestion.other;
    }

    if (!draftHasOtherValue)
      initialValue[question.codeName] =
        (Object.prototype.hasOwnProperty.call(draftQuestion, 'value') &&
        !!draftQuestion.value
          ? draftQuestion.value
          : draftQuestion.multipleValue) || '';

    if (question.answerType === 'boolean') {
      initialValue[question.codeName] =
        initialValue[question.codeName] === 'true';
    }

    if (question.answerType === 'multiselect') {
      let values = [];
      if (Array.isArray(draftQuestion.multipleValue)) {
        values = draftQuestion.multipleValue.map((v, index) => ({
          value: v,
          label: draftQuestion.multipleText[index]
        }));
      }
      initialValue[question.codeName] = values;
    }

    !!initialValue[question.codeName] &&
      delete initialValue[question.codeName].text;
  });

  return initialValue;
};

export const buildValidationSchemaForForm = questions => {
  const schema = {};
  let validation = Yup.string();
  let dateValidation = Yup.date();
  const validDate = 'validation.validDate';
  const fieldIsRequired = 'validation.fieldIsRequired';

  questions.forEach(question => {
    if (question.codeName === 'stoplightIndicator') {
      schema[question.codeName] = Yup.string().when(
        'generalIntervention',
        (generalIntervention, schema) => {
          return schema.test('stoplightIndicator', fieldIsRequired, value => {
            return (
              (!!value && !generalIntervention) ||
              (!value && generalIntervention)
            );
          });
        }
      );
    } else if (question.answerType === 'date' && question.coreQuestion) {
      schema[question.codeName] = dateValidation
        .typeError(fieldIsRequired)
        .transform((_value, originalValue) => {
          return originalValue
            ? moment.unix(originalValue).toDate()
            : new Date('');
        })
        .required(validDate)
        .test({
          name: 'test-date-range',
          test: function(date) {
            if (Date.parse(date) / 1000 > moment().unix()) {
              return this.createError({
                message: validDate,
                path: question.codeName
              });
            }
            return true;
          }
        });
    } else if (
      question.required &&
      question.codeName !== 'generalIntervention'
    ) {
      schema[question.codeName] = validation.required(fieldIsRequired);
    }
  });

  const validationSchema = Yup.object().shape(schema);
  return validationSchema;
};

const AddInterventionModal = ({
  open,
  onClose,
  interventionEdit,
  definition,
  indicators,
  snapshotId,
  intervention,
  familyId,
  familyName,
  user,
  preview
}) => {
  const classes = useStyles();
  const isEdit = !!interventionEdit && !!interventionEdit.id;
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [draft, setDraft] = useState([]);

  useEffect(() => {
    if (definition) {
      let questions = definition.questions;
      if (indicators && Array.isArray(indicators)) {
        let indicatorsOptions =
          indicators.map(ind => ({ value: ind.key, text: ind.shortName })) ||
          [];
        questions = questions.map(question => {
          if (question.codeName === 'stoplightIndicator') {
            question.options = indicatorsOptions;
          }
          return question;
        });
      }
      setQuestions(questions);
    }
  }, [definition, indicators]);

  useEffect(() => {
    isEdit
      ? getInterventionById(user, interventionEdit.id)
          .then(response => {
            setDraft(response.data.data.retrieveInterventionData.values);
          })
          .catch(e => console.log(e.message))
      : setDraft([]);
  }, [interventionEdit]);

  const onSubmit = values => {
    let keys = Object.keys(values);

    let answers = [];
    keys.forEach(key => {
      const otherQuestion = !!key.match(/^custom/g);
      const otherValue = values[`custom${capitalize(key)}`];
      let answer;

      if (otherQuestion) {
        //If it has custom in it's key then it's just an auxiliar questions and should be ignore
      } else if (Array.isArray(values[key])) {
        answer = {
          codeName: key,
          multipleValue: values[key].map(v => v.value || v),
          multipleText: values[key].map(v => v.label || v)
        };
      } else {
        answer = {
          codeName: key,
          value: values[key]
        };
      }

      if (otherValue) {
        answer = {
          ...answer,
          other: otherValue
        };
      }

      answers[key] = answer;
    });

    let finalAnswers = [];
    keys.forEach(key => {
      const otherQuestion = !!key.match(/^custom/g);
      let answer = answers[key];
      !otherQuestion && finalAnswers.push(answer);
    });

    let params = '';
    definition.questions.forEach(question => {
      params += `${question.codeName} `;
    });

    setLoading(true);
    createOrUpdateIntervention(
      user,
      finalAnswers,
      definition.id,
      snapshotId,
      intervention,
      interventionEdit.id,
      { familyId, familyName },
      params
    )
      .then(response => {
        enqueueSnackbar(
          t('views.familyProfile.interventions.form.save.success'),
          { variant: 'success' }
        );
        let data = isEdit
          ? response.data.data.updateIntervention
          : response.data.data.createIntervention;
        onClose(true, data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(
          t('views.familyProfile.interventions.form.save.error'),
          { variant: 'error' }
        );
        setLoading(false);
      });
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
        <Typography
          variant="h5"
          test-id="title-bar"
          align="center"
          className={classes.title}
        >
          {isEdit && t('views.familyProfile.interventions.form.editTitle')}
          {preview && t('views.familyProfile.interventions.form.previewTitle')}
          {!isEdit &&
            !preview &&
            t('views.familyProfile.interventions.form.addTitle')}
        </Typography>
        {preview && (
          <Alert severity="warning" className={classes.alert}>
            {t('views.intervention.definition.previewWarning')}
          </Alert>
        )}
        <IconButton
          className={classes.closeIcon}
          key="dismiss"
          onClick={() => onClose(false)}
        >
          <CloseIcon style={{ color: 'green' }} />
        </IconButton>

        <Formik
          initialValues={buildInitialValuesForForm(questions, draft)}
          enableReinitialize
          validationSchema={buildValidationSchemaForForm(questions)}
          onSubmit={values => {
            onSubmit(values);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form noValidate autoComplete={'off'}>
              {questions.map(question => {
                if (question.answerType === 'date') {
                  return (
                    <React.Fragment key={question.codeName}>
                      <DatePickerWithFormik
                        label={question.shortName}
                        name={question.codeName}
                        required={question.required}
                        maxDate={
                          question.coreQuestion
                            ? new Date()
                            : new Date('2100-01-01')
                        }
                        disableFuture={question.coreQuestion}
                        minDate={moment('1910-01-01')}
                        onChange={e => {
                          !!e &&
                            e._isValid &&
                            setFieldValue(question.codeName, e.unix());
                          //Condition for clearing  unrequired dates fields
                          (!e || !e._isValid) &&
                            !question.required &&
                            setFieldValue(question.codeName, '');
                        }}
                      />
                    </React.Fragment>
                  );
                }
                if (question.answerType === 'select') {
                  return (
                    <React.Fragment key={question.codeName}>
                      <AutocompleteWithFormik
                        label={question.shortName}
                        name={question.codeName}
                        rawOptions={question.options || []}
                        labelKey="text"
                        valueKey="value"
                        required={question.required}
                        isClearable={!question.required}
                      />
                      <OtherOptionInput
                        key={`custom${capitalize(question.codeName)}`}
                        dep={question.codeName}
                        fieldOptions={question.options || []}
                        target={`custom${capitalize(question.codeName)}`}
                        cleanUp={() =>
                          setFieldValue(
                            `custom${capitalize(question.codeName)}`,
                            ''
                          )
                        }
                      >
                        {(otherOption, value) =>
                          otherOption === value && (
                            <InputWithFormik
                              key={`custom${capitalize(question.codeName)}`}
                              type="text"
                              label={t('views.survey.specifyOther')}
                              name={`custom${capitalize(question.codeName)}`}
                              required
                            />
                          )
                        }
                      </OtherOptionInput>
                    </React.Fragment>
                  );
                }
                if (question.answerType === 'multiselect') {
                  return (
                    <React.Fragment key={question.codeName}>
                      <SelectWithFormik
                        name={question.codeName}
                        label={question.shortName}
                        rawOptions={question.options || []}
                        maxMenuHeight="120"
                        labelKey="text"
                        valueKey="value"
                        isMulti
                        required={question.required}
                        isClearable={!question.required}
                        isDisabled={
                          question.codeName === 'stoplightIndicator' &&
                          values.generalIntervention
                        }
                      />
                      <OtherOptionInput
                        key={`custom${capitalize(question.codeName)}`}
                        dep={question.codeName}
                        fieldOptions={question.options || []}
                        target={`custom${capitalize(question.codeName)}`}
                        cleanUp={() =>
                          setFieldValue(
                            `custom${capitalize(question.codeName)}`,
                            ''
                          )
                        }
                        isMultiValue
                      >
                        {(otherOption, value) =>
                          otherOption === value && (
                            <InputWithFormik
                              key={`custom${capitalize(question.codeName)}`}
                              type="text"
                              label={t('views.survey.specifyOther')}
                              name={`custom${capitalize(question.codeName)}`}
                              required
                            />
                          )
                        }
                      </OtherOptionInput>
                    </React.Fragment>
                  );
                }
                if (question.answerType === 'radio') {
                  return (
                    <React.Fragment key={question.codeName}>
                      <RadioWithFormik
                        label={question.shortName}
                        rawOptions={question.options || []}
                        key={question.codeName}
                        name={question.codeName}
                        required={question.required}
                        onChange={e =>
                          setFieldValue(question.codeName, e.target.value)
                        }
                      />
                      <OtherOptionInput
                        key={`custom${capitalize(question.codeName)}`}
                        dep={question.codeName}
                        fieldOptions={question.options || []}
                        target={`custom${capitalize(question.codeName)}`}
                        cleanUp={() =>
                          setFieldValue(
                            `custom${capitalize(question.codeName)}`,
                            ''
                          )
                        }
                      >
                        {(otherOption, value) =>
                          otherOption === value && (
                            <InputWithFormik
                              key={`custom${capitalize(question.codeName)}`}
                              type="text"
                              label={t('views.survey.specifyOther')}
                              name={`custom${capitalize(question.codeName)}`}
                              required
                            />
                          )
                        }
                      </OtherOptionInput>
                    </React.Fragment>
                  );
                }
                if (question.answerType === 'checkbox') {
                  return (
                    <React.Fragment key={question.codeName}>
                      <CheckboxWithFormik
                        key={question.codeName}
                        label={question.shortName}
                        rawOptions={question.options || []}
                        name={question.codeName}
                        required={question.required}
                        onChange={values =>
                          setFieldValue(question.codeName, values)
                        }
                      />
                      <OtherOptionInput
                        key={`custom${capitalize(question.codeName)}`}
                        dep={question.codeName}
                        fieldOptions={question.options || []}
                        target={`custom${capitalize(question.codeName)}`}
                        isMultiValue
                        cleanUp={() =>
                          setFieldValue(
                            `custom${capitalize(question.codeName)}`,
                            ''
                          )
                        }
                      >
                        {(otherOption, value) =>
                          otherOption === value && (
                            <InputWithFormik
                              key={`custom${capitalize(question.codeName)}`}
                              type="text"
                              label={t('views.survey.specifyOther')}
                              name={`custom${capitalize(question.codeName)}`}
                              required
                            />
                          )
                        }
                      </OtherOptionInput>
                    </React.Fragment>
                  );
                }

                if (question.answerType === 'boolean') {
                  return (
                    <BooleanWithFormik
                      key={question.codeName}
                      label={question.shortName}
                      name={question.codeName}
                      required={
                        question.required &&
                        question.codeName !== 'generalIntervention'
                      }
                      cleanUp={() => {
                        if (question.codeName === 'generalIntervention') {
                          setFieldValue('stoplightIndicator', []);
                        }
                      }}
                    />
                  );
                }

                return (
                  <InputWithFormik
                    key={question.codeName}
                    label={question.shortName}
                    type={question.answerType}
                    name={question.codeName}
                    required={question.required}
                    multiline
                    inputProps={{ maxLength: 275 }}
                    onChange={e =>
                      setFieldValue(question.codeName, e.target.value)
                    }
                  />
                );
              })}

              {loading && (
                <CircularProgress className={classes.loadingContainer} />
              )}

              <div className={classes.buttonContainerForm}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => onClose(false)}
                  disabled={loading}
                >
                  {preview
                    ? t('views.intervention.definition.goBack')
                    : t('general.cancel')}
                </Button>

                {preview && (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setLoading(true);
                      onClose(true, definition);
                    }}
                  >
                    {t('views.intervention.definition.saveForm')}
                  </Button>
                )}

                {!preview && (
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={loading}
                  >
                    {t('general.save')}
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(AddInterventionModal);
