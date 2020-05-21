import { LoadingStatus } from "../../enum";

export const SET_PAGE = "SET_PAGE";
export const SET_LOADING_STATUS = "SET_LOADING_STATUS";

export const setPage = (page: number) => {
  return {
    type: SET_PAGE,
    payload: {
      page,
    },
  };
};

export const setLoadingStatus = (loadingStatus: LoadingStatus) => {
  return {
    type: SET_LOADING_STATUS,
    payload: {
      loadingStatus,
    },
  };
};
