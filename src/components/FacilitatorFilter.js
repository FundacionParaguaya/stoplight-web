import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import * as _ from 'lodash';
import { getMentors } from '../api';

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
  singleValue: styles => ({ ...styles, fontSize: 14 }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused ? 'hsl(0,0%,90%)' : 'transparent',
    fontSize: 14,
    fontFamily: 'Poppins',
    color: isSelected ? 'green' : styles.color
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
  label: { marginRight: 10, fontSize: 14, flexGrow: 1 },
  selector: { width: '100%', flex: 100 }
}));

const FacilitatorFilter = ({ user, data, org, onChange, isMulti, label }) => {
  const [facilitators, setFacilitators] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const { t } = useTranslation();
  useEffect(() => {
    setLoading(true);
    setFacilitators([]);

    console.log('getMentorsByOrganizations');

    getMentors(user)
      .then(response => {
        const mentors = _.get(
          response,
          'data.data.getMentorsByOrganizations',
          []
        ).map(m => ({
          label: m.username,
          value: m.userId
        }));
        setFacilitators(mentors);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const selectedFacilitator = useMemo(
    () =>
      console.log('useMemo', data) ||
      facilitators.filter(mentor => mentor.value === data.value),
    [data, facilitators]
  );

  /*useEffect(() => {
    console.log('selectedFacilitator', data);
    setSelectedFacilitators(data ? facilitators.filter(mentor => mentor.value === data.userId) : {});
    console.log('selectedFacilitator to show', selectedFacilitator);

  }, [data,facilitators]);*/

  /* const allFacilitatorsOption = {
     label: t('views.facilitatorFilter.allFacilitators'),
     value: 'ALL'
   };*/
  /*let facilitatorsToShow =
    facilitators &&
    data &&
    facilitators.length !== data.length &&
    facilitators.length > 1
      ? [allFacilitatorsOption, ...facilitators]
      : [...facilitators];
  if (data.some(d => d.value === 'ALL')) {
    facilitatorsToShow = [];
  }*/
  return (
    <div className={classes.container}>
      <Typography variant="subtitle1" className={classes.label}>
        {label}
      </Typography>

      <div className={classes.selector}>
        <Select
          value={selectedFacilitator}
          onChange={value => onChange(value, facilitators)}
          placeholder=""
          isLoading={loading}
          loadingMessage={() => t('views.facilitatorFilter.loading')}
          noOptionsMessage={() => t('views.facilitatorFilter.noOption')}
          options={facilitators}
          components={{
            DropdownIndicator: () => <div />,
            IndicatorSeparator: () => <div />,
            ClearIndicator: () => <div />
          }}
          closeMenuOnSelect={false}
          multiple={isMulti}
          styles={selectStyle}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(FacilitatorFilter);
