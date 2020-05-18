import { SET_USER } from "../actions/userActions";
import { State } from "./audioReducer";

const INITIAL_STATE: State["user"] = {};

export const userReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
