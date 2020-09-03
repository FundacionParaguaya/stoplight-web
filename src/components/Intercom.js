import React from 'react';
import Intercom from 'react-intercom';
import { connect } from 'react-redux';

const InitializedIntercom = ({ user }) => (
  <Intercom
    appID="msjjl81s"
    {...{
      name: !!user && !!user.username ? ' ' + user.username : '',
      email: !!user && !!user.email ? ' ' + user.email : null,
      created_at: !!user && !!user.name && new Date().getTime()
    }}
  />
);

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(InitializedIntercom);
