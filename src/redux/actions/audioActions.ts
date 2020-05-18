import { Status } from "../reducers";
import { LoadingStatus, PlayType } from "../reducers/audioReducer";

export const SET_SRC = "SET_SRC";
export const SET_PLAY_TYPE = "SET_PLAYTYPE";
export const PLAY_AUDIO = "PLAY_AUDIO";
export const PAUSE_AUDIO = "PAUSE_AUDIO";
export const STOP_AUDIO = "STOP_AUDIO";
export const SET_STATUS = "SET_STATUS";
export const SET_PAGE = "SET_PAGE";
export const SET_LOADING_STATUS = "SET_LOADING_STATUS";

export const setSrc = (src: string) => {
  return {
    type: SET_SRC,
    payload: { src },
  };
};

export const setPlayType = (playType: PlayType) => {
  return {
    type: SET_PLAY_TYPE,
    payload: {
      playType,
    },
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
