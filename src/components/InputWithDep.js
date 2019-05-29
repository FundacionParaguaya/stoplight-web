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
  console.log(draft.familyData.familyMembersList[innerIndex][field]);
  return draft.familyData.familyMembersList[innerIndex][field];
};

// Dep for dependency :)
const InputWithDep = ({ dep, fieldOptions, from, children, index }) => {
  const otherOption = getOtherOption(fieldOptions);
  const value = getFieldValue(from, dep, index);

  return children(otherOption, value);
};

export default InputWithDep;
