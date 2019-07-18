import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
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

const OrganizationsFilter = props => {
  const [organizations, setOrganizations] = useState([]);
  useEffect(() => {
    getOrganizations(props.user).then(response => {
      const orgs = _.get(response, 'data.list', []).map(org => ({
        label: org.name,
        value: org.id
      }));
      setOrganizations(orgs);
    });
  }, [props.user]);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginBottom: '15px'
      }}
    >
      <Typography variant="subtitle1" style={{ marginRight: 10, fontSize: 14 }}>
        Organizations
      </Typography>
      <div style={{ width: '80%' }}>
        <Select
          placeholder=""
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

// export default OrganizationsFilter;

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withTranslation()(OrganizationsFilter));
