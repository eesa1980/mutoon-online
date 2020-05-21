import { cloneDeep } from "lodash-es";
import { State } from "../../model/state";
import { INITIAL_AUDIO_STATE } from "../../templates/Book";
import { loadState } from "../../util/localStorage";
import { SET_LOADING_STATUS, SET_PAGE } from "../actions/";

const INITIAL_STATE: State["audio"] = {};

export const audioReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_PAGE:
    case SET_LOADING_STATUS:
      const cloned: State["audio"] = cloneDeep(state);
      const persistedState: State = loadState();

      cloned[persistedState?.activeBook?.id] = {
        ...INITIAL_AUDIO_STATE,
        ...cloned[persistedState?.activeBook?.id],
        ...action.payload,
      };

      return { ...state, ...cloned };
    default:
      return state;
  }
};
