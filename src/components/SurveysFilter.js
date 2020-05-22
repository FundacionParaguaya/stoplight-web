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

const SurveysFilter = ({ user, data, onChange, hub, organizations }) => {
  const [surveys, setSurveys] = useState([]);
  const [allSurveys, setAllSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const { t } = useTranslation();

  const loadSurveysByUser = () => {
    getSurveysByUser(user)
      .then(response => {
        console.log(response);
        const surveysFromAPI = _.get(response, 'data', []).map(survey => ({
          label: survey.title,
          value: survey.id,
          applications: survey.applications,
          organizations: survey.organizations
        }));
        //console.log('Setting orgs ', loading);
        setSurveys(surveysFromAPI);
        setAllSurveys(surveysFromAPI);
      })
      .finally(() => {
        setLoading(false);
        //This is neccesary cause users can change the hub/org filter in the middle of the loading call
        reloadSurveyFilter();
      });
  };

  const reloadSurveyFilter = () => {
    //console.log(' Calling loading surveys by hub and orgs ', loading);
    //console.log(' all surveys ', allSurveys);

    if (!loading && allSurveys.length > 0) {
      if (hub || organizations.length > 0) {
        setLoading(true);

        const newSurveyList = allSurveys.filter(survey => {
          return (
            (!hub || survey.applications.some(e => e.id === hub.value)) &&
            (organizations.length === 0 || existsOrgs(survey, organizations))
          );
        });

        //console.log(' New list of surveys is: ', newSurveyList);
        setSurveys(newSurveyList);
        setLoading(false);
      } else {
        //console.log(' Setting list of survey all ', allSurveys);
        setSurveys(allSurveys);
      }
    }
  };

  //This effect load the list the first time
  useEffect(() => {
    setLoading(true);
    loadSurveysByUser();
  }, [user]);

  //This effect load the list of surveys after changing hub or orgs filters.
  useEffect(() => {
    reloadSurveyFilter();
  }, [organizations, hub]);

  //This check if the survey is asociated with some of the organization list
  const existsOrgs = (survey, organizationsSelected) => {
    let exits = false;
    const surveyOrgs = survey.organizations;

    for (let e of organizationsSelected) {
      if (surveyOrgs.some(surveyOrg => surveyOrg.id === e.value)) {
        exits = true;
        break;
      }
    }

    return exits;
  };

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
