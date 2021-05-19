import React from 'react';
import ReactDOM from 'react-dom';
import './i18n';
import App from './App';

import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

import firebase from 'firebase';
import 'firebase/analytics';

Bugsnag.start({
  apiKey: '36f54c53a441715e2933b07757d728db',
  plugins: [new BugsnagPluginReact()]
});

const firebaseConfig = {
  apiKey: 'AIzaSyBXWbqWulAnXPVhX0_gvdSCsgtnGRFPT5Y',
  authDomain: 'stoplight-web.firebaseapp.com',
  projectId: 'stoplight-web',
  storageBucket: 'stoplight-web.appspot.com',
  messagingSenderId: '338453487209',
  appId: '1:338453487209:web:4fa3034d80b12328c1ccf8',
  measurementId: 'G-YB1GG0BG1Z'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById('root'));
