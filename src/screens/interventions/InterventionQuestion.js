import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  questionContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    minHeight: 50
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  deleteIcon: {
    height: 'min-content',
    color: 'red',
    opacity: '50%',
    marginLeft: 4,
    '&:hover': {
      opacity: '100%'
    }
  },
  addOptionContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  }
}));

export const InterventionQuestion = ({
  itemRef,
  draggableProps,
  question,
  options,
  answerType,
  addOption,
  deleteOption
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div
      ref={itemRef}
      {...draggableProps}
      className={classes.questionContainer}
    >
      <Typography variant="h6">{question}</Typography>

      {(answerType === 'select' ||
        answerType === 'radio' ||
        answerType === 'checkbox') && (
        <React.Fragment>
          <Typography variant="h6">
            {t('views.intervention.definition.options')}
          </Typography>

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
                onChange={e => {}}
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

          <div className={classes.addOptionContainer} onClick={addOption}>
            <AddIcon />
            <Typography variant="h6">
              {t('views.intervention.definition.addOption')}
            </Typography>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default InterventionQuestion;
