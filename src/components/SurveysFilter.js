import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import * as _ from 'lodash';
import { getSurveysByUser } from '../api';

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
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  label: { marginRight: 10, fontSize: 14 },
  selector: { width: '100%' }
}));

const SurveysFilter = ({ user, data, onChange }) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const { t } = useTranslation();
  useEffect(() => {
    console.log(' Calling loading surveys');
    getSurveysByUser(user)
      .then(response => {
        console.log(response);
        const surveysFromAPI = _.get(response, 'data', []).map(survey => ({
          label: survey.title,
          value: survey.id
        }));
        setSurveys(surveysFromAPI);
      })
      .finally(() => setLoading(false));
  }, [user]);
  return (
    <div className={classes.container}>
      <Typography variant="subtitle1" className={classes.label}>
        {t('views.surveysFilter.label')}
      </Typography>
      <div className={classes.selector}>
        <Select
          value={data}
          onChange={value => onChange(value)}
          placeholder=""
          isLoading={loading}
          loadingMessage={() => t('views.surveysFilter.loading')}
          noOptionsMessage={() => t('views.surveysFilter.noOption')}
          options={surveys}
          components={{
            DropdownIndicator: () => <div />,
            IndicatorSeparator: () => <div />
          }}
          styles={selectStyle}
          isClearable
          isMulti
          hideSelectedOptions
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(SurveysFilter);