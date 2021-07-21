import React from 'react';
import ReactDOM from 'react-dom';
import './i18n';
import App from './App';

import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

import firebase from 'firebase';
import 'firebase/analytics';

import secrets from './secrets.json';

const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env
  .REACT_APP_MAP_API_KEY || secrets['MAP_API_KEY']}&libraries=places,drawing`;
document.head.append(script);

Bugsnag.start({
  apiKey: process.env.REACT_APP_BUGSNAG_API_KEY || secrets['BUGSNAG_API_KEY'],
  plugins: [new BugsnagPluginReact()]
});

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || secrets['FIREBASE_API_KEY'],
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    secrets['FIREBASE_AUTH_DOMAIN'],
  projectId: 'stoplight-web',
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    secrets['FIREBASE_STORAGE_BUCKET'],
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER ||
    secrets['FIREBASE_MESSAGING_SENDER'],
  appId: process.env.REACT_APP_FIREBASE_APP_ID || secrets['FIREBASE_APP_ID'],
  measurementId:
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID ||
    secrets['FIREBASE_MEASUREMENT_ID']
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById('root'));
