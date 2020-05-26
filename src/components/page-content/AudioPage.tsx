import { Button, ButtonBase, ButtonGroup } from "@material-ui/core";
import teal from "@material-ui/core/colors/teal";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import * as React from "react";
import { Dispatch } from "redux";
import styled from "styled-components";
import { LoadingStatus, Status } from "../../enum";
import { Range } from "../../hooks/useAudioHelper";
import { Content } from "../../model/book";
import { ActiveBook, AudioState, Settings } from "../../model/state";
import { setStatus } from "../../redux/actions/activeBookActions";
import { setPage } from "../../redux/actions/audioActions";
import { PaperStyled, PaperStyledTitle } from "../../styled/PaperStyled";
import { updateHash } from "../../util/urlHash";
import Spinner from "../Spinner";
import { PageProps } from "./Page";
import PageNumber from "./PageNumber";
import PageText from "./PageText";

interface AudioPageProps extends PageProps {
  title: string;
  page_number: number;
  content: Content;
  audioState?: AudioState;
  settings: Settings;
  dispatch: Dispatch<any>;
  onClickPlayToggle: any;
  activeBook: ActiveBook;
  onChangeRangeHandler: any;
  range: Range;
}

const HashMarker = styled.span`
  position: absolute;
  margin-top: -140px;
`;

const ButtonBaseStyled: any = styled(ButtonBase)`
  position: static;
  display: block;
  width: 100%;

  * a {
    color: ${teal[500]};
  }
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
  activeBook,
  onChangeRangeHandler,
  range,
}) => {
  const Wrapper = getWrapper(page_number);

  const shouldShowSpinner =
    audioState.loadingStatus !== LoadingStatus.READY &&
    page_number === audioState.page &&
    activeBook.status === Status.PLAYING;

  return (
    <Wrapper
      elevation={page_number > 1 ? 3 : 0}
      style={{
        opacity: page_number === audioState.page ? 1 : page_number > 0 && 0.5,
      }}
    >
      <ButtonBaseStyled
        onClick={(e: any) => {
          e.preventDefault();
          if (page_number > 0 && page_number !== audioState.page) {
            updateHash(page_number, () => {
              dispatch(setPage(page_number));
              onChangeRangeHandler({
                start: page_number,
                end: range.end < page_number ? page_number : range.end,
              });
            });

            if (activeBook.status !== Status.STOPPED) {
              dispatch(setStatus(Status.STOPPED));
            }
          }
        }}
        disableRipple={page_number === audioState.page || page_number < 1}
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
                activeBook.status === Status.PLAYING ? (
                  <StopIcon />
                ) : (
                  <PlayArrowIcon />
                )
              }
            >
              {activeBook.status === Status.PLAYING ? "stop" : "play"}
            </Button>
          </ButtonGroup>
        )}
      </ButtonBaseStyled>
    </Wrapper>
  );
};

export default AudioPage;
