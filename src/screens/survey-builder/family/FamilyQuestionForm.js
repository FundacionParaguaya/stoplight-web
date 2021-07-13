import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import NotInterestedIcon from '@material-ui/icons/HighlightOff';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import CheckboxInput from '../../../components/CheckboxInput';
import TextInput from '../../../components/TextInput';
import { COLORS, theme } from '../../../theme';
import { autoCompleteStyle } from '../../../utils/styles-utils';

const useStyles = makeStyles(theme => ({
  questionContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.grey,
    margin: theme.spacing(3),
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    minHeight: 57,
    borderRadius: 4
  },
  label: {
    marginBottom: theme.spacing(1)
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between'
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
  },
  addOptionContainer: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  icon: {
    width: 30,
    color: COLORS.MEDIUM_GREY
  },
  greyDot: {
    textDecoration: 'none',
    height: '9px',
    width: '10px',
    backgroundColor: theme.palette.grey.middle,
    borderRadius: '50%',
    display: 'inline-block',
    marginLeft: 10
  }
}));

export const EditQuestion = ({
  itemRef,
  draggableProps,
  question,
  updateQuestion,
  afterSubmit = () => {}
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const addOption = () => {
    let q = {
      ...question,
      options: Array.isArray(question.options) ? question.options : []
    };
    q.options.push({ value: '', text: '' });
    updateQuestion(q);
  };

  const updateOption = (optionIndex, option) => {
    let q = question;
    q.options[optionIndex] = { ...option, value: option.value.toUpperCase() };
    updateQuestion(q);
  };

  const deleteOption = optionIndex => {
    let q = question;
    q.options.splice(optionIndex, 1);
    updateQuestion(q);
  };

  const addOtherOption = () => {
    let q = question;
    q.otherOption = !q.otherOption;
    updateQuestion(q);
  };

  const primaryGenders = [
    { value: 'M', label: t('views.familiesOverviewBlock.men') },
    { value: 'F', label: t('views.familiesOverviewBlock.women') },
    { value: 'O', label: t('views.familiesOverviewBlock.other') }
  ];

  const {
    codeName,
    questionText,
    options,
    answerType,
    otherOption = false
  } = question;

  const isGender = codeName === 'gender';

  const hasOptions =
    answerType === 'select' ||
    answerType === 'radio' ||
    answerType === 'checkbox';
  return (
    <div
      ref={itemRef}
      {...draggableProps}
      className={classes.questionContainer}
    >
      <Grid container>
        <Grid container spacing={4} className={classes.label}>
          <Grid item md={5} sm={5} xs={10} container alignItems="center">
            <Typography variant="h6">{questionText}</Typography>
          </Grid>
          <Grid item md={5} sm={5} xs={10}>
            {hasOptions && (
              <CheckboxInput
                label={t('views.intervention.definition.otherOption')}
                onChange={() => addOtherOption()}
                checked={otherOption}
              />
            )}
          </Grid>
          <Grid item md={12} sm={12} xs={12} className={classes.label}>
            {hasOptions && (
              <React.Fragment>
                <Typography variant="subtitle2" className={classes.label}>
                  {t('views.surveyBuilder.options')}
                </Typography>
                <Grid container>
                  {Array.isArray(options) &&
                    options.map((option, optionIndex) => {
                      const selectedPrimaryGender =
                        isGender &&
                        primaryGenders.find(g => g.value === option.value);
                      return (
                        <Grid
                          item
                          md={12}
                          key={optionIndex}
                          container
                          spacing={2}
                          alignItems="center"
                        >
                          <span className={classes.greyDot}></span>
                          <Grid
                            item
                            md={5}
                            container
                            justify="center"
                            alignItems="center"
                          >
                            <TextInput
                              label={''}
                              value={option.text}
                              onChange={e => {
                                let newOption = {
                                  ...option,
                                  text: e.target.value,
                                  value: e.target.value
                                };
                                updateOption(optionIndex, newOption);
                              }}
                            />
                          </Grid>
                          {isGender && (
                            <Grid item md={4}>
                              <Select
                                value={selectedPrimaryGender}
                                onChange={selection =>
                                  updateOption(optionIndex, {
                                    ...option,
                                    value: selection
                                      ? selection.value
                                      : option.text
                                  })
                                }
                                placeholder={t(
                                  'views.surveyBuilder.familyDetails.showAs'
                                )}
                                options={primaryGenders}
                                hideSelectedOptions
                                styles={selectStyle}
                                closeMenuOnSelect
                                isClearable
                              />
                            </Grid>
                          )}
                          <Grid item md={1}>
                            <Tooltip
                              title={t('general.delete')}
                              className={classes.deleteIcon}
                            >
                              <IconButton
                                color="default"
                                component="span"
                                onClick={() => deleteOption(optionIndex)}
                              >
                                <NotInterestedIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      );
                    })}

                  {Array.isArray(options) &&
                    options.length === 0 &&
                    !otherOption && (
                      <FormHelperText
                        error={true}
                        style={{ textAlign: 'center' }}
                      >
                        {t('views.surveyBuilder.missingOptions')}
                      </FormHelperText>
                    )}
                </Grid>

                <div className={classes.addOptionContainer} onClick={addOption}>
                  <AddIcon style={{ fontSize: 16 }} />
                  <Typography variant="subtitle2">
                    {t('views.surveyBuilder.addOption')}
                  </Typography>
                </div>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </Grid>
      <div>
        <Button
          color="primary"
          variant="contained"
          onClick={() => afterSubmit()}
        >
          {t('general.done')}
        </Button>
      </div>
    </div>
  );
};

export default EditQuestion;

const selectStyle = {
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
    maxHeight: 50,
    height: 39,
    width: '100%'
  }),
  placeholder: styles => ({
    ...styles,
    fontSize: 14
  })
};
