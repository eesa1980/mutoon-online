import { Status } from "../../enum";
import { ActiveBook } from "../../model/state";
import { SET_ACTIVE_BOOK, SET_STATUS } from "../actions/activeBookActions";

const INITIAL_STATE: ActiveBook = {
  id: "0",
  title: "",
  status: Status.INACTIVE,
};

export const activeBookReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_ACTIVE_BOOK:
    case SET_STATUS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
