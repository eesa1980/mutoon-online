import { Container } from "@material-ui/core";
import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import BottomNav from "../components/BottomNav";
import AudioPage from "../components/page-content/AudioPage";
import Spinner from "../components/Spinner";
import { useAudioHelper } from "../hooks/useAudioHelper";
import DefaultLayout from "../layouts/DefaultLayout";
import { AllAudio, AudioNode } from "../model/audio";
import { BookNode } from "../model/book";
import {
  setLoadingStatus,
  setPage,
  setPlayType,
  setStatus,
} from "../redux/actions/audioActions";
import { State } from "../redux/reducers";
import {
  LoadingStatus,
  PlayType,
  Status,
} from "../redux/reducers/audioReducer";
import { smoothPageScroll } from "../util/smoothScroll";

interface IBookTemplate {
  pageContext: BookNode;
  allAudio: AllAudio;
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
    dispatch(setLoadingStatus(LoadingStatus.LOADING));
    setTimeout(() => smoothPageScroll(audioState.page), 500);
    return onUnload;
  };

  /**
   * Just before page unloads
   */
  const onUnload = () => {
    dispatch(setPage(1));
    dispatch(setPlayType(PlayType.PLAY_ONCE));
    dispatch(setStatus(Status.STOPPED));
    dispatch(setLoadingStatus(LoadingStatus.INACTIVE));
    cleanupTimeoutState();
  };

  useEffect(() => {
    onLoad();
    return onUnload;
  }, []);

  useEffect(() => {
    cleanupTimeoutState();
  }, [
    audioState.page,
    audioState.loadingStatus,
    audioState.playType,
    audioState.src,
  ]);

  const { allAudio } = useStaticQuery(query);

  if (!audioState) {
    return (
      <DefaultLayout>
        <Spinner />
      </DefaultLayout>
    );
  }

  const audio = allAudio?.nodes.find(
    (node: AudioNode) => node.book_id === pageContext.id
  );

  const helper = useAudioHelper({
    audioState,
    reactPlayer: reactPlayerRef,
    setLoopTimeout,
    cleanupTimeoutState,
    offsets: JSON.parse(audio?.offset || "{}"),
  });

  console.log("audioState. :>> ", audioState.player);

  return (
    <>
      <DefaultLayout title={pageContext.title}>
        <Container maxWidth="sm">
          {pageContext?.content.map((con, i) => {
            return (
              <AudioPage
                key={i}
                page_number={i}
                content={con}
                title={pageContext.title}
                audioState={audioState}
                dispatch={dispatch}
              />
            );
          })}
        </Container>
        <BottomNav
          onClickPlayHandler={helper.onClickPlayToggle}
          onClickLoopHandler={helper.onClickLoopToggle}
          audioState={audioState}
        />
        <ReactPlayer
          onReady={() => dispatch(setLoadingStatus(LoadingStatus.READY))}
          ref={reactPlayerRef}
          url={audio?.src?.publicURL}
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
    </>
  );
};

export default BookTemplate;

const query = graphql`
  {
    allAudio {
      nodes {
        id
        src {
          publicURL
        }
        book_id
        name
        offset
      }
    }
  }
`;
