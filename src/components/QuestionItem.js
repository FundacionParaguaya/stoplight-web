import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DropDown from '@material-ui/icons/ArrowDropDownCircle';
import Number from '@material-ui/icons/Filter1TwoTone';
import Checkbox from '@material-ui/icons/LibraryAddCheckTwoTone';
import Radio from '@material-ui/icons/RadioButtonChecked';
import Text from '@material-ui/icons/ShortText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../theme';

const useStyles = makeStyles(theme => ({
  questionContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    minHeight: 50
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

  const iconForType = type => {
    if (type === 'select') {
      return <DropDown className={classes.icon} />;
    }
    if (type === 'number') {
      return <Number className={classes.icon} />;
    }
    if (type === 'radio') {
      return <Radio className={classes.icon} />;
    }
    if (type === 'text') {
      return <Text className={classes.icon} />;
    }
    if (type === 'checkbox') {
      return <Checkbox className={classes.icon} />;
    }
    return <DropDown className={classes.icon} />;
  };

  const labelForType = type => t(`answerType.${type}`);

  return (
    <div
      ref={itemRef}
      {...draggableProps}
      className={classes.questionContainer}
    >
      <div className={classes.mainContainer}>
        {iconForType(answerType)}

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
