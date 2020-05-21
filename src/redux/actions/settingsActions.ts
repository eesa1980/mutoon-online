import { PlayType } from "../../enum";

export const SET_PLAY_TYPE = "SET_PLAYTYPE";

export const setPlayType = (playType: PlayType) => {
  return {
    type: SET_PLAY_TYPE,
    payload: {
      playType,
    },
  };
};
