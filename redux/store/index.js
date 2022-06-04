import { combineReducers, createStore } from "redux";
import { userReducer } from "./user";
import { usersReducer } from "./users";
const rootReducer = combineReducers({
  user: userReducer,
  usersState: usersReducer,
});

export const store = createStore(rootReducer);
