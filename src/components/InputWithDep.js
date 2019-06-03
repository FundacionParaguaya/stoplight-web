import PropTypes from 'prop-types';

const getOtherOption = options => {
  if (!options.some(e => e.otherOption)) {
    return null;
  }

  return options.filter(e => e.otherOption)[0].value;
};

const getFieldValue = (draft, field, index) => {
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
const InputWithDep = ({ dep, fieldOptions, from, children, index }) => {
  const otherOption = getOtherOption(fieldOptions);
  const value = getFieldValue(from, dep, index);

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

export default InputWithDep;
