import React from 'react';
import Intercom from 'react-intercom';
import { connect } from 'react-redux';
import { ROLES_NAMES } from '../utils/role-utils';
import secrets from '../secrets.json';

const InitializedIntercom = ({ user }) => (
  <React.Fragment>
    {!!user && user.role !== ROLES_NAMES.ROLE_FAMILY_USER && (
      <Intercom
        appID={
          process.env.REACT_APP_INTERCOM_API_KEY || secrets['INTERCOM_API_KEY']
        }
        {...{
          name: !!user && !!user.username ? ' ' + user.username : '',
          email: !!user && !!user.email ? ' ' + user.email : null,
          created_at: !!user && !!user.name && new Date().getTime()
        }}
      />
    )}
  </React.Fragment>
);

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(InitializedIntercom);
