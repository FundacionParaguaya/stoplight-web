import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import * as _ from 'lodash';
import { getMentors } from '../api';
import FormHelperText from '@material-ui/core/FormHelperText';

const selectStyle = {
  control: (styles, { isFocused }) => ({
    ...styles,
    //backgroundColor: '#FFFFFF;',
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
  selector: { width: '100%', flex: 100 },
  stackedContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 4
  },
  stackedLabel: {
    marginBottom: 5,
    fontSize: 14
  }
}));

const FacilitatorFilter = ({
  user,
  organizations,
  data,
  onChange,
  isMulti,
  label,
  stacked,
  isDisabled,
  isClearable,
  closeMenuOnSelect,
  maxMenuHeight,
  required,
  error
}) => {
  const [facilitators, setFacilitators] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const { t } = useTranslation();
  useEffect(() => {
    setLoading(true);
    setFacilitators([]);

    let orgIds = !(organizations || []).some(org => org.value === 'ALL')
      ? (organizations || []).map(o => o.value)
      : [];

    getMentors(user, orgIds)
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
  }, [user, organizations]);

  return (
    <div className={stacked ? classes.stackedContainer : classes.container}>
      <Typography
        variant="subtitle1"
        className={stacked ? classes.stackedLabel : classes.label}
      >
        {required ? `${label} *` : `${label}`}
      </Typography>

      <div className={classes.selector}>
        <Select
          value={data}
          onChange={value => onChange(value, facilitators)}
          placeholder=""
          isLoading={loading}
          loadingMessage={() => t('views.facilitatorFilter.loading')}
          noOptionsMessage={() => t('views.facilitatorFilter.noOption')}
          maxMenuHeight={maxMenuHeight}
          options={facilitators}
          isDisabled={isDisabled}
          components={{
            DropdownIndicator: () => <div />,
            IndicatorSeparator: () => <div />,
            ClearIndicator: () => <div />
          }}
          closeMenuOnSelect={closeMenuOnSelect}
          isMulti={isMulti}
          styles={selectStyle}
          isClearable={isClearable}
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

export default connect(mapStateToProps)(FacilitatorFilter);
