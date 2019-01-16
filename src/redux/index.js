import { combineReducers } from 'redux'

import { user, families, surveys, drafts } from './reducers'

export default combineReducers({
  user,
  families,
  surveys,
  drafts
})
