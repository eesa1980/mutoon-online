import { Container } from "@material-ui/core";
import * as React from "react";
import { Fragment, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import BottomNav from "../components/BottomNav";
import AudioPage from "../components/page-content/AudioPage";
import Spinner from "../components/Spinner";
import { useAudioHelper } from "../hooks/useAudioHelper";
import DefaultLayout from "../layouts/DefaultLayout";
import { BookPage, Category } from "../model";
import { setPage, setPlayType, setStatus } from "../redux/actions/audioActions";
import { State } from "../redux/reducers";
import { PlayType, Status } from "../redux/reducers/audioReducer";

interface IBookTemplate {
  pageContext: {
    title: string;
    book: BookPage[];
    offsets: Category["offsets"];
    audio_file: string;
  };
  [key: string]: any;
}

const BookTemplate: React.FC<IBookTemplate> = ({ pageContext }) => {
  const [loopTimeout, setLoopTimeout] = useState(undefined);
  const audioState: State["audio"] = useSelector((state: State) => state.audio);
  const dispatch = useDispatch();
  const reactPlayerRef: React.RefObject<ReactPlayer> = React.useRef();

  const cleanupTimeoutState = () => {
    if (loopTimeout) {
      clearTimeout(loopTimeout);
      setLoopTimeout(undefined);
    }
  };

  /**
   * When page first loads
   */
  const onLoad = () => {
    dispatch(setPage(audioState.page));
    return onUnload;
  };

  /**
   * Just before page unloads
   */
  const onUnload = () => {
    dispatch(setPage(1));
    dispatch(setPlayType(PlayType.PLAY_ONCE));
    dispatch(setStatus(Status.STOPPED));
    cleanupTimeoutState();
  };

  useEffect(() => {
    onLoad();
    return onUnload;
  }, []);

  if (!audioState) {
    return <Spinner />;
  }

  const helper = useAudioHelper({
    audioState,
    reactPlayer: reactPlayerRef,
    setLoopTimeout,
    cleanupTimeoutState,
    offsets: pageContext.offsets,
  });

  return (
    <DefaultLayout title={pageContext.title}>
      <Container maxWidth="sm">
        {pageContext?.book.map((page, i) => {
          return (
            <Fragment key={i}>
              <AudioPage
                page={page}
                title={pageContext.title}
                audioState={audioState}
                dispatch={dispatch}
              />
            </Fragment>
          );
        })}
      </Container>
      <BottomNav
        onClickPlayHandler={helper.onClickPlayToggle}
        onClickLoopHandler={helper.onClickLoopToggle}
        audioState={audioState}
      />
      <ReactPlayer
        ref={reactPlayerRef}
        url={pageContext.audio_file}
        progressInterval={1000}
        onProgress={helper.onProgressAudio}
        height={0}
        playing={audioState.status === Status.PLAYING}
        onEnded={() => {
          dispatch(setStatus(Status.STOPPED));
          cleanupTimeoutState();
        }}
      />
    </DefaultLayout>
  );
};

export default BookTemplate;
