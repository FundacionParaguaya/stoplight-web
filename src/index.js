import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import rootReducer from './redux'

import './styles/index.css'
import App from './App'

const persistConfig = {
  key: 'root',
  whitelist: ['user'],
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export let store
if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(thunk))
  )
} else {
  store = createStore(persistedReducer, applyMiddleware(thunk))
}
let persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
