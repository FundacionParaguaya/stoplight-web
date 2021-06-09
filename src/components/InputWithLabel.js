import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import * as _ from 'lodash';
import { getOrganizationsByHub, cancelFilterRequest } from '../api';
import { outlineSelectStyle } from '../utils/styles-utils';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    '& .MuiInputBase-input': {
      padding: '12px 12px 10px!important'
    }
  },
  label: { marginRight: 10, marginBottom: 10, fontSize: 14 },
  field: { width: '-webkit-max-content' },
  outlinedInputContainer: {
    marginBottom: 20
  },
  outlinedInput: {}
}));

const InputWithLabel = ({
  title,
  placeholder,
  multiline,
  value,
  inputProps,
  onChange
}) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const { t } = useTranslation();
  //
  // useEffect(() => {
  //   return () => cancelFilterRequest();
  // }, []);
  //
  // useEffect(() => {
  //   setLoading(true);
  //   getOrganizationsByHub(user, hub && hub.value ? hub.value : null)
  //     .then(response => {
  //       const orgs = _.get(response, 'data.data.organizations', []).map(
  //         org => ({
  //           label: org.name,
  //           value: org.id
  //         })
  //       );
  //       setOrganizations(orgs);
  //       setLoading(false);
  //     })
  //     .catch(e => setLoading(false));
  // }, [user, hub]);
  // const allOrganizationsOption = {
  //   label: t('views.organizationsFilter.allOrganizations'),
  //   value: 'ALL'
  // };
  // let organizationsToShow =
  //   organizations.length !== data.length && organizations.length > 1
  //     ? [allOrganizationsOption, ...organizations]
  //     : [...organizations];
  // if (data.some(d => d.value === 'ALL')) {
  //   organizationsToShow = [];
  // }
  return (
    <div className={classes.container}>
      <Typography variant="subtitle1" className={classes.label}>
        {title}
      </Typography>
      <OutlinedInput
        classes={{
          root: classes.outlinedInputContainer,
          input: classes.outlinedInput
        }}
        placeholder={placeholder}
        multiline={multiline}
        value={value}
        inputProps={inputProps}
        onChange={onChange}
        fullWidth={true}
        margin="dense"
      />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(InputWithLabel);
