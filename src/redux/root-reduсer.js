import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reduсer';
import cartReducer from './cart/cart.reducer';

const persistConfig = {
  key: 'root',
  storage,              //window.localStorage
  whitelist: ['cart']
}

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
})

export default persistReducer(persistConfig, rootReducer)

