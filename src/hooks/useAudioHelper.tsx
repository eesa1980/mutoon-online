import throttle from "lodash-es/throttle";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LoadingStatus, PlayType, Status } from "../enum";
import { ActiveBook, Settings, State } from "../model/state";
import { setLoadingStatus, setPlayType, setStatus } from "../redux/actions";
import { setPage } from "../redux/actions/audioActions";
import { smoothPageScroll } from "../util/smoothScroll";
import { updateHash } from "../util/urlHash";

interface IOffset {
  [key: string]: number[];
}

interface PropTypes {
  audioPlayer: HTMLAudioElement | undefined;
  audioState: State["audio"][string];
  activeBook: ActiveBook;
  offsets: IOffset;
  settings: Settings;
}

export interface Range {
  start: number;
  end: number;
}

export const useAudioHelper = ({
  audioPlayer,
  audioState,
  offsets,
  activeBook,
  settings,
}: PropTypes) => {
  const dispatch = useDispatch();
  const [range, setRange] = useState<Range>({
    start: 1,
    end: Object.keys(offsets).length,
  });

  let start: number;
  let duration: number;

  try {
    [start, duration] = offsets[`part-${audioState.page}`];
  } catch (err) {
    [start, duration] = offsets[`part-1`];
  }

  const playAudio = async () => {
    if (audioPlayer === null) {
      return;
    }

    await audioPlayer.play();

    if (activeBook.status !== Status.PAUSED) {
      audioPlayer.currentTime = start / 1000;
      smoothPageScroll(audioState.page);
    }
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
    switch (activeBook.status) {
      case Status.STOPPED:
        return stopAudio();
      case Status.PAUSED:
        return pauseAudio();
      default:
        break;
    }
  };

  const onChangeRangeHandler = (args: Range) => {
    setRange(args);
  };

  useEffect(() => void toggleAudio(), [activeBook.status]);

  /**
   * When play button is pressed
   */
  const onClickPlayToggle = async () => {
    switch (activeBook.status) {
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

    switch (settings.playType) {
      case PlayType.PLAY_ONCE:
        dispatch(setPlayType(PlayType.RANGE));
        break;

      case PlayType.LOOPING:
        dispatch(setPlayType(PlayType.PLAY_ONCE));
        break;

      case PlayType.CONTINUOUS:
        dispatch(setPlayType(PlayType.PLAY_ONCE));
        break;

      case PlayType.RANGE:
        dispatch(setPlayType(PlayType.PLAY_ONCE));
        break;

      default:
        break;
    }
  };

  const scrollToPage = (page: number) => {
    smoothPageScroll(page);
    dispatch(setPage(page));
  };

  /**
   * Polls audio to select correct page
   */
  const onProgressAudio = throttle((currentTime: number) => {
    const isReadyToPlay =
      currentTime * 1000 > start &&
      activeBook.status === Status.PLAYING &&
      audioState.loadingStatus !== LoadingStatus.READY;

    if (isReadyToPlay) {
      dispatch(setLoadingStatus(LoadingStatus.READY));
    }

    const resetTime = () => {
      audioPlayer.currentTime = start / 1000;
    };

    const isLastPage = audioState.page >= Object.keys(offsets).length;

    // Takes away 1/2 second off end to ensure audio doesn't stop if on last page
    const reachedEnd =
      currentTime >= (start + duration - ((isLastPage && 500) || 0)) / 1000;

    if (activeBook.status === Status.PLAYING && reachedEnd) {
      if (range.start === range.end) {
        resetTime();
        return;
      }

      if (audioState.page >= range.end) {
        // Reset range
        const [rSt] = offsets[`part-${range.start}`];
        audioPlayer.currentTime = rSt / 1000;

        if (PlayType.PLAY_ONCE) {
          dispatch(setStatus(Status.STOPPED));
        }

        return updateHash(range.start, scrollToPage);
      }

      return updateHash(audioState.page + 1, scrollToPage);
    }
  }, 100);

  // Listeners
  if (typeof window !== "undefined" && audioPlayer !== null) {
    audioPlayer.ontimeupdate = () => {
      onProgressAudio(audioPlayer?.currentTime);
    };

    audioPlayer.onended = () => {
      stopAudio();
    };

    audioPlayer.onloadedmetadata = () => {
      audioPlayer.currentTime = start;
    };
  }

  return {
    onChangeRangeHandler,
    onClickLoopToggle,
    onClickPlayToggle,
    range,
    scrollToPage,
  };
};
