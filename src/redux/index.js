import { combineReducers } from 'redux'

import { user ,families,surveys} from './reducers'

export default combineReducers({
  user,families,surveys
})
