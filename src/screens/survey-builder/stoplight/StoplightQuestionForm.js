import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import InputWithLabel from '../../../components/InputWithLabel';
import AudioUploader from '../AudioUploader';
import ImageForm from './ImageForm';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    margin: '1rem',
    padding: '1rem',
    backgroundColor: theme.palette.background.grey
  },
  buttonContainer: {
    marginTop: '2rem',
    marginBottom: '2rem',
    width: '100%',
    display: 'flex'
  },
  img: {
    minHeight: 125,
    height: 125,
    minWidth: 125,
    width: 125,
    borderRadius: '0 0 4px 4px',
    marginRight: 16
  },
  label: {
    fontSize: 14
  },
  colorContainer: {
    display: 'flex',
    margin: '1rem'
  },
  colorBall: {
    marginRight: theme.spacing(1),
    height: 17,
    width: 20,
    borderRadius: '50%'
  }
}));
const fieldIsRequired = 'validation.fieldIsRequired';

const StoplightQuestionForm = ({
  itemRef,
  draggableProps,
  question,
  updateQuestion,
  afterSubmit = () => {}
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const isCreate = !question.id;
  const inputSize = isCreate ? 4 : 6;

  const validationSchema = Yup.object({
    questionText: Yup.string().required(fieldIsRequired),
    spanishText: Yup.string().when('other', (other, schema) =>
      isCreate ? schema.required(fieldIsRequired) : schema
    ),
    englishText: Yup.string().when('other', (other, schema) =>
      isCreate ? schema.required(fieldIsRequired) : schema
    ),
    shortName: Yup.string().required(fieldIsRequired),
    description: Yup.string().required(fieldIsRequired),
    definition: Yup.string(),
    questionAudio: Yup.string(),
    stoplightColors: Yup.array().of(
      Yup.object().shape({
        url: Yup.string().required(fieldIsRequired),
        description: Yup.string().required(fieldIsRequired)
      })
    )
  });

  const updateField = (setFieldValue, key, value) => {
    setFieldValue(key, value);
    updateQuestion({ ...question, [key]: value });
  };

  const updateColors = (setFieldValue, colorIndex, key, value) => {
    setFieldValue(`stoplightColors[${colorIndex}].${key}`, value);
    let newColors = Array.from(question.stoplightColors);
    newColors[colorIndex][key] = value;
    updateQuestion({ ...question, stoplightColors: newColors });
  };

  const colorLabels = {
    '1': 'RED',
    '2': 'YELLOW',
    '3': 'GREEN'
  };

  return (
    <div ref={itemRef} {...draggableProps} className={classes.mainContainer}>
      <Formik
        initialValues={{
          questionText: question.questionText || '',
          spanishText: question.spanishText || '',
          englishText: question.englishText || '',
          shortName: question.shortName || '',
          description: question.description || '',
          definition: question.definition || '',
          stoplightColors: !Array.isArray(question.stoplightColors)
            ? [
                { value: 3, url: '', description: '' },
                { value: 2, url: '', description: '' },
                { value: 1, url: '', description: '' }
              ]
            : [
                {
                  value: 3,
                  url: question.stoplightColors[0].url,
                  description: question.stoplightColors[0].description
                },
                {
                  value: 2,
                  url: question.stoplightColors[1].url,
                  description: question.stoplightColors[1].description
                },
                {
                  value: 1,
                  url: question.stoplightColors[2].url,
                  description: question.stoplightColors[2].description
                }
              ],
          questionAudio: question.questionAudio || ''
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          updateQuestion({ ...question, ...values });
          afterSubmit();
        }}
      >
        {({ values, setFieldValue }) => (
          <Form noValidate autoComplete={'off'}>
            <Grid container>
              <Grid item md={12} container spacing={1}>
                <Grid item md={inputSize}>
                  <InputWithLabel
                    title={t(
                      `views.surveyBuilder.stoplight.form.indicatorTitle`
                    )}
                    inputProps={{ maxLength: '255' }}
                    name="questionText"
                    required
                    onChange={e =>
                      updateField(setFieldValue, 'questionText', e.target.value)
                    }
                  />
                </Grid>
                {isCreate && (
                  <Grid item md={4}>
                    <InputWithLabel
                      title={t(
                        `views.surveyBuilder.stoplight.form.spanishIndicatorTitle`
                      )}
                      inputProps={{ maxLength: '255' }}
                      name="spanishText"
                      required
                      onChange={e =>
                        updateField(
                          setFieldValue,
                          'spanishText',
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                )}
                {isCreate && (
                  <Grid item md={4}>
                    <InputWithLabel
                      title={t(
                        `views.surveyBuilder.stoplight.form.englishIndicatorTitle`
                      )}
                      inputProps={{ maxLength: '255' }}
                      name="englishText"
                      required
                      onChange={e =>
                        updateField(
                          setFieldValue,
                          'englishText',
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                )}
              </Grid>

              <Grid item md={12} container spacing={1}>
                <Grid item md={inputSize}>
                  <InputWithLabel
                    title={t(`views.surveyBuilder.stoplight.form.shortName`)}
                    inputProps={{ maxLength: '255' }}
                    name="shortName"
                    required
                    onChange={e =>
                      updateField(setFieldValue, 'shortName', e.target.value)
                    }
                  />
                </Grid>
                <Grid item md={inputSize}>
                  <InputWithLabel
                    title={t(`views.surveyBuilder.stoplight.form.lifemapName`)}
                    inputProps={{ maxLength: '255' }}
                    name="description"
                    required
                    onChange={e =>
                      updateField(setFieldValue, 'description', e.target.value)
                    }
                  />
                </Grid>
              </Grid>

              <Grid item md={12} container spacing={1}>
                <InputWithLabel
                  title={t(`views.surveyBuilder.stoplight.form.definition`)}
                  inputProps={{ maxLength: '1000' }}
                  name="definition"
                  multiline
                  onChange={e =>
                    updateField(setFieldValue, 'definition', e.target.value)
                  }
                />
              </Grid>

              <Grid item md={12} container direction="column">
                {question.stoplightColors.map(({ value }) => (
                  <div key={value} className={classes.colorContainer}>
                    <div
                      className={classes.colorBall}
                      style={{ backgroundColor: colorLabels[value] }}
                    />
                    <ImageForm
                      imageUrl={values.stoplightColors[3 - value].url}
                      handleChange={url =>
                        updateColors(setFieldValue, 3 - value, 'url', url)
                      }
                    />
                    <InputWithLabel
                      title={t(
                        `views.surveyBuilder.stoplight.form.${colorLabels[value]}`
                      )}
                      inputProps={{ maxLength: '255' }}
                      name={`stoplightColors[${3 - value}].description`}
                      multiline
                      required
                      onChange={e =>
                        updateColors(
                          setFieldValue,
                          3 - value,
                          'description',
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </Grid>

              <Grid item md={12} container spacing={1}>
                <Typography variant="subtitle1" className={classes.label}>
                  {t('views.surveyBuilder.audioSupport')}
                </Typography>

                <AudioUploader
                  audioUrl={question.questionAudio}
                  onChange={url =>
                    updateField(setFieldValue, 'questionAudio', url)
                  }
                />
              </Grid>
            </Grid>

            <div className={classes.buttonContainer}>
              <Button type="submit" color="primary" variant="contained">
                {t('general.done')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StoplightQuestionForm;
