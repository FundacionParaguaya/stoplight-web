import React from 'react'
import ReactDOM from 'react-dom'
import './i18n'
import App from './App'

import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

Bugsnag.start({
    apiKey: '36f54c53a441715e2933b07757d728db',
    plugins: [new BugsnagPluginReact()]
  })

ReactDOM.render(<App />, document.getElementById('root'))
