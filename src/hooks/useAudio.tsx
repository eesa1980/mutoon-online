import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Page } from "../model/book";
import { setStatus } from "../redux/actions";
import { setPage, setPlayType, setSrc } from "../redux/actions/audioActions";
import { State, Status } from "../redux/reducers";
import { PlayType } from "../redux/reducers/audioReducer";

export const useAudio = (book: Page[]) => {
  const [instance, setInstance] = useState<HTMLAudioElement>(undefined);

  const audioState: State["audio"] = useSelector(
    (state: State) => state?.audio
  );

  const dispatch = useDispatch();

  const init = async (src: string) => {
    if (!instance) {
      const audio = new Audio(src);
      audio.loop = audioState.playType === PlayType.LOOPING;
      setInstance(audio);
    } else {
      instance.setAttribute("src", src);
      instance.load();
    }

    await waitForAudio();

    if (audioState.playType === PlayType.CONTINUOUS) {
      dispatch(setStatus(Status.PLAYING));
    }

    if (audioState.playType === PlayType.CONTINUOUS_PAUSED) {
      dispatch(setPlayType(PlayType.CONTINUOUS));
    }
  };

  const waitForAudio = async () => {
    try {
      return new Promise((res, rej) => {
        setInterval(() => {
          if (instance?.readyState > 2) {
            return res(instance);
          }
        }, 500);
      });
    } catch (e) {
      console.info(e);
    }
  };

  // Init / update audio element
  useEffect(() => {
    init(audioState.src);
  }, [audioState.src]);

  // Set play / pause
  useEffect(() => {
    if (!audioState || !instance) {
      return;
    }

    switch (audioState.status) {
      case Status.PLAYING:
        instance.play();
        break;

      case Status.PAUSED:
        instance.pause();
        break;

      case Status.STOPPED:
        instance.pause();
        instance.currentTime = 0;
        break;

      default:
        break;
    }
  }, [audioState.status]);

  // Update src url
  useEffect(() => {
    const { publicURL } = book[audioState.page].acf.audio?.localFile;
    dispatch(setSrc(publicURL));
    dispatch(setStatus(Status.STOPPED));
  }, [audioState.page]);

  useEffect(() => {
    if (!instance) {
      return;
    }
    instance.loop = audioState.playType === PlayType.LOOPING;
  }, [audioState.playType]);

  // set event handler
  useEffect(() => {
    if (!instance) {
      return;
    }

    instance.onended = () => {
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

  return { init, stop };
};
