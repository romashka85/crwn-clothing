import { combineReducers } from 'redux';

import userReducer from './user/user.reduсer';

export default combineReducers({
  user: userReducer
  
})

