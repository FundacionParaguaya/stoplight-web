import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import * as _ from 'lodash';
import { getOrganizations } from '../api';

const selectStyle = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: '#FFFFFF;',
    borderRadius: 2,
    '&:hover': { borderColor: isFocused ? '#309E43' : 'hsl(0, 0%, 70%)' },
    border: isFocused ? '1.5px solid #309E43' : '1.5px solid #DCDEE3',
    boxShadow: isFocused ? '0 0 0 1px #309E43' : 'none'
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

const OrganizationsFilter = ({ user, data, onChange }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const { t } = useTranslation();
  useEffect(() => {
    getOrganizations(user)
      .then(response => {
        const orgs = _.get(response, 'data.list', []).map(org => ({
          label: org.name,
          value: org.id
        }));
        setOrganizations(orgs);
      })
      .finally(() => setLoading(false));
  }, [user]);
  return (
    <div className={classes.container}>
      <Typography variant="subtitle1" className={classes.label}>
        {t('views.organizationsFilter.label')}
      </Typography>
      <div className={classes.selector}>
        <Select
          value={data}
          onChange={value => onChange(value)}
          placeholder=""
          isLoading={loading}
          loadingMessage={() => t('views.organizationsFilter.loading')}
          noOptionsMessage={() => t('views.organizationsFilter.noOption')}
          options={organizations}
          components={{
            DropdownIndicator: () => <div />,
            IndicatorSeparator: () => <div />
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
