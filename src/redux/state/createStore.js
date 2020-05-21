import throttle from "lodash-es/throttle";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { loadState, saveState } from "../../util/localStorage";
import { audioReducer } from "../reducers";
import { activeBookReducer } from "../reducers/activeBook";
import { settingsReducer } from "../reducers/settingsReducer";
import { userReducer } from "../reducers/userReducer";

const persistedState = loadState();

const reducer = combineReducers({
  audio: audioReducer,
  user: userReducer,
  activeBook: activeBookReducer,
  settings: settingsReducer,
});

// preloadedState will be passed in by the plugin
export default () => {
  const composeEnhancers =
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
      : compose;

  const enhancer = composeEnhancers(
    applyMiddleware(thunk)

    // other store enhancers if any
  );

  const store = createStore(reducer, persistedState, enhancer);

  store.subscribe(
    throttle(() => {
      saveState({
        ...store.getState(),
      });
    }, 1000)
  );

  return store;
};
