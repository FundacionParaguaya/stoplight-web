import PropTypes from 'prop-types';
import { connect } from 'formik';
import { get } from 'lodash';

const getOtherOption = options => {
  if (!options.some(e => e.otherOption)) {
    return null;
  }

  return options.filter(e => e.otherOption)[0].value;
};

const getFieldValue = (draft, field, index, isEconomic, isMultiValue) => {
  if (isEconomic) {
    if (
      index >= 0 &&
      draft &&
      index >= 0 && draft.familyData &&
      index >= 0 &&
        draft.familyData.familyMembersList[index].socioEconomicAnswers.find(
          e => e.key === field
        )
    ) {
      let question = draft.familyData.familyMembersList[
        index
      ].socioEconomicAnswers.find(e => e.key === field);

      return !isMultiValue ? question.value : question.multipleValue;
    }

    if (
      !draft ||
      !draft.economicSurveyDataList ||
      !draft.economicSurveyDataList.find(e => e.key === field)
    ) {
      return null;
    }

    let question = draft.economicSurveyDataList.find(e => e.key === field);

    return !isMultiValue ? question.value : question.multipleValue;
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
  isEconomic,
  isMultiValue
}) => {
  const otherOption = getOtherOption(fieldOptions);

  if (!isMultiValue) {
    const value = getFieldValue(from, dep, index, isEconomic, isMultiValue);

    if (
      (otherOption !== value && !!get(formik.values, target)) ||
      (otherOption !== value && !!get(formik.values, `forFamily.${target}`)) ||
      (otherOption !== value &&
        !!get(formik.values, `forFamilyMember.${target}`))
    ) {
      cleanUp(value);
    }

    if (otherOption && value) {
      return children(otherOption, value);
    }
  } else {
    const values =
      getFieldValue(from, dep, index, isEconomic, isMultiValue) || [];

    if (
      (!values.find(v => v === otherOption) && !!get(formik.values, target)) ||
      (!values.find(v => v === otherOption) &&
        !!get(formik.values, `forFamily.${target}`)) ||
      (!values.find(v => v === otherOption) &&
        !!get(formik.values, `forFamilyMember.${target}`))
    ) {
      cleanUp();
    } else {
      if (otherOption && !!values.find(v => v === otherOption)) {
        return children(
          otherOption,
          values.find(v => v === otherOption)
        );
      }
    }
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
