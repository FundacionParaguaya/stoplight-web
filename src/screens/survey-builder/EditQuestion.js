import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import NotInterestedIcon from '@material-ui/icons/HighlightOff';
import React from 'react';
import { useTranslation } from 'react-i18next';
import GreenCheckbox from '../../components/GreenCheckbox';
import QuestionIcon from '../../components/QuestionIcon';
import { COLORS } from '../../theme';

const useStyles = makeStyles(theme => ({
  questionContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    minHeight: 57,
    borderRadius: 4
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  filterInput: {
    height: 15,
    paddingTop: '12.0px!important',
    paddingBottom: '12.0px!important',
    paddingRight: '14px!important',
    paddingLeft: '14px!important',
    fontFamily: 'Poppins',
    fontSize: '12px'
  },
  textField: {
    marginTop: 4,
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderRadius: '2px',
        border: `1.5px solid ${theme.palette.primary.main}`
      }
    }
  },
  optionContainer: {
    margin: theme.spacing(1),
    marginTop: 0,
    marginRight: 0,
    display: 'flex',
    alignItems: 'center',
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
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  addOptionContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  icon: {
    width: 30,
    color: COLORS.MEDIUM_GREY
  }
}));

export const EditQuestion = ({
  itemRef,
  draggableProps,
  question,
  updateQuestion
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const addOption = () => {
    let q = question;
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

  const setQuestionRequired = () => {
    let q = question;
    q.required = !q.required;
    updateQuestion(q);
  };

  const {
    shortName,
    options,
    answerType,
    otherOption = false,
    required = false
  } = question;
  return (
    <div
      ref={itemRef}
      {...draggableProps}
      className={classes.questionContainer}
    >
      <div className={classes.title}>
        <Typography variant="h6" style={{ marginBottom: '1rem' }}>
          {shortName}
        </Typography>

        <QuestionIcon type={answerType} iconClass={classes.icon} />
      </div>

      <div className={classes.checkboxContainer}>
        <GreenCheckbox
          onChange={e => setQuestionRequired()}
          checked={required}
        />
        <Typography variant="subtitle2">
          {t('views.intervention.definition.required')}
        </Typography>
      </div>

      {(answerType === 'select' ||
        answerType === 'radio' ||
        answerType === 'checkbox') && (
        <React.Fragment>
          <Typography variant="subtitle2">
            {t('views.intervention.definition.options')}
          </Typography>

          <div className={classes.checkboxContainer}>
            <GreenCheckbox
              onChange={e => addOtherOption()}
              checked={otherOption}
            />
            <Typography variant="subtitle2">
              {t('views.intervention.definition.otherOption')}
            </Typography>
          </div>

          {options.map((option, optionIndex) => (
            <div key={optionIndex} className={classes.optionContainer}>
              <TextField
                InputProps={{
                  classes: {
                    input: classes.filterInput
                  }
                }}
                variant="outlined"
                margin="dense"
                value={option.text}
                onChange={e => {
                  let newOption = {
                    ...option,
                    text: e.target.value,
                    value: e.target.value
                  };
                  updateOption(optionIndex, newOption);
                }}
                fullWidth
                className={classes.textField}
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

          {Array.isArray(options) && options.length === 0 && !otherOption && (
            <FormHelperText error={true} style={{ textAlign: 'center' }}>
              {t('views.intervention.definition.missingOptions')}
            </FormHelperText>
          )}

          <div className={classes.addOptionContainer} onClick={addOption}>
            <AddIcon style={{ fontSize: 16 }} />
            <Typography variant="subtitle2">
              {t('views.intervention.definition.addOption')}
            </Typography>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default EditQuestion;
