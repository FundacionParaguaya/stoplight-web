import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/Edit';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RadioInput from '../../components/RadioInput';
import { COLORS } from '../../theme';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    margin: '2rem',
    padding: '1rem',
    backgroundColor: theme.palette.background.default,
    '&:hover': {
      backgroundColor: theme.palette.background.grey
    }
  },
  economicContainer: {
    margin: '1rem'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  icon: {
    width: 20,
    marginRight: theme.spacing(1)
  },
  radio: {
    '& $span': {
      color: `${theme.palette.grey.middle} !important`
    }
  },
  button: {
    width: 'fit-content',
    padding: '0 16px',
    backgroundColor: COLORS.MEDIUM_GREY,
    marginRight: 2,
    marginLeft: 2,
    marginBottom: 6
  }
}));

const Question = ({
  itemRef,
  draggableProps,
  order,
  question,
  setSelectedQuestion = () => {},
  setSurveyQuestion = () => {},
  isEconomic,
  handleDelete,
  goToConditional
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [hovering, setHovering] = useState(false);

  return (
    <div
      ref={itemRef}
      {...draggableProps}
      className={clsx(
        classes.mainContainer,
        isEconomic && classes.economicContainer
      )}
      onMouseEnter={() => {
        setSurveyQuestion();
        setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
    >
      <div className={classes.container}>
        <Typography variant="h6" style={{ margin: '0 1rem 1rem 0' }}>
          {`${order}. ${question.questionText} ${question.required ? '*' : ''}`}
        </Typography>
        <div style={{ minWidth: isEconomic ? 300 : 100 }}>
          {hovering && (
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={() => setSelectedQuestion(question.codeName)}
            >
              <Edit className={classes.icon} /> {t('general.edit')}
            </Button>
          )}
          {hovering && isEconomic && (
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={goToConditional}
            >
              {t('views.surveyBuilder.economic.conditionalLogic')}
            </Button>
          )}
          {hovering && isEconomic && (
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={() => handleDelete(question.codeName)}
            >
              {t('general.delete')}
            </Button>
          )}
        </div>
      </div>
      {Array.isArray(question.options) &&
        question.options.map((option, index) => (
          <RadioInput
            key={index}
            disabled
            label={option.text}
            value={option.value}
            currentValue={''}
            classes={{
              root: classes.radio
            }}
          />
        ))}
      {question.otherOption && (
        <RadioInput
          key={'OTHER'}
          disabled
          label={t('general.other')}
          value={'OTHER'}
          currentValue={''}
          classes={{
            root: classes.radio
          }}
        />
      )}
    </div>
  );
};

export default Question;
