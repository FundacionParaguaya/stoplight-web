import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import RadioInput from '../../components/RadioInput';
import Button from '@material-ui/core/Button';
import Edit from '@material-ui/icons/Edit';
import { useTranslation } from 'react-i18next';
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
  }
}));

const Question = ({ order, question, setSelectedQuestion }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [hovering, setHovering] = useState(false);

  return (
    <div
      className={classes.mainContainer}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className={classes.container}>
        <Typography variant="h6" style={{ marginBottom: '1rem' }}>
          {`${order}. ${question.questionText} ${question.required ? '*' : ''}`}
        </Typography>
        {hovering && (
          <Button
            color="primary"
            variant="contained"
            style={{ backgroundColor: COLORS.MEDIUM_GREY }}
            onClick={() => setSelectedQuestion(question.codeName)}
          >
            <Edit className={classes.icon} /> {t('general.edit')}
          </Button>
        )}
      </div>
      {question.options.map((option, index) => (
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
