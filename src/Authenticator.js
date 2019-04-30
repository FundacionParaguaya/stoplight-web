import React, { useState, useMemo, useEffect } from 'react';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { updateUser } from './redux/actions';

let LoadingAuth = ({ classes }) => (
  <div className={classes.container}>
    <CircularProgress />
  </div>
);

const loadingAuthStyles = {
  container: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
LoadingAuth = withStyles(loadingAuthStyles)(LoadingAuth);

let UserNotAllowed = ({ classes }) => (
  <div>
    <p>Auth Failed, you're not logged in</p>
  </div>
);

const userNotAllowedStyles = {
  container: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
UserNotAllowed = withStyles(userNotAllowedStyles)(UserNotAllowed);

const Authenticator = props => {
  // TODO add
  const {
    updateUser: updateUserActionDispatch,
    _persist: { rehydrated },
    location,
    children
  } = props;
  const [authVerified, setAuthVerified] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const sid = useMemo(() => queryString.parse(location.search).sid, [
    location.search
  ]);
  // TODO delete the default testing environment, used only while
  const env =
    useMemo(() => queryString.parse(location.search).env, [location.search]) ||
    'testing';
  useEffect(() => {
    console.log(`Verifying login SID ${sid} rehydrated ${rehydrated}`);
    if (!sid || !env) {
      // Did not received expected query params. Fatal error
      setAuthVerified(true);
      // TODO query params are getting deleted in every redirect, in which case the next line
      // logs user out. We'll need to further clarify this
      // setLoggedIn(false);
      return;
    }
    if (!rehydrated) {
      // If it has not rehydrated yet from localStorage, it's not verified and not logged in
      setAuthVerified(false);
      setLoggedIn(false);
      return;
    }
    // TODO DELETE THIS. Just a workaround while we don't have backend service that
    // can validate an access token and retrieve user data from access token
    setTimeout(() => {
      updateUserActionDispatch({
        username: 'Jose Perez',
        token: sid,
        env
      });
      setLoggedIn(true);
      setAuthVerified(true);
    }, 1000);
    // TODO we should invoke the new API endpoint and act according the response
  }, [sid, env, rehydrated, updateUserActionDispatch]);
  return (
    <React.Fragment>
      {authVerified && loggedIn && <React.Fragment>{children}</React.Fragment>}
      {authVerified && !loggedIn && <UserNotAllowed />}
      {!authVerified && <LoadingAuth />}
    </React.Fragment>
  );
};

const mapStateToProps = ({ user, _persist }) => ({ user, _persist });
const mapDispatchToProps = { updateUser };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Authenticator)
);
