import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import musicReducer from './slices/musicSlice';
import tokenReducer from './slices/tokenSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    music: musicReducer,
    tokens: tokenReducer
  }
});

export default store;