import { createStore, applyMiddleware } from 'redux'
import { persistReducer } from 'redux-persist'
import rootReducer from './'

import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  blacklist: [ ],
  storage
}

// https://stackoverflow.com/questions/39986178/testing-react-target-container-is-not-a-dom-element
const persistedReducer = persistReducer(persistConfig, rootReducer)

var store
if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(thunk))
  )
} else {
  store = createStore(persistedReducer, applyMiddleware(thunk))
}

export default store
