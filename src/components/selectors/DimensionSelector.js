import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { getDimensionsByUser } from '../../api';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from 'react-select';
import * as _ from 'lodash';
import { selectStyle } from '../../utils/styles-utils';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start'
  },
  label: {
    marginBottom: 5,
    fontSize: 14
  },
  selector: {
    width: '100%'
  }
}));

const DimensionSelector = ({
  withTitle,
  user,
  dimensionData,
  onChangeDimension,
  onBlur,
  required,
  isClearable,
  parentLang,
  error
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [dimensionOptions, setDimensionOptions] = useState([]);
  const label = `${t('views.dimensionFilter.label')} ${required ? ' *' : ''}`;

  useEffect(() => {
    setLoading(true);
    let lang = !!parentLang ? parentLang : language;
    getDimensionsByUser(user, lang)
      .then(response => {
        const dimensions = _.get(response, 'data.data.getDimensions', []).map(
          dimension => ({
            label: dimension.name,
            value: dimension.surveyDimensionId
          })
        );
        setDimensionOptions(dimensions);
      })
      .finally(() => setLoading(false));
  }, [language, parentLang]);

  return (
    <div className={classes.container}>
      {withTitle && (
        <Typography variant="subtitle1" className={classes.label}>
          {label}
        </Typography>
      )}

      <div className={classes.selector}>
        <Select
          value={dimensionData}
          onChange={value => onChangeDimension(value)}
          onBlur={onBlur}
          placeholder={withTitle ? '' : label}
          isLoading={loading}
          loadingMessage={() => t('views.dimensionFilter.loading')}
          noOptionsMessage={() => t('views.dimensionFilter.noOption')}
          options={dimensionOptions}
          components={{
            DropdownDimension: () => <div />,
            DimensionSeparator: () => <div />,
            ClearDimension: () => <div />
          }}
          styles={selectStyle}
          closeMenuOnSelect={true}
          isClearable={isClearable}
          hideSelectedOptions
        />
      </div>
      {error && (
        <FormHelperText error={error}>
          {t('validation.fieldIsRequired')}
        </FormHelperText>
      )}
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(DimensionSelector);
