import React from 'react';
import Intercom from 'react-intercom';
import { connect } from 'react-redux';
import { ROLES_NAMES } from '../utils/role-utils';

const InitializedIntercom = ({ user }) => (
  <React.Fragment>
    {!!user && user.role !== ROLES_NAMES.ROLE_FAMILY_USER && (
      <Intercom
        appID="msjjl81s"
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
