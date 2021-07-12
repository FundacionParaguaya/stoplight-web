import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CancelIcon from '@material-ui/icons/Cancel';
import NotInterestedIcon from '@material-ui/icons/HighlightOff';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import TextInput from '../../../components/TextInput';
import { theme } from '../../../theme';
import { autoCompleteStyle } from '../../../utils/styles-utils';
import OptionsConditionals from './OptionsConditionals';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: '2rem',
    backgroundColor: theme.palette.background.default,
    borderBottom: '1px solid #E0E0E0'
  },
  economicContainer: {
    margin: '1rem'
  },
  input: {
    height: 30,
    paddingTop: '12.0px!important',
    paddingBottom: '12.0px!important',
    paddingRight: '14px!important',
    paddingLeft: '14px!important',
    fontFamily: 'Poppins',
    fontSize: '12px',
    backgroundColor: theme.palette.background.default
  },
  textField: {
    marginTop: 0,
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderRadius: '2px',
        border: `1.5px solid ${theme.palette.primary.main}`
      }
    }
  },
  addContainer: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  addLabel: {
    color: theme.palette.primary.main,
    marginLeft: 4,
    fontWeight: 600
  },
  addIcon: {
    fontSize: 20,
    color: theme.palette.primary.main
  },
  arrow: {
    fontSize: 50,
    color: '#BDBDBD'
  },
  deleteIcon: {
    height: 'min-content',
    color: 'red',
    opacity: '50%',
    padding: 4,
    marginLeft: 4,
    '&:hover': {
      opacity: '100%'
    }
  }
}));

const Conditionals = ({
  order,
  question,
  relatedConditions,
  targetOptions,
  updateConditions,
  deleteCondition
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [conditions, setConditions] = useState([]);
  const [openOptionsModal, setOpenOptionsModal] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState({});

  const conditionsTypes = [
    {
      value: 'questions',
      label: t('views.surveyBuilder.economic.conditionals.types.question')
    },
    {
      value: 'options',
      label: t('views.surveyBuilder.economic.conditionals.types.option')
    },
    {
      value: 'family',
      label: t('views.surveyBuilder.economic.conditionals.types.age')
    }
  ];

  const conditionsForString = [
    {
      value: 'equals',
      label: t('views.surveyBuilder.economic.conditionals.operator.equals')
    },
    {
      value: 'not_equals',
      label: t('views.surveyBuilder.economic.conditionals.operator.notEquals')
    }
  ];

  const conditionsForNumbers = [
    {
      value: 'less_than',
      label: t('views.surveyBuilder.economic.conditionals.operator.less')
    },
    {
      value: 'greater_than',
      label: t('views.surveyBuilder.economic.conditionals.operator.greater')
    },
    {
      value: 'less_than_eq',
      label: t('views.surveyBuilder.economic.conditionals.operator.lessThanEq')
    },
    {
      value: 'greater_than_eq',
      label: t(
        'views.surveyBuilder.economic.conditionals.operator.greaterThanEq'
      )
    }
  ];

  useEffect(() => {
    let newConditions = [];
    relatedConditions.forEach(condition => {
      const index = newConditions.findIndex(
        c =>
          c.variant === condition.variant &&
          c.value === condition.value &&
          c.operator === condition.operator
      );
      if (index >= 0) {
        newConditions[index].targets = [
          ...newConditions[index].targets,
          condition.target
        ];
      } else {
        newConditions.push({
          order: newConditions.length + 1,
          variant: condition.variant,
          operator: condition.operator,
          value: condition.value,
          targets: [condition.target],
          conditionalOptions: condition.conditionalOptions || []
        });
      }
    });
    conditions.forEach(c => {
      !shouldUpdateDraft(c) &&
        newConditions.push({ ...c, order: newConditions.length + 1 });
    });

    newConditions.length === 0 &&
      newConditions.push({
        order: 1,
        variant: 'questions',
        value: '',
        operator: 'equals',
        targets: []
      });
    setConditions(newConditions);
  }, [relatedConditions]);

  const addCondition = () => {
    let newConditions = Array.from(conditions);
    newConditions.push({
      order: newConditions.length + 1,
      variant: 'questions',
      value: '',
      operator: 'equals',
      targets: []
    });
    setConditions(newConditions);
  };

  const shouldUpdateDraft = condition => {
    if (condition.operator && condition.value) {
      if (condition.variant === 'family') {
        return true;
      } else if (
        condition.variant === 'questions' &&
        condition.targets.length > 0 &&
        !!condition.targets[0]
      ) {
        return true;
      } else if (
        Array.isArray(condition.targets) &&
        condition.targets.length > 0 &&
        Array.isArray(condition.conditionalOptions) &&
        condition.conditionalOptions.length > 0
      ) {
        return true;
      }
    }
    return false;
  };

  const onChangeCondition = condition => {
    let newConditions = Array.from(conditions);
    newConditions[condition.order - 1] = condition;
    setConditions(newConditions);
    shouldUpdateDraft(condition) &&
      updateConditions(
        question,
        newConditions.filter(c => shouldUpdateDraft(c))
      );
  };

  const onDeleteCondition = condition => {
    let newConditions = Array.from(conditions);
    newConditions.splice(condition.order - 1, 1);
    newConditions = newConditions.map((condition, index) => ({
      ...condition,
      order: index + 1
    }));
    setConditions(newConditions);
    shouldUpdateDraft(condition) && deleteCondition(question, condition);
  };

  const questionTitle = `${order}. ${question.questionText} ${
    question.required ? '*' : ''
  }`;

  return (
    <div className={classes.mainContainer}>
      <OptionsConditionals
        open={openOptionsModal}
        question={questionTitle}
        condition={selectedCondition}
        targetOptions={targetOptions}
        onClose={(saved, condition) => {
          setOpenOptionsModal(false);
          saved && onChangeCondition(condition);
        }}
      />

      <Typography variant="h6" style={{ marginBottom: 20 }}>
        {questionTitle}
      </Typography>

      {conditions.map((condition, index) => {
        const isNumeric =
          condition.variant === 'family' || question.answerType === 'number';

        let operators = [
          ...conditionsForString,
          ...(isNumeric ? conditionsForNumbers : [])
        ];

        const selectedVariant = conditionsTypes.find(
          o => o.value === condition.variant
        );

        const selectedOperator = operators.find(
          o => o.value === condition.operator
        );
        let selectedValue =
          Array.isArray(question.options) && condition.value
            ? question.options.find(o => o.value === condition.value)
            : {};

        let selectedTargets = Array.from(targetOptions).filter(target =>
          (condition.targets || []).includes(target.value)
        );

        return (
          <Grid key={index} container style={{ marginTop: 8 }}>
            <Grid item md={6} container>
              <Grid item md={4}>
                <Select
                  value={selectedVariant}
                  onChange={selection => {
                    onChangeCondition({
                      ...condition,
                      variant: selection.value
                    });
                  }}
                  placeholder={''}
                  options={conditionsTypes}
                  hideSelectedOptions
                  styles={operatorsSelectStyle}
                  closeMenuOnSelect={true}
                />
              </Grid>
              <Grid item md={3}>
                <Select
                  value={selectedOperator}
                  onChange={selection => {
                    onChangeCondition({
                      ...condition,
                      operator: selection.value
                    });
                  }}
                  placeholder={''}
                  options={operators}
                  hideSelectedOptions
                  styles={operatorsSelectStyle}
                  closeMenuOnSelect={true}
                />
              </Grid>
              <Grid item md={5}>
                {Array.isArray(question.options) &&
                question.options.length > 0 &&
                condition.variant !== 'family' ? (
                  <Select
                    value={{
                      value: selectedValue.value,
                      label: selectedValue.text
                    }}
                    onChange={selection => {
                      onChangeCondition({
                        ...condition,
                        value: selection.value
                      });
                    }}
                    placeholder={t(
                      'views.surveyBuilder.economic.conditionals.optionPlaceholder'
                    )}
                    options={question.options.map(o => ({
                      value: o.value,
                      label: o.text
                    }))}
                    hideSelectedOptions
                    styles={optionSelectStyle}
                    closeMenuOnSelect={true}
                  />
                ) : (
                  <TextInput
                    label={''}
                    value={condition.value}
                    onChange={e => {
                      onChangeCondition({
                        ...condition,
                        value: e.target.value
                      });
                    }}
                    customClasses={{
                      input: classes.input,
                      textField: classes.textField
                    }}
                  />
                )}
              </Grid>
            </Grid>
            <Grid item md={1} container justify="center" alignItems="center">
              <ArrowForwardIcon className={classes.arrow} />
            </Grid>
            <Grid item md={5} container justify="center" alignItems="center">
              <Grid item md={11} container justify="center" alignItems="center">
                {condition.variant === 'questions' && (
                  <Select
                    value={selectedTargets}
                    onChange={selections => {
                      onChangeCondition({
                        ...condition,
                        targets: selections.map(s => s.value)
                      });
                    }}
                    placeholder={t(
                      'views.surveyBuilder.economic.conditionals.optionPlaceholder'
                    )}
                    components={{ MultiValue }}
                    options={targetOptions}
                    hideSelectedOptions
                    styles={optionSelectStyle}
                    closeMenuOnSelect
                    isMulti
                  />
                )}
                {condition.variant === 'options' && (
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={!condition.value}
                    onClick={() => {
                      setSelectedCondition({
                        ...condition,
                        operatorText: selectedOperator.label,
                        valueText: selectedValue.text || condition.value
                      });
                      setOpenOptionsModal(true);
                    }}
                  >
                    {Array.isArray(condition.conditionalOptions) &&
                    condition.conditionalOptions.length > 0
                      ? t(
                          'views.surveyBuilder.economic.conditionals.displayOptions'
                        )
                      : t(
                          'views.surveyBuilder.economic.conditionals.chooseOptions'
                        )}
                  </Button>
                )}
                {condition.variant === 'family' && (
                  <Typography variant="subtitle2">
                    {t(
                      'views.surveyBuilder.economic.conditionals.ageCondition'
                    )}
                  </Typography>
                )}
              </Grid>
              <Grid item md={1} container justify="center" alignItems="center">
                <Tooltip
                  title={t('general.delete')}
                  className={classes.deleteIcon}
                >
                  <IconButton
                    color="default"
                    component="span"
                    onClick={() => onDeleteCondition(condition)}
                  >
                    <NotInterestedIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        );
      })}

      <div className={classes.addContainer} onClick={() => addCondition()}>
        <AddIcon className={classes.addIcon} />
        <Typography variant="subtitle2" className={classes.addLabel}>
          {t('views.surveyBuilder.economic.conditionals.addCondition')}
        </Typography>
      </div>
    </div>
  );
};

export default Conditionals;

const multiValueStyle = makeStyles(theme => ({
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

const MultiValue = props => {
  const classes = multiValueStyle();
  const { t } = useTranslation();
  return (
    <Chip
      tabIndex={-1}
      className={classes.chip}
      label={
        <Tooltip
          title={props.data.label}
          placement="top"
          classes={{
            tooltip: classes.tooltip
          }}
        >
          <Typography variant="subtitle2" className={classes.container}>
            {t('views.surveyBuilder.economic.conditionals.showQuestion')}{' '}
            <div className={classes.number}> {props.data.order}</div>
          </Typography>
        </Tooltip>
      }
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
};

const operatorsSelectStyle = {
  ...autoCompleteStyle,
  control: (styles, { hasValue }) => ({
    ...styles,
    backgroundColor: hasValue ? '#E5E5E5' : theme.palette.background.default,
    border: `.5px solid ${theme.palette.grey.quarter}`,
    '&:hover': {
      borderColor: 'none'
    },
    boxShadow: 'none',
    overflowY: 'auto',
    maxHeight: 75,
    paddingRight: 11,
    width: '100%'
  })
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
