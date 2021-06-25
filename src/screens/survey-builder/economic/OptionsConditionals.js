import {
  Button,
  IconButton,
  Modal,
  Tooltip,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import CheckboxWithFormik from '../../../components/CheckboxWithFormik';
import { theme } from '../../../theme';
import { autoCompleteStyle } from '../../../utils/styles-utils';
import SearchText from '../SearchText';

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
    width: '75vw',
    maxWidth: 825,
    height: '75vh',
    minHeight: 660,
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      width: '65vw'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '1em',
      paddingTop: '2.5rem',
      height: '100vh',
      width: '100vw'
    },
    overflowY: 'auto'
  },
  titleContainer: {
    display: 'flex',
    marginBottom: 8,
    width: 360
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },
  labelOne: {
    width: 'fit-content',
    height: 54,
    background: '#F2F2F2',
    border: '1px solid #E0E0E0',
    padding: theme.spacing(2)
  },
  labelTwo: {
    width: 'fit-content',
    minWidth: 200,
    height: 54,
    border: '1px solid #E0E0E0',
    padding: theme.spacing(2)
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30,
    marginBottom: 30
  }
}));

const OptionsConditionals = ({
  open,
  question,
  condition,
  targetOptions,
  onClose
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [target, setTarget] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    Array.isArray(condition.targets) &&
      condition.targets.length > 0 &&
      setTarget(targetOptions.find(t => t.value === condition.targets[0]));
  }, [condition]);

  const onSave = values => {
    onClose(true, {
      ...condition,
      targets: [target.value],
      conditionalOptions: values.options
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
        <Typography variant="h5" align="center" style={{ marginBottom: 10 }}>
          {t('views.surveyBuilder.economic.conditionals.optionsTitle')}
        </Typography>
        <IconButton
          className={classes.closeIcon}
          key="dismiss"
          onClick={() => onClose(false)}
        >
          <CloseIcon style={{ color: 'green' }} />
        </IconButton>

        <Typography variant="h6" style={{ marginBottom: 20 }}>
          {question}
        </Typography>

        <div className={classes.titleContainer}>
          <Typography
            variant="subtitle2"
            className={classes.labelOne}
            style={{ minWidth: 160 }}
          >
            {condition.operatorText}
          </Typography>
          <Typography variant="subtitle2" className={classes.labelTwo}>
            {condition.valueText}
          </Typography>
        </div>
        <div style={{ display: 'flex' }}>
          <Typography
            variant="subtitle2"
            className={classes.labelOne}
            style={{ width: '100%' }}
          >
            {t('views.surveyBuilder.economic.conditionals.selectQuestion')}
          </Typography>

          <Select
            value={target}
            onChange={selection => setTarget(selection)}
            placeholder={t(
              'views.surveyBuilder.economic.conditionals.optionPlaceholder'
            )}
            components={{ SingleValue }}
            options={targetOptions}
            hideSelectedOptions
            styles={optionSelectStyle}
            closeMenuOnSelect
          />
        </div>
        <SearchText
          label={t('views.surveyBuilder.economic.conditionals.searchOption')}
          onChange={e => setFilter(e.target.value)}
        />
        <Formik
          enableReinitialize
          initialValues={{ options: condition.conditionalOptions || [] }}
          onSubmit={values => {
            onSave(values);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form noValidate>
              {target && Array.isArray(target.optionKeys) && (
                <CheckboxWithFormik
                  label={''}
                  rawOptions={(target.optionKeys || []).filter(
                    o => o.text.indexOf(filter) >= 0
                  )}
                  name={'options'}
                  required={question.required}
                  onChange={multipleValue => {
                    setFieldValue('options', multipleValue);
                  }}
                />
              )}
              <div className={classes.buttonContainerForm}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={!target}
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

export default OptionsConditionals;

const valueStyle = makeStyles(theme => ({
  chip: {
    backgroundColor: theme.palette.background.default,
    fontSize: 14
  },
  tooltip: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  number: {
    height: 24,
    marginLeft: 4,
    padding: '4px 8px',
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(48, 158, 67, 0.3)',
    borderRadius: '50%',
    fontWeight: 600
  }
}));

const SingleValue = props => {
  const classes = valueStyle();
  const { t } = useTranslation();
  return (
    <Tooltip
      title={props.data.label}
      placement="top"
      classes={{
        tooltip: classes.tooltip
      }}
    >
      <Typography variant="subtitle2" className={classes.container}>
        {t('views.surveyBuilder.question')}{' '}
        <div className={classes.number}> {props.data.order}</div>
      </Typography>
    </Tooltip>
  );
};

const optionSelectStyle = {
  ...autoCompleteStyle,
  container: styles => ({
    ...styles,
    width: '100%'
  }),
  control: (styles, { hasValue }) => ({
    ...styles,
    backgroundColor: theme.palette.background.default,
    border: `.5px solid ${theme.palette.grey.quarter}`,
    '&:hover': {
      borderColor: 'none'
    },
    boxShadow: 'none',
    overflowY: 'auto',
    maxHeight: 75,
    height: 55,
    paddingRight: 11,
    paddingLeft: 8,
    width: '100%'
  }),
  placeholder: styles => ({
    ...styles,
    fontSize: 14,
    color: theme.palette.grey.middle,
    paddingBottom: 0
  })
};
