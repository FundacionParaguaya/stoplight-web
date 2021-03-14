import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getOrganizationsByHub } from '../../api';
import * as _ from 'lodash';
import { withStyles, Grid, Typography } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { selectStyle } from '../../utils/styles-utils';

const styles = () => ({
  mainContainer: {
    marginTop: 5,
    marginBottom: 5
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  label: {
    margin: 'auto',
    fontSize: 14,
    marginBottom: 5
  },
  selector: {
    width: '100%'
  }
});

const OrganizationSelector = ({
  data,
  hub,
  user,
  classes,
  t,
  onChange,
  isMulti,
  isClearable
}) => {
  const [options, setOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  useEffect(() => {
    setOptionsLoading(true);
    getOrganizationsByHub(user, hub && hub.value ? hub.value : null)
      .then(response => {
        const orgs = _.get(response, 'data.data.organizations', []).map(
          org => ({
            label: org.name,
            value: org.id
          })
        );
        setOptions(orgs);
      })
      .finally(() => setOptionsLoading(false));
  }, []);

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      className={classes.mainContainer}
    >
      <Grid item md={12} sm={12} xs={12}>
        <Typography className={classes.label} variant="subtitle1">
          {`${t('views.familyList.moveFamily.organization')} *`}
        </Typography>
        <div className={classes.selector}>
          <Select
            value={data}
            onChange={value => onChange(value)}
            placeholder=""
            options={options}
            isMulti={isMulti}
            isClearable={isClearable}
            styles={selectStyle}
            components={{
              DropdownIndicator: () => <div />,
              IndicatorSeparator: () => <div />,
              ClearIndicator: () => <div />
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withStyles(styles)(
  connect(mapStateToProps)(withTranslation()(OrganizationSelector))
);
