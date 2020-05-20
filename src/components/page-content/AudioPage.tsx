import { Button, ButtonBase, ButtonGroup } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import * as React from "react";
import { Dispatch } from "redux";
import styled from "styled-components";
import { Content } from "../../model/book";
import { setPage, setStatus } from "../../redux/actions/audioActions";
import { State } from "../../redux/reducers";
import { LoadingStatus, Status } from "../../redux/reducers/audioReducer";
import { PaperStyled, PaperStyledTitle } from "../../styled/PaperStyled";
import Spinner from "../Spinner";
import { PageProps } from "./Page";
import PageNumber from "./PageNumber";
import PageText from "./PageText";

interface AudioPageProps extends PageProps {
  title: string;
  page_number: number;
  content: Content;
  audioState?: State["audio"];
  dispatch: Dispatch<any>;
  onClickPlayToggle: any;
}

const HashMarker = styled.span`
  position: absolute;
  margin-top: -110px;
`;

const ButtonBaseStyled: any = styled(ButtonBase)`
  position: static;
  display: block;
  width: 100%;
`;

const getWrapper = (index: number) =>
  index > 0 ? PaperStyled : PaperStyledTitle;

const AudioPage: React.FC<AudioPageProps> = ({
  title,
  page_number,
  content,
  audioState,
  dispatch,
  onClickPlayToggle,
}) => {
  const Wrapper = getWrapper(page_number);

  const shouldShowSpinner =
    audioState.loadingStatus === LoadingStatus.LOADING &&
    page_number === audioState.page &&
    audioState.status === Status.PLAYING;

  return (
    <Wrapper
      elevation={page_number > 1 ? 3 : 0}
      disabled={page_number === audioState.page}
      style={{
        opacity: page_number === audioState.page ? 1 : page_number > 0 && 0.5,
      }}
    >
      <ButtonBaseStyled
        onClick={() => {
          if (page_number > 0) {
            dispatch(setPage(page_number));
            dispatch(setStatus(Status.STOPPED));
          }
        }}
        disabled={page_number < 1}
        disableRipple={page_number === audioState.page}
        component={"div"}
      >
        <HashMarker id={`page-${page_number}`} />
        {shouldShowSpinner && <Spinner />}
        {page_number > 0 && <PageNumber page_number={page_number} />}
        <PageText
          title={title}
          page_number={page_number}
          arabic={content.ar}
          english={content.en}
        />
        {page_number > 0 && (
          <ButtonGroup variant="text" fullWidth>
            <Button
              fullWidth
              variant={page_number !== audioState.page ? "text" : "contained"}
              color="primary"
              onClick={onClickPlayToggle}
              size="large"
              disabled={page_number !== audioState.page}
              endIcon={
                audioState.status === Status.PLAYING ? (
                  <StopIcon />
                ) : (
                  <PlayArrowIcon />
                )
              }
            >
              {audioState.status === Status.PLAYING ? "stop" : "play"}
            </Button>
          </ButtonGroup>
        )}
      </ButtonBaseStyled>
    </Wrapper>
  );
};

export default AudioPage;
