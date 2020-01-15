import { combineReducers } from 'redux';

import userReducer from './user/user.reduсer';
import cartReducer from './cart/cart.reducer';

export default combineReducers({
  user: userReducer,
  cart: cartReducer,
})

