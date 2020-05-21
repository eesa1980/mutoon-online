import { Container, Typography } from "@material-ui/core";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import BottomNav from "../components/BottomNav";
import AudioPage from "../components/page-content/AudioPage";
import { LoadingStatus, Status } from "../enum";
import { useAudioHelper } from "../hooks/useAudioHelper";
import DefaultLayout from "../layouts/DefaultLayout";
import { AllAudio, AudioNode } from "../model/audio";
import { BookNode } from "../model/book";
import { ActiveBook, AudioState, Settings, State } from "../model/state";
import { setActiveBook, setStatus } from "../redux/actions/activeBookActions";
import { setLoadingStatus, setPage } from "../redux/actions/audioActions";
import { FloatingTitle } from "../styled/FloatingTitle";
import { smoothPageScroll } from "../util/smoothScroll";
import { getHashPage, updateHash } from "../util/urlHash";

export const INITIAL_AUDIO_STATE = {
  page: 1,
  loadingStatus: LoadingStatus.INACTIVE,
};

interface IBookTemplate {
  pageContext: BookNode;
  allAudio: AllAudio;
  [key: string]: any;
}

const BookTemplate: React.FC<IBookTemplate> = ({ pageContext }) => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const dispatch = useDispatch();

  const { allAudio } = useStaticQuery(query);

  const audio: AudioNode = allAudio?.nodes.find(
    (node: AudioNode) => node.book_id === pageContext.id
  );

  const audioState: AudioState = useSelector((state: State) => ({
    ...INITIAL_AUDIO_STATE,
    ...state.audio[pageContext.id],
  }));

  const activeBook: ActiveBook = useSelector(
    (state: State) => state.activeBook
  );

  const settings: Settings = useSelector((state: State) => state.settings);

  /**
   * When page first loads
   */
  const onLoad = () => {
    const hashPage = getHashPage();

    dispatch(setActiveBook(pageContext));
    dispatch(setStatus(Status.STOPPED));
    dispatch(setLoadingStatus(LoadingStatus.LOADING));

    if (audioPlayer.current) {
      setTimeout(() => {
        try {
          smoothPageScroll(hashPage);
          dispatch(setPage(hashPage));
        } catch (err) {
          try {
            updateHash(audioState.page, (page: number) => {
              dispatch(setPage(page));
              smoothPageScroll(page);
            });
          } catch (err) {
            updateHash(1, (page: number) => {
              dispatch(setPage(page));
              smoothPageScroll(page);
            });
          }
        }
      }, 1000);
    }
  };

  /**
   * Just before page unloads
   */
  const onUnload = () => {
    dispatch(setStatus(Status.STOPPED));
    dispatch(setLoadingStatus(LoadingStatus.INACTIVE));
  };

  useEffect(() => {
    onLoad();
    return onUnload();
  }, []);

  const helper = useAudioHelper({
    activeBook,
    audioPlayer: audioPlayer.current,
    audioState,
    offsets: JSON.parse(audio?.offset || "{}"),
    settings,
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
              activeBook={activeBook}
              dispatch={dispatch}
              onClickPlayToggle={helper.onClickPlayToggle}
              settings={settings}
            />
          );
        })}
      </Container>
      <BottomNav
        onClickPlayHandler={helper.onClickPlayToggle}
        onClickLoopHandler={helper.onClickLoopToggle}
        activeBook={activeBook}
        settings={settings}
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
