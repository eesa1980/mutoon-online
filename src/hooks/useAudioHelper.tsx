import throttle from "lodash-es/throttle";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setLoadingStatus,
  setPage,
  setPlayType,
  setStatus,
} from "../redux/actions";
import { LoadingStatus, PlayType, State, Status } from "../redux/reducers";
import { smoothPageScroll } from "../util/smoothScroll";

interface IOffset {
  [key: string]: number[];
}

interface PropTypes {
  audioPlayer: HTMLAudioElement;
  audioState: State["audio"];
  offsets: IOffset;
}

export const useAudioHelper = ({
  audioPlayer,
  audioState,
  offsets,
}: PropTypes) => {
  const dispatch = useDispatch();

  const [start, duration] = offsets[`part-${audioState.page}`];

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  useEffect(() => {
    if (
      audioPlayer?.readyState > 3 &&
      audioState.loadingStatus !== LoadingStatus.READY
    ) {
      dispatch(setLoadingStatus(LoadingStatus.READY));
    }
  }, [audioPlayer?.readyState]);

  if (typeof window !== "undefined" && audioPlayer !== null) {
    audioPlayer.ontimeupdate = () => {
      onProgressAudio(audioPlayer?.currentTime);
    };

    audioPlayer.onended = () => {
      stopAudio();
    };

    audioPlayer.onloadstart = () => {
      dispatch(setLoadingStatus(LoadingStatus.LOADING));
    };

    audioPlayer.oncanplaythrough = () => {
      if (audioState.loadingStatus !== LoadingStatus.READY) {
        audioPlayer.currentTime = start / 1000;
        dispatch(setLoadingStatus(LoadingStatus.READY));
      }
    };
  }

  const playAudio = async () => {
    if (audioPlayer === null) {
      return;
    }

    if (audioState.status !== Status.PAUSED) {
      audioPlayer.currentTime = start / 1000;
      smoothPageScroll(audioState.page);
    }

    await audioPlayer.play();
  };

  const pauseAudio = () => {
    if (audioPlayer === null) {
      return;
    }

    audioPlayer.pause();
  };

  const stopAudio = () => {
    if (audioPlayer === null) {
      return;
    }

    audioPlayer.currentTime = start / 1000;
    audioPlayer.pause();
  };

  const toggleAudio = async () => {
    switch (audioState.status) {
      case Status.STOPPED:
        return stopAudio();
      case Status.PAUSED:
        return pauseAudio();
      default:
        break;
    }
  };

  useEffect(() => void toggleAudio(), [audioState.status]);

  /**
   * When play button is pressed
   */
  const onClickPlayToggle = async () => {
    switch (audioState.status) {
      case Status.INACTIVE:
      case Status.STOPPED:
      case Status.PAUSED:
        await playAudio();
        return dispatch(setStatus(Status.PLAYING));
      case Status.PLAYING:
        return dispatch(setStatus(Status.STOPPED));
      default:
        break;
    }
  };

  /**
   * When loop button is pressed
   */
  const onClickLoopToggle = () => {
    dispatch(setStatus(Status.STOPPED));

    switch (audioState.playType) {
      case PlayType.PLAY_ONCE:
        dispatch(setPlayType(PlayType.LOOPING));
        break;

      case PlayType.LOOPING:
        dispatch(setPlayType(PlayType.CONTINUOUS));
        break;

      case PlayType.CONTINUOUS:
        dispatch(setPlayType(PlayType.PLAY_ONCE));
        break;

      default:
        break;
    }
  };

  /**
   * Polls audio to select correct page
   */
  const onProgressAudio = throttle((currentTime: number) => {
    const resetTime = () => {
      audioPlayer.currentTime = start / 1000;
    };

    const reachedEnd = currentTime * 1000 >= start + duration;

    if (audioState.status === Status.PLAYING && reachedEnd) {
      switch (audioState.playType) {
        case PlayType.PLAY_ONCE:
          dispatch(setStatus(Status.STOPPED));
          resetTime();
          return;

        case PlayType.LOOPING:
          resetTime();
          return;

        case PlayType.CONTINUOUS:
          dispatch(setPage(audioState.page + 1));
          smoothPageScroll(audioState.page + 1);
          return;

        default:
          break;
      }
    }
  }, 100);

  return {
    onClickPlayToggle,
    onClickLoopToggle,
  };
};
