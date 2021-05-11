import { IconButton, Modal, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import {
  createIntervention,
  getInterventionDefinition,
  getInterventionById
} from '../../../api';
import AutocompleteWithFormik from '../../../components/AutocompleteWithFormik';
import BooleanWithFormik from '../../../components/BooleanWithFormik';
import CheckboxWithFormik from '../../../components/CheckboxWithFormik';
import DatePickerWithFormik from '../../../components/DatePickerWithFormik';
import InputWithFormik from '../../../components/InputWithFormik';
import OtherOptionInput from '../../../components/OtherOptionInput';
import RadioWithFormik from '../../../components/RadioWithFormik';
import SelectWithFormik from '../../../components/SelectWithFormik';
import { capitalize } from '../../../utils/survey-utils';

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
    width: '80vw',
    maxWidth: 1450,
    maxHeight: '85vh',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      padding: '1em'
    },
    overflowY: 'auto'
  },
  title: {
    marginTop: 20,
    paddingBottom: 5
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
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
    const draftQuestion = draft.find(e => e.key === question.codeName) || {};

    const hasOtherOption = (question.options || []).find(o => o.otherOption);

    if (hasOtherOption) {
      initialValue[`custom${capitalize(question.codeName)}`] =
        draftQuestion.hasOwnProperty('other') && !!draftQuestion.other
          ? draftQuestion.other
          : '';
    }

    initialValue[question.codeName] =
      (Object.prototype.hasOwnProperty.call(draftQuestion, 'value') &&
      !!draftQuestion.value
        ? draftQuestion.value
        : draftQuestion.multipleValue) || '';

    if (question.answerType === 'boolean') {
      initialValue[question.codeName] = false;
    }
    delete initialValue[question.codeName].text;
  });

  return initialValue;
};

export const buildValidationSchemaForForm = questions => {
  const schema = {};
  let validation = Yup.string();

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

const fieldIsRequired = 'validation.fieldIsRequired';

const AddInterventionModal = ({
  open,
  onClose,
  interventionEdit,
  indicators,
  snapshotId,
  showErrorMessage,
  showSuccessMessage,
  user
}) => {
  const classes = useStyles();
  const isEdit = !!interventionEdit && !!interventionEdit.id;

  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [definition, setDefinition] = useState();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setLoading(true);
    getInterventionDefinition(user, 6)
      .then(response => {
        let definition = response.data.data.retrieveInterventionDefinition;
        setDefinition(definition);
        setQuestions(definition.questions);
        setLoading(false);
      })
      .catch(e => {
        showErrorMessage(e.message);
        setLoading(false);
      });
  }, []);

  useEffect(
    () => {
      if (indicators && Array.isArray(indicators)) {
        let indicatorsOptions =
          indicators.map(ind => ({ value: ind.key, text: ind.shortName })) ||
          [];
        let q = Array.from(questions);
        q = q.map(question => {
          if (question.codeName === 'stoplightIndicator') {
            question.options = indicatorsOptions;
          }
          return question;
        });
        setQuestions(q);
      }
    },
    [JSON.stringify(indicators)],
    snapshotId
  );

  useEffect(() => {
    getInterventionById(user, 1)
      .then(response => console.log(response))
      .catch(e => showErrorMessage(e));
  }, []);

  const onSubmit = values => {
    let keys = Object.keys(values);

    let answers = [];
    keys.forEach(key => {
      const otherQuestion = !!key.match(/^custom/g);
      const otherValue = values[`custom${capitalize(key)}`];
      let answer;

      if (otherQuestion) {
      } else if (Array.isArray(values[key])) {
        answer = {
          codeName: key,
          multipleValue: values[key].map(v => v.value),
          multipleText: values[key].map(v => v.label)
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

      if (
        !otherQuestion &&
        (answer.value || answer.multipleValue || answer.value === false)
      ) {
        answers[key] = answer;
      }
    });

    let finalAnswers = [];
    keys.forEach(key => {
      let answer = answers[key];
      answer && finalAnswers.push(answer);
    });

    setLoading(true);
    createIntervention(user, finalAnswers, definition.id, snapshotId, null)
      .then(() => {
        showSuccessMessage(
          t('views.familyProfile.interventions.form.save.success')
        );
        setLoading(false);
      })
      .catch(() => {
        showErrorMessage(
          t('views.familyProfile.interventions.form.save.error')
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
          style={{ marginBottom: '2rem' }}
        >
          {isEdit
            ? t('views.familyProfile.interventions.form.editTitle')
            : t('views.familyProfile.interventions.form.addTitle')}
        </Typography>
        <IconButton
          className={classes.closeIcon}
          key="dismiss"
          onClick={() => onClose(false)}
        >
          <CloseIcon style={{ color: 'green' }} />
        </IconButton>

        <Formik
          initialValues={buildInitialValuesForForm(questions, [])}
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
                        maxDate={new Date()}
                        disableFuture
                        required
                        minDate={moment('1910-01-01')}
                        onChange={e => {
                          !!e &&
                            e._isValid &&
                            setFieldValue(question.codeName, e.unix());
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
                  onClick={() => {}}
                  disabled={loading}
                >
                  {t('general.cancel')}
                </Button>

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

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(AddInterventionModal);
