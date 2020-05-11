import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
// @ts-ignore
import { audioReducer } from "../reducers";

const reducer = combineReducers({ audio: audioReducer });

// @ts-ignore
// const devTools = window.__REDUX_DEVTOOLS_EXTENSION__;

// preloadedState will be passed in by the plugin
export default (preloadedState) => {
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

  return createStore(reducer, enhancer);
};
