import { Container, Typography } from "@material-ui/core";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import BottomNav from "../components/BottomNav";
import AudioPage from "../components/page-content/AudioPage";
import { useAudioHelper } from "../hooks/useAudioHelper";
import DefaultLayout from "../layouts/DefaultLayout";
import { AllAudio, AudioNode } from "../model/audio";
import { BookNode } from "../model/book";
import {
  setLoadingStatus,
  setPage,
  setStatus,
} from "../redux/actions/audioActions";
import { State } from "../redux/reducers";
import { LoadingStatus, Status } from "../redux/reducers/audioReducer";
import { FloatingTitle } from "../styled/FloatingTitle";
import { smoothPageScroll } from "../util/smoothScroll";

const removeHash = () => {
  history.pushState(
    "",
    document.title,
    window.location.pathname + window.location.search
  );
};

interface IBookTemplate {
  pageContext: BookNode;
  allAudio: AllAudio;
  [key: string]: any;
}

const BookTemplate: React.FC<IBookTemplate> = ({ pageContext }) => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const audioState: State["audio"] = useSelector((state: State) => state.audio);
  const dispatch = useDispatch();

  /**
   * When page first loads
   */
  const onLoad = () => {
    dispatch(setPage(audioState.page));
    dispatch(setStatus(Status.STOPPED));
    dispatch(setLoadingStatus(LoadingStatus.LOADING));
    removeHash();

    if (audioPlayer.current) {
      setTimeout(() => smoothPageScroll(audioState.page), 1000);
    }
    return onUnload;
  };

  /**
   * Just before page unloads
   */
  const onUnload = () => {
    dispatch(setPage(1));
    dispatch(setStatus(Status.STOPPED));
    dispatch(setLoadingStatus(LoadingStatus.INACTIVE));
  };

  useEffect(() => {
    onLoad();
    return onUnload;
  }, []);

  useEffect(() => {
    removeHash();
  }, [audioState.page]);

  const { allAudio } = useStaticQuery(query);

  const audio: AudioNode = allAudio?.nodes.find(
    (node: AudioNode) => node.book_id === pageContext.id
  );

  const helper = useAudioHelper({
    audioPlayer: audioPlayer.current,
    audioState,
    offsets: JSON.parse(audio?.offset || "{}"),
  });

  return (
    <DefaultLayout title={pageContext.title}>
      <FloatingTitle>
        <Typography color="textPrimary">
          <LibraryBooksIcon fontSize="small" />
          &nbsp;&nbsp;{pageContext.title}
        </Typography>
      </FloatingTitle>

      <audio src={audio.src.publicURL} preload={"auto"} ref={audioPlayer} />

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
              onClickPlayToggle={helper.onClickPlayToggle}
            />
          );
        })}
      </Container>
      <BottomNav
        onClickPlayHandler={helper.onClickPlayToggle}
        onClickLoopHandler={helper.onClickLoopToggle}
        audioState={audioState}
      />
    </DefaultLayout>
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
