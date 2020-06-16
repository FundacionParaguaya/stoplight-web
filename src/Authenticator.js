import React, { useState, useMemo, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { capitalize } from 'lodash';
import { updateUser } from './redux/actions';
import { checkSessionToken } from './api';

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

let UserNotAllowed = () => <div />;

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
    user,
    location,
    children
  } = props;
  const [authVerified, setAuthVerified] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const redirect = to =>
    window.location.replace(`https://${to}.povertystoplight.org/login.html`);

  const sid = useMemo(() => queryString.parse(location.search).sid, [
    location.search
  ]);
  const refresh = useMemo(() => queryString.parse(location.search).refresh, [
    location.search
  ]);
  // TODO delete the default testing environment, used only while
  const env = useMemo(() => queryString.parse(location.search).env, [
    location.search
  ]);

  const {
    localStorageToken,
    localStorageEnviroment,
    localStorageRefreshToken
  } = useMemo(() => {
    const {
      token,
      env: envFromStorage,
      refreshToken: refreshTokenFromStorage
    } = user || {};
    return {
      localStorageToken: token,
      localStorageEnviroment: envFromStorage,
      localStorageRefreshToken: refreshTokenFromStorage
    };
  }, [user]);

  useEffect(() => {
    if (!rehydrated) {
      // If it has not rehydrated yet from localStorage, it's not verified and not logged in
      setAuthVerified(false);
      setLoggedIn(false);
      return;
    }

    let sessionId = sid;
    let refreshToken = refresh;
    let environment = env;
    if (!sessionId) {
      // If there's no sid from queryParam, will try to use from localStorage
      sessionId = localStorageToken;
    }
    if (!refreshToken) {
      // If there's no sid from queryParam, will try to use from localStorage
      refreshToken = localStorageRefreshToken;
    }
    if (!environment) {
      // If there's no env from queryParam, will try to use from localStorage
      environment = localStorageEnviroment;
    }
    if (!sessionId || !environment) {
      // There's no sid or env to use. User no logged in
      setAuthVerified(true);
      setLoggedIn(false);
      redirect(environment);
      return;
    }
    // Verifying token before logging user in
    checkSessionToken(sessionId, environment)
      .then(response => {
        const username = response.data.username
          .split(' ')
          .map(capitalize)
          .join(' ');

        updateUserActionDispatch({
          username,
          token: sessionId,
          refreshToken,
          env: environment,
          role: response.data.role,
          hub: response.data.application,
          organization: response.data.organization,
          name: response.data.name,
          interative_help: response.data.application
            ? !!response.data.application.interactiveHelp
            : false
        });
        setLoggedIn(true);
        setAuthVerified(true);
      })
      .catch(() => {
        updateUserActionDispatch({
          username: null,
          token: null,
          env: null,
          role: null,
          hub: null,
          organization: null,
          name: null
        });
        setLoggedIn(false);
        setAuthVerified(true);
        redirect(environment);
      });
  }, [
    sid,
    refresh,
    env,
    rehydrated,
    localStorageToken,
    localStorageRefreshToken,
    localStorageEnviroment,
    updateUserActionDispatch
  ]);
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
  connect(mapStateToProps, mapDispatchToProps)(Authenticator)
);
