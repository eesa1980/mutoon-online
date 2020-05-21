import { PlayType } from "../../enum";
import { State } from "../../model/state";
import { SET_PLAY_TYPE } from "../actions/settingsActions";

const INITIAL_STATE: State["settings"] = { playType: PlayType.CONTINUOUS };

export const settingsReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_PLAY_TYPE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
