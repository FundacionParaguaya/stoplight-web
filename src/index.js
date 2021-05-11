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
  apiKey: 'AIzaSyCKpUIRikUr8SxXjgQuXXqc9cUf0I9ni8w',
  authDomain: 'psp-web.firebaseapp.com',
  projectId: 'psp-web',
  storageBucket: 'psp-web.appspot.com',
  messagingSenderId: '436144717161',
  appId: '1:436144717161:web:09ef2308c7a0ee323551f8',
  measurementId: 'G-PCDX137GCP'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById('root'));
