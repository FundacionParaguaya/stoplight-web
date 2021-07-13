import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import NotInterestedIcon from '@material-ui/icons/HighlightOff';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CheckboxInput from '../../../components/CheckboxInput';
import TextInput from '../../../components/TextInput';
import { COLORS } from '../../../theme';

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
  optionContainer: {
    marginLeft: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
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
  checkboxContainer: {
    alignItems: 'center',
    display: 'initial'
  },
  greyDot: {
    textDecoration: 'none',
    height: '9px',
    width: '10px',
    backgroundColor: theme.palette.grey.middle,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: theme.spacing(1)
  }
}));

export const EconomicQuestionForm = ({
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

  const {
    questionText,
    shortName,
    options,
    answerType,
    otherOption = false,
    forFamilyMember = false,
    required = false
  } = question;

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
          <Grid item md={5} sm={5} xs={10}>
            <TextInput
              label={t('views.surveyBuilder.question')}
              value={questionText}
              onChange={e => {
                updateQuestion({ ...question, questionText: e.target.value });
              }}
            />
          </Grid>

          <Grid item md={5} sm={5} xs={10}>
            <TextInput
              label={t('views.surveyBuilder.shortName')}
              value={shortName}
              onChange={e => {
                updateQuestion({ ...question, shortName: e.target.value });
              }}
            />
          </Grid>

          <Grid item md={5} sm={5} xs={10} className={classes.label}>
            {hasOptions && (
              <React.Fragment>
                <Typography variant="subtitle2" className={classes.label}>
                  {t('views.surveyBuilder.options')}
                </Typography>

                {Array.isArray(options) &&
                  options.map((option, optionIndex) => (
                    <div key={optionIndex} className={classes.optionContainer}>
                      <span className={classes.greyDot}></span>
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
                    </div>
                  ))}

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

                <div className={classes.addOptionContainer} onClick={addOption}>
                  <AddIcon style={{ fontSize: 16 }} />
                  <Typography variant="subtitle2">
                    {t('views.surveyBuilder.addOption')}
                  </Typography>
                </div>
              </React.Fragment>
            )}
          </Grid>
          <Grid
            item
            md={5}
            sm={5}
            xs={10}
            className={classes.checkboxContainer}
          >
            {hasOptions && (
              <CheckboxInput
                label={t('views.intervention.definition.otherOption')}
                onChange={() => addOtherOption()}
                checked={otherOption}
              />
            )}
            <CheckboxInput
              label={t('views.surveyBuilder.economic.forFamilyMembers')}
              onChange={() => {
                updateQuestion({
                  ...question,
                  forFamilyMember: !question.forFamilyMember
                });
              }}
              checked={forFamilyMember}
            />

            <CheckboxInput
              label={t('views.intervention.definition.required')}
              onChange={() => {
                updateQuestion({ ...question, required: !question.required });
              }}
              checked={required}
            />
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

export default EconomicQuestionForm;
