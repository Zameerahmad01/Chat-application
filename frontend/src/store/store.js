import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userReducer from "./auth-slice/index";
import projectReducer from "./project-slice/index";

const rootReducer = combineReducers({
  user: userReducer,
  project: projectReducer,
  // Add other reducers here
});

const store = configureStore({
  reducer: rootReducer,
});

export { store };
