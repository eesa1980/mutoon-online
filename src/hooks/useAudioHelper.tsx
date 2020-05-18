import debounce from "lodash-es/debounce";
import ReactPlayer from "react-player";
import { useDispatch } from "react-redux";
import { AudioNode } from "../model/audio";
import { setPage, setPlayType, setStatus } from "../redux/actions";
import { PlayType, State, Status } from "../redux/reducers";
import { smoothPageScroll } from "../util/smoothScroll";

interface IOffset {
  [key: string]: number[];
}

interface PropTypes {
  audioState: State["audio"];
  reactPlayer: React.RefObject<ReactPlayer>;
  setLoopTimeout: React.Dispatch<any>;
  cleanupTimeoutState: () => void;
  offsets: IOffset;
}

export const useAudioHelper = ({
  audioState,
  reactPlayer,
  setLoopTimeout,
  cleanupTimeoutState,
  offsets,
}: PropTypes) => {
  const dispatch = useDispatch();

  const playAudio = () => {
    try {
      const [start, duration] = offsets[`part-${audioState.page}`];

      reactPlayer.current.seekTo(start / 1000);

      smoothPageScroll(audioState.page);

      // Sets appropriate timeout for each scenario
      switch (audioState.playType) {
        // Plays audio just once for duration length
        case PlayType.PLAY_ONCE:
          return setLoopTimeout(
            setTimeout(() => dispatch(setStatus(Status.STOPPED)), duration)
          );

        // Infinite loop, using recurrsion
        case PlayType.LOOPING:
          return setLoopTimeout(setTimeout(playAudio, duration));

        // No timeout needed as audio will just play normally
        case PlayType.CONTINUOUS:
          dispatch(setStatus(Status.PLAYING));
      }
    } catch (err) {
      dispatch(setStatus(Status.STOPPED));
      const msg = audioState.src
        ? `Unable to play file: "${audioState.src}". You may have forgotten to create an offsets object.\n\n`
        : `No audio file exists. please check one has been uploaded and an offsets object has been created.\n\n`;

      console.error(msg + err);
    }
  };

  /**
   * When play button is pressed
   */
  const onClickPlayToggle = () => {
    switch (audioState.status) {
      case Status.INACTIVE:
      case Status.STOPPED:
        dispatch(setStatus(Status.PLAYING));
        playAudio();
        break;
      case Status.PLAYING:
        cleanupTimeoutState();
        dispatch(setStatus(Status.STOPPED));
        break;

      default:
        break;
    }
  };

  /**
   * When loop button is pressed
   */
  const onClickLoopToggle = () => {
    switch (audioState.playType) {
      case PlayType.PLAY_ONCE:
        cleanupTimeoutState();
        dispatch(setPlayType(PlayType.LOOPING));
        dispatch(setStatus(Status.STOPPED));
        break;

      case PlayType.LOOPING:
        cleanupTimeoutState();
        dispatch(setPlayType(PlayType.CONTINUOUS));
        dispatch(setStatus(Status.STOPPED));
        break;

      case PlayType.CONTINUOUS:
        cleanupTimeoutState();
        dispatch(setPlayType(PlayType.PLAY_ONCE));
        dispatch(setStatus(Status.STOPPED));
        break;

      default:
        break;
    }
  };

  /**
   * Polls audio to select correct page
   */
  const onProgressAudio = debounce(
    (e: any) => {
      if (
        audioState.playType === PlayType.CONTINUOUS &&
        audioState.status === Status.PLAYING
      ) {
        // Find all offset times lower than the amount of time audio has elapsed
        const filtered: number[] = Object.values(offsets)
          .map((offset: any[]) => offset[0])
          .filter((offset) => offset < e.playedSeconds * 1000);

        // Then get the highest time
        const maxOffset = Math.max(...filtered);

        // Get the key of the highest time
        const matchingKey = Object.keys(offsets).find(
          (part) => offsets[part][0] === maxOffset
        );

        // use key to set correct page number
        if (matchingKey) {
          const page = parseInt(matchingKey.split("-")[1], 10);
          if (page !== audioState.page && page > audioState.page) {
            dispatch(setPage(page));
            smoothPageScroll(page);
          }
        }
      }
    },
    500,
    {
      leading: false,
      trailing: true,
    }
  );

  return {
    playAudio,
    onProgressAudio,
    onClickPlayToggle,
    onClickLoopToggle,
  };
};
