import { Howl } from "howler";
import { useEffect, useState } from "react";

export const useAudio = () => {
  const [audio, setAudio] = useState(undefined);
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(true);

  const togglePlayback = (url: string) => {
    if (!audio) {
      const au = new Howl({ src: [url], loop: looping });
      au.play();
      setAudio(au);
      return;
    }

    if (audio?._src !== url) {
      audio.stop();
      const au = new Howl({ src: [url] });
      au.play();
      setAudio(au);
      return;
    }

    if (audio.playing()) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const toggleLooping = () => {
    setLooping(!looping);
  };

  useEffect(() => {
    audio?.loop(looping);
  }, [looping]);

  useEffect(() => {
    if (!audio) {
      return;
    }

    audio.on("end", () => {
      setPlaying(false);
    });

    audio.on("stop", () => {
      setPlaying(false);
    });

    audio.on("play", () => {
      setPlaying(true);
    });

    audio.on("pause", () => {
      setPlaying(false);
    });

    return () => {
      audio.on("end", () => {
        setPlaying(false);
      });
    };
  }, [audio?._src]);

  return { playing, audio, togglePlayback, toggleLooping, looping };
};
