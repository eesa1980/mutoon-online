import { Container, MenuItem, Select, Typography } from "@material-ui/core";
import { ThemeOptions } from "@material-ui/core/styles";
import withTheme from "@material-ui/core/styles/withTheme";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import BottomNav from "../components/BottomNav";
import DialogComponent from "../components/Dialog";
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

const FormWrapper = withTheme(styled.div`
  display: inline-flex;
  align-items: center;

  > * {
    margin-right: ${({ theme }: { theme: ThemeOptions | any }) =>
      theme.spacing(1)}px;

    &:last-child {
      margin-right: 0;
    }
  }
`);

interface IBookTemplate {
  pageContext: BookNode;
  allAudio: AllAudio;
  [key: string]: any;
}

const BookTemplate: React.FC<IBookTemplate> = ({ pageContext }) => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState<number>(0);

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

  const setCurrentPage = (pg: number) =>
    new Promise((resolve) => {
      try {
        updateHash(pg, (page: number) => {
          dispatch(setPage(page));
          smoothPageScroll(page);
          helper.onChangeRangeHandler({
            start: page,
            end: page + 1,
          });
        });
        resolve(pg);
      } catch (err) {
        resolve(undefined);
      }
    });

  /**
   * When page first loads
   */
  const onLoad = async () => {
    const hashPage = getHashPage();

    dispatch(setActiveBook(pageContext));
    dispatch(setStatus(Status.STOPPED));
    dispatch(setLoadingStatus(LoadingStatus.LOADING));

    if (audioPlayer.current) {
      setTimeout(async () => {
        if (await setCurrentPage(hashPage)) {
          return;
        }

        if (await setCurrentPage(audioState.page)) {
          return;
        }

        await setCurrentPage(1);
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

  const onChangeStartHandler = (e: any) => {
    const { value } = e.target;

    if (activeBook.status !== Status.STOPPED) {
      dispatch(setStatus(Status.STOPPED));
    }

    updateHash(value, (page: number) => {
      smoothPageScroll(page);
      helper.onChangeRangeHandler({
        start: page,
        end: page + 1,
      });

      dispatch(setPage(page));
    });
  };

  const onChangeEndHandler = (e: any) => {
    const { value } = e.target;

    helper.onChangeRangeHandler({
      start: helper.range.start,
      end: value,
    });
  };

  const arrayKeys = [...new Array(pageContext.content.length).keys()].filter(
    (item) => item
  );

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
        {pageContext?.content.map((con, i) => (
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
            onChangeRangeHandler={helper.onChangeRangeHandler}
          />
        ))}
      </Container>

      <DialogComponent
        title="Select a range"
        openModal={openModal}
        confirmText={"Play"}
        cancelText={"Close"}
        onClickConfirmHandler={helper.onClickPlayToggle}
      >
        <FormWrapper onChange={(e: any) => e.preventDefault()}>
          <Typography component="label">From</Typography>
          <Select
            variant={"outlined"}
            id={"range-start"}
            fullWidth
            value={helper.range.start}
            onChange={onChangeStartHandler}
          >
            {arrayKeys
              .filter((item) => item !== arrayKeys.length)
              .map((item, i) => (
                <MenuItem key={`range-start-${i}`} value={item}>
                  page {item}
                </MenuItem>
              ))}
          </Select>
          <Typography component="label">to</Typography>
          <Select
            variant={"outlined"}
            id={"range-end"}
            value={helper.range.end}
            fullWidth
            onChange={onChangeEndHandler}
          >
            {arrayKeys.map((item, i) => (
              <MenuItem
                key={`range-end-${i}`}
                value={item}
                disabled={item <= helper.range.start}
              >
                page {item}
              </MenuItem>
            ))}
          </Select>
        </FormWrapper>
      </DialogComponent>
      <BottomNav
        onClickOpenModalHandler={() => setOpenModal(openModal + 1)}
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
