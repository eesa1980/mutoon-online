import Container from "@material-ui/core/Container";
import Fab from "@material-ui/core/Fab";
import ForwardIcon from "@material-ui/icons/Forward";
import LoopIcon from "@material-ui/icons/Loop";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import * as React from "react";
import styled from "styled-components";
import { PlayType, Status } from "../enum";
import { ActiveBook, Settings } from "../model/state";

const Wrapper = styled.div`
  position: sticky;
  padding-bottom: env(safe-area-inset-bottom);
  bottom: -1px;
  left: 0;
  width: 100%;
  height: calc((env(safe-area-inset-bottom) + 84px));
  background: linear-gradient(0deg, #303030 30%, #ffffff00 100%);
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding-top: 20px;
`;

interface PropTypes {
  onClickPlayHandler: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onClickLoopHandler: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  activeBook: ActiveBook;
  settings: Settings;
  onClickOpenModalHandler: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const BottomNav: React.FC<PropTypes> = ({
  onClickPlayHandler,
  activeBook,
  settings,
  onClickLoopHandler,
  onClickOpenModalHandler,
}) => {
  const isPlaying = activeBook.status === Status.PLAYING;
  const StatusIcon = isPlaying ? StopIcon : PlayArrowIcon;
  const statusLabel = isPlaying ? "Stop" : "Play";

  let PlaytypeIcon;
  let playTypeLabel;

  switch (settings.playType) {
    case PlayType.PLAY_ONCE:
      PlaytypeIcon = ForwardIcon;
      playTypeLabel = "Play once";
      break;

    case PlayType.RANGE:
      PlaytypeIcon = LoopIcon;
      playTypeLabel = "Loop";
      break;

    default:
      break;
  }

  return (
    <Wrapper>
      <Container maxWidth="sm">
        <Inner>
          <div>
            <Fab
              color="primary"
              aria-label="Play"
              onClick={onClickPlayHandler}
              variant="extended"
            >
              <StatusIcon />
              &nbsp;&nbsp;{statusLabel}
            </Fab>
          </div>
          <div>
            <Fab
              color="secondary"
              aria-label="play once or loop"
              onClick={onClickLoopHandler}
              variant="extended"
            >
              <PlaytypeIcon />
              &nbsp;&nbsp;{playTypeLabel}
            </Fab>
          </div>
          <div>
            <Fab
              aria-label="options"
              onClick={onClickOpenModalHandler}
              variant="extended"
            >
              <MoreHorizIcon />
              &nbsp;&nbsp;options
            </Fab>
          </div>
        </Inner>
      </Container>
    </Wrapper>
  );
};

export default BottomNav;
