import PropTypes from 'prop-types';
import { connect } from 'formik';
import * as _ from 'lodash';

const getOtherOption = options => {
  if (!options.some(e => e.otherOption)) {
    return null;
  }

  return options.filter(e => e.otherOption)[0].value;
};

const getFieldValue = (draft, field, index, isEconomic) => {
  if (isEconomic) {
    if (
      !draft ||
      !draft.economicSurveyDataList ||
      !draft.economicSurveyDataList.find(e => e.key === field)
    ) {
      return null;
    }

    return draft.economicSurveyDataList.find(e => e.key === field).value;
  }

  const innerIndex = index || 0;
  if (
    !draft ||
    !draft.familyData ||
    !draft.familyData.familyMembersList[innerIndex][field]
  ) {
    return null;
  }

  return draft.familyData.familyMembersList[innerIndex][field];
};

// Dep for dependency :)
const InputWithDep = ({
  dep,
  fieldOptions,
  from,
  children,
  index,
  target,
  cleanUp,
  formik,
  isEconomic
}) => {
  const otherOption = getOtherOption(fieldOptions);
  const value = getFieldValue(from, dep, index, isEconomic);
  if (otherOption !== value && !!_.get(formik.values, target)) {
    cleanUp();
  }

  if (otherOption && value) {
    return children(otherOption, value);
  }

  return null;
};

InputWithDep.propTypes = {
  dep: PropTypes.string.isRequired,
  fieldOptions: PropTypes.array.isRequired,
  from: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
  index: PropTypes.number
};

export default connect(InputWithDep);
