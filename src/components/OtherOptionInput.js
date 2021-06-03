import PropTypes from 'prop-types';
import { connect } from 'formik';
import { get } from 'lodash';

const getOtherOption = options => {
  if (!options.some(e => e.otherOption)) {
    return null;
  }

  return options.filter(e => e.otherOption)[0].value;
};

const OtherOptionInput = ({
  dep,
  fieldOptions,
  children,
  target,
  cleanUp,
  formik,
  isMultiValue
}) => {
  const otherOption = getOtherOption(fieldOptions);

  if (!isMultiValue) {
    const value = formik.values[dep];

    if (otherOption !== value && !!get(formik.values, target)) {
      cleanUp(value);
    }

    if (otherOption && value) {
      return children(otherOption, value);
    }

    return null;
  } else {
    const values = formik.values[dep] || [];

    if (
      Array.isArray(values) &&
      !values.find(v => v === otherOption) &&
      !!get(formik.values, target)
    ) {
      cleanUp();
    } else {
      if (
        Array.isArray(values) &&
        otherOption &&
        !!values.find(v => v === otherOption)
      ) {
        return children(
          otherOption,
          values.find(v => v === otherOption)
        );
      }
    }

    return null;
  }
};

OtherOptionInput.propTypes = {
  dep: PropTypes.string.isRequired,
  fieldOptions: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired
};

export default connect(OtherOptionInput);
