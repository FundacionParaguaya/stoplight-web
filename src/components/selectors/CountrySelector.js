import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import countries from 'localized-countries';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { selectStyle } from '../../utils/styles-utils';
import { getLanguageByCode } from '../../utils/lang-utils';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      marginTop: 0,
      marginBottom: 10
    }
  },
  label: {
    marginBottom: 5,
    fontSize: 14
  },
  selector: {
    width: '100%'
  }
}));

const CountrySelector = ({
  withTitle,
  countryData,
  onChangeCountry,
  onBlur,
  required,
  parentLang,
  error
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();
  const label = `${t('views.solutions.form.country')} ${required ? ' *' : ''}`;

  const [loading, setLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    setLoading(true);
    const lang = !!parentLang ? parentLang : language;
    const languag = getLanguageByCode(lang);
    let countriesOptions = countries(
      require(`localized-countries/data/${languag}`)
    ).array();
    setCountryOptions(
      countriesOptions.map(country => ({
        label: country.label,
        value: country.code
      }))
    );
    setLoading(false);
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
          value={countryData}
          onChange={value => onChangeCountry(value)}
          onBlur={onBlur}
          placeholder={withTitle ? '' : label}
          isLoading={loading}
          loadingMessage={() => t('views.dimensionFilter.loading')}
          noOptionsMessage={() => t('views.dimensionFilter.noOption')}
          options={countryOptions}
          components={{
            DropdownDimension: () => <div />,
            DimensionSeparator: () => <div />,
            ClearDimension: () => <div />
          }}
          styles={selectStyle}
          closeMenuOnSelect={true}
          isClearable={true}
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

export default CountrySelector;
