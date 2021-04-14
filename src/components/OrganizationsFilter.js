import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import * as _ from 'lodash';
import { getOrganizationsByHub, cancelRequest } from '../api';

const selectStyle = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: '#FFFFFF;',
    borderRadius: 2,
    '&:hover': { borderColor: isFocused ? '#309E43' : 'hsl(0, 0%, 70%)' },
    border: isFocused ? '1.5px solid #309E43' : '1.5px solid #DCDEE3',
    boxShadow: isFocused ? '0 0 0 1px #309E43' : 'none',
    overflowY: 'auto',
    maxHeight: 75
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
  selector: { width: '100%' },
  stackedContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 5
  },
  stackedLabel: {
    marginRight: 10,
    marginBottom: 5,
    fontSize: 14
  }
}));

const OrganizationsFilter = ({ user, data, hub, onChange, stacked }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    return () => cancelRequest();
  }, []);

  useEffect(() => {
    setLoading(true);
    setOrganizations([]);
    getOrganizationsByHub(user, hub && hub.value ? hub.value : null)
      .then(response => {
        const orgs = _.get(response, 'data.data.organizations', []).map(
          org => ({
            label: org.name,
            value: org.id
          })
        );
        setOrganizations(orgs);
      })
      .catch(e => {})
      .finally(() => setLoading(false));
  }, [user, hub]);
  const allOrganizationsOption = {
    label: t('views.organizationsFilter.allOrganizations'),
    value: 'ALL'
  };
  let organizationsToShow =
    organizations.length !== data.length && organizations.length > 1
      ? [allOrganizationsOption, ...organizations]
      : [...organizations];
  if (data.some(d => d.value === 'ALL')) {
    organizationsToShow = [];
  }
  return (
    <div className={stacked ? classes.stackedContainer : classes.container}>
      <Typography
        variant="subtitle1"
        className={stacked ? classes.stackedLabel : classes.label}
      >
        {t('views.organizationsFilter.label')}
      </Typography>

      <div className={classes.selector}>
        <Select
          value={data}
          onChange={value => onChange(value, organizations)}
          placeholder=""
          isLoading={loading}
          loadingMessage={() => t('views.organizationsFilter.loading')}
          noOptionsMessage={() => t('views.organizationsFilter.noOption')}
          options={organizationsToShow}
          components={{
            DropdownIndicator: () => <div />,
            IndicatorSeparator: () => <div />,
            ClearIndicator: () => <div />
          }}
          closeMenuOnSelect={false}
          isMulti
          styles={selectStyle}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(OrganizationsFilter);
