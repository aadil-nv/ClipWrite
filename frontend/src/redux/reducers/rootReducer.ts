import { combineReducers } from '@reduxjs/toolkit';
import themeReducer from '../slices/themeSlice';
import userReducer from '../slices/userSlice';




const appReducer = combineReducers({
  theme: themeReducer,
  user : userReducer
 
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rootReducer = (state: any, action: any) => {
 
  return appReducer(state, action);
};

export default rootReducer;