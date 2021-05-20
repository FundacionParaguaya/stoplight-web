import DropDown from '@material-ui/icons/ArrowDropDownCircle';
import Checkbox from '@material-ui/icons/CheckBox';
import Date from '@material-ui/icons/Event';
import Number from '@material-ui/icons/LooksOne';
import Radio from '@material-ui/icons/RadioButtonChecked';
import Text from '@material-ui/icons/ShortText';
import React from 'react';

const QuestionIcon = ({ type, iconClass }) => {
  if (type === 'select') {
    return <DropDown className={iconClass} />;
  } else if (type === 'number') {
    return <Number className={iconClass} />;
  } else if (type === 'radio') {
    return <Radio className={iconClass} />;
  } else if (type === 'text') {
    return <Text className={iconClass} />;
  } else if (type === 'checkbox' || type === 'boolean') {
    return <Checkbox className={iconClass} />;
  } else if (type === 'date') {
    return <Date className={iconClass} />;
  } else {
    return <DropDown className={iconClass} />;
  }
};

export default QuestionIcon;
