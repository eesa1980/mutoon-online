import {
  PAUSE_AUDIO,
  PLAY_AUDIO,
  SET_PAGE,
  SET_PLAY_TYPE,
  SET_SRC,
  SET_STATUS,
  STOP_AUDIO,
} from "../actions/audioActions";

interface Audio {
  page: number;
  src: string;
  playType: PlayType;
  status: Status;
}

export interface State {
  audio: Audio;
}

export enum Status {
  PLAYING = "playing",
  STOPPED = "stopped",
  PAUSED = "paused",
  CONTINUING = "continuing",
  INACTIVE = "inactive",
  ERROR = "error",
}

export enum PlayType {
  PLAY_ONCE = "play-once",
  LOOPING = "looping",
  CONTINUOUS = "continuous",
  CONTINUOUS_PAUSED = "continuous_paused",
}

const INITIAL_STATE: State["audio"] = {
  page: 1,
  src: "",
  playType: PlayType.PLAY_ONCE,
  status: Status.INACTIVE,
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
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
