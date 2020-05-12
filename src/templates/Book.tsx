import { Container } from "@material-ui/core";
import { navigate } from "@reach/router";
import * as React from "react";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BottomNav from "../components/BottomNav";
import AudioPage from "../components/page-content/AudioPage";
import Spinner from "../components/Spinner";
import { useAudio } from "../hooks/useAudio";
import DefaultLayout from "../layouts/DefaultLayout";
import { BookPage } from "../model";
import { setPage, setPlayType, setStatus } from "../redux/actions/audioActions";
import { State } from "../redux/reducers";
import { PlayType, Status } from "../redux/reducers/audioReducer";

interface IBookTemplate {
  pageContext: {
    title: string;
    book: BookPage[];
  };
  [key: string]: any;
}

const BookTemplate: React.FC<IBookTemplate> = ({ pageContext }) => {
  const audioState: State["audio"] = useSelector((state: State) => state.audio);
  const dispatch = useDispatch();
  const audioHelper = useAudio(audioState, pageContext?.book);

  useEffect(() => {
    dispatch(setPage(audioState.page));

    return () => {
      dispatch(setPage(1));
      dispatch(setPlayType(PlayType.PLAY_ONCE));
      dispatch(setStatus(Status.STOPPED));
    };
  }, []);

  if (!audioState || !audioHelper) {
    return <Spinner />;
  }

  const onClickPlayToggle = () => {
    const setDispatch = (st: Status) => dispatch(setStatus(st));

    switch (audioState.status) {
      case Status.STOPPED:
        audioHelper.playAudio();
        setDispatch(Status.PLAYING);
        navigate("#page-" + audioState.page);
        break;
      case Status.PLAYING:
        setDispatch(Status.STOPPED);
        break;

      default:
        break;
    }
  };

  const onClickLoopToggle = () => {
    const setDispatch = (type: PlayType) => dispatch(setPlayType(type));

    switch (audioState.playType) {
      case PlayType.PLAY_ONCE:
        setDispatch(PlayType.LOOPING);
        break;

      case PlayType.LOOPING:
        setDispatch(PlayType.PLAY_ONCE);
        break;

      // case PlayType.CONTINUOUS:
      //   setDispatch(PlayType.PLAY_ONCE);
      //   break;

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
        onClickPlayHandler={onClickPlayToggle}
        onClickLoopHandler={onClickLoopToggle}
        audioState={audioState}
      />
    </DefaultLayout>
  );
};

export default BookTemplate;
