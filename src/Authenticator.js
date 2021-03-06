import React, { useState, useMemo, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { capitalize } from 'lodash';
import { updateUser } from './redux/actions';
import { checkSessionToken, enviroments } from './api';
import Login from './screens/Login';
import Bugsnag from '@bugsnag/js';
import firebase from 'firebase';
import 'firebase/analytics';

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

const getEnv = url => enviromentsList.find(e => url.includes(e));

const enviromentsList = ['platform', 'demo', 'testing', 'development'];

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

  const redirect = env => window.location.replace(`${enviroments[env]}/login`);

  const sid = useMemo(() => queryString.parse(location.search).sid, [
    location.search
  ]);
  const refresh = useMemo(() => queryString.parse(location.search).refresh, [
    location.search
  ]);
  // TODO delete the default testing environment, used only while
  const env = useMemo(
    () =>
      queryString.parse(location.search).env || getEnv(window.location.href),
    [location.search]
  );

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

    user && Bugsnag.setUser(user.username, user.email, user.name);
    !!user &&
      firebase.analytics().setUserProperties({
        user: user.username,
        role: user.role,
        env: user.env
      });

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
      environment = !!localStorageEnviroment
        ? localStorageEnviroment
        : 'development';
    }
    if (!sessionId || !environment) {
      // There's no sid or env to use. User no logged in
      setAuthVerified(true);
      setLoggedIn(false);
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
          email: response.data.email,
          interative_help:
            !!response.data.application &&
            !!response.data.application.interactiveHelp
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
      {authVerified && !loggedIn && <Login env={env ? env : 'development'} />}
      {!authVerified && <LoadingAuth />}
    </React.Fragment>
  );
};

const mapStateToProps = ({ user, _persist }) => ({ user, _persist });
const mapDispatchToProps = { updateUser };

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Authenticator)
);
