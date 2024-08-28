import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import groupsReducer from "./groups";
import friendsReducer from "./friends";
import expensesReducer from "./expense";
import balanceReducer from "./balance";
import messagesReducer from "./message";

const rootReducer = combineReducers({
  session: sessionReducer,
  groups: groupsReducer,
  friends: friendsReducer,
  expenses: expensesReducer,
  balances: balanceReducer,
  messages: messagesReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
