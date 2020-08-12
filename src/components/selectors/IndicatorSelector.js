import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { getIndicatorsByUser } from '../../api';
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

const IndicatorSelector = ({
  withTitle,
  user,
  indicatorsData,
  onChangeIndicator,
  onBlur,
  required,
  error
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [indicatorOptions, setIndicatorOptions] = useState([]);
  const label = `${t('views.indicatorFilter.label')} ${required ? ' *' : ''}`;

  useEffect(() => {
    setLoading(true);

    getIndicatorsByUser(user, language)
      .then(response => {
        const indicators = _.get(response, 'data.data.getIndicators', []).map(
          indicator => ({
            codeName: indicator.codeName,
            label: indicator.name,
            value: indicator.surveyIndicatorId
          })
        );
        setIndicatorOptions(indicators);
      })
      .finally(() => setLoading(false));
  }, [language]);

  return (
    <div className={classes.container}>
      {withTitle && (
        <Typography variant="subtitle1" className={classes.label}>
          {label}
        </Typography>
      )}

      <div className={classes.selector}>
        <Select
          value={indicatorsData}
          onChange={value => onChangeIndicator(value)}
          onBlur={onBlur}
          placeholder={withTitle ? '' : label}
          isLoading={loading}
          loadingMessage={() => t('views.indicatorFilter.loading')}
          noOptionsMessage={() => t('views.indicatorFilter.noOption')}
          options={indicatorOptions}
          components={{
            DropdownDimension: () => <div />,
            DimensionSeparator: () => <div />,
            ClearDimension: () => <div />
          }}
          styles={selectStyle}
          closeMenuOnSelect={true}
          isClearable={false}
          hideSelectedOptions
          isMulti
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

export default connect(mapStateToProps)(IndicatorSelector);
