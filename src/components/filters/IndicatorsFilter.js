import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { getIndicatorsBySurveyId } from '../../api';
import Select from 'react-select';
import * as _ from 'lodash';

const selectStyle = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: '#FFFFFF;',
    borderRadius: 2,
    '&:hover': { borderColor: isFocused ? '#309E43' : 'hsl(0, 0%, 70%)' },
    border: isFocused ? '1.5px solid #309E43' : '1.5px solid #DCDEE3',
    boxShadow: isFocused ? '0 0 0 1px #309E43' : 'none'
  }),
  multiValueLabel: styles => ({
    ...styles,
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: 500,
    color: 'rgba(28,33,47,0.51)'
  }),
  multiValue: styles => ({ ...styles, color: 'rgba(28,33,47,0.51)' }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? 'hsl(0,0%,90%)' : 'transparent',
    fontSize: 14,
    fontFamily: 'Poppins'
  }),
  noOptionsMessage: styles => ({
    ...styles,
    fontSize: 16,
    fontFamily: 'Poppins'
  }),
  loadingMessage: styles => ({
    ...styles,
    fontSize: 16,
    fontFamily: 'Poppins'
  })
};

const useStyles = makeStyles(() => ({
  container: {
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

const IndicatorsFilter = ({
  user,
  survey,
  indicator,
  onChangeIndicator,
  isMulti
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [indicatorOptions, setIndicatorOptions] = useState([]);

  useEffect(() => {
    if (!!survey && !!survey.value) {
      setLoading(true);
      getIndicatorsBySurveyId(user, survey.value)
        .then(response => {
          const indicators = _.get(
            response,
            'data.data.surveyById.surveyStoplightQuestions',
            []
          ).map(indicator => ({
            label: indicator.shortName,
            value: indicator.codeName
          }));
          setIndicatorOptions(indicators);
        })
        .finally(() => setLoading(false));
    } else {
      setIndicatorOptions([]);
    }
  }, [survey]);

  return (
    <div className={classes.container}>
      <Typography variant="subtitle1" className={classes.label}>
        {t('views.indicatorFilter.label')}
      </Typography>

      <div className={classes.selector}>
        <Select
          value={indicator}
          onChange={value => onChangeIndicator(value)}
          placeholder=""
          isLoading={loading}
          loadingMessage={() => t('views.indicatorFilter.loading')}
          noOptionsMessage={() => t('views.indicatorFilter.noMatchFilters')}
          options={indicatorOptions}
          components={{
            DropdownIndicator: () => <div />,
            IndicatorSeparator: () => <div />,
            ClearIndicator: () => <div />
          }}
          closeMenuOnSelect={false}
          styles={selectStyle}
          isMulti={isMulti}
          closeMenuOnSelect={true}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(IndicatorsFilter);
