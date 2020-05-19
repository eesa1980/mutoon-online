import { User } from "netlify-identity-widget";
import {
  PAUSE_AUDIO,
  PLAY_AUDIO,
  SET_LOADING_STATUS,
  SET_PAGE,
  SET_PLAY_TYPE,
  SET_SRC,
  SET_STATUS,
  STOP_AUDIO,
} from "../actions/audioActions";

interface Audio {
  player: HTMLAudioElement;
  page: number;
  src: string;
  playType: PlayType;
  status: Status;
  loadingStatus: LoadingStatus;
}

export interface State {
  audio: Audio;
  user: User | {};
}

export enum Status {
  PLAYING = "playing",
  STOPPED = "stopped",
  PAUSED = "paused",
  INACTIVE = "inactive",
  ERROR = "error",
}

export enum PlayType {
  PLAY_ONCE = "play-once",
  LOOPING = "looping",
  CONTINUOUS = "continuous",
}

export enum LoadingStatus {
  INACTIVE = "inactive",
  LOADING = "loading",
  READY = "READY",
}

const player = typeof window !== "undefined" && new Audio();

const INITIAL_STATE: State["audio"] = {
  player,
  page: 1,
  src: "",
  playType: PlayType.PLAY_ONCE,
  status: Status.INACTIVE,
  loadingStatus: LoadingStatus.INACTIVE,
};

export const audioReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_SRC:
    case PLAY_AUDIO:
    case STOP_AUDIO:
    case PAUSE_AUDIO:
    case SET_STATUS:
    case SET_PAGE:
    case SET_PLAY_TYPE:
    case SET_LOADING_STATUS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
