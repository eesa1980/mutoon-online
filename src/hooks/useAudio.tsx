import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BookPage } from "../model/book";
import { setStatus } from "../redux/actions";
import {
  setLoadingStatus,
  setPage,
  setPlayType,
  setSrc,
} from "../redux/actions/audioActions";
import { State, Status } from "../redux/reducers";
import { LoadingStatus, PlayType } from "../redux/reducers/audioReducer";

export const useAudio = (audioState: State["audio"], book: BookPage[]) => {
  const dispatch = useDispatch();

  /**
   *
   * @param {String} src
   */
  const init = async (src: string) => {
    audioState.player.setAttribute("src", src);
    audioState.player.load();

    if (audioState.playType === PlayType.CONTINUOUS) {
      dispatch(setStatus(Status.PLAYING));
    }

    if (audioState.playType === PlayType.CONTINUOUS_PAUSED) {
      dispatch(setPlayType(PlayType.CONTINUOUS));
    }
  };

  useEffect(() => {
    init(audioState.src);
  }, [audioState.src]);

  /**
   *
   */
  const setPlayState = async () => {
    try {
      switch (audioState.status) {
        case Status.PLAYING:
          break;

        case Status.PAUSED:
          audioState.player.pause();
          break;

        case Status.STOPPED:
          audioState.player.pause();
          audioState.player.currentTime = 0;
          break;

        default:
          break;
      }
    } catch (e) {
      return;
    }
  };

  // Set play / pause
  useEffect(() => void setPlayState(), [audioState.status]);

  // Update src url
  useEffect(() => {
    if (book?.[audioState.page]?.acf) {
      const { publicURL } = book[audioState.page].acf.audio?.localFile;
      dispatch(setSrc(publicURL));
      dispatch(setStatus(Status.STOPPED));
    }
  }, [audioState.page]);

  useEffect(() => {
    if (!audioState.player) {
      return;
    }
    audioState.player.loop = audioState.playType === PlayType.LOOPING;
  }, [audioState.playType]);

  // set event handler
  useEffect(() => {
    if (!audioState.player) {
      return;
    }

    audioState.player.onended = () => {
      switch (audioState.playType) {
        case PlayType.PLAY_ONCE:
          dispatch(setStatus(Status.STOPPED));
          break;

        case PlayType.LOOPING:
          dispatch(setStatus(Status.STOPPED));
          break;

        case PlayType.CONTINUOUS:
          dispatch(setStatus(Status.STOPPED));
          dispatch(setPage(audioState.page + 1));
          break;
      }
    };
  }, [audioState]);

  const playAudio = async () => {
    dispatch(setLoadingStatus(LoadingStatus.LOADING));
    audioState.player.src = audioState.src;
    await audioState.player.play();
    dispatch(setLoadingStatus(LoadingStatus.READY));
  };

  return {
    playAudio,
  };
};
