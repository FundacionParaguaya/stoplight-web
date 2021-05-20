import { FormControl, FormHelperText } from '@material-ui/core';
import { connect } from 'formik';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import { getErrorLabelForPath, pathHasError } from '../utils/form-utils';
import { selectStyle } from '../utils/styles-utils';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme';

const customSelect = {
  ...selectStyle,
  control: (styles, { isFocused, hasValue }) => ({
    ...styles,
    backgroundColor: hasValue
      ? theme.palette.background.default
      : theme.palette.background.paper,
    borderRadius: '8px 8px 0 0!important',
    '&:hover': {
      borderColor: isFocused ? theme.palette.primary.main : 'hsl(0, 0%, 70%)'
    },
    border: isFocused
      ? `1.5px solid ${theme.palette.primary.main}`
      : `1.5px solid ${theme.palette.grey.quarter}`,
    boxShadow: isFocused ? `0 0 0 1px ${theme.palette.primary.main}` : 'none',
    overflowY: 'auto',
    maxHeight: 75,
    height: 69
  }),
  placeholder: styles => ({
    ...styles,
    fontSize: 16,
    color: theme.palette.grey.middle
  })
};

const SelectWithFormik = ({
  label,
  rawOptions,
  valueKey,
  labelKey,
  formik,
  name,
  tReady,
  required,
  inputRef,
  classes,
  ...props
}) => {
  const { t } = useTranslation();
  const values = get(formik.values, name) || [];
  const error = pathHasError(name, formik.touched, formik.errors);
  const helperText = getErrorLabelForPath(
    name,
    formik.touched,
    formik.errors,
    t
  );

  let effectiveOptions = [];
  const onChange = v => formik.setFieldValue(name, v ? v : []);

  const onBlur = () => formik.setFieldTouched(name);

  // If parent specifies the following props, we can infer what are the actual
  // options and the value from the raw options array, and the keys for
  // label and value
  if (rawOptions && valueKey && labelKey) {
    effectiveOptions = (rawOptions || []).map(o => ({
      label: o[labelKey],
      value: o[valueKey]
    }));
  }

  return (
    <FormControl
      style={{
        width: '100%',
        margin: '10px 0'
      }}
    >
      <Select
        value={values}
        onBlur={onBlur}
        onChange={onChange}
        loadingMessage={() => t('views.indicatorFilter.loading')}
        noOptionsMessage={() => t('general.noOptionsToShow')}
        placeholder={`${label}${required ? ' *' : ''}`}
        options={effectiveOptions}
        hideSelectedOptions
        {...props}
        styles={customSelect}
        components={{
          DropdownIndicator: () => <div />,
          IndicatorSeparator: () => <div />,
          ClearIndicator: () => <div />
        }}
      />
      {error && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

SelectWithFormik.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rawOptions: PropTypes.array.isRequired
};

export default connect(SelectWithFormik);
