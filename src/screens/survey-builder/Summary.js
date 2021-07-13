import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import DoneIcon from '@material-ui/icons/Done';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import CheckboxInput from '../../components/CheckboxInput';
import InputWithLabel from '../../components/InputWithLabel';
import withLayout from '../../components/withLayout';
import { updateSurvey } from '../../redux/actions';
import Header from './Header';
import ProgressBar from './ProgressBar';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    paddingTop: 30
  },
  amount: {
    fontSize: 32,
    fontWeight: '500'
  },
  amountsLabel: {
    fontSize: 12,
    fontWeight: '400'
  },
  amountsGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  amountItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 30
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    padding: '0 12%'
  },
  additionalSettingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    marginBottom: 20
  },
  summaryContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.palette.background.default,
    padding: 30,
    marginTop: 20,
    marginBottom: 20
  },
  lifeMapTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 10
  },
  icon: {
    color: theme.palette.grey.main
  },
  lifeMapLabel: {
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: 'bold'
  },
  mandatoryNumber: {
    paddingLeft: 42,
    width: 300
  },
  buttonContainer: {
    marginTop: '2rem',
    marginBottom: '2rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  doneIcon: {
    fontSize: 22,
    marginRight: theme.spacing(1)
  }
}));

// Validation criterias
const validationSchema = Yup.object({
  signSupport: Yup.bool(),
  pictureSupport: Yup.bool(),
  minimumPriorities: Yup.number().min(0)
});

const Summary = ({ user, currentSurvey, updateSurvey }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState('');
  const [dimensions, setDimensions] = useState('');

  useEffect(() => {
    let t = [];
    (currentSurvey.surveyEconomicQuestions || []).forEach(q => {
      t[q.topic] = q;
    });
    setTopics(Object.keys(t).length);
    let d = [];
    (currentSurvey.surveyStoplightQuestions || []).forEach(q => {
      d[q.dimension] = q;
    });
    setDimensions(Object.keys(d).length);
  }, []);

  const updateSettings = (setFieldValue, key, value) => {
    setFieldValue(key, value);
    updateSurvey({
      ...currentSurvey,
      surveyConfig: { ...currentSurvey.surveyConfig, [key]: value }
    });
  };

  const onSubmit = values => {
    setLoading(true);
    //Todo: Update survey
    setLoading(false);
    history.push('/survey-builder/final');
  };

  const AmountItem = ({ amount, label }) => {
    return (
      <div className={classes.amountItemContainer}>
        <Typography className={classes.amount} variant="h4">
          {amount}
        </Typography>
        <Typography className={classes.amountsLabel} variant="subtitle1">
          {label}
        </Typography>
      </div>
    );
  };

  return (
    <div className={classes.mainContainer}>
      <ProgressBar />
      <Formik
        enableReinitialize
        initialValues={{
          signSupport: currentSurvey.surveyConfig.signSupport || false,
          pictureSupport: currentSurvey.surveyConfig.pictureSupport || false,
          minimumPriorities: currentSurvey.minimumPriorities || '0'
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          onSubmit(values);
        }}
      >
        {({ setFieldValue, values }) => (
          <Form noValidate autoComplete={'off'}>
            <div className={classes.container}>
              <Header
                title={t('views.surveyBuilder.summary.title')}
                bottomTitle
              />
              <div className={classes.summaryContainer}>
                <Grid
                  item
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.amountsGrid}
                >
                  <AmountItem
                    amount={topics}
                    label={
                      topics > 1
                        ? t('views.surveyBuilder.economic.topics')
                        : t('views.surveyBuilder.economic.singleTopic')
                    }
                  />
                  <AmountItem
                    amount={currentSurvey.surveyEconomicQuestions.length}
                    label={t('views.surveyBuilder.economic.socioeconomic')}
                  />
                  <AmountItem
                    amount={dimensions}
                    label={
                      dimensions > 1
                        ? t('views.surveyBuilder.stoplight.dimensions')
                        : t('views.surveyBuilder.stoplight.singleDimension')
                    }
                  />
                  <AmountItem
                    amount={currentSurvey.surveyStoplightQuestions.length}
                    label={t('views.surveyBuilder.stoplight.section')}
                  />
                </Grid>
              </div>
              <Typography className={classes.title} variant="h5">
                {t('views.surveyBuilder.summary.settings')}
              </Typography>
              <div
                style={{ marginBottom: 0 }}
                className={classes.additionalSettingsContainer}
              >
                <CheckboxInput
                  label={t('views.surveyBuilder.summary.sign')}
                  onChange={() =>
                    updateSettings(
                      setFieldValue,
                      'signSupport',
                      !values.signSupport
                    )
                  }
                  checked={values.signSupport}
                />
                <CheckboxInput
                  label={t('views.surveyBuilder.summary.image')}
                  onChange={() =>
                    updateSettings(
                      setFieldValue,
                      'pictureSupport',
                      !values.pictureSupport
                    )
                  }
                  checked={values.pictureSupport}
                />
                <div className={classes.lifeMapTitleContainer}>
                  <BlurOnIcon className={classes.icon} />
                  <Typography
                    className={classes.lifeMapLabel}
                    variant="subtitle1"
                  >
                    {t('views.surveyBuilder.summary.lifemap')}
                  </Typography>
                </div>
                <div className={classes.mandatoryNumber}>
                  <InputWithLabel
                    title={t('views.surveyBuilder.summary.mandatoryNumber')}
                    inputProps={{ min: 0 }}
                    type={'number'}
                    name="minimumPriorities"
                    onChange={e => {
                      setFieldValue('minimumPriorities', e.target.value);
                      updateSurvey({
                        ...currentSurvey,
                        minimumPriorities: e.target.value
                      });
                    }}
                  />
                </div>
              </div>
              <div className={classes.buttonContainer}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={loading}
                >
                  <DoneIcon className={classes.doneIcon} />
                  {t('general.save')}
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
)(withLayout(Summary));
