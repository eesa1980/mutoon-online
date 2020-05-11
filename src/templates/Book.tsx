import { Container } from "@material-ui/core";
import * as React from "react";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookPage from "../components/BookPage";
import BottomNav from "../components/BottomNav";
import { useAudio } from "../hooks/useAudio";
import DefaultLayout from "../layouts/DefaultLayout";
import { Page } from "../model";
import { setPlayType, setStatus } from "../redux/actions/audioActions";
import { State } from "../redux/reducers";
import { PlayType, Status } from "../redux/reducers/audioReducer";

interface IBookTemplate {
  pageContext: {
    title: string;
    book: Page[];
  };
  [key: string]: any;
}

const BookTemplate: React.FC<IBookTemplate> = ({ pageContext }) => {
  const audioState: State["audio"] = useSelector((state: State) => state.audio);
  const dispatch = useDispatch();
  const audioPlayer = useAudio(pageContext?.book);

  if (!audioState || !audioPlayer) {
    return <></>;
  }

  useEffect(() => {
    console.log("test :>> ");
    dispatch(setStatus(Status.STOPPED));
    dispatch(setPlayType(PlayType.PLAY_ONCE));

    return () => {
      dispatch(setStatus(Status.STOPPED));
      dispatch(setPlayType(PlayType.PLAY_ONCE));
    };
  }, []);

  const onClickPlayToggle = () => {
    const setDispatch = (st: Status) => dispatch(setStatus(st));

    audioState.status === Status.PLAYING
      ? setDispatch(Status.STOPPED)
      : setDispatch(Status.PLAYING);
  };

  const onClickLoopToggle = () => {
    const setDispatch = (type: PlayType) => dispatch(setPlayType(type));

    switch (audioState.playType) {
      case PlayType.PLAY_ONCE:
        setDispatch(PlayType.LOOPING);
        break;

      case PlayType.LOOPING:
        setDispatch(PlayType.CONTINUOUS);
        break;

      case PlayType.CONTINUOUS:
        setDispatch(PlayType.PLAY_ONCE);
        break;

      default:
        setDispatch(PlayType.PLAY_ONCE);
        break;
    }
  };

  return (
    <DefaultLayout>
      <Container maxWidth="sm">
        {pageContext?.book.map((page, i) => {
          return (
            <Fragment key={i}>
              <BookPage
                page={page}
                title={pageContext.title}
                audioPlayer={audioPlayer}
                audioState={audioState}
                dispatch={dispatch}
              />
            </Fragment>
          );
        })}
      </Container>
      <BottomNav
        onClickPlayHandler={onClickPlayToggle}
        onClickLoopHandler={onClickLoopToggle}
        audioState={audioState}
      />
    </DefaultLayout>
  );
};

export default BookTemplate;
