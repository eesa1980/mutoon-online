import { Status } from "../../enum/Status";
import { BookNode } from "../../model/Book";

export const SET_STATUS = "SET_STATUS";
export const SET_ACTIVE_BOOK = "SET_ACTIVE_BOOK";

export const setActiveBook = ({ id, title }: BookNode) => {
  return {
    type: SET_ACTIVE_BOOK,
    payload: { id, title },
  };
};

export const setStatus = (status: Status) => {
  return {
    type: SET_STATUS,
    payload: {
      status,
    },
  };
};
