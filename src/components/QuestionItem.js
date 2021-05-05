import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../theme';
import QuestionIcon from './QuestionIcon';

const useStyles = makeStyles(theme => ({
  questionContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    minHeight: 57,
    borderRadius: 4
  },
  mainContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: 30,
    color: COLORS.MEDIUM_GREY,
    margin: '0px 10px 0px 2px'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
}));

export const QuestionItem = ({
  itemRef,
  draggableProps,
  question,
  answerType
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const labelForType = type => t(`answerType.${type}`);

  return (
    <div
      ref={itemRef}
      {...draggableProps}
      className={classes.questionContainer}
    >
      <div className={classes.mainContainer}>
        <QuestionIcon type={answerType} iconClass={classes.icon} />

        <div className={classes.textContainer}>
          <Typography variant="h6">{question}</Typography>
          <Typography variant="subtitle2" style={{ color: COLORS.MEDIUM_GREY }}>
            {labelForType(answerType)}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
