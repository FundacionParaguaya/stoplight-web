import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import CheckboxInput from '../../components/CheckboxInput';
import InputWithLabel from '../../components/InputWithLabel';
import withLayout from '../../components/withLayout';
import { updateSurvey } from '../../redux/actions';
import Header from './Header';

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
  icon: { color: theme.palette.grey.main },
  lifeMapLabel: {
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: 'bold'
  },
  buttonContainer: {
    marginTop: '2rem',
    marginBottom: '2rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));

// Validation criterias
const validationSchema = Yup.object({
  signature: Yup.bool(),
  imageCapture: Yup.bool(),
  mandatoryIndicators: Yup.number(),
  interactiveHelp: Yup.bool(),
  randomOrder: Yup.bool(),
  hasQuestionsWithScore: Yup.bool()
});

const Summary = ({ user, currentSurvey, updateSurvey }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const onSubmit = values => {
    setLoading(true);
    //Todo: Update survey
    setLoading(false);
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

  const CheckboxWithLabel = ({ onCheck, label, checked }) => {
    return (
      <div style={{ cursor: 'pointer' }} onClick={onCheck}>
        <CheckboxInput label={label} onChange={onCheck} checked={checked} />
      </div>
    );
  };

  return (
    <div className={classes.mainContainer}>
      <Formik
        enableReinitialize
        initialValues={{
          signature: currentSurvey.signature || false,
          imageCapture: currentSurvey.imageCapture || false,
          interactiveHelp: currentSurvey.interactiveHelp || false,
          randomOrder: currentSurvey.randomOrder || false,
          hasQuestionsWithScore: currentSurvey.hasQuestionsWithScore || false,
          mandatoryIndicators: currentSurvey.mandatoryIndicators || '0'
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          onSubmit(values);
        }}
      >
        {({ setFieldValue, values, touched, setTouched }) => (
          <Form noValidate autoComplete={'off'}>
            <div className={classes.container}>
              <Header title={'Survey Summary'} bottomTitle />
              <div
                className={classes.summaryContainer}
                style={{ width: '100%' }}
              >
                <Grid
                  item
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.amountsGrid}
                >
                  <AmountItem amount={4} label={4 > 1 ? 'Topics' : 'Topic'} />
                  <AmountItem
                    amount={currentSurvey.surveyEconomicQuestions.length}
                    label={'Socioeconomic Questions'}
                  />
                  <AmountItem
                    amount={5}
                    label={
                      5 > 1 ? 'Indicator Dimensions' : 'Indicator Dimension'
                    }
                  />
                  <AmountItem
                    amount={currentSurvey.surveyStoplightQuestions.length}
                    label={'Stoplight Questions'}
                  />
                </Grid>
              </div>
              <Typography className={classes.title} variant="h5">
                {'Additional Settings'}
              </Typography>
              <div
                style={{ marginBottom: 0 }}
                className={classes.additionalSettingsContainer}
              >
                <CheckboxWithLabel
                  label={'Enable survey signature'}
                  onCheck={() => setFieldValue('signature', !values.signature)}
                  checked={values.signature}
                />
                <CheckboxWithLabel
                  label={'Enable image capture'}
                  onCheck={() =>
                    setFieldValue('imageCapture', !values.imageCapture)
                  }
                  checked={values.imageCapture}
                />
                <CheckboxWithLabel
                  label={'Enable interactive help'}
                  onCheck={() =>
                    setFieldValue('interactiveHelp', !values.interactiveHelp)
                  }
                  checked={values.interactiveHelp}
                />
                <CheckboxWithLabel
                  label={'Enable random order'}
                  onCheck={() =>
                    setFieldValue('randomOrder', !values.randomOrder)
                  }
                  checked={values.randomOrder}
                />
                <CheckboxWithLabel
                  label={'Enable questions with score'}
                  onCheck={() =>
                    setFieldValue(
                      'hasQuestionsWithScore',
                      !values.hasQuestionsWithScore
                    )
                  }
                  checked={values.hasQuestionsWithScore}
                />
                <div className={classes.lifeMapTitleContainer}>
                  <BlurOnIcon className={classes.icon} />
                  <Typography
                    className={classes.lifeMapLabel}
                    variant="subtitle1"
                  >
                    {'Life Map'}
                  </Typography>
                </div>
                <div style={{ paddingLeft: 42, width: 300 }}>
                  <InputWithLabel
                    title={'Number of mandatory indicators'}
                    inputProps={{ maxLength: '100' }}
                    multiline={true}
                    name="mandatoryIndicators"
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
