import { cloneDeep } from "lodash-es";
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
    start: cloneDeep(audioState.page),
    end: cloneDeep(audioState.page) + 1,
  });

  const [[start, duration], setOffset] = useState<any>(offsets[`part-1`]);

  const updateOffset = (key: string) => {
    if (audioPlayer) {
      const [st, dur] = offsets[key];
      audioPlayer.currentTime = st / 1000;
      setOffset([st, dur]);
    }
  };

  useEffect(() => {
    if (activeBook.status === Status.PLAYING) {
      smoothPageScroll(audioState.page);
    }

    try {
      updateOffset(`part-${audioState.page}`);
    } catch (err) {
      updateOffset(`part-1`);
    }
  }, [audioState.page, audioPlayer?.src]);

  const playAudio = async () => {
    if (audioPlayer === null) {
      return;
    }

    smoothPageScroll(audioState.page);

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
        dispatch(setPlayType(PlayType.LOOPING));
        break;

      case PlayType.LOOPING:
        dispatch(setPlayType(PlayType.CONTINUOUS));
        break;

      case PlayType.CONTINUOUS:
        dispatch(setPlayType(PlayType.RANGE));
        break;

      case PlayType.RANGE:
        dispatch(setPlayType(PlayType.PLAY_ONCE));
        break;

      default:
        break;
    }
  };

  // const scrollToPage = (page: number) => {
  //   smoothPageScroll(page);
  //   dispatch(setPage(page));
  // };

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

    const reachedEnd = currentTime * 1000 >= start + duration;

    if (activeBook.status === Status.PLAYING && reachedEnd) {
      switch (settings.playType) {
        case PlayType.PLAY_ONCE:
          dispatch(setStatus(Status.STOPPED));
          resetTime();
          return;

        case PlayType.LOOPING:
          resetTime();
          return;

        case PlayType.CONTINUOUS:
          if (audioState.page < Object.keys(offsets).length) {
            return updateHash(audioState.page + 1, (page: number) =>
              dispatch(setPage(page))
            );
          }

          return dispatch(setStatus(Status.STOPPED));

        case PlayType.RANGE:
          if (audioState.page >= range.end) {
            // Reset range
            const [rSt] = offsets[`part-${range.start}`];
            audioPlayer.currentTime = rSt / 1000;
            return updateHash(range.start, (page: number) =>
              dispatch(setPage(page))
            );
          }

          return updateHash(audioState.page + 1, (page: number) =>
            dispatch(setPage(page))
          );

        default:
          break;
      }
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

    audioPlayer.oncanplay = () => {
      audioPlayer.currentTime = start;
    };
  }

  return {
    onClickPlayToggle,
    onClickLoopToggle,
    onChangeRangeHandler,
    range,
  };
};
